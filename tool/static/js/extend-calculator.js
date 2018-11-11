define("extend::calculator", function() {
	var calculator = function(options) {
        return new calculator.fn.init(options);
    };
	calculator.fn = calculator.prototype = {
        constructor:calculator,
        init:function(options) {
            this.result = options.result; 
			this.prompt = options.prompt; 
			this.nLast = 0;
			this.bNewNum = false;
			this.sLastOpr = "";
			this.sLastPrompt = "";
			this.sLastPro = "";
            return this;
        },
		inputNum:function(num){
			if (this.bNewNum) {
				this.result.value  = num;
				this.bNewNum = false;
				if(this.sLastOpr == "="){
					this.prompt.innerHTML = num;
				}else{
					this.prompt.innerHTML += num;	
				}
			}else {
				if (this.result.value == "0"){
					this.result.value = num;
					this.prompt.innerHTML = num;
				}else{
					this.result.value += num;	
					this.prompt.innerHTML += num;	
					
				}
			}
			this.sLastPrompt = this.prompt.innerHTML;
		},
		operate:function(opr){
			if(!this.sLastPrompt){
				return;
			}
			var Readout = this.result.value;
			if (this.bNewNum && this.sLastOpr != "="){
				switch(opr)
				{
					case '+' :
					case '－' :			
						this.prompt.innerHTML = this.sLastPrompt+opr;	//字符串相加	
						break;
					case '×' :
					case '÷' :	
					case '%' :	
						this.prompt.innerHTML = "("+this.sLastPrompt+")"+opr;
						break;
					default :
						break;
				}
				this.sLastOpr = opr;
			}else{
				this.bNewNum = true;
				switch(this.sLastOpr)
				{
					case '+' :
						this.nLast += parseFloat(Readout);
						break;
					case '－' :
						this.nLast -= parseFloat(Readout);
						break;
					case '×' :
						this.nLast *= parseFloat(Readout);
						break;
					case '÷' :
						this.nLast /= parseFloat(Readout);
						break;
					case '%' :
						this.nLast %= parseFloat(Readout);
						break;
					default :
						this.nLast = parseFloat(Readout);
						break;
				}
				switch(opr)
				{
					case '+' :
					case '－' :
						this.prompt.innerHTML += opr;
						break;
					case '×' :
					case '÷' :
					case '%' :		
						if(this.sLastOpr == '×' || this.sLastOpr == '÷' || this.sLastOpr == ""){
							this.prompt.innerHTML += opr;
						}else{
							this.prompt.innerHTML = "("+this.prompt.innerHTML+")"+opr;
						}
						break;
					case '=' :
						break;
					default :
						break;
				}
				this.result.value = this.nLast;
				this.sLastOpr = opr;
			}
		},
		inputDecimal:function(){
			var value = this.result.value;
			if (this.bNewNum) {
				value = "0.";
				this.prompt.innerHTML += "0.";
				this.bNewNum = false;
			}else{
				if (value.indexOf(".") == -1){
					value += ".";
					if(this.prompt.innerHTML == ""){
						this.prompt.innerHTML = "0.";
					}else{
						this.prompt.innerHTML += "."; 
					}
				}
			}
			this.result.value = value;
		},
		clearAll:function (){
			this.nLast = 0;
			this.sLastOpr = "";
			this.result.value = "0";
			this.prompt.innerHTML = "";
			this.bNewNum = true;
		},
		negative:function () 
		{
			this.result.value = parseFloat(this.result.value) * -1;
			this.prompt.innerHTML = "-("+this.prompt.innerHTML+")";
		},
		reciprocal:function () {
			var value = 1 / this.result.value;
			if (this.result.value == 0) {
				value = '正无穷'
			};
			this.result.value = value;
			this.prompt.innerHTML = value;
		},
		radicals:function () {
			var value = Math.sqrt(this.result.value);
			this.result.value = value;
			this.prompt.innerHTML = value;
		}
	};
	calculator.fn.init.prototype = calculator.fn;
    return calculator;
});

