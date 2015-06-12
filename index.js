'use strict'
module.exports = function init (appName,appId,appSecret) {
  // 利用 node 的 exports 缓存，进行文件的初始化
  var weixinAccount = require('./config/config').weixin.account;
  weixinAccount.appName = appName;
  weixinAccount.appId = appId;
  weixinAccount.appSecret = appSecret;

  return {
    'access_token':require('./lib/access_token'),
    'user_info':require('./lib/user_info')
  }
}


