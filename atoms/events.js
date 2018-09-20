
	var slice = [].slice;
	
	/**
	 * [Events 事件机制构造函数]
	 */
	function Events(){}

	Events.prototype = {

		/**
		 * [on 事件监听]
		 * @param  {[String]}   type     [必须,事件名称]
		 * @param  {Function} callback [必须,事件触发时的回调函数]
		 * @param  {[type]}   context  [可选,回调函数的上下文环境]
		 * @return {[void]}
		 */
		on : function(type , callback , context){

			//事件类型,回调以及上下文对象保存容器
			this.events || (this.events = {});

			var events = this.events,
				callbacks = events[type],
				contexts;

			if(!callbacks){

				callbacks = events[type] = [];

				callbacks.contexts = [];

			}

			contexts = callbacks.contexts;

			callbacks.push(callback);

			contexts.push(context);

		},

		/**
		 * [emit 触发事件函数]
		 * @param  {[String]}   type     [可选,触发指定类型的事件,没有该参数时触发所有事件]
		 * @param  {Function} callback [可选,触发指定类型对应的指定回调函数,没有该参数时触发指定事件的所有回调函数]
		 * @return {[void]}            
		 */
		emit : function(type , callback , args){

			var events = this.events;

			if(!events || !arguments.length || typeof type !== 'string')return;

			if(type === 'all'){

				return emitAllEvents(events , this , slice.call(arguments , 1));

			}

			var callbacks = events[type];

			if(!callbacks)return;

			var index = indexOf(callbacks , callback);

			if(index >= 0){

				return callback.apply(callbacks.contexts[index] || this , slice.call(arguments , 2)) !== false;

			}

			return emitEvents(callbacks , this , slice.call(arguments , 1)) !== false;

		},


		/**
		 * [off 事件销毁]
		 * @param  {[String]}   type     [可选,事件类型]
		 * @param  {Function} callback   [可选,回调函数]
		 * @return {[void]}
		 */
		off : function(type , callback){

			if(this.events.hasOwnProperty(type)){

				var callbacks = this.events[type];

				if(!callback || typeof callback !== 'function'){
			
					delete this.events[type];

					return;

				}

				for(var i=0;i<callbacks.length;i++){

					if(callback === callbacks[i]){

						return callbacks.splice(i , 1);
					}

				}

			}else if(arguments.length == 0){

				this.events = {};

			}

		}

	};

	/**
	 * [emitEvents 触发事件]
	 * @param  {[Array]} callbacks [回调函数数组]
	 * @param  {[Object]} obj       [回调上下文对象]
	 * @return {[void]}
	 */
	function emitEvents(callbacks , obj , args){

		var contexts = callbacks.contexts;

		var flag = true;

		for(var i=0;i<callbacks.length;i++){

			if(callbacks[i].apply(contexts[i] || obj , args) === false){

				flag = false;

			}

		}

		return flag;

	}

	function emitAllEvents(events , obj , args){

		var flag = true;

		for(var key in events){

			if(emitEvents(events[key] , obj , args) === false){

				flag = false;

			}

		}

		return flag;

	}

	/**
	 * [indexOf 数组指定元素搜索]
	 * @param  {[Array]} arr  [数组]
	 * @param  {[Object]} item [数组元素]
	 * @return {[Number]}      [元素在数组中对应的下标,不存在返回-1]
	 */
	function indexOf(arr , item){

		if(!arr || !item){

			return -1;

		}

		for(var i=0;i<arr.length;i++){

			if(item === arr[i])return i;

		}

		return -1;

	}

	export default Events;

