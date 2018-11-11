define("code::json", function() {
	var code = function(source) {
        return new code.fn.init(source);
    };
	code.fn = code.prototype = {
        constructor:code,
        init:function(source) {
			this.tab = '\t'; 
			this.source = source;
            return this;
        },
		format:function(opt){
			var tab = (opt&&opt.tab) || this.tab;
			if (typeof JSON === 'undefined' ) return this.source; 
			if ( typeof this.source === "string" ) return JSON.stringify(JSON.parse(this.source), null, tab);
			if ( typeof this.source === "object" ) return JSON.stringify(this.source, null, tab);
			return this.source; 
		},
		mini:function(){
			if (typeof JSON === 'undefined' ) return this.source; 
			return JSON.stringify(JSON.parse(this.source), null, 0); 
		}
	};
	code.fn.init.prototype = code.fn;
    return code;
})

