define("code::xml", function() {
	var code = function(source) {
        return new code.fn.init(source);
    };
	
	function createShift(shift) {
		var tabArr = ['\n']
		for(var i=0;i<100;i++){
			tabArr.push(tabArr[i]+shift); 
		};
		return tabArr;
	}
	code.fn = code.prototype = {
        constructor:code,
        init:function(source) {
			this.tab = '\t';
			this.source = source;
            return this;
        },
		format:function(opt){
			var tab = (opt&&opt.tab) || this.tab;
			var tabs = createShift(tab);
			var ar = this.source.replace(/>\s{0,}</g,"><")
				 .replace(/</g,"~::~<")
				 .replace(/\s*xmlns\:/g,"~::~xmlns:")
				 .replace(/\s*xmlns\=/g,"~::~xmlns=")
				 .split('~::~'),
			len = ar.length,
			inComment = false,
			deep = 0,
			str = '',
			ix = 0;
	console.log(ar)
			for(ix=0;ix<len;ix++) {
				// start comment or <![CDATA[...]]> or <!DOCTYPE //
				if(ar[ix].search(/<!/) > -1) { 
					str += tabs[deep]+ar[ix];
					inComment = true; 
					// end comment  or <![CDATA[...]]> //
					if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) { 
						inComment = false; 
					}
				} else 
				// end comment  or <![CDATA[...]]> //
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) { 
					str += ar[ix];
					inComment = false; 
				} else 
				// <elm></elm> //
				if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
					/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) { 
					str += ar[ix];
					if(!inComment) deep--;
				} else
				 // <elm> //
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
					str = !inComment ? str += tabs[deep++]+ar[ix] : str += ar[ix];
				} else 
				 // <elm>...</elm> //
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
					str = !inComment ? str += tabs[deep]+ar[ix] : str += ar[ix];
				} else 
				// </elm> //
				if(ar[ix].search(/<\//) > -1) { 
					str = !inComment ? str += tabs[--deep]+ar[ix] : str += ar[ix];
				} else 
				// <elm/> //
				if(ar[ix].search(/\/>/) > -1 ) { 
					str = !inComment ? str += tabs[deep]+ar[ix] : str += ar[ix];
				} else 
				// <? xml ... ?> //
				if(ar[ix].search(/<\?/) > -1) { 
					str += tabs[deep]+ar[ix];
				} else 
				// xmlns //
				if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) { 
					str += tabs[deep]+ar[ix];
				} 
				
				else {
					str += ar[ix];
				}
			};
			return  (str[0] == '\n') ? str.slice(1) : str;
		},
		mini:function(opt){
			var code = this.source.replace(/^\s+/, '');
			var code = (opt&&opt.comment) ? this.source.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"").replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns'):this.source;
			return  code.replace(/>\s{0,}</g,"><"); 
		}
	};
	code.fn.init.prototype = code.fn;
    return code;
})

