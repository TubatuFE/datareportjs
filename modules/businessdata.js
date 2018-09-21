    import './daterangepicker.js';
    import pages from '../atoms/pages.js';
    import SingleSelect from './singleselect.js';
    import MultiSelect from './multiselect.js';
    import util from '../atoms/util.js';
    import Linktree from '../atoms/linktree.js';
    import Suggest from './suggest.js';
    // import convertPinYin from '../atoms/convertpinyin.js';
    import Calendar from './timecalendar.js';
    import OaCalendar from './oa-calendar.js';
    
	var BusinessData = function(){
	}

	BusinessData.prototype.init = function(){
		initEvent();
		this.render();
	}

	BusinessData.prototype.render = function(){

        //维度选项渲染
        initLinkTree();
        //图形下拉选项渲染
        renderChartSelect();
		//report渲染
		renderReport();

	}

    function initEvent(){

        //添加日历控件
       // initCalendar();

        var date_type = $('input[name=date_type]').val();
        if(date_type == 4) {
            initSecondsDateTime($('#datepicker'));
        } else {
            initDateTime($('#datepicker'), 1);
            initDateTime($('#datepicker2'), 2);
        }
        
        //日期 选择
        jumpDate();
        //表格排序
        initOrder();
        //下载报表
        downXls();
        //添加监控
        addMonitor();
        //分页
        // require('pages')();
        pages();
        //SQL展开
        showSQL();
        //自定义指标
        customIndicators();
        
        atips();
        
    }
    
    /**
     * 顶部提示 事件
     */
    function atips(){
        $('#topTips a,.atips').on('click',function(){
            $('#topTips').fadeToggle(200);
        });
        
    }
    
    function renderChartSelect(){
        // var SingleSelect = require('singleselect'),
        //    MultiSelect = require('multiselect');

        //饼状图
        var pieChartSelect  = new SingleSelect({
            element : '#piechart_select > div.singleselect_input',
            selectElem : '#piechart_select > div.singleselect_content'
        });
        pieChartSelect.init();
        //选择饼状图表数据项
        pieChartSelect.on("select",pieChartHandler);

        //线性图
        var lineChartSelect  = new MultiSelect({
            element : '#linechart_select > div.multiselect_input',
            selectElem : '#linechart_select > div.multiselect_content'
        });
        lineChartSelect.init();
        //选择线性图表数据项
        lineChartSelect.on("select",lineChartHandler);

        //选择图表
        var ckChartsSelect = new SingleSelect({
            element : '#ck_charts > div.singleselect_input',
            selectElem : '#ck_charts > div.singleselect_content'
        });
        ckChartsSelect.init();
        //选择图表类型
        ckChartsSelect.on("select",function(selectedOptions){
            ckChartHandler(selectedOptions, pieChartSelect, lineChartSelect);
        });
        ckChartsSelect.emit('select',ckChartsSelect.getSelected());
    }

    //得到每个维度下拉框所有可能值得数组
    function convertData(data){
        if(!data || data.length<=0){return null;}
        var probableValue = $.extend({},data[0]);
        // var util = require('util');
        
        for(var item in probableValue){
            probableValue[item] = [];
        }
        
        for(var i=0; i<data.length; i++){
            for(var item in data[i]){
                if(util.indexOf(probableValue[item],data[i][item]) <0){
                    probableValue[item].push(data[i][item]);
                }
            }
        }
        return probableValue;
    }

    //初始化维度下拉框
    function initLinkTree(){
        // var Linktree = require('linktree'),
        var url;
        if(checkURLType()===1){
            url = window.location.href + '/req_menu/1';
        }else{
            url = window.location.href + '&req_menu=1';
        }

        var menuSetting = $('#menu_select').val() ? JSON.parse($('#menu_select').val()) : null;
        
        var col1=[],col2=[],col3=[],col_date=[],col_text=[],col_qujian=[];
        if(menuSetting){
            for(var item in menuSetting){
                
                switch (menuSetting[item]['screen']){
                    case "1":
                        switch (menuSetting[item]['source']){
                            case "0":
                                col1[item] = menuSetting[item];
                                break;
                            case "1":
                                col2[item] = menuSetting[item];
                                break;
                            case "2":
                                col3[item] = menuSetting[item];
                                break
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
        
        
        $.get(url, {}, function(data) {
            //console.log(data);
            if(data.col1 && data.col1.length > 0) {

                var probableValue = convertData(data.col1);

                var linktree = new Linktree();
                
                linkTreeHandler(linktree.bulidTree(data.col1), probableValue,col1);
            }

            if(data.col2 && data.col2.length > 0){
                
                for(var col2_k in data.col2){
                    var probableValue2 = convertData(data.col2[col2_k]);
                    var selectArr2 = createAllLinkTree(col2, probableValue2);
                    createChange(selectArr2[0].id,selectArr2, 0, '');
                }
            }

            if(data.col3 && data.col3.length > 0){
                for(var col3_k in data.col3){
                    var probableValue3 = convertData(data.col3[col3_k]);
                    var selectArr3 = createAllLinkTree(col3, probableValue3);
                    createChange(selectArr3[0].id,selectArr3, 0, '');
                }
            }

            if(data.col_date && data.col_date.length > 0) {
                for(var coldate_k in data.col_date){
                    createDate(col_date,data.col_date[coldate_k])
                }
            }

            if(data.col_qujian && data.col_qujian.length > 0) {
                for(var colqujian_k in data.col_qujian){
                    createQujian(col_qujian,data.col_qujian[colqujian_k])
                }
            }

            if(data.col_text && data.col_text.length > 0) {
                for(var coltext_k in data.col_text){
                    createText(col_text,data.col_text[coltext_k])
                }
            }
        });
    }

    function linkTreeHandler(data, probableValue,menuSetting){
        
        var selectArr = createAllLinkTree(menuSetting, probableValue);
        if(!selectArr.length){return;}
        //初始化第一个下拉框
        rendLinkTree(selectArr[0].id, selectArr[0].value, data, selectArr[0].title, selectArr[0].dimensionView, selectArr[0].col);
        
        //创建点击事件
        createChange(selectArr[0].id, selectArr, 0, data);
        
        //设置默认值
        setlinkTreeDefault(selectArr);
    }

    /**
     * 创建时间输入
     * @param menuSetting
     * @param probableValue
     */
    function createDate(menuSetting, probableValue){
        if(!menuSetting){return;}
        
        for(var item in menuSetting){

            var id = item;
            var col = menuSetting[item]['col'];
            var value = menuSetting[item]['value'];
            var parent = menuSetting[item]['parent'];
            var dimensionView = menuSetting[item]['dimensionView'];
            
            if(col == probableValue){
                var input_id = 'input[id=' + id + ']';
                if(!$(input_id).length){
                    $('<div class="col_l dw-query-field m_b_10"><div class="input-group"><span class="input-group-addon">' + parent + ':</span><input id="' + id + '" type="text" class="form-control" placeholder="" title="请选择时间范围" style="width:160px"><input name="'+ id +'" placeholder="日期" type="hidden" value=""></div>').insertBefore($('div.option_canal input.submit'));
                    if(value && value != 'by' && value != 'summary'){
                        $('input[name="'+ id +'"]').val(col + '*_*' + value);
                    }
                    createDateTime($(input_id),id,col);
                }
            }
        }
    }
    function createDateTime(obj,id,col){
        var start=0,
            end=0,
            datePicker = obj;
        
        var autoUpdateInput = false;
        var date_start = $('input[name="'+ id +'"]');

        function cb(start, end) {
            date_start.val(col + '*_*' + start.format('YYYYMMDD') + '~~' + end.format('YYYYMMDD'));
            
            datePicker.val(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
            datePicker.data('daterangepicker').setStartDate(start.format('YYYY-MM-DD'));
            datePicker.data('daterangepicker').setEndDate(end.format('YYYY-MM-DD'));
        }
        if(date_start.val()!='' ){
            var val = date_start.val();
            var d = val.split("*_*");
            if(d[1] != 'by' && d[1] != 'summary'){
                var a = d[1].split("~~");
                start = moment(a[0]).format('YYYY-MM-DD');
                end = moment(a[1]).format('YYYY-MM-DD');
                datePicker.val(moment(a[0]).format('YYYY-MM-DD') + ' ~ ' + moment(a[1]).format('YYYY-MM-DD'));
            }
        }

        datePicker.daterangepicker({
            linkedCalendars: false,
            format: 'YYYY-MM-DD',
            language: 'zh-CN',
            startDate: start,
            endDate: end,
            autoUpdateInput: autoUpdateInput,
            //ranges: {
            //    '今天': [moment(), moment()],
            //    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            //    '最近7天': [moment().subtract(6, 'days'), moment()],
            //    '最近30天': [moment().subtract(29, 'days'), moment()],
            //    '本月': [moment().startOf('month'), moment().endOf('month')],
            //    '最近一月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            //},
            locale:{
                customRangeLabel: '自定义',
                applyLabel: '确定',
                cancelLabel: '取消',
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            },
            onClose: function(dateText, inst) {
                console.log(dateText);
                console.log(inst);
            }
        }, cb);
    }

    /**
     * 创建区间输入
     * @param menuSetting
     * @param probableValue
     */
    function createQujian(menuSetting, probableValue){
        if(!menuSetting){return;}

        for(var item in menuSetting){

            var id = item;
            var col = menuSetting[item]['col'];
            var value = menuSetting[item]['value'];
            var parent = menuSetting[item]['parent'];
            var dimensionView = menuSetting[item]['dimensionView'];

            if(col == probableValue){
                
                var input_id = 'input[id=' + id + ']';
                if(!$(input_id).length){
                    $('<div class="col_l dw-query-field m_b_10"><div class="input-group"><span class="input-group-addon">' + parent + ':</span><input id="' + id + '" type="text" class="form-control" placeholder="" title="请选择范围" style="width:80px"><span class="input-group-addon"> 到 </span><input id="' + id + '_2" type="text" class="form-control" placeholder="" title="请选择范围" style="width:80px"><input name="'+ id +'" placeholder="区间" type="hidden" value=""></div>').insertBefore($('div.option_canal input.submit'));

                    if(value && value != 'by' && value!= 'summary'){
                        var val = value.split("--");
                        $('input[id=' + id + ']').val(val[0])
                        $('input[id=' + id + '_2]').val(val[1])
                        $('input[name=' + id + ']').val(col + '*_*' + value)
                    }
                    
                    var o1 =$('input[name=' + id + ']');
                    $('input[id=' + id + ']').bind('blur',function(){
                        if($(this).val()) {
                            if(o1.val()){
                                var val = o1.val();
                                var d = val.split("*_*");
                                var a = d[1].split("--");
                                o1.val(d[0] + '*_*' + $(this).val() + '--' + a[1])
                            } else {
                                o1.val(probableValue + "*_*" + $(this).val() + '--')
                            }
                        } else {
                            o1.val('');
                        }
                        
                    });
                    
                    $('input[id=' + id + '_2]').bind('blur',function(){
                        if($(this).val()) {
                            if (o1.val()) {
                                var val = o1.val();
                                var d = val.split("*_*");
                                var a = d[1].split("--");
                                o1.val(d[0] + '*_*' + a[0] + '--' + $(this).val());
                            } else {
                                o1.val(probableValue + "*_*" + '--' + $(this).val())
                            }
                        } else {
                            o1.val('');
                        }
                    })
                }
            }
        }
    }

    /**
     * 创建输入搜索
     * @param menuSetting
     * @param probableValue
     */
    function createText(menuSetting, probableValue){
        if(!menuSetting){return;}

        for(var item in menuSetting){

            var id = item;
            var col = menuSetting[item]['col'];
            var value = menuSetting[item]['value'];
            var parent = menuSetting[item]['parent'];
            var dimensionView = menuSetting[item]['dimensionView'];

            if(col == probableValue){
                var input_id = 'input[id=' + id + ']';
                if(!$(input_id).length){
                    $('<div class="col_l dw-query-field m_b_10"><div class="input-group"><span class="input-group-addon">' + parent + ':</span><input id="' + id + '" type="text" class="form-control" placeholder="" title="请输入搜索" style="width:160px"><input name="'+ id +'" placeholder="搜索" type="hidden" value=""></div>').insertBefore($('div.option_canal input.submit'));
                    
                    var o =$('input[name=' + id + ']');
                    if(value && value !='by' && value!= 'summary'){
                        $('input[id=' + id + ']').val(value);
                        o.val(col + '*_*' + value + '-~');
                    }
                    
                    $('input[id=' + id + ']').bind('blur',function(){
                        if($(this).val()) {
                            if (o.val()) {
                                var val = o.val();
                                var d = val.split("*_*");
                                o.val(d[0] + '*_*' + $(this).val() + '-~')
                            } else {
                                o.val(probableValue + "*_*" + $(this).val() + '-~')
                            }
                        } else {
                            o.val('');
                        }
                    });
                }
            }
        }
    }
    /**
     * 构建下拉数据
     * @param menuSetting
     * @param probableValue
     * @returns {Array}
     */
    function createAllLinkTree(menuSetting, probableValue){
        var id,col,value,parent,dimensionView,
            selectArr = [], data = [];
        if(!menuSetting){return;}
        
        for(var item in menuSetting){
            
                var id = item;
                var col = menuSetting[item]['col'];
                var value = menuSetting[item]['value'];
                var parent = menuSetting[item]['parent'];
                var dimensionView = menuSetting[item]['dimensionView'];
                //selectArr.push({id:id,col:col,value:value,title:parent,dimensionView:dimensionView});
                /*rendLinkTree(id, value, [], parent, dimensionView, col);*/
            
            if(probableValue[col]) {
                data = [];
                for (var i = 0; i < probableValue[col].length; i++) {
                    data.push({value: col + '*_*' + probableValue[col][i], text: probableValue[col][i]});
                }
                selectArr.push({
                    id: id,
                    col: col,
                    value: value,
                    title: parent,
                    dimensionView: dimensionView,
                    probableValue: data
                });
                rendLinkTree(id, value, data, parent, dimensionView, col);
            }
        }
        return selectArr;
    }
    
    //渲染下拉菜单
    function rendLinkTree( name, defaultvalue, data, title, dimensionView, col ){
        
        var html = "",
            common =  [{value:col + '*_*' +'gb',text:'展开'},{value:col + '*_*' +'summary',text:'收拢'}],
            lastValue = true;
        
        var select_id = 'select[id=' + name + ']';
        
        if(!$(select_id).length){
            $('<div class="col_l dw-query-field m_b_10"><input class="subline_input ' + name  + '" name="' + name + '" ></div>').insertBefore($('div.option_canal input.submit'));
            $('<div class="input-group"><span class="input-group-addon">' + title + ':</span><select id="'+ name  +'" title="支持多选，请选择" data-live-search="true" multiple="" data-hide-disabled="true" data-width="214" data-size="10" tabindex="-98"></select></div>').insertBefore($('input.' + name));
        }
        
        //上次记录的值
        //lastValue =  $('select[id="' + name + '"] option:selected').val();
        data = common.concat(data);
        if(defaultvalue === 'by'){
            defaultvalue = 'gb';
        }
        
        var aDefaultvalue = defaultvalue.split(',');
        var aDefaultvalue_str = '';
        
        var selectedValue = false;
        for(var i = 0;i < data.length; i++){
            
            for(var df = 0; df < aDefaultvalue.length; df++){
                if(data[i].value === col + '*_*' + aDefaultvalue[df]){
                    selectedValue = true;
                    aDefaultvalue_str+= data[i].value;
                    if(df+1 < aDefaultvalue.length)
                        aDefaultvalue_str+=',';
                }
            }
            if(selectedValue){
                lastValue = false;
                html += "<option value='" + data[i].value + "' selected='selected'"+ ">" + data[i].text + "</option>";
            } else{
                html += "<option value='" + data[i].value + "'>" + data[i].text + "</option>"
            }
            selectedValue = false;
        }
        $(select_id).html(html);

        
        
        if(lastValue){
            $(select_id + ' option').eq(1).attr('selected','selected');
            $('input[name=' + name + ']').val($(select_id + ' option').eq(1).val());
        }       
        
        if(aDefaultvalue_str && aDefaultvalue_str !== $('input[name=' + name + ']').val()) {
            $('input[name=' + name + ']').val(aDefaultvalue_str);
        }
        
        $(select_id).selectpicker('refresh');
        $(select_id).selectpicker({
            selectedTextFormat:'count > 3'
        });
        
        $('input.'+name).hide();
    }
    
    function selectRender(name,obj){
        var select_id = 'select[id=' + name + ']';
        $(select_id).selectpicker('deselectAll');
        $(select_id).val(obj[0] + '*_*' + obj[1]);
        $(select_id).selectpicker('render');
        $(select_id).selectpicker('var', obj[0] + '*_*' + obj[1]);
    }

    /*
    * 克隆对象
    * */
    function clone(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }
    
    function linkTreeChange(selectArr, idx, data, type){
        
        var select_text='';
        var tempdatas = [];
        var tempdata = '';
        var tempdataArr = [];
        var datas = clone(data);

        if(type === 'select'){
            var select_id = 'select[id=' + selectArr[idx].id +']';
            if($(select_id).find("option:selected").length > 1) {
                $.each($(select_id).find("option:selected"), function (i) {
                    select_text+= $(select_id).find("option:selected").eq(i).text();
                    if(i+1 < $(select_id).find("option:selected").length )
                        select_text+=',';
                });
            } else {
                select_text = $(select_id).find("option:selected").text();
            }
        }else{
            select_text = $('input.' + selectArr[idx].id ).val();
        }
        
        select_text = select_text.split(',');
        for(var i = 0 ; i < datas.length; i++) {
            for(var j =0; j < select_text.length; j++) {
                if (data[i].text === select_text[j]) {
                    tempdatas[j] =  datas[i];
                }
            }
        }
        if(tempdatas) {
            $.each(tempdatas, function (index) {
                if (tempdata) {
                    if(tempdatas[index].next) {
                        $.each(tempdatas[index].next, function (i) {
                            if ($.inArray(tempdatas[index].next[i].text, tempdataArr) == -1) {
                                tempdata.next.push(tempdatas[index].next[i]);
                                tempdataArr.push(tempdatas[index].next[i].text);
                            }
                        })
                    }
                } else {
                    tempdata = tempdatas[index];
                    if(tempdata.next) {
                        $.each(tempdata.next, function (i) {
                            tempdataArr[i] = tempdatas[index].next[i].text;
                        });
                    }
                }
            });
        }

        //给对应input设置可选值
        //inputSuggest($('input.' + selectArr[idx].id), $('select[name=' + selectArr[idx].id +']'));
        
        //渲染下一级菜单
        idx = idx+1;
        if(idx <= selectArr.length-1){
            var nextdata = tempdata && tempdata.next ? tempdata.next : selectArr[idx].probableValue;
            
            rendLinkTree(selectArr[idx].id, selectArr[idx].value, nextdata, selectArr[idx].title, selectArr[idx].dimensionView, selectArr[idx].col);
            //给对应input设置可选值
            //inputSuggest($('input.' + selectArr[idx].id), $('select[id=' + selectArr[idx].id +']'));
            //为下一级菜单注册change事件
            $('select[id=' + selectArr[idx].id +']').unbind('changed.bs.select');
            createChange(selectArr[idx].id,selectArr, idx, nextdata);
        }
    }

    //创建 change 事件
    function createChange(name,selectArr, idx, nextdata){
        
        $('select[id=' + name + ']').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
            var a = $(e.target).val();
            if(a) {
                var a1 = a[0].split('*_*');
                if (clickedIndex == 0) {
                    if(a1[1] == 'gb') {
                        selectRender(selectArr[idx].id,a1);
                    }
                } else if (clickedIndex == 1) {
                    if(a[1]){
                        var a2 = a[1].split('*_*');
                        if(a2[1] == 'summary') a1 = a2;
                    }
                    if(a1[1] == 'summary'){
                        selectRender(selectArr[idx].id,a1);
                    }
                } else {
                    if((a1[1] == 'gb' || a1[1] == 'summary') && a[1]){
                        selectRender(selectArr[idx].id,a[1].split('*_*'));
                    }
                }
                if(nextdata) {
                    linkTreeChange(selectArr, idx, nextdata, 'select');
                }
            }
            $('input[name=' + name + ']').val($(e.target).val());

        }).on('hide.bs.select',function(e){
            if($(e.target).val() == null){
                $('select[id=' + name + '] option').eq(1).attr('selected','selected');
                $('select[id=' + name + ']').selectpicker('refresh');
                $('input[name=' + name + ']').val($('select[id=' + name + '] option').eq(1).val());
            }
        });
    }
    
    //设置默认值
    function setlinkTreeDefault(selectArr){
        var col,value,text;
        if(!selectArr){return;}
        
        for(var i= 0,len= selectArr.length; i<len; i++){
            //col = selectArr[i].col;
            //value = selectArr[i].value;
            //value = value === 'by'?'gb':value;
            //value = col + '*_*' + value;
            //$('select[name=' + selectArr[i].id +']').find('option[value="' + value+ '"]').prop("selected","selected");
            $('select[id=' + selectArr[i].id +']').change();
            //text = $('select[name=' + selectArr[i].id +']').find("option:selected").text();
            //$('input[name=' + selectArr[i].id+']').val(value);
        }
    }

    function confirmInput(data , select){
        select.find('option').each(function(){
            if($(this).text() === data){
                $(this).prop("selected","selected");
                select.change();
                return false;
            }
        });
    }
    //模糊查询
    function inputSuggest(input,select){
        // var Suggest = require('suggest');
        // var convertPinYin = require('convertpinyin');
        var arr_ddpinyin= [];
        
        select.find('option').each(function(){
            //arr_ddpinyin.push({key:convertPinYin($(this).text()),value:$(this).text()});
             arr_ddpinyin.push({key:"",value:$(this).text()});
        });
        
        var suggest = new Suggest({
            target: input,
            data: arr_ddpinyin,
            confirmCb:function(data){
                confirmInput(data,select);
            }
        });
    }

	function renderReport(){

		//表格边框渲染
	    //borderControl("table.table");

	    //表格数据渲染(周末数据颜色修改)
	    markWeekend("table.table");

	    //延迟加载合计行
	    delayLoadTotal("table.table");
	}

    
	//日历控件初始化
	function initCalendar(){
        var date_type = $('input[name=date_type]').val(),
            start, end, date_start,date_end;
        date_start = $('input[name=date_start]').val();
        date_end =  $('input[name=date_end]').val();
        if(date_type ==='4'){
            //添加时间控件
            // var Calendar = require('timecalendar');

            start = new Calendar({element : '.date[name=date_start]',lang:'cn'});
            start.toDate(date_start.substr(0,4),Number(date_start.substr(4,2))-1,date_start.substr(6,2),date_start.substr(9,2),date_start.substr(12,2),date_start.substr(15,2));
            start.render();

            end = new Calendar({element : '.date[name=date_end]',lang:'cn'});
            end.toDate(date_end.substr(0,4),Number(date_end.substr(4,2))-1,date_end.substr(6,2),date_end.substr(9,2),date_end.substr(12,2),date_end.substr(15,2));
            end.render();
        }else{
            //添加日历控件
            // OaCalendar = require('oacalendar');

            start = new OaCalendar({element : '.date[name=date_start]',lang:'cn'});
            start.toDate(date_start.substr(0,4),Number(date_start.substr(4,2))-1,date_start.substr(6,2));
            start.render();

            end = new OaCalendar({element : '.date[name=date_end]',lang:'cn'});
            end.toDate(date_end.substr(0,4),Number(date_end.substr(4,2))-1,date_end.substr(6,2));
            end.render();
        }
	}
    
    //日历控件初始化
    function initDateTime(obj,n){
        var pageInfo,
            reportType,
            start,
            end,
            datePicker = obj;
        var autoUpdateInput = true;
        var date_start = $('input[name=date_start]');
        var date_end = $('input[name=date_end]');
        var contrast_start = $('input[name=contrast_start]');
        var contrast_end = $('input[name=contrast_end]');
        
        function cb(start, end) {

            if(n==1){
                date_start.val(start.format('YYYYMMDD'));
                date_end.val(end.format('YYYYMMDD'));
                if(contrast_start.val()!='' && contrast_end.val()!=''){
                    var deltaT1 = moment(date_end.val()) - moment(date_start.val());
                    contrast_end.val(moment(moment(contrast_start.val()) + deltaT1).format('YYYYMMDD'));
                    $('#datepicker2').val(moment(contrast_start.val()).format('YYYY-MM-DD') + ' ~ ' + moment(moment(contrast_start.val()) + deltaT1).format('YYYY-MM-DD'));
                    $('#datepicker2').data('daterangepicker').setStartDate(moment(contrast_start.val()).format('YYYY-MM-DD'));
                    $('#datepicker2').data('daterangepicker').setEndDate(moment(moment(contrast_start.val()) + deltaT1).format('YYYY-MM-DD'));
                }
            } else {
                
                var deltaT2 = moment(date_end.val()) - moment(date_start.val());
                contrast_start.val(start.format('YYYYMMDD'));
                contrast_end.val(moment(start + deltaT2).format('YYYYMMDD'));
                datePicker.val(start.format('YYYY-MM-DD') + ' ~ ' + moment(start + deltaT2).format('YYYY-MM-DD'));
                datePicker.data('daterangepicker').setStartDate(start.format('YYYY-MM-DD'));
                datePicker.data('daterangepicker').setEndDate(moment(start + deltaT2).format('YYYY-MM-DD'));
            }
        }
        pageInfo = $('#page-info');
        reportType = pageInfo.attr('report-type') || 'daily';
        if(date_start.val()!='' && date_end.val()!='' ){
            if(n == 1) {
                start = moment(date_start.val()).format('YYYY-MM-DD');
                end = moment(date_end.val()).format('YYYY-MM-DD');
            } else {
                if(contrast_start.val()!='' && contrast_end.val()!='') {
                    start = moment(contrast_start.val()).format('YYYY-MM-DD');
                    end = moment(contrast_end.val()).format('YYYY-MM-DD');
                } else {
                    autoUpdateInput = false;
                }
            }
        } else if(reportType == 'daily'){
            start= end = moment().subtract(1, 'day')
        } else if(reportType == 'week'){
            start = end = moment().startOf('week');
        } else if(reportType == 'month'){
            start = end = moment().startOf('month');
        }
        
        datePicker.daterangepicker({
            linkedCalendars: false,
            format: 'YYYY-MM-DD',
            language: 'zh-CN',
            startDate: start,
            endDate: end,
            timePicker: false,
            autoUpdateInput: autoUpdateInput,
            //ranges: {
            //    '今天': [moment(), moment()],
            //  timePicker
            //    '最近7天': [moment().subtract(6, 'days'), moment()],
            //    '最近30天': [moment().subtract(29, 'days'), moment()],
            //    '本月': [moment().startOf('month'), moment().endOf('month')],
            //    '最近一月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            //},
            locale:{
                customRangeLabel: '自定义',
                applyLabel: '确定',
                cancelLabel: '取消',
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            },
            onClose: function(dateText, inst) {
                console.log(dateText);
                console.log(inst);
            }
        }, cb);
        
        if(n==2){
            if($('input[name=contrast]').is(':checked')){
                $('#datepicker2').show();
            }
            $('input[name=contrast]').on('click',function(){
                if($(this).is(':checked')){
                    $('#datepicker2').show();
                } else {
                    $('#datepicker2').hide();
                }
            });
        }
    }


    //日历秒控件初始化
    function initSecondsDateTime(obj){
        var pageInfo,
            reportType,
            start,
            end,
            datePicker = obj;
        var autoUpdateInput = true;
        var date_start = $('input[name=date_start]');
        var date_end = $('input[name=date_end]');

        function cb(start, end) {
            date_start.val(start.format('YYYYMMDD HH:mm'));
            date_end.val(end.format('YYYYMMDD HH:mm'));
        }
        pageInfo = $('#page-info');
        reportType = pageInfo.attr('report-type') || 'daily';
        if(date_start.val()!='' && date_end.val()!='' ){
            start = moment(date_start.val()).format('YYYY-MM-DD HH:mm');
            end = moment(date_end.val()).format('YYYY-MM-DD HH:mm');
        } else if(reportType == 'daily'){
            start= end = moment().subtract(1, 'day')
        } else if(reportType == 'week'){
            start = end = moment().startOf('week');
        } else if(reportType == 'month'){
            start = end = moment().startOf('month');
        }

        datePicker.daterangepicker({
            linkedCalendars: false,
            language: 'zh-CN',
            startDate: start,
            endDate: end,
            timePicker: true,
            timePicker24Hour: true,
            autoUpdateInput: autoUpdateInput,
            //ranges: {
            //    '今天': [moment(), moment()],
            //  timePicker
            //    '最近7天': [moment().subtract(6, 'days'), moment()],
            //    '最近30天': [moment().subtract(29, 'days'), moment()],
            //    '本月': [moment().startOf('month'), moment().endOf('month')],
            //    '最近一月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            //},
            locale:{
                format: 'YYYY-MM-DD HH:mm',
                customRangeLabel: '自定义',
                applyLabel: '确定',
                cancelLabel: '取消',
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            },
            onClose: function(dateText, inst) {
                console.log(dateText);
                console.log(inst);
            }
        }, cb);

    }
    

	//日期上翻和下翻
	function jumpDate(){
        var direct;
		//var date_type = $("select[name=select_date] option:selected").val();
		//$("input[name=date_type]").val(date_type);
		$('div.option_data').on('click','a.jump',function(){
			direct = $(this).attr('id');
			if(direct ==='jumpPrev'){
				$("input[name=date_turning]").val(5);
			}else{
				$("input[name=date_turning]").val(6);
			}
			$("input.submit").click();
		})
        
        $('.date_time_a a').on('click',function(){
            $("input[name=date_turning]").val($(this).index()+1);
            $("input.submit").click();
        })
	}

    //字段排序
    function initOrder(){
        var order_name = $('input[name=order_name]').val();
        var order_value = $('input[name=order_value]').val();
        if(order_name){
            var field = $('a[name=order]').filter('[field='+ order_name +']').find('span[name=orderby]');
            order_value === 'desc' ? field.attr('class','order_down') : field.attr('class','order_up');
        }
        $('table a[name=order]').on('click',function(){
            var ordertag = $(this).find('span[name=orderby]');
            switch(ordertag.attr('class')){
                case 'order_up':
                    ordertag.attr('class','order_down');
                    orderField($(this).attr("field"),'desc');
                    break;
                case 'order_down':
                    ordertag.attr('class','order_up');
                    orderField($(this).attr("field"),'asc');
                    break;
                default :
                    ordertag.attr('class','order_down');
                    orderField($(this).attr("field"),'desc');
                    break;
            }
        });
    }

    function redirect(key,value){
        // var util = require('util');
        var url = window.location.href;
        if(checkURLType()===1){
            if(url.indexOf('/'+ key)< 0){
                url +=  '/'+ key + '/' + value;
            }else{
                var reg = new RegExp('\\/'+ key + '\\/[\\w\\*]*');
                url = url.replace(reg, '/'+ key + '/' + value);
            }
        }else{
             url = util.addUrlParam(url, key, value);
        }
        window.location.href = url;
    }

    function orderField(field,order){
        redirect('select_order',field+'*_*order_'+order);
    }

	//下载报表事件
	function downXls(){
		$('a.glyphicon_download').on('click',function(){
			var href = window.location.href;
			$(this).attr('target', '_blank');
	        if(href.indexOf("&") > 0 ){
	        	href += "&down=1";
	        }else{
	        	href += "/down/1";
	        }
	        $(this).attr('href',href);
		});
	}
    //添加监控事件
    function addMonitor(){
        $('a.glyphicon_monitor').on('click',function(){
            var href = window.location.href;
            if(href.indexOf('cid') < 0){
                href = $('.business_nav .nav_li_on a').attr('href');
            }
            href = href.replace('Business/ViewReport', 'DataMonitor/AddMonitor');
            $(this).attr('target', '_blank');
            $(this).attr('href', href);
        });
    }

    function showSQL(){
        //SQL语句展示
        $('#sql_switch').on('click',function(){
            if($(this).find('em').attr('class')==='icon_sql_switch_up'){
                //展开
                $('#sql_content').slideDown();
                $(this).find('em').attr('class',"icon_sql_switch_down");
            }else{
                //收起
                $('#sql_content').slideUp();
                $(this).find('em').attr('class',"icon_sql_switch_up");
            }
        });
    }

    function ckChartHandler(selectedOptions, pieChartSelect, lineChartSelect){
        var val = selectedOptions.length>0 ? selectedOptions[0].value : '';
        var linecharts =  {};
        if($('#linecharts').val()){
            linecharts = JSON.parse($('#linecharts').val());
        }
        if(val === '1' || val === '2'){
            $("#piechart_select").hide();

            //线性图表
            $("#linechart_select").show();
            lineChartSelect.emit('select',lineChartSelect.getSelected());
        }else if(val === '3'){
            $('div.charts_tip').hide();
            $("#linechart_select").hide();

            //饼图图表
            $("#piechart_select").show();
            pieChartSelect.emit('select',pieChartSelect.getSelected());
        }else{
            $('div.charts_tip').hide();
            $("#linechart_select").hide();
            $("#piechart_select").hide();
            hideChart();
        }
    }

    function lineChartHandler(selectedOptions){
        var myChart,
            linecharts = JSON.parse($('#linecharts').val());
        if(linecharts.xAxis[0].data == null || linecharts.xAxis[0].data.length == 0){
            hideChart();
            $('div.charts_tip').show();
            return;
        }else{
            $('div.charts_tip').hide();
        }
        if(selectedOptions.length > 0){
            // var util = require('util');
            var selectedArr = _getSelectedItem(selectedOptions);
            var totalArr = linecharts.legend.data;
            var unselecteArr = util.removeArray(totalArr,selectedArr);
            linecharts.legend.data = selectedArr;
            linecharts.legend.selected = {};
            for(var i = 0 ,len = unselecteArr.length; i<len ;i++){
                linecharts.legend.selected[unselecteArr[i]] = false;
            }
            myChart = echarts.init(document.getElementById('charts'),'macarons');
            myChart.setOption(linecharts);
            showChart();
        }else{
            hideChart();
        }

        function _getSelectedItem(selectedOptions){
            var item = [];
            for(var i = 0,len = selectedOptions.length; i<len; i++){
                item.push(selectedOptions[i].text);
            }
            return item;
        }
    }

    function pieChartHandler(selectedOptions){
        var id = selectedOptions.length>0 ? selectedOptions[0].value : '',
            data = "barchar="+id,
            url = window.location.href,
            type = "GET",
            myChart;
        if(id){
            showChart();
            myChart = echarts.init(document.getElementById('charts'),'macarons');
            loadChartData(myChart,type,url,data);
        }else{
            hideChart();
        }
    }

    function loadChartData(myChart,type,url,data){
        myChart.showLoading({
            text: '正在努力的读取数据中...',
            effect: 'whirling'
        });
        $.ajax({
            type: type,
            url:url,
            data: data,
            dataType:'json',
            success: function(result) {
                myChart.hideLoading();
                myChart.setOption(result);
            }
        });
    }

    function showChart(){
        $('#charts_div').css({'height':'auto'});
        $('#charts_div').css({'border':'1px solid #ddd'});
    }
    function hideChart(){
        $('#charts_div').css({'height':'0'});
        $('#charts_div').css({'border':'none'});
    }

	//表格边框控制
	function borderControl(table){
		var titleCell = $(table).find(".table_title").children(),
			rowspan = 1,
			colspan = 1,
			subtitleColIndex =0,
			bodyColIndex = 0;
		titleCell.each(function(index){
			rowspan = parseInt($(this).attr("rowspan")) || 1;
			colspan = parseInt($(this).attr("colspan")) || 1;
			setSubTitleBorder(table,subtitleColIndex,colspan);
			setBodyBorder(table,bodyColIndex,colspan);
			subtitleColIndex += rowspan > 1 ? 0 : colspan;
			bodyColIndex += colspan;
		});
	}

	function setSubTitleBorder(table,colindex,colspan){
		var tr = $(table).find("tr.table_subtitle");
		setborders(tr,colindex,colspan);
	}

	function setBodyBorder(table,colindex,colspan){
		var tr = $(table).find("tr.table_body");
		setborders(tr,colindex,colspan);
	}

	function setborders(tr,colindex,colspan){
		if(colspan === 1){return;}
		tr.each(function(index){
			for(var i = colindex,len = colindex + colspan; i < len; i++){
				if(i === colindex){
					$(this).children(":eq("+ i +")").addClass('leftborder');
				}else if(i === len-1){
					$(this).children(":eq("+ i +")").addClass('rightborder');
				}else{
					$(this).children(":eq("+ i +")").addClass('noneborder');
				}
			}
		});
	}
	
	//标记周末数据
	function markWeekend(table){
		// var util = require('util'),
		var tr = $(table).find("tr.table_body"),
            date_type = $('input[name=date_type]').val(),
			date;
        if(date_type !=='0'){
            //周报,月报和年报不渲染周末数据项
            return;
        }
		tr.each(function(){
			date = util.stringToDate($(this).children().first().text());
			if(util.isDate(date)&& (date.getDay()===6 ||date.getDay()===0)){
				$(this).css('color','#328cf0');
			}
		});
	}

	//延迟加载合计行
	function delayLoadTotal(table){
		var url = window.location.href + '&req_sub=1';
        if(checkURLType()===1){
            url = window.location.href + '/req_sub/1';
        }else{
            url = window.location.href + '&req_sub=1';
        }

        if($('#nodata').length>0){
            return;
        }
        $.get(url, {}, function(data) {
            data['sum'] &&  $('div.report .table').append(getDataInnerHtml(data['sum'],'sum'));
            data['avg'] && $('div.report .table').append(getDataInnerHtml(data['avg'],'average'));
        });

        function getDataInnerHtml(data, type){
            var html ='<tr class="table_body total ' + type + '">';
            for(var item in data){
                html += '<td>' + data[item] + '</td>';
            }
            html += '</tr>'
            return html;
        }
	}

    /**
     * 自定义指标 添加常用报表
     */
    function customIndicators(){
        $('#custom').on('click',function(){
            var cid =  $('input[name=cid]').val();
            bootbox.dialogGet('自定义指标', '/Business/CustomReport', {cid: cid, rnd: Math.random()}, 750);
        });
        
        $('#common_use').on('click',function(){
            var cid =  $('input[name=cid]').val();
            var cancel = 0, a,herf,title;
            if($('#common_use i').attr('class')=='icon-heart') {
                cancel = 1;
            }
            if((window.location.href).indexOf("used=1") > -1){
                a = $('.used_tree li.level_0 div.on a').attr('data-title').split('|');
                herf = a[0];
                title = a[1];
            } else {
                a = $('.type_tree ul.level_0 div.on a');
                herf = a.attr('href').split("/");
                herf = herf[herf.length-1];
                title = a.attr('data-title').split('|');
                title = title[title.length-1];
            }
            
            $.ajax({
                url: '/Business/CommonReport',
                type: 'post',
                data:  {cid: cid, pid: herf,name: title,cancel:cancel,rnd: Math.random()},
                success: function(result) {
                    if(result == 1){
                        window.location.href = "/Business/ViewReport/pid/" + herf + "/cid/"+cid;
                    } else {
                        window.location.href = window.location.href;
                    }
                    /*if($('#common_use i').attr('class')=='icon-heart')
                        $('#common_use i').attr('class','icon-heart-empty');
                    else 
                        $('#common_use i').attr('class','icon-heart');*/
                }
            });
        });
    }

    
    function checkURLType(){
        if(window.location.href.indexOf('&')<0 && window.location.href.indexOf('?')<0){
           //URL为： /req_sub/1
           return 1;
        }else{
           //URL为： &req_sub=1
            return 2;
        }
    }

    
	export default BusinessData;
