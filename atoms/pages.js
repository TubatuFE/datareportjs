
    function pages(){
        $('div.pages input.redirect').on('keydown',function(event){
            var num = $(this).val();
            if(!keyPressIsAllowed(event.which)){
                event.preventDefault();
                return;
            }
            if(event.keyCode == "13"){
                jump(num);
            }
        });

        $('div.pages a.btn').on('click',function(){
            var num = $('div.pages input.redirect').val();
            jump(num);
        })
    }

    function keyPressIsAllowed( which ){
        if( which >= 96 && which <= 105     // 小键盘0~9
            || which >= 48 && which <= 57     // 大键盘0~9
            || which === 37 || which === 39   // 方向键
            || which === 8 || which === 46    // 退格与delete键
            || which === 9 || which === 13    // tab与enter键
            )return true;
    }

    function jump(num){
        var href = $('div.pages').find('a').first().attr('href');
        if(href){
            window.location.href = href.replace(/\d+\.html$/ , num+'.html');
        }
    }

	export default pages;
