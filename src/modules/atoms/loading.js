var LoadingSVG = "";
    LoadingSVG += "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n";
    LoadingSVG += "     width=\"24px\" height=\"30px\" viewBox=\"0 0 24 30\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n";
    LoadingSVG += "    <rect x=\"0\" y=\"13\" width=\"4\" height=\"5\" fill=\"#333\">\n";
    LoadingSVG += "      <animate attributeName=\"height\" attributeType=\"XML\"\n";
    LoadingSVG += "        values=\"5;21;5\" \n";
    LoadingSVG += "        begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n";
    LoadingSVG += "      <animate attributeName=\"y\" attributeType=\"XML\"\n";
    LoadingSVG += "        values=\"13; 5; 13\"\n";
    LoadingSVG += "        begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n";
    LoadingSVG += "    <\/rect>\n";
    LoadingSVG += "    <rect x=\"10\" y=\"13\" width=\"4\" height=\"5\" fill=\"#333\">\n";
    LoadingSVG += "      <animate attributeName=\"height\" attributeType=\"XML\"\n";
    LoadingSVG += "        values=\"5;21;5\" \n";
    LoadingSVG += "        begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n";
    LoadingSVG += "      <animate attributeName=\"y\" attributeType=\"XML\"\n";
    LoadingSVG += "        values=\"13; 5; 13\"\n";
    LoadingSVG += "        begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n";
    LoadingSVG += "    <\/rect>\n";
    LoadingSVG += "    <rect x=\"20\" y=\"13\" width=\"4\" height=\"5\" fill=\"#333\">\n";
    LoadingSVG += "      <animate attributeName=\"height\" attributeType=\"XML\"\n";
    LoadingSVG += "        values=\"5;21;5\" \n";
    LoadingSVG += "        begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n";
    LoadingSVG += "      <animate attributeName=\"y\" attributeType=\"XML\"\n";
    LoadingSVG += "        values=\"13; 5; 13\"\n";
    LoadingSVG += "        begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n";
    LoadingSVG += "    <\/rect>\n";
    LoadingSVG += "  <\/svg>\n";

var Loading = {
  _el: null,
  show (text) {
    if (!this._el) {
      var el = document.createElement('div');
      var wrapper = document.createElement('div');
      var style = document.createElement('style');
      var ptext = document.createElement('p');

      style.innerHTML = 'svg path, svg rect { fill: #fff; }';

      el.style.cssText = 'background-color: transparent; position: fixed; z-index: 1000; top: 0; bottom: 0; left: 0; right: 0; display: flex;';
      wrapper.style.cssText = 'border-radius: 10px; margin: auto; text-align: center; padding: 30px 20px 20px; min-width: 100px; min-height: 100px; background-color: rgba(0,0,0,.6);';
      
      ptext.style.cssText = 'color: #fff; font-szie: 16px;';
      ptext.innerText = text;

      wrapper.innerHTML = LoadingSVG;
      wrapper.appendChild(ptext);
      el.appendChild(wrapper);

      document.head.appendChild(style);
      document.body.appendChild(el);
      this._el = el;
    } else {
      this._el.querySelector('p').innerText = text
    }
    this._el.style.display = 'flex';
  },
  hide () {
    this._el.style.display = 'none';
  }
}

export default Loading;
