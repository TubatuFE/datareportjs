
    var LinkTree = function(){
        this.tree = [];
    }

    LinkTree.prototype.bulidTree =  function (arr){
        var node;
        for(var i = 0,len = arr.length; i < len; i++){
            node = this.tree;
            for(var item in arr[i]){
                node = this.addTreeNode(node, item + '*_*' + arr[i][item], arr[i][item]);
            }
        }
        return this.tree;
    }

    LinkTree.prototype.addTreeNode =  function(node, value ,text){
        var obj;
        if(!node){return;}
        obj = contain(node, value);
        if(!obj){
            obj = {value:value, text:text, next:[]};
            node.push(obj);
        }
        return obj.next;
    }

    function contain(obj, value){
        for(var i=0; i< obj.length; i++){
            if(obj[i].value  === value){
                return obj[i];
            }
        }
        return null;
    }

	export default LinkTree;
