---
title: 测试
description: 喝酒，大醉一场。
template:post
date:2010-05-30 19:07:00
tags:胸脯 喝酒
---

``` javascript
(function(){
	window.isDarked = false;
	var arr,reg = new RegExp("(^| )isDarked=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)){
		if(unescape(arr[2]) === 'true'){
			var className = document.documentElement.className,hasClass = new RegExp("(\\s|^)color-dark(\\s|$)").test(className);
			!hasClass && (document.documentElement.className += " " + 'color-dark');
			window.isDarked = true
		}
	}
})();
```

