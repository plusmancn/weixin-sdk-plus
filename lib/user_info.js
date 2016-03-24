'use strict'
var configWeixin = require('../config/config').weixin;
var util = require('util');
var request = require('request');

var oauth2AuthorizePath = util.format(configWeixin.api.oauth2Authorize,configWeixin.account.appId);

/**
 * 获取用户基本信息，静默授权
 * @param  {string} redirectUrl  回调URL
 * @param  {function} redirectFunc 前端框架的跳转函数, 在express内是 res.redirect.bind(res)
 * 
 */
function getBase (redirectUrl,redirectFunc) {
  var basePath = util.format(oauth2AuthorizePath,encodeURIComponent(redirectUrl),configWeixin.scope[0]);
  redirectFunc(basePath);
}


/**
 * 获取用户基本信息，用户已经关注公众号，无需授权；用户未关注公众号，需要授权
 * @param  {string} redirectUrl  回调URL
 * @param  {function} redirectFunc 前端框架的跳转函数, 在express内是 res.redirect.bind(res)
 * 
 */
function getUserinfo (redirectUrl,redirectFunc) {
  var userinfoPath = util.format(oauth2AuthorizePath,encodeURIComponent(redirectUrl),configWeixin.scope[1]);
  redirectFunc(userinfoPath);
}


/**
 * code置换access_token
 * @param  {string}   code     
 * @param  {Function} callback 
 * 
 */
function switchToken(code,callback){
  var oauth2AccessTokenPath = util.format(configWeixin.api.oauth2AccessToken,configWeixin.account.appId,configWeixin.account.appSecret,code);
  request(oauth2AccessTokenPath,function(err,response,body){
    if(err)
      return callback(err);
    callback(null,JSON.parse(body));
  })
}

/**
 * 获取用户详情
 * @param  {string}   access_token  通过code置换得到的
 * @param  {string}   openid       
 * @param  {Function} callback   
 */
function getDetail(access_token,openid,callback){
  var snsUserinfoPath = util.format(configWeixin.api.snsUserinfo,access_token,openid);
  request(snsUserinfoPath,function(err,response,body){
    if (err)
      return callback(err);
    callback(null,JSON.parse(body));
  })
}

/**
 * code 路由导航，
 * @param  {string}   code     通过用户授权获取到的code
 * @param  {Function} callback 
 * 
 */
function routeCode (code,callback) {
  switchToken(code,function(err,data){
    if (err)
      return callback(err);
    if (data.scope === configWeixin.scope[1]) {
      getDetail(data.access_token,data.openid,function(err,data){
        if(err)
          callback(err);
        callback(null,data);
      });
    }else{
      callback(null,data);
    }
  });
}


// 公开方法
module.exports.getBase = getBase;
module.exports.getUserinfo = getUserinfo;
module.exports.routeCode = routeCode;
