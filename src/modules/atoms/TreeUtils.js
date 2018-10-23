var TreeUtils = {
  valueKey: 'value',
  pointerKey: 'next',
  titleKey: 'text',
  
  rowsToMap: function (rows, max, keys) {
    // 将数据库行数据转换为字段映射数据
    if (!rows || !rows.length) return {};
    var len = rows.length;
    var max = max || len;
    var count = max > len ? len : max;
    var fieldMap = {};
    var keys = keys || [];
    if (!(keys && keys.length)) {
      keys = [];
      var row = rows[0];
      for (var key in row) {
        if (row.hasOwnProperty(key)) {
          keys.push(key);
          fieldMap[key] = [];
        }
      }
    }

    for (var i = 0; i < count; i++) {
      var data = rows[i];
      for (var j = 0, klen = keys.length; j < klen; j++) {
        var field = keys[j];
        var fieldValue = data[field];
        if (fieldValue && fieldValue !== 'NULL') {
          var fieldMapArr = fieldMap[field];
          if (fieldMapArr.indexOf(fieldValue) === -1) {
            fieldMapArr.push(fieldValue);
          }
        }
      }
    }

    return fieldMap;
  },
  buildTree: function (rows, max) {
    if (!rows || !rows.length) return [];
    var len = rows.length;
    var max = max || len;
    var count = max > len ? len : max;
    var tree = [];
    var nodeParent = tree;
    var valueKey = TreeUtils.valueKey;
    var pointerKey = TreeUtils.pointerKey;
    var titleKey = TreeUtils.titleKey;
    function addNode (nodeArr, node) {
      var hasThisNode = false;
      var pointer = node[pointerKey];
      for (var i = 0, len = nodeArr.length; i < len; i++) {
        var existNode = nodeArr[i];
        if (existNode[valueKey] == node[valueKey]) {
          hasThisNode = true;
          pointer = existNode[pointerKey];
          break;
        }
      }
      return hasThisNode ? pointer : (nodeArr.push(node), node[pointerKey]);
    }

    for (var i = 0; i < count; i++) {
      var data = rows[i];
      nodeParent = tree;
      for (var key in data) {
        var node = {};
        node[valueKey] = key + '*_*' + data[key];
        node[titleKey] = data[key];
        node[pointerKey] = [];
        nodeParent = addNode(nodeParent, node);
      }
    }
    return tree;
  },
  PrintTree: function (nodeId, childrenPointer, titleKey) {
    var nodeId = nodeId || 'value';
    var childrenPointer = childrenPointer || 'next';
    var rootEle = document.createElement('ul');
    var parentEle = rootEle;

    function traversal (node) {
      var nodeValue = node[nodeId];
      var childrenNodes = node[childrenPointer];

      var nodeEle = document.createElement('li');
      var ptextEle = document.createElement('p');
      ptextEle.innerText = titleKey ? node[titleKey] + '=' + nodeValue : nodeValue;
      nodeEle.appendChild(ptextEle);
      parentEle.appendChild(nodeEle);

      if (childrenNodes && childrenNodes.length) {
        var childrenEle = document.createElement('ul');
        nodeEle.appendChild(childrenEle);

        parentEle = childrenEle;
        for (var i = 0, len = childrenNodes.length; i < len; i++) {
          traversal(childrenNodes[i]);
        }
        parentEle = nodeEle.parentNode;
      }
    }

    traversal(this);

    var style = document.createElement('style');
    style.innerHTML = '.tree-print ul ul { list-style-type: circle; margin-block-start: 0px; margin-block-end: 0px; } .tree-print ul ul ul { list-style-type: square; } .tree-print ul { display: block; list-style-type: disc; margin-block-start: 1em; margin-block-end: 1em; margin-inline-start: 0px; margin-inline-end: 0px; padding-inline-start: 40px; }';

    var maskScreen = document.createElement('div');
    maskScreen.style.cssText = 'overflow: auto; background-color: rgba(0,0,0,.8); color: #fff; position: fixed; z-index: 1000; top: 0; bottom: 0; left: 0; right: 0;';
    maskScreen.className = 'tree-print';
    maskScreen.appendChild(rootEle);

    document.head.appendChild(style);
    document.body.appendChild(maskScreen);
    return rootEle;
  }
}

export default TreeUtils;
