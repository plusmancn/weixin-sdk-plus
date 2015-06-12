'use strict'
var error = require('../config/error');
var access_token_http = require('./access_token_http');
var access_token_store = require('./access_token_store');

/**
 * 获取最终token值
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getToken(callback){
  access_token_store.getToken(function(err,data){
    if ( err || data.expiresTime < (new Date().getTime()) ){
      updateToken(function(err,data){
        if (!err) {
          callback(null,data['access_token']);
        }else{  
          callback(new Error(error['101']));
        }
      });
    }else{
      callback(null,data.access_token);
    }
  });
}

/**
 * 更新token
 * @param  {Function} callback 
 */
function updateToken(callback){
  access_token_http.reqToken(function(err,data){
    if (err)
      return callback(err);

    callback(access_token_store.setToken(data),data);
  });
}

module.exports.getToken = getToken;