
    var util = {};
    /**
     * @description             [数组指定元素搜索]
     * @param  {[Array]} arr    [数组]
     * @param  {[Object]} item  [数组元素]
     * @return {[Number]}       [元素在数组中对应的下标,不存在返回-1]
     */
    util.indexOf = function(arr , item){
        if(Array.prototype.indexOf){
            return arr.indexOf(item);
        }else{
            for(var i = 0; i < arr.length; i++){
                if(item === arr[i]){
                    return i;
                }
            }
            return -1;
        }  
    };

    //功能：数组删除元素
    util.removeArray = function(arr,items) {
        if(!arr){return;}
        var result = arr.slice(0) , index;
        util.isArray(items) || ( items = [items] );
        for(var i = 0,len = items.length; i < len; i++){
            if( ( index = util.indexOf( result , items[i] ) ) >= 0){
                result.splice( index , 1 );
            }
        }
        return result;
    }

    //功能：时间格式的转换
    //调用方法： util.dateToString(new Date(),"yyyy-MM-dd HH:mm:ss")        
    util.dateToString = function(date,format) {
        var M = date.getMonth() + 1,
            H = date.getHours(),
            m = date.getMinutes(),
            d = date.getDate(),
            s = date.getSeconds();
        var n = {
            'yyyy': date.getFullYear(),
            'MM': fillNum(M),
            'M': M,
            'dd': fillNum(d),
            'd': d,
            'HH': fillNum(H),
            'H': H,
            'mm': fillNum(m),
            'm': m,
            'ss': fillNum(s),
            's': s
        };
        return format.replace(/([a-zA-Z]+)/g, function(s, $1) {
            return n[$1];
        });
    };

    //功能：时间格式的转换
    //调用方法： util.stringToDate('20150127','yyyyMMdd') 
    util.stringToDate = function (strDate,format){
        format = format || 'yyyyMMdd';
        try{
            var year = getPartDate(strDate, format, 'yyyy'),
                month = getPartDate(strDate, format, 'MM'),
                date = getPartDate(strDate, format, 'dd'),
                hour = getPartDate(strDate, format, 'HH'),
                minute = getPartDate(strDate, format, 'mm'),
                second = getPartDate(strDate, format, 'ss');
            if(year===''&&month===''&&date===''&&hour===''&&minute===''&&second===''){
                return null;
            }else{
                month = month - 1 < 0 ? '':month - 1;
                return new Date(year,month,date,hour,minute,second);
            }
        }catch(e){
            return null;
        }

        function getPartDate(strDate, format, formatPart){
            var idx = format.indexOf(formatPart),
                part;
            if(idx < 0){
                part =  '';
            }else{
                part = parseInt(strDate.substr(idx , formatPart.length));
                part = isNaN(part) ? '' : part;
            }
            return part;
        }
    };

    util.isDate = function(date){
        return Object.prototype.toString.call(date) === '[object Date]';
    };

    util.isArray = function(arr){
        return Object.prototype.toString.call(arr) === '[object Array]';
    }

    //获取页面url传过来的参数
    util.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


    //增加url参数，url参数存在则替换，不存在增加
    util.addUrlParam = function(sHref, sParamName, sNewValue) {
        var reg = new RegExp(sParamName + '=[^&]*');
        if (reg.test(sHref)) {
            sHref = sHref.replace(reg, sParamName + '=' + escape(sNewValue));
        } else {
            sHref += '&' + sParamName + '=' + escape(sNewValue);
        }
        return sHref;
    }
    
    export default util;
