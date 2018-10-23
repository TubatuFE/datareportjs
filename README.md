# gulp-rollup

gulp&amp;rollup 构建打包JS

## 快速开始

### 全局安装rollup和gulp

```sh
npm install --global rollup gulp-cli
```

### 打包app.js

```sh
rollup -c
```

### 合并app.js和库文件

```sh
gulp build:js
```

### 清空输出文件

```sh
npm run clear
```

### 一键打包（打包app.js，合并app.js和库文件组合命令）

```sh
npm run build
```

### 部署

```sh
npm run deploy
```

### 一键打包构建部署

```sh
npm run doall
```

浏览器控制台获取当前地址的查询对象
``` js
(function () { var arr=location.search.substr(1).split('&'); var obj={}; for (var i=0,len=arr.length; i<len; i++) { var arr2=arr[i].split('='); obj[arr2[0]]=arr2[1]; }  return obj; })();
```

控制台查看查询表单字段值
``` js
(function (form) {
  var fields = form.querySelectorAll('[name]');
  var fieldsObj = {};
  for (var i = 0, len = fields.length; i < len; i++) {
    var field = fields[i];
    var name = field.getAttribute('name');
    var value = field.value;
    if (value && name != 'contrast') {
      fieldsObj[name] = value;
    }
  }
  var url_search = (function(obj){
    var str = [];
    for (k in obj) {
      if (obj[k]) { str.push(k + '=' + obj[k]); }
    }
    return str.join('&');
  })(fieldsObj);

  return { method: form.method, action: form.action, search: url_search, url: form.action + '?' + url_search, data: fieldsObj };
})(document.forms[1]);

eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(o(d){5(3 a=d.8("[2]"),b={},e=0,g=a.i;e<g;e++){3 c=a[e],f=c.7("2");(c=c.9)&&"h"!=f&&(b[f]=c)}a=[];5(k j b)b[k]&&a.l(k+"="+b[k]);a=a.m("&");n{6:d.6,4:d.4,p:b,q:a}})(r.s[1]);',29,29,'||name|var|action|for|method|getAttribute|querySelectorAll|value||||||||contrast|length|in||push|join|return|function|params|search|document|forms'.split('|'),0,{}))
```

浏览器控制台拦截表单提交
``` js
document.forms[1].onsubmit = function (evt) {
  var fields = this.querySelectorAll('[name]');
  var fieldsObj = {};
  for (var i = 0, len = fields.length; i < len; i++) {
    var field = fields[i];
    var name = field.getAttribute('name');
    var value = field.value;
    fieldsObj[name] = value;
  }

  var url_search = (function(obj){
    var str = [];
    for (k in obj) {
      if (obj[k]) { str.push(k + '=' + obj[k]); }
    }
    return str.join('&');
  })(fieldsObj);
  console.log('[form submit] method: %s, action: %s, search: %s, params: %o', this.method, this.action, url_search, fieldsObj);
  debugger;
  window.location.href = this.action + '?' + url_search;
  return false;
}

document.forms[1].onsubmit=function(b){var a=this.querySelectorAll("[name]");b={};for(var c=0,e=a.length;c<e;c++){var d=a[c],f=d.getAttribute("name");b[f]=d.value}a=[];for(k in b)b[k]&&a.push(k+"="+b[k]);a=a.join("&");console.log("[form submit] method: %s, action: %s, search: %s, params: %o",this.method,this.action,a,b);debugger;window.location.href=this.action+"?"+a;return!1};

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('j.i[1].9=g(b){3 a=2.u("[7]");b={};5(3 c=0,e=a.v;c<e;c++){3 d=a[c],f=d.h("7");b[f]=d.8}a=[];5(k l b)b[k]&&a.m(k+"="+b[k]);a=a.n("&");p.q("[r t] 6: %s, 4: %s, w: %s, x: %o",2.6,2.4,a,b);y;z.A.B=2.4+"?"+a;C!1};',39,39,'||this|var|action|for|method|name|value|onsubmit|||||||function|getAttribute|forms|document||in|push|join||console|log|form||submit|querySelectorAll|length|search|params|debugger|window|location|href|return'.split('|'),0,{}))
```
