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

document.forms[1].onsubmit=function(a){a=this.querySelectorAll("[name]");for(var c={},b=0,e=a.length;b<e;b++){var d=a[b],f=d.getAttribute("name");c[f]=d.value}console.log("[form submit]method: %s, action: %s, params: %o",this.method,this.action,c);return!1};
```
