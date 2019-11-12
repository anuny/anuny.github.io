seajs.config({
	paths: {
		'css': './static/css',
		'jquery': './static/js/lib/jquery',
		'app': './static/js/app',
	},
	alias: {
		'jquery': 'jquery/jquery.min.js',
		'dragsort': 'app/dragsort-0.4.min.js',
		'main': 'app/main.js',
	}
});
seajs.use('jquery',
function() {
seajs.use('main',
	function() {
		layout.mainWidth($('.menu'), $('.container'));
		$(window).resize(function() {
			layout.mainWidth($('.menu'), $('.container'));
		});
		data.ajax('https://www.thankwork.cn/link/data.json');	
		user.login();
		var len=$('#main>li>ul>li').length;
		var tit=$('title');
		tit.html('网络书签 - 杨飞 - '+len+'个网址')
	});
});
