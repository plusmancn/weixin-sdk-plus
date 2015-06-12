/**
 * edit by plusmancn@gmail.com  wechat@plusman
 */
'use strict'
var request = require('request');
var util = require('util');
var configWeixin = require('../config/config').weixin;
var error = require('../config/error');
var tokenUrl = util.format(configWeixin.api.token,configWeixin.account.appId,configWeixin.account.appSecret);

/**
 * request token from wechat open platform
 * @param  {Function} callback 
 * 
 */
function reqToken(callback) {
  if (!callback)
    throw new Error(error[2]);

  request(tokenUrl,function(err,response,body){
    if (err || response.statusCode !== 200)
      return callback(err);

    callback(null,JSON.parse(body));
  });
}


module.exports.reqToken = reqToken;