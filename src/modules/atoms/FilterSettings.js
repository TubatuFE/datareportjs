export default (function () {
  var menuSetting = $('#menu_select').val() ? JSON.parse($('#menu_select').val()) : null;

  var col1 = {},
      col2 = {},
      col3 = {},
      col_date = {},
      col_text = {},
      col_qujian = {};

  if (menuSetting) {
    for (var item in menuSetting) {
      var screen = menuSetting[item]['screen'];
      switch (screen) {
        case "1":
          var source = menuSetting[item]['source'];
          switch (source) {
            case "0":
              col1[item] = menuSetting[item];
              break;
            case "1":
              col2[item] = menuSetting[item];
              break;
            case "2":
              col3[item] = menuSetting[item];
              break;
          }
        break;
        case "2":
          col_date[item] = menuSetting[item];
          break;
        case "3":
          col_qujian[item] = menuSetting[item];
          break;
        case "4":
          break;
        case "5":
          col_text[item] = menuSetting[item];
          break;
      }
    }
  }

  return {
    col1: col1,
    col2: col2,
    col3: col3,
    col_date: col_date,
    col_text: col_text,
    col_qujian: col_qujian
  }
})();