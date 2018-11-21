define("code::css", function() {
	var code = function(source) {
        return new code.fn.init(source);
    };
	code.fn = code.prototype = {
        constructor:code,
        init:function(source) {
            this.shift = '\t'; 
			this.indent = 1; 
			this.source = source;
            return this;
        },
		format:function(options){
			var indent = options ? options.indent : this.indent;
			var shift = options?options.shift : this.shift;
			var tabsize = (function(){
				var ret='';
				for(var i=0,len=indent;i<len;i++){
					ret += shift;
				}
				return ret;
			})();
			var code=this.mini(this.source).replace(/(\{)/ig,' $1').replace(/(\{|\;)/ig,'$1\n'+tabsize).replace(/\t*(\})/ig,'$1\n').replace(/(\*\/)/ig,'$1\n');
			return code;
		},
		mini:function(){
			var code=this.source.replace(/(\n|\t|\s)*/ig,'$1').replace(/\n|\t|\s(\{|\}|\,|\:|\;)/ig,'$1').replace(/(\{|\}|\,|\:|\;)\s/ig,'$1');
			return code;
		},
		line:function(){
			var code=this.mini(this.source).replace(/(\})/ig,'$1\n');
			code=code.replace(/(\*\/)/ig,'$1\n');
			return code;
		}
	};
	code.fn.init.prototype = code.fn;
    return code;
})

