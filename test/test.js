'use strict'
var should = require('should');
var request = require('request');

// leanCloud  服务可用性测试
var hostUrl = {
  'local':'http://l3.plusman.cn/',
  'dev':'http://dev.g5-server.avosapps.com/',
  'prod':'https://g5-server.avosapps.com/'
}
request.post(hostUrl.local + 'callCloudFunc',{form:{'func':'getToken'}},function(err,reponse,body){
  console.log('server test',err,body);
});


// 本地测试，access token
var weixin = require('weixin-sdk-plus')('测试公众号','wxf4697d97090dcadb','fe1f4e4f356d17b63b7d3fd76706e902').access_token;

weixin.getToken(function(err,data){
  console.log('local',err,data);
});
