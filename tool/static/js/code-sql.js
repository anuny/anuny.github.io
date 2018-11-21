define("code::sql", function() {
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
	
	function isSubquery(str, parenthesisLevel) {
		return  parenthesisLevel - (str.replace(/\(/g,'').length - str.replace(/\)/g,'').length )
	}
	
	function split_sql(str, tab) {
		return str.replace(/\s{1,}/g," ")
			.replace(/ AND /ig,"~::~"+tab+tab+"AND ")
			.replace(/ BETWEEN /ig,"~::~"+tab+"BETWEEN ")
			.replace(/ CASE /ig,"~::~"+tab+"CASE ")
			.replace(/ ELSE /ig,"~::~"+tab+"ELSE ")
			.replace(/ END /ig,"~::~"+tab+"END ")
			.replace(/ FROM /ig,"~::~FROM ")
			.replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ")
			.replace(/ HAVING /ig,"~::~HAVING ")
			.replace(/ IN /ig," IN ")
			.replace(/ JOIN /ig,"~::~JOIN ")
			.replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ")
			.replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ")
			.replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ")
			.replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ")
			.replace(/ ON /ig,"~::~"+tab+"ON ")
			.replace(/ OR /ig,"~::~"+tab+tab+"OR ")
			.replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ")
			.replace(/ OVER /ig,"~::~"+tab+"OVER ")
			.replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ")
			.replace(/\)\s{0,}SELECT /ig,")~::~SELECT ")
			.replace(/ THEN /ig," THEN~::~"+tab+"")
			.replace(/ UNION /ig,"~::~UNION~::~")
			.replace(/ USING /ig,"~::~USING ")
			.replace(/ WHEN /ig,"~::~"+tab+"WHEN ")
			.replace(/ WHERE /ig,"~::~WHERE ")
			.replace(/ WITH /ig,"~::~WITH ")
			.replace(/ ALL /ig," ALL ")
			.replace(/ AS /ig," AS ")
			.replace(/ ASC /ig," ASC ")	
			.replace(/ DESC /ig," DESC ")	
			.replace(/ DISTINCT /ig," DISTINCT ")
			.replace(/ EXISTS /ig," EXISTS ")
			.replace(/ NOT /ig," NOT ")
			.replace(/ NULL /ig," NULL ")
			.replace(/ LIKE /ig," LIKE ")
			.replace(/\s{0,}SELECT /ig,"SELECT ")
			.replace(/\s{0,}UPDATE /ig,"UPDATE ")
			.replace(/ SET /ig," SET ")
						
			.replace(/~::~{1,}/g,"~::~")
			.split('~::~');
	}

	code.fn = code.prototype = {
        constructor:code,
        init:function(source) {
            this.tab = '\t';
			this.source = source;
            return this;
        },
		format:function(opt){
			var ar_by_quote = this.source.replace(/\s{1,}/g," ").replace(/\'/ig,"~::~\'").split('~::~'),
			len = ar_by_quote.length,
			ar = [],
			deep = 0,
			tab = (opt&&opt.tab) || this.tab;
			tabs = createShift(tab),
			inComment = true,
			inQuote = false,
			parenthesisLevel = 0,
			str = '',
			ix = 0;
	
			for(ix=0;ix<len;ix++) {
				if(ix%2) {
					ar = ar.concat(ar_by_quote[ix]);
				} else {
					ar = ar.concat(split_sql(ar_by_quote[ix], tab) );
				}
			}
			
			len = ar.length;
			for(ix=0;ix<len;ix++) {
				
				parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);
				
				if( /\s{0,}\s{0,}SELECT\s{0,}/.exec(ar[ix]))  { 
					ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"")
				} 
				
				if( /\s{0,}\s{0,}SET\s{0,}/.exec(ar[ix]))  { 
					ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"")
				} 
				
				if( /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(ar[ix]))  { 
					deep++;
					str += tabs[deep]+ar[ix];
				} else 
				if( /\'/.exec(ar[ix]) )  { 
					if(parenthesisLevel<1 && deep) {
						deep--;
					}
					str += ar[ix];
				}
				else  { 
					str += tabs[deep]+ar[ix];
					if(parenthesisLevel<1 && deep) {
						deep--;
					}
				} 
				var junk = 0;
			}
	
			str = str.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");
			return str;
		},
		mini:function(){
			return this.source.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
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

