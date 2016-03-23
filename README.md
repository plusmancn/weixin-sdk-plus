# weixin-sdk-plus
[![weixin-sdk-plus](http://img.shields.io/npm/v/weixin-sdk-plus.svg)](https://www.npmjs.org/package/weixin-sdk-plus)

> Using exports cacahe store weixin accout info.

## features

  * access_token maintain
  * oauth2 grant & get userinfo

  
## Get started

**Initialization**
```javascript
var weixinSdk = require('weixin-sdk-plus')('测试公众号','wxf4697d97090dcadb','fe1f4e4f356d17b63b7d3fd76706e902');
```
**Get normal access token**
```javascirpt
weixinSdk.access_token.getToken(function(err,data){
    /**
    @{Error} err
    @{string} data  access token if success
    */
});
```

**Get userinfo by wechat oauth2**
```javascript
/**
 * 获取用户基本信息，静默授权
 * @param  {string} redirectUrl  回调URL
 * @param  {function} redirectFunc 前端框架的跳转函数, 在express内是 res.redirect.bind(res)
 * 
 */
weixinSdk.user_info.getBase(callbackUrl,redirectFunc);

/**
 * 获取用户基本信息，用户已经关注公众号，无需授权；用户未关注公众号，需要授权
 * @param  {string} redirectUrl  回调URL
 * @param  {function} redirectFunc 前端框架的跳转函数, 在express内是 res.redirect.bind(res)
 * 
 */
weixinSdk.user_info.getUserinfo(callbackUrl,redirectFunc);

// pass code to routeCode to get final info
weixinSdk.user_info.routeCode(code,function(err,data){
    /**
    @{Error} err
    @{Object} data see Wechat Data Response
    */
});

```

---
**how to make a test for oauth2 ?**   
Once you install the package,find  `weixin-sdk-plus/test/test_http.js` 
then exec below code, it will create a server on port 80.
```javascript
sudo node test_http.js
```
then,you can vist link such as  'http://l3.plusman.cn/oauth2/weixin/' in wechat app.

you can edit `test_http.js` for making test.
```javascript
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
```




## Wechat Data Response
`Denpend on your wechat privilege, unionid may be not exists.`    
**snsapi_base**

    {
       "access_token":"ACCESS_TOKEN",
       "expires_in":7200,
       "refresh_token":"REFRESH_TOKEN",
       "openid":"OPENID",
       "scope":"SCOPE",
       "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
    }


**snsapi_userinfo**

    {
      "openid":" OPENID",
      " nickname": NICKNAME,
      "sex":"1",
      "province":"PROVINCE"
      "city":"CITY",
      "country":"COUNTRY",
      "headimgurl":"http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46", 
      "privilege":[
        "PRIVILEGE1"
        "PRIVILEGE2"
      ],
      "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
    }
