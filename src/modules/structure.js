    import AccordionMenu from './coms/accordionmenu.js';
    import Notice from './coms/tip.js';

	var Structure = function(){

	}

    Structure.prototype.init = function(){
		initEvent();
		this.render();
	};

    Structure.prototype.render = function(){
		
        //通知消息
        getNotice();
        //页面自适应
        pageAdapter();
        //顶部用户头像
        userMenu();
        //左侧菜单处理
        rendMenu();
	};

    //左侧菜单处理
    function rendMenu(){
        // var AccordionMenu = require('accordionmenu'),
        var menu = new AccordionMenu('div.type_tree'),
            node;
        menu.init();

        //搜索目录
        searchMenu();

        if((window.location.href).indexOf("used=1") == -1) {
            if (node = findMenuNode(window.location.pathname)) {
                menu.unfold(node);
            }
        } else {
            $('.used_tree ol').show();
            $('.used_tree span[name=switch]').attr('class','icon_tree_switch_down');
        }
        //常用报表
        $('.used_tree li').children('div:eq(0)').find('a').on('click',function(){
            if($('.used_tree ol').is(':hidden')){
                $('.used_tree ol').show();
                $('.used_tree span[name=switch]').attr('class','icon_tree_switch_down');
            } else {
                $('.used_tree ol').hide();
                $('.used_tree span[name=switch]').attr('class','icon_tree_switch_up');
            }
        })
    }

    function findMenuNode(url){
        var link = $('div.type_tree').find('a'),
            href,
            node;
        url = addEndStr(url, '/').toLowerCase();
        link.each(function(){
            if(href = $(this).attr('href')){
                if(url.indexOf(addEndStr(href, '/').toLowerCase())>=0){
                    node = $(this).parents('li').first();
                    return false;
                }
            }
        });
        return node;
    }

    function addEndStr(str, endStr){
        return str.substr(str.length - endStr.length,endStr.length) === endStr ? str :  str + endStr;
    }

    /*
     *  创建搜索 事件处理
     */
    function searchMenu(){
        $('.menu-search input[name=search]').on('click',function(){
            $('.menu-search-list').show();
            $('.menu-search-list input[name=searchmenu]').focus();
            $('.menu-search-list input[name=searchmenu]').bind('blur',function(){
                hidemenu();
            })
        });
        $('.menu-search-list').hover(function(){
            $('.menu-search-list input[name=searchmenu]').unbind('blur');
            $('.menu-search-list').show();
        },function(){
            hidemenu();
        });

        $('.menu-search-list .more').bind('click',function(){
            $('.menu-search-html dd').show();
            $(this).hide();
            $('.menu-search-list .last1').removeAttr('class');

        });
        $('.menu-search-list input[name=searchmenu]').bind('input propertychange',function(){
            createMenu($(this))
        })
    }
    function hidemenu(){
        $('.menu-search-list').hide();
        $('.menu-search-html').html('');
        $('.menu-search-list input[name=searchmenu]').val('');
        $('.menu-search input[name=search]').val('');
        $('.menu-search-list .more').hide();
    }

    /*
     * 查询相同字符
     */
    function createMenu(obj){
        var list =  $('#cont_left .type_tree ul a');
        var a = [];
        if($.trim(obj.val())) {
            $.each(list, function (index,con) {
                list.eq(index).attr('data-a',index);
                if (list.eq(index).attr('data-title').indexOf(obj.val()) != -1) {
                    //console.log(list.eq(index).attr('data-title'));
                    a.push(list.eq(index));
                }
            });
            createHTML(a);
        } else {
            $('.menu-search-html').html('');
        }
        $('.menu-search input[name=search]').val(obj.val());
    }
    /*
     * 查询 父节点 构造HTML
     */
    function createHTML(arr){

        var a = [];
        var oneA=[],towA=[];
        /**
         * 构造父节点
         */
        $.each(arr,function(index,con){
            var t = con.attr('data-title').split('|');
            var data = [];
            if( t[0] != 0 ){
                var oid = 0;
                for(var i = 0; i<= t[0] ;i++) {
                    var o = con.parents('li.level_' + i + ':eq(0)').children('div:eq(0)').children('a:eq(0)');
                    var c = o.attr('data-title').split('|');
                    var id = o.attr('data-a');
                    if (i == 0) {
                        if (!a[id]) {
                            data = a[id] = [];
                            a[id][0] = [];
                            a[id][0]['con'] = c[1];
                            a[id][0]['herf'] = o.attr('href')?o.attr('href'):'';
                            a[id][0]['id'] = id;
                            a[id][0]['perant'] = oid;
                            oneA.push(id);
                        } else {
                            data = a[id];
                        }
                    } else {
                        if(towA && $.inArray(id,towA) > -1){
                        } else {
                            var data_s = [];
                            data_s['con'] = c[1];
                            data_s['href'] = o.attr('href')?o.attr('href'):'';
                            data_s['id'] = id;
                            data_s['perant'] = oid;
                            if(!data[i])
                                data[i]=[];
                            data[i].push(data_s);
                            towA.push(id);
                        }
                    }
                    oid = id;
                }
            }
            // delete(data);
        });
        // 二维转多维
        $.each(oneA,function(oi,oc){
            if(a[oc]){
                for(var j=a[oc].length-1;j>=0;j--){
                    for(var n=0;n<a[oc][j].length;n++) {
                        if(j-1 >0){
                            for(var i=0;i<a[oc][j-1].length;i++){
                                if( a[oc][j][n]['perant'] == a[oc][j-1][i]['id']){
                                    if(!a[oc][j-1][i]['list'])
                                        a[oc][j-1][i]['list'] = [];
                                    a[oc][j-1][i]['list'].push(a[oc][j][n]);
                                }
                            }
                        } else if(j-1==0){
                            a[oc][j-1]['list'] = [];
                            a[oc][j-1]['list'].push(a[oc][j]);
                        }
                    }
                    if(j!=0) ;
                        // delete (a[oc][j]);
                }
            }
        });
        /**
         * 构造 HTML
         */
        var html ='';
        html+='<dl>';
        $.each(oneA,function(oi,oc){
            if(a[oc]){
                if((oi+1) == oneA.length)
                    html+='<dd class="last"';
                else
                    html+='<dd';

                if(oi > 2){
                    html+=' style="display:none;"';
                    $('.menu-search-list .more').show();
                } else {
                    $('.menu-search-list .more').hide();
                }
                if(oneA.length>2 && oi==2){
                    html+=' class="last last1" ';
                }
                html+='><a data-a="'+ a[oc][0]['id'] +'">' +a[oc][0]['con']+ '</a>';
                if(a[oc][0]['list']) {
                    html = arrDG(a[oc][0]['list'][0], html);
                }
                html+='</dd>';
            }
        });
        html+='</dl>';
        $('.menu-search-html').html(html);
        $('.menu-search-html a').on('click',function(){
            if(!$(this).attr('href')) {
                $('.type_tree ul.level_0 li ul').hide();
                $('.type_tree ul.level_0 a').eq($(this).attr('data-a')).click();
                hidemenu();
            }
        });
    }
    /**
     * 递归构造 HTML
     */
    function arrDG(obj,html){
        html+= '<dl>';
        $.each(obj,function(i,c){
            html+= '<dd><a';
            if(c['href'])
                html+= ' href="' + c['href'] + '"';
            html+= ' data-a= "' + c['id'] + '">' + c['con'] + '</a>';
            if(c['list']){
                html = arrDG(c['list'],html);
            }
            html+='</dd>';
        });
        html+='</dl>';
        return html;
    }
    
    function getNotice(){
        var url = window.location.href;
        if(url.indexOf("appName") ===  -1){
            $.ajax({
                type : "get",
                url : "/Base/NoticeView",
                data:{action:'get'},
                cache:false,
                success : function(data){
                    if(!data){return;}
                    for(var i = 0; i<data.length; i++){
                        target = (i == 0 ? 'span.notice_msg':$('.tip').last());
                        rendNotice(target,'tip'+i, data[i]);
                    }
                }
            });
        }
    }

    function rendNotice(target,tip,data){
        if(!data){return;}
        var level;
        // var Notice = require('tip');
        var notice = new Notice({
            target: target,
            tip : tip,
            title: '通知',
            content: createNoticeHtml(data),
            close:'&times',
            trigger : 'click',
            effects  : 'normal',
            direction : 'bottom'
        });
        level = data.level;
        if(level === "1"){
            //紧急
            notice.setBgColor('#f99ea3');
        }else if(level ==="2"){
            //普通
            notice.setBgColor('#d7d7d7');
        }
        notice.on('close',function(obj){
            closeNotice(obj);
        });
        //$('span.notice_msg').click();
        notice.show();
    }

    function createNoticeHtml(data){
        var html = '';
        if(data){
            html += '<div class="inner" data-id="'+ data.id + '" style="word-wrap: break-word;">'+ data.content + '</div>';
            html += '<div style="float:right">'+ data.notifier + '</div>';
        }
        return html;
    }

    function closeNotice(obj){
        var noticeid = obj.tip.find('div.inner').attr('data-id');
        $.ajax({
            type : "get",
            url : "/Base/NoticeView",
            data: {action:'remove',id:noticeid},
            success : function(data){
                return data;
            }
        });
    }
    function userMenu(){
        $('.navbar-header').hover(function(){
            $('.user-menu').slideDown(200);
        },function(){
            $('.user-menu').slideUp(200);
        })    
    }
    
	function initEvent(){
		//自适应处理
        $(window).bind("resize",function() {
            pageAdapter(); 
        });
	}

	function pageAdapter(){
		var windowWidth = 0,
            windowHeight = 0,
            bodyWidth = 0,
            bodyHeight = 0,
            topHeight = $('div.mod_top').outerHeight(),
            contentHeight = $('#bodycontent').outerHeight(),
			leftMenuWidth = $('#cont_left').outerWidth(),
            rightContentWidth= $('#cont_right').outerWidth();
		if (document.documentElement && document.documentElement.clientHeight) {
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else  if (document.body){ 
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }
        //if(leftMenuWidth + rightContentWidth < windowWidth){
            rightContentWidth = windowWidth - leftMenuWidth;
        //}
        bodyWidth = leftMenuWidth + rightContentWidth;

        $('#cont_right').outerWidth(rightContentWidth-1);
        $('div.sql').outerWidth($('div.report').outerWidth());
        $(document.body).width(bodyWidth);

        contentHeight = $('#bodycontent').outerHeight();
        bodyHeight = topHeight + contentHeight > windowHeight ? topHeight + contentHeight : windowHeight;
        //$('#bodycontent').height(bodyHeight - topHeight-10);
        //$(document.body).height(bodyHeight);

        if($('#testIframe').length > 0){
            $('#testIframe').height(windowHeight-115);
            $('#testIframe').width(rightContentWidth-270);
        }
	}
	
	export default Structure;
