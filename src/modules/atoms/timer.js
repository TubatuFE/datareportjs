var Timer = {
  _data: {},
  _tags: {},
  tag: function (name, tag) {
    var _tag = this._tags[name];
    if (!_tag) {
      this._tags[name] = tag;
    }
  },
  start: function (key) {
    this._data[key] = new Date();
  },
  stop: function (key) {
    var time = this._data[key];
    if (time) {
      this._data[key] = new Date() - time;
    }
  },
  getTime: function (key) {
    return this._data[key];
  },
  mergeTagsData: function () {
    var tags = this._tags;
    var data = this._data;
    var merge = {};
    for (var key in tags) {
      if (tags.hasOwnProperty(key) && tags[key]) {
        merge[key] = tags[key];
      }
    }
    for (var key in data) {
      if (data.hasOwnProperty(key) && data[key]) {
        merge[key] = data[key];
      }
    }
    return merge;
  },
  post: function (url) {
    var url = url || '/Api/JsTimer';
    $ && $.post(url, this.mergeTagsData(), function (res) {
    }, 'json');
  }
};

export default Timer;
