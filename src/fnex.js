(function(){

    /**
     * [expand 类的继承]
     * @param  {Function} callback [构造回调函数]
     * @return {[Function]}      [子类的构造函数]
     */
    Function.prototype.expand = function(callback){

        var ParentClass = this;

        var SubClass = function(){

            var args = arguments;

            var sub = this;

            //父类构造函数如果不需要参数,默认调用父类构造函数初始化实例
            if(!ParentClass.argsLength && ParentClass.length == 0){

                ParentClass.apply(this);

            }

            //将包装过的父类构造函数当成子类构造回调函数的第一个参数
            Array.prototype.unshift.call(args , function(){

                ParentClass.apply(sub , arguments);

            });

            //子类回调函数代替构造函数执行子类构造方法
            callback.apply(this , args);

            //this.getter && this.getter();

            //this.setter && this.setter();

        };

        //确定子类跟父类之间的继承关系
        var fn = function(){}

        fn.prototype = ParentClass.prototype;

        SubClass.prototype = new fn();

        SubClass.prototype.constructor = SubClass;

        SubClass.argsLength = callback.length > 1 ? callback.length - 1 : 0;

        return SubClass;

    }

    /**
     * [addProperty 给构造函数原型添加属性或方法]
     * @param {[json]} propertyObj [包含属性的json对象]
     */
    Function.prototype.addProperty = function(propertyObj){
        
        if(!propertyObj)return;

        for(var propertyName in propertyObj){

            this.prototype[propertyName] = propertyObj[propertyName];

        }

    }

    /**
     * [getPropertyFrom 类不能多继承,所以添加一个getPropertyFrom方法,'继承'别的类写在prototype上的属性]
     * @param  {[Function || array]} constructors [constructors可以是一个构造函数或者构造函数数组]
     * @return {[void]}
     */
    Function.prototype.getPropertyFrom = function(constructors){

        typeof constructors === 'function' && (constructors = [constructors]);

        for(var i=0;i<constructors.length;i++){

            propExtend(this , constructors[i]);

        }

    }

    /**
     * [methodsExtend 子类prototype添加父类prototype上的属性和方法]
     * @param  {[Function]} subClass [子构造函数]
     * @param  {[Function]} baseClass [父构造函数]
     * @return {[void]}
     */
    function propExtend(subClass , baseClass){

        var subProto = subClass.prototype;
        // var fn = function(){};
        // fn.prototype = baseClass.prototype;
        // var parProto = new fn();
        var parProto = baseClass.prototype;

        for(var prop in parProto){

            if(!subProto.hasOwnProperty(prop)){

                subProto[prop] = parProto[prop];
            }

        }

    }

})();
