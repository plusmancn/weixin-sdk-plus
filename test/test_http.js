/**
 * node 简易服务器，用户微信授权测试。
 *
 */
'use strict'
var co = require('co');
var http = require('http');
var url = require('url');
var Weixin = require('../');

var weixin = new Weixin('测试公众号','wxf4697d97090dcadb','fe1f4e4f356d17b63b7d3fd76706e902')

var server = http.createServer(function(req,res){
  var urlParse = url.parse(req.url,true);

  if (/^\/oauth2\/weixin/g.test(req.url)) {
    if (urlParse.query.code) {
        co(function *(){
            return weixin.switchToken(urlParse.query.code);
        }).then(function(info){
            console.log(JSON.stringify(info));
            res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'})
            res.end(JSON.stringify(info));
        }).catch(function(err){
            console.log(err);
            res.writeHead(500, {'Content-Type': 'application/text; charset=utf-8'});
            res.end('Error');
        });
    }else{
        let callbackUrl = 'http://' + req.headers.host + '/oauth2/weixin/';
        // user_info.getUserinfo(callbackUrl,redirectFunc);
        // user_info.getBase(callbackUrl, redirectFunc);
        let goWxUrl = weixin.getBaseUrlSync(callbackUrl);
        res.writeHead(302,{'Location':goWxUrl});
        res.end();
    }
  }else{
        res.writeHead(404);
        res.end('404 not found create by plusmancn@gmail.com');
  }
});

server.listen(80);
