
	/**
	 * [Base t8t基础组件构造函数]
	 */
	function Base(){}

	Base.prototype = {

		/**
		 * @method init
		 * @description 构造函数初始化对象
		 * @return {void} 
		 */
		init : function(){},

		/**
		 * @method render
		 * @description 组件渲染
		 * @return {void} 
		 */
		render : function(){},

		/**
		 * @method destroy
		 * @description 对象保存dom元素的数组和自定义事件的销毁
		 * @return {void} 
		 */
		destroy : function(){

			this.element && 

			(typeof this.element.off === 'function' && this.element.off()),

			this.element = null;

			typeof this.off === 'function' && this.off();

		},

		/**
		 * @method getter
		 * @description 
		 * @return {void}
		 */
		getter : function(){

			setGetter(this , 'get');

		},

		/**
		 * @method setter
		 * @description 
		 * @return {void}
		 */
		setter : function(){

			setGetter(this , 'set');

		},

		/**
		 * [toString]
		 * @return {[String]} [对象信息基本描述]
		 */
		toString : function(){

			return '[t8t-plugin Object]';

		}

	};

	function setGetter(obj , type){

		for(var key in obj){

			var funcName = type + fUpper(key);

			if(obj[funcName] || typeof obj[key] === 'function')continue;

			(function(key , funcName){

				obj.constructor.prototype[funcName] = function(value){

					if(type === 'get'){

						return this[key];

					}

					this[key] = value;

				}

			})(key , funcName);

		}

	}

	function fUpper(str){

		return str[0].toUpperCase() + str.substr(1);

	}

	export default Base;

