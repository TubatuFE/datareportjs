import TreeUtils from '../atoms/TreeUtils'

var linkTree = {
  selects: {},
  selectIds: [],
  renderData: function (fieldMapValues, filterSettings) {
    console.log('[renderData]字段映射表: %o, 筛选设置：%o', fieldMapValues, filterSettings);
    var id,
        col,
        value,
        parent,
        dimensionView,
        renderData = [],
        options = [];

    if(!filterSettings) { return; }

    for (var selectId in filterSettings) {
      var id = selectId;
      var col = filterSettings[selectId]['col'];
      var value = filterSettings[selectId]['value'];
      var parent = filterSettings[selectId]['parent'];
      var dimensionView = filterSettings[selectId]['dimensionView'] || false; // 维度图表显示

      if(fieldMapValues[col]) {
        options = [];

        for (var i = 0; i < fieldMapValues[col].length; i++) {
          options.push({value: col + '*_*' + fieldMapValues[col][i], text: fieldMapValues[col][i]});
        }

        renderData.push({
          id: id,
          title: parent,
          col: col,
          value: value,
          options: options,
          dimensionView: dimensionView
        });
      }
    }

    return renderData;
  },
  renderSelect: function (id, maxCount, options) {
    var select = linkTree.selects[id];
    var field = select.field;
    var publicoptions =  [{value: field + '*_*' +'gb', text:'展开'}, {value: field + '*_*' +'summary', text: '收拢'}];
    var options = options || select.options;
    options = publicoptions.concat(options);

    // 渲染Select Options
    var selectOptionsHtml = '';
    var value = select.value;
    var len = options.length;
    if (maxCount) {
      len = len > maxCount ? maxCount : len;
    }
    for (var i = 0; i < len; i++) {
      var opt = options[i];
      var optVal = opt.value;
      var optText = opt.text;
      var selected = value.indexOf(optVal) !== -1;

      selectOptionsHtml += '<option value="' + optVal + '"' + ( selected ? ' selected="selected"' : '') + '>' + optText + '</option>';
    }
    var $select = select.$select;
    $select.html(selectOptionsHtml);
    $select.selectpicker('refresh');
    $select.selectpicker({
      selectedTextFormat: 'count > 3'
    });
  },
  initSelect: function (slectData) {
    var name = slectData.id,
        title = slectData.title,
        col = slectData.col,
        value = slectData.value,
        options = slectData.options;

    var $select = $('select[id=' + name + ']');
    // 渲染Select容器
    if (!$select.length) {
      var selectOutHtml = [
        '<div class="col_l dw-query-field m_b_10">',
        '<div class="input-group"><span class="input-group-addon">' + title + ':</span><select id="'+ name  +'" title="支持多选，请选择" data-live-search="true" multiple="multiple" data-hide-disabled="true" data-width="214" data-size="10" tabindex="-98"></select></div>',
        '<input type="hidden" class="subline_input ' + name  + '" name="' + name + '" ></div>'
      ].join('');
      $(selectOutHtml).insertBefore($('div.option_canal input.submit'));
      $select = $('select[id=' + name + ']');
    }

    if(value === 'by') {
      value = 'gb';
    }
  
    var valueArr = value.split(',');
    for (var i = 0, len = valueArr.length; i < len; i++) {
      valueArr[i] = col + '*_*' + valueArr[i];
    }

    var $selectValue = $('input[name=' + name + ']');
    $selectValue.val(valueArr.join(','));

    var selectRender = {
      name: name,
      field: col,
      $select: $select,
      $value: $selectValue,
      value: valueArr,
      options: options
    };
    console.log('[renderSelect] title: %s, size: %d, selectRender: %o', title, options.length, selectRender);

    return selectRender;
  },
  initRender: function (renderData) {
    // rendLinkTree(id, value, data, parent, dimensionView, col);
    for (var i = 0, len = renderData.length; i < len; i++) {
      var select = linkTree.initSelect(renderData[i]);
      linkTree.selects[select.name] = select;
      linkTree.selectIds.push(select.name);
    }
  },
  bindEvents: function (treeData) {
    console.log('[bindEvents]级联树: %o, selectIds: %o, selects: %o', treeData, linkTree.selectIds, linkTree.selects);
    var selectIds = linkTree.selectIds;
    var selects = linkTree.selects;
    for (var i = 0, len = selectIds.length; i < len; i++) {
      var selectId = selectIds[i];
      var select = selects[selectId];

      select.$select.on('changed.bs.select', function (e, clickedIndex) {
        var $this = $(this); // this === e.target
        var val = $this.val();
        var $select = $this; // select.$select 不能在回调里使用局部变量select，selec只保留最后一个select引用
        var name = $select.attr('id');
        var $value = $('input[name=' + name + ']');

        if (clickedIndex === 0) {
          // 展开
          $select.selectpicker('deselectAll'); // 取消所有选择
          $select.selectpicker('val', ['new_luodi_type*_*gb']);
          $value.val('new_luodi_type*_*gb');
        } else if (clickedIndex === 1) {
          // 收拢
          $select.selectpicker('deselectAll'); // 取消所有选择
          $select.selectpicker('val', ['new_luodi_type*_*summary']);
          $value.val('new_luodi_type*_*summary');
        } else{
          if (val) {
            $value.val(val.join(','));
          }
          // 其他选项
        }

        console.log('[event]changed.bs.select clickedIndex: %d, value: %o', clickedIndex, val);
      }).on('hide.bs.select', function (e) {
        var $this = $(this); // this === e.target
        var val = $this.val();
        var $select = $this; // select.$select 不能在回调里使用局部变量select，selec只保留最后一个select引用
        var name = $select.attr('id');
        var $value = $('input[name=' + name + ']');

        if (val == null) {
          // 如果什么也没选 则默认选择 eq(1) 选项 并给input name=select* 赋值
          var option1Val = $this.children().eq(1).val();
          $value.val(option1Val);
        }

        console.log('[event]hide.bs.select value: %o', val);
      });
    }
  }
};

var linkTreeHandlerOptimize = function (treeData, fieldMapValues, filterSettings) {
  var renderData = linkTree.renderData(fieldMapValues, filterSettings);
  // TreeUtils.PrintTree.call({ value: '筛选树数据', next: treeData});
  linkTree.initRender(renderData);
  linkTree.renderSelect('sel_1');
  linkTree.renderSelect('sel_2');
  linkTree.renderSelect('sel_3');
  linkTree.renderSelect('sel_4', 300);
  linkTree.renderSelect('sel_5');
  linkTree.renderSelect('sel_6');
  linkTree.renderSelect('sel_7', 300);
  linkTree.renderSelect('sel_8');
  linkTree.bindEvents(treeData);
};

export default linkTreeHandlerOptimize;
