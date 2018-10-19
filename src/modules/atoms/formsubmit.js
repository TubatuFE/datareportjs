document.forms[1].onsubmit = function (evt) {
  var fields = this.querySelectorAll('[name]');
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
  console.log('[form submit] method: %s, action: %s, search: %s, params: %o', this.method, this.action, url_search, fieldsObj);
  debugger;
  window.location.href = this.action + '?' + url_search;
  return false;
}
