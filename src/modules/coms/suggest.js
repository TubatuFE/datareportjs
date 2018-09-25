	import Base from '../atoms/base.js';

	var defaults = {
		target      :   null,         // String   目标元素
		data        :   null,	      // Array    建议数据
		reqUrl      :   "",           // String   异步加载数据的地址，在data未设置时才生效
		reqCb       :   null,         // Function 异步加载建议数据的函数  
		enableCache :   false,        // Boolean  异步加载建议数据时使用，减少对服务器的请求
		confirmCb   :   null,         // Function 确认后回调函数
		width       :   "auto",       // String   建议层的宽度,默认情况下和input输入框的宽度保持一致.示范取值："200px", "10%"等，必须带单位
		zIndex      :   9998          // Number   建议层的层级值
	};

	/**
	 * @description                     Suggest组件
	 * @param  {function}  Base         基类构造函数
	 * @param  {function}  				构造函数初始化
	 *         {object}    config       配置参数		                                
	 */
	var Suggest = Base.expand(function(Super,config){
		var option = $.extend({}, defaults, config);
		this.init(option);
	});



	/**
	 * @description             初始化方法
	 * @param  {object} option  配置参数
	 * @return {null}         
	 */
	Suggest.prototype.init = function(option){
		var sugdata = [],
			timer = null;
		this.option  = 	option;
		this.cache = null;
		this.elements = $(option.target);
		this.elements.attr( 'autocomplete', 'off' );
		eventsInit(this);
	}

	/**
	 * @description           组件渲染方法
	 * @param  {array} data   猜测数据
	 * @return {null}         
	 */
	Suggest.prototype.render = function(data){
		var option = this.option;
		if(data.length === 0){
			this.suggestElem && this.suggestElem.remove();
			this.suggestElem = null;
		}else{
			this.suggestElem && this.suggestElem.remove();
			this.suggestElem = $(getHtml(data));
			setStyle(this.elements, this.suggestElem , option);
			setPosition(this.elements, this.suggestElem);
			this.suggestElem.appendTo('body');
			bindEvents(this);
		}
		this.open();
	}

	/**
	 * @description           组件销毁方法
	 * @return {null} 
	 */
	Suggest.prototype.destroy = function(){
		this.suggestElem.remove();
		this.suggestElem = null;
		this.elements = null;
		this.option = null;
	}

	/**
	 * @description           展开列表
	 * @return {null} 
	 */
	Suggest.prototype.open = function() {
		this.suggestElem && this.suggestElem.show();
	}

	/**
	 * @description           关闭列表
	 * @return {null} 
	 */
	Suggest.prototype.close = function() {
		this.suggestElem && this.suggestElem.hide();
	}

	/**
	 * @description            组件事件初始化
	 * @param  {object} obj    Suggest组件对象
	 * @return {null}        
	 */
	function eventsInit(obj){
		var option = obj.option,	
			cache = obj.cache,
			timer = obj.timer,
			confirmCb = option.confirmCb;
		/*obj.elements.on("input propertychange focus click",function(){
			var input = $.trim($(this).val());
			sugdata = getSugData(cache, input, option);
			if(option.enableCache){
				cache = saveCache(cache, input, sugdata);
			}
			obj.render(sugdata);
		}).on("blur",function(){
			clearTimeout(timer);
			timer = setTimeout(function(){
				obj.close();
			},300);
		}).on("keydown",function(event){
			keyDownListen(obj, event, confirmCb);
		});	*/

        obj.elements.on('focus click',function(){
            /*需求需要，定制化*/
            var sugdata = obj.option.data;
            obj.render(sugdata);
        }).on("input propertychange",function(){
            var input = $.trim($(this).val());
            sugdata = getSugData(cache, input, option);
            if(option.enableCache){
                cache = saveCache(cache, input, sugdata);
            }
            obj.render(sugdata);
        }).on("blur",function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                obj.close();
            },300);
        }).on("keydown",function(event){
            keyDownListen(obj, event, confirmCb);
        });
    }

	/**
	 * @description                	监听按键事件
	 * @param  {object}   obj      	Suggest组件对象
	 * @param  {object}   event    	按键事件
	 * @param  {Function} callback 	确认(enter)后回调函数
	 * @return {null}           
	 */
	function keyDownListen(obj, event, callback){
		var which = event.which,
			suggestElem = obj.suggestElem,
        	index = -1;
       	suggestElem && (index = suggestElem.find('li.current').index());	
    	if(which === 38 ){ // up
    		selectItem(obj, index - 1);
    		event.preventDefault();
    	}else if(which === 40){ // down
    		selectItem(obj, index + 1);
    		event.preventDefault();
    	}else if(which === 13 || which === 108){ // enter
    		if(suggestElem){
				var selectData = suggestElem.find('li.current').text();
				selectData && backfill(obj, selectData);
				obj.close();
			}
			callback && callback.call(null,$.trim(obj.elements.val()));
			event.preventDefault();
    	}else if(which === 27){ //	escape
    		obj.close();
    		event.preventDefault();
    	}
    	     
    }

    /**
     * @description            选择下拉列表项
     * @param  {object} obj    Suggest组件对象
     * @param  {number} index  下拉列表项序号
     * @return {null}       
     */
    function selectItem(obj,index){
    	var len = obj.suggestElem.find('li').length;
    	index = index >=0 ? index % len : index + len;
    	obj.suggestElem.find('li').eq(index).addClass("current")
    	 	.siblings().removeClass("current");
    }

    /**
     * @description             获取猜想数据
     * @param  {array}  cache   缓存数据
     * @param  {string} input   输入值
     * @param  {object} option  配置参数
     * @return {null} 
     */
    function getSugData(cache, input , option){
    	var sugdata = [],
    		data = option.data,
    		reqUrl = option.reqUrl,
    		reqCb = option.reqCb,
    		reqFun = reqCb ? reqCb : requestData,
    		enableCache = option.enableCache,
    		formatData;	
		if(data){
			formatData = dataAdapter(data);
			return filterData(input, formatData);
		}
		if(enableCache){
				if(!cache){
					sugdata = reqFun(input, reqUrl);
					sugdata = dataAdapter(sugdata);
				}else{
					formatData = dataAdapter(cache);
					sugdata = filterData(input, formatData);
				}
		}else{
			sugdata = reqFun(input, reqUrl);
			sugdata = dataAdapter(sugdata);
		}
		return sugdata;
    }

    /**
     * @description             缓存数据
     * @param  {array}  cache   当前缓存数据
     * @param  {string} input   输入值
     * @param  {array}  data    猜想值
     * @return {array}          最新的缓存数据
     */
    function saveCache(cache,input,data){
    	if( input.length === 0){
    		return null;
    	}
		if(!cache){
			cache = data;
		}
    	return cache;
	}

	/**
	 * @description            从给定数据(或者缓存数据)中过滤数据，找出匹配猜想
	 * @param  {string} input  输入值
	 * @param  {array}  data   给定数据(或者缓存数据)
	 * @return {array}         匹配猜想数据
	 */
	function filterData(input, data){
		var result = [],key,value;
		if(input ==='') return result;
		for(var i = 0,j = 0; i < data.length; i++){
			key = data[i].key || "";
			value = data[i].value || "";
			if(key.toUpperCase().indexOf(input.toUpperCase()) == 0 || 
				value.toUpperCase().indexOf(input.toUpperCase()) == 0 ){
				result[j++] = data[i];
			}
		}
		return result;
	}

	/**
	 * @description     		异步请求猜想数据
	 * @param  {string} input   输入值
	 * @param  {string} url     请求地址
	 * @return {array}          猜想数据
	 */
	function requestData(input,	url){ 
		var result = [];
		url = url + "?t=" + new Date().getTime();
		if(input ==='' || !url) return result;
		/*$.get(url, {value : input}, function(data, textStatus) {
		//data格式：'[{"key" : "key1", "value" : "value1"}, {"key" : "key2", "value" : "value2"},...]' 
        	var json = JSON.parse(data); 
        	for(var i = 0; i < json.length; i++){
        		result[i] = json[i];
        	}
     	},'json'); */
     	result = ["tubatu","tengxun","baidu","taobao","xiaomi","xinlang"];
     	return result;
	}

	/**
	 * @description          数据适配,将输入数据转换为: '[{"key" : "key1", "value" : "value1"}, {"key" : "key2", "value" : "value2"},...]'格式              
	 * @param  {array} data  输入数据
	 * @return {array}       转换后的数据
	 * @example  
	 * 	  dataAdapter(["tengxun","baidu","taobao"])转换为：
	 * 	  [{key:"tengxun",value:"tengxun"},{key:"baidu",value:"baidu"},{key:"taobao",value:"taobao"}]
	 */
	function dataAdapter(data){
		var result = [];
		for(var i = 0; i < data.length; i++){
			if(typeof data[i] === "object"){
				result[i] = {key:data[i].key, value:data[i].value};
			}else{
				result[i] = {key:data[i], value:data[i]};
			}
		}
		return result;
	}

	/**
	 * @description          将选中数据回填至输入框
	 * @param  {object} obj  Suggest组件对象
	 * @param  {string} data 选中数据
	 * @return {null}      
	 */
	function backfill(obj,data){
		obj.elements.val(data);
	}

	/**
	 * @description           构造Html
	 * @param  {array}  data  猜想数据
	 * @return {null}
	 */
	function getHtml(data){
		var html = '<div class="suggest"><ul>';  
        for(var i = 0; i < data.length; i++){
        	html += '<li>' + data[i].value + '</li>';
        }  
        html += '</ul></div>';
        return html;
	}

	/**
	 * @description           设置猜想列表样式
	 * @param {object} refer  输入框Jquery对象
	 * @param {object} obj    猜想列表Jquery对象
	 * @param {option} option 配置参数
	 * @return {null}
	 */
	function setStyle(refer,obj,option){
		var width = option.width ==='auto'? refer.outerWidth() : option.width,
			zIndex = option.zIndex,
			position = option.position;
		obj.css("width",width);
		obj.css("z-index",zIndex);
	}

	/**
	 * @description           猜想列表定位
	 * @param {object} refer  输入框Jquery对象
	 * @param {object} obj    猜想列表Jquery对象
	 * @return {null}
	 */
	function setPosition(refer,obj){
		var cssMap = {},
            targetHeight = refer.outerHeight(),
            offset = refer.offset(),
            offsetTop = offset.top,          
            offsetLeft = offset.left;           

        cssMap.left = offsetLeft + 'px';
        cssMap.top = offsetTop + targetHeight  + 'px';
       
        cssMap.display = 'none';   
        obj.css( cssMap );  
	}

	/**
	 * @description          猜想列表绑定事件
	 * @param  {object} obj  Suggest组件对象
	 * @return {null}    
	 */
	function bindEvents(obj){
		var suggestElem = obj.suggestElem,
			confirmCb = obj.option.confirmCb,
			selectData;
		suggestElem.on("mouseover", "li", function(){
			$(this).addClass("current").siblings().removeClass("current");
		}).on("click", "li", function(){
			selectData =  $(this).text();
			backfill(obj, selectData);
			obj.close();
			confirmCb && confirmCb.call(null, selectData);
		});
	}

	export default Suggest;	
