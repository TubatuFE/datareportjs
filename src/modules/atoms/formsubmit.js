document.forms[1].onsubmit = function (evt) {
  var fields = this.querySelectorAll('[name]');
  var fieldsObj = {};
  for (var i = 0, len = fields.length; i < len; i++) {
    var field = fields[i];
    var name = field.getAttribute('name');
    var value = field.value;
    fieldsObj[name] = value;
  }

  console.log('[form submit]method: %s, action: %s, params: %o', this.method, this.action, fieldsObj);
  return false;
}
