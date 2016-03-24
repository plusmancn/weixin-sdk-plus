'use strict'

var util = require('util');
var wxConfig = require('./config/weixin.json');
var request = require('request');

/**
 * 微信 API Node 对象封装
 */
function Weixin(name, appId, appSecret, options){
    let self = this;
    self.name = name;
    self.appId = appId;
    self.appSecret = appSecret;
    self.oAuth2AuthorizePath = util.format(wxConfig.api.oAuth2Authorize, self.appId)
}


/**
 * [Sync] 获取基础认证URL，静默授权
 *
 * scope 0 snsapi_base
 *       1 snsapi_userinfo
 */
Weixin.prototype.getBaseUrlSync = function(wxCallbackUrl, scope){
    var self = this;
    let url = util.format(self.oAuth2AuthorizePath, encodeURIComponent(wxCallbackUrl), scope);
    return url;
}

/**
 * Token 置换
 */
Weixin.prototype.switchToken = function(code){
    var self = this;
    var oAuth2AccessTokenUrl = util.format(wxConfig.api.oAuth2AccessToken, self.appId, self.appSecret, code);
    return new Promise(function(resolve, reject){
        request({
            url: oAuth2AccessTokenUrl,
            method: 'GET',
            json: true
        }, function(err, resp, body){
            if(err) reject(err);
            resolve(body);
        });
    });
}


module.exports = Weixin;
