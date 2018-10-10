var timeProbe = (function () {
    var getTime = function () { var time =  new Date().getTime() / 1000; return time; }
    var startTime = getTime()
    return {
      time: function () {
        return getTime()
      },
      set: function () {
        startTime = getTime()
      },
      get: function () {
        return (getTime() - startTime).toFixed(3)
      }
    }
})()

export default timeProbe