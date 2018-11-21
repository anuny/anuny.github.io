(function(win, undefined) {
	'use strict';
	var $       = require('extend::dom');
	
	// 公历转农历
	var dater   = require('plugins::dater');
	function getCalendar(){
		var times = $('time.lunar-calendar');
		times.each(function(){
			var time = $(this);
			var date = time.text();
			var calendar = dater(date);
			var newDate = calendar.era;
			if(calendar.ster!==''){
				newDate += '<a href="#" class="link-important">' +calendar.ster +'</a>'
			}else{
				newDate += '<i class="icon">&#xe64e;</i>'
			};
			time.html(newDate).attr('title',date)
		})
	}
	getCalendar();
	
	function share(options){
		var title = document.title;
		var img = $('.global-post img')[0]
		img = img?img.src:'';
		window._bd_share_config = {
			"common": {
				"bdText": title,
				"bdMini": "1",
				"bdPic": img,
				"bdStyle": "1",
				"bdSize": "0"
			},
			"share": {}
		};
		
		var jsSrc = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+ ~ ( - new Date() / 36e5);
		var head = document.getElementsByTagName('head')[0]||body;
		var js = document.createElement('script');
		js.src = jsSrc + ~ ( - new Date() / 36e5);
		head.appendChild(js);
		js = null;
	}
	
	share();
	

	
	
	
	// 代码高亮
	var fhlt    = require('plugins::highlight');
	var hl = fhlt.init({
		element:'code', //代码元素名称
		langFix:'class',//语言标识
		clsName:'HL',  // 高亮样式前缀
		theme:'gray', // 默认主题 light,gray,blue,red,dark
		fontSize:'14px',
		lineNum:false,  // 是否显示行号
		wrap:true      // 是否自动换行
	});
	
	// 切换主题
	//hl.setTheme('dark')
	
	// 列表瀑布流
	var waterfall = require('plugins::waterfall');
	waterfall('.waterfall');
	
	// 图片灯箱插件
	var lightbox = require('plugins::lightbox');
	lightbox();

	
	// 二级菜单
	function headerMenu(){
		var menu = $('.menu li');
		var isShow =null;
		var doc = $(document);
		
		menu.each(function(index, element) {
            var This = $(this);
			var current = This.find('a.current');
			var topNav = This.find('a').first();
			if(current.length>0){
				topNav.addClass('current')
			}
			
        });
		
		function show(root,callback){
			var subNav =  root.find('dl');
			if(subNav.length){
				var arrow = root.find('li a i.icon'); 
				arrow.addClass('current');
				subNav.addClass('show');
				isShow = root;
				'function' == typeof callback && callback();
			}	
		};
		function hide(root){
			var subNav =  root.find('dl');
			if(subNav.length){
				var arrow = root.find('li a i.icon'); 
				arrow.removeClass('current');
				subNav.removeClass('show');
			};
			doc.off('click')
		};
		function docClick(){
			setTimeout(function(){
				doc.on('click',function(){
					if(isShow){
						hide(isShow);
					};
				})	
			},0) ;	
		}

		
		menu.on('mouseenter',function(){
			show($(this));
		});
		menu.on('mouseleave',function(){
			hide($(this));
		});
		menu.on('click',function(){
			var This = $(this);
			var thisShow = This.find('dl');
			var hasShow = thisShow.hasClass('show');
			if(thisShow.length){
				if(hasShow){
					hide(This);
				}else{
					if(isShow && isShow.length){
						hide(isShow);
					};
					show(This,function(){
						docClick();
					})
				}
			}
		})
	};
	
	headerMenu();
	
	// 返回顶部
	function backTop(){
		var maxScroll = 500;
		var backTopBtn = $('.footer .backtop');
		var win = $(window);
		var scrollTop = win.scrollTop(); 
		function init(val){
			val>=maxScroll?backTopBtn.css({'display':'block'}):backTopBtn.css({'display':'none'});
		};
		
		$(window).on('scroll',function(){
			scrollTop = win.scrollTop(); 
			init(scrollTop);
		});
		
		backTopBtn.on('click',function(){
			document.documentElement.scrollTop = document.body.scrollTop =0;
		});

		init(scrollTop);
	};
	
	backTop();
	
})(this);