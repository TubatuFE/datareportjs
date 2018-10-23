Array.prototype.PrintTop = function (num) {
  var len = this.length;
  var loop_num = num < len ? num : len;
  var out = [];
  for (var i = 0; i < loop_num; i++) {
    out.push(this[i]);
  }
  console.log(out);
  return out;
}
