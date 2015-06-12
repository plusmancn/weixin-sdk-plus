'use strict'
var error = require('../config/error');
var configWeixin = require('../config/config').weixin;
/**
 * token 存储格式
  var configFormat = {
    'token':'',
    'expiresTime':''
  }
*/
/**
 * 方式1
 * 通过文件读写进行存储
 */
var fs = require('fs');
var configFile = {
  'dir':'/tmp/',
  'filename':'weixin-sdk-temp-file-' + configWeixin.account.appId + '.json'
}
var filepath = configFile.dir + configFile.filename;

/**
 * write config obj to file system
 * @param  {Dic} configDic the config info about access token
 * 
 */
function setToken(configDic){
  var configFormat = {
    'access_token':configDic['access_token'],
    'expiresTime':new Date().getTime() + (+configDic['expires_in'])*1e3
  }
  return fs.writeFileSync(filepath,JSON.stringify(configFormat),'utf8');
}

/**
 * 获取微信token
 * @param  {Function} callback 
 * 
 */
function getToken(callback){
  fs.readFile(filepath,'utf8',function(err,data){ 
    if (err)
      return callback(err);

    try{
      var dic = JSON.parse(data);
      callback(null,dic);
    }catch(ex){
      callback(new Error(error[3]));
    };
  });
}


// 对外开放接口
module.exports.setToken = setToken;
module.exports.getToken = getToken;
