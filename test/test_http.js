/**
 * node 简易服务器，用户微信授权测试。
 *
 * 警告：
 * 1. 需要在微信公众平台配置回调URL
 * 2. 转向函数的构造，在express内，可以使用，res.redirect.bind(res) 
 *
 */
'use strict'
var http = require('http');
var url = require('url');

var server = http.createServer(function(req,res){
  var urlParse = url.parse(req.url,true);

  if (/^\/oauth2\/weixin/g.test(req.url)) {
    var user_info = require('weixin-sdk-plus')('测试公众号','wxf4697d97090dcadb','fe1f4e4f356d17b63b7d3fd76706e902').user_info;

    if (urlParse.query.code) {
      user_info.routeCode(urlParse.query.code,function(err,data){
        res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'})
        res.end(JSON.stringify(data));
      })
    }else{
      // 构造转向函数
      var redirectFunc = function(redirectUrl){
        res.writeHead(302,{'Location':redirectUrl});
        res.end();
      }  
      var callbackUrl = 'http://' + req.headers.host + '/oauth2/weixin/';
      user_info.getUserinfo(callbackUrl,redirectFunc);
      // user_info.getBase(callbackUrl,redirectFunc);
    }
  }else{
    res.writeHead(404);
    res.end('404 not found create by plusmancn@gmail.com');
  }
});

server.listen(80);
