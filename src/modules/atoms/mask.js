var Mask = {
  _el: null,
  show () {
    if (!this._el) {
      var el = document.createElement('div');
      el.style.cssText = 'background-color: transparent; position: fixed; z-index: 1000; top: 0; bottom: 0; left: 0; right: 0; display: flex;';

      document.body.appendChild(el);
      this._el = el;
    }
  
    this._el.style.display = 'flex';
  },
  hide () {
    this._el.style.display = 'none';
  }
}

export default Mask;
