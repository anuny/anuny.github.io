define("plugins::highlight", function() {
    var hasClass = function(node, className) {
        return new RegExp("(\\s|^)" + className + "(\\s|$)").test(node.className);
    };
    var addClass = function(node, className) {
        if (!hasClass(node, className)) node.className = [ node.className, className ].join(" ").replace(/(^\s+)|(\s+$)/g, "");
    };
    var removeClass = function(node, className) {
        if (hasClass(node, className)) node.className = node.className.replace(new RegExp("(\\s|^)" + className + "(\\s|$)", "g"), " ").replace(/(^\s+)|(\s+$)/g, "");
    };
    var highlight = function(element, langFix, height, width, lineNum, wrap, clsName) {
        var pres = document.getElementsByTagName(element), len = pres.length, pre = null, index = 0, lang = "javascript", html, outer;
        var parseHTML = function(html) {
            return html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(\r?\n)$/g, "");
        };
        var addLineNumber = function(html) {
            var newHtml = '<ol start="1">', htmls = html.split("\n");
            for (var i = 0, len = htmls.length; i < len; i++) {
                newHtml += '<li>' + htmls[i] + '</li>';
            }
            newHtml += "</ol>";
            return newHtml;
        };
        var hlbylanguage = function(html, lang, findParent) {
            if (!(lang in highlight.language)) {
                return findParent ? addLineNumber(html) :html;
            }
            var l = highlight.language[lang];
            if (findParent && l.wrapper) l = highlight.language[l.wrapper];
            if (!l) return findParent ? addLineNumber(html) :html;
            html = " " + html + " ";
            var pattern = l.reg, markup = l.markup, cls = l.cls || [], defaultCls = cls.length === 0, inc = l.include, olanghl = [], placeholder = [], pl = "", language = "", wrapper, incLang;
            for (var type in pattern) {
                language += pattern[type];
                defaultCls && cls.push(type);
            };
            pattern = new RegExp(language, "g");
            if (inc && inc.length > 0) {
                for (i = 0; i < inc.length; i += 1) {
                    wrapper = new RegExp("string" == typeof inc[i].lang ? inc[i].wrapper.replace(/</g, "&lt;").replace(/>/g, "&gt;") :inc[i].wrapper, "gi");
                    html = html.replace(wrapper, function($0, $1) {
                        incLang = "string" == typeof inc[i].lang ? inc[i].lang :$0.match(new RegExp(inc[i].lang[0], "gi"))[0].replace(/\s|\n/, "").replace(/(^\s*)|(\s*$)/g, "");
                        pl = "{@" + Math.random() + "@}";
                        placeholder.push(pl);
                        olanghl.push(hlbylanguage($1, incLang, false));
                        return $0.replace($1, pl);
                    });
                }
            }
            html = html.replace(pattern, function() {
                var args = Array.prototype.slice.call(arguments, 0), currArg1 = null, currArg = null, len = args.length - 2, index = len;
                for (;index > 0; index -= 1) {
                    currArg = args[index];
                    if (currArg) {
                        if (markup && cls[index - 1] === "tag") {
                            currArg1 = currArg.replace(/(\w+)=(".*?")/g, '<span class="' + highlight.language.html.cls[2] + '">$1</span>=<span class="' + highlight.language.html.cls[3] + '">$2</span>');
                        }
                        if (cls[index - 1] == "com") {
                            var currArgs = currArg.split("\n"), _currArgs = "", curLen = currArgs.length;
                            for (var i = 0, len = currArgs.length; i < len; i++) {
                                _currArgs += '<span class="' + cls[index - 1] + '">' + currArgs[i] + "</span>" + (i == len - 1 ? "" :"\n");
                            }
                            args[0] = args[0].replace(args[0], _currArgs);
                        } else {
                            var __currArg = '<span class="' + cls[index - 1] + '">' + (currArg1 !== null ? currArg1 :currArg) + "</span>";
                            args[0] = args[0].replace(currArg, __currArg);
                        }
                    }
                }
                return args[0];
            });
            placeholderLen = placeholder.length;
            if (placeholderLen > 0) {
                for (i = 0; i < placeholderLen; i++) {
                    var newReg = new RegExp("{@.*?" + placeholder[i].replace(/[{@}]/g, "") + ".*?@}", "g");
                    html = html.replace(newReg, placeholder[i]);
                    html = html.replace(placeholder[i], olanghl[i]);
                }
            }
            var rep = function($0) {
                return /^\s+$/.test($0) ? "" :$0.replace(/(\s+)$/, "");
            };
            html = html.replace(/^(\<.*?\>)*(\s)|(\s)$/g, rep);
            return findParent ? addLineNumber(html) :html;
        };
        for (;index < len; index += 1) {
            pre = pres[index];
			lang = pre.getAttribute(langFix)||'';
			lang = lang.replace('language-','').split(" ")[0];
            lang = lang.toLowerCase();
            if (lang == '') continue;
            addClass(pre, clsName);
            if (height && height !== "auto" && pre.offsetHeight > height) pre.style.height = height + "px", 
            pre.style.overflowY = "auto";
            if (width && width !== "auto") pre.style.width = width + "px";
            wrap ? addClass(pre, clsName + "-wrap") :pre.style.overflowX = "auto";
            html = parseHTML(pre.innerHTML);
			var langText = '<div class="lang-type">'+lang+'</div>';
            if (pre.outerHTML) {
                outer = pre.outerHTML.match(/<\w+\s*(.*?)>/)[1];
                pre.outerHTML = "<" + element + " " + outer + ">" + langText+hlbylanguage(html, lang, true) + "</" + element + ">";
            } else {
                pre.innerHTML = langText+hlbylanguage(html, lang, true);
            };
			
        }
    };
    highlight.options = {};
    highlight.language = highlight.language || {};
    highlight.extendLanguage = function(langName, langObj) {
        highlight.language[langName] = langObj;
        if (langObj.wrapper) highlight.language[langObj.wrapper].include.push(langObj.content);
    };
    function addCss(node, css) {
        if ("styleSheet" in node) {
            node.setAttribute("type", "text/css");
            node.styleSheet.cssText = css;
        } else {
            node.innerHTML = css;
        }
        return node;
    }
    highlight.addStyle = function(css, id) {
        var style = '<style id="' + id + '">' + css + "</style>";
        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        var style;
        if ("string" == typeof id) {
            id = id + "-themes";
            style = document.createElement("style");
            style.id = id;
            head.appendChild(addCss(style, css));
            style = null;
            return document.getElementById(id);
        } else {
            style = id;
            addCss(style, css);
            return style;
        }
    };
    highlight.extendThemes = function(themes, clsName, theme, element) {
        if (!themes) return;
        var style = "";
        theme = themes[theme];
        var prefix = element + "." + clsName;
        for (var i in theme) {
            var sty;
            switch (i) {
              case "public":
                var pre = theme[i].PRE, 
				lineStat = highlight.options.lineNum;
				type = theme[i].TYPE, 
				wrap = theme[i].WARP, ol = theme[i].OL_SPA+(lineStat?theme[i].OL_LINE:''), hasLine = theme[i].OL_LINE, li = theme[i].OL_LIST+(lineStat?theme[i].OL_LIST_LINE:'');
                sty = prefix + "{" + pre + "font-size:"+highlight.options.fontSize+" !important;}" + prefix + " .lang-type{" + type + "}" + prefix + "-wrap{" + wrap + "}" + prefix + " ol{" + ol + "}" + prefix + " ol li{" + li + "}"+prefix+" ol li .main{font-size:"+highlight.options.fontSize+" !important;}";
                break;

              case "main":
                sty = prefix + "{" + theme[i] + "}";
                break;

              case "type":
                sty = prefix + " .lang-type{" + theme[i] + "}";
                break;
			  case "hover":
				sty = prefix + " ol li:hover{" + theme[i] + "}";
                break;
			  case "hover_line":
				if(lineStat){
					sty = prefix + " ol li:hover{" + theme[i] + "}";
				}
                break;

              case "list":
				if(lineStat){
					sty = prefix + " ol li{" + theme[i] + "}";
				}
                break;

              default:
                sty = prefix + " ." + i + "{" + theme[i] + "}";
            }
            style += sty;
        }
        return style;
    };
    highlight.setTheme = function(theme) {
        var opts = highlight.options;
        var style = highlight.extendThemes(opts.themes, opts.clsName, theme, opts.element);
        highlight.addStyle(style, opts.styleEle);
    };
    highlight.addOptions = function(options) {
        for (var opt in options) highlight.options[opt] = options[opt];
    };
    highlight.init = function(options) {
        var element = options.element || "code", langFix = options.langFix || "class", clsName = options.clsName || "FHLT", height = options.height || "auto", width = options.width || "auto", theme = options.theme || "light", fontSize = options.fontSize||"12px",wrap = options.wrap || false, lineNum = options.lineNum || false;
        highlight.addOptions({
            element:element,
            langFix:langFix,
            clsName:clsName,
            height:height,
            width:width,
            theme:theme,
			fontSize:fontSize,
            wrap:wrap,
            lineNum:lineNum
        });
        highlight(element, langFix, height, width, lineNum, wrap, clsName);
        var style = highlight.extendThemes(highlight.options.themes, clsName, theme, element);
        highlight.options.styleEle = highlight.addStyle(style, clsName);
        return highlight;
    };
    var language = {};
    var public = {
        COM:{
            HASH:"(\\#.*)|",
            SLASH:"(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|"
        },
        STR:"(\"(?:[^\"\\\\]|\\\\[\\s\\S])*\"|'(?:[^'\\\\]|\\\\[\\s\\S])*')|",
        NUM:"\\b(\\d+(?:\\.\\d+)?(?:[Ee][-+]?(?:\\d)+)?)\\b|"
    };
    language.html = {
        cls:[ "com", "tag", "attr", "str" ],
        reg:{
            com:"(&lt;\\!--[\\s\\S]*?--&gt;)|",
            tag:"(&lt;\\/?\\w+(?:.*?)&gt;)|"
        },
        markup:true,
        include:[ {
            lang:"javascript",
            wrapper:"<script>([\\s\\S]*?)<\\/script>"
        }, {
            lang:"css",
            wrapper:"<style>([\\s\\S]*?)<\\/style>"
        } ]
    };
    language.css = {
        cls:[ "com", "slt", "attr", "str", "brt" ],
        reg:{
            com:public.COM.SLASH,
            ele:"([^{\\\n\\$\\|]*?){|",
            obj:"(?:([\\w-]+?)\\s*\\:([\\w\\s\"',\\-\\#\\.,\\,\\/,\\(,\\)]*))|",
            brt:"(\\;|\\!important)"
        }
    };
    language.javascript = language.js = {
        cls:[ "com", "str", "bui", "key", "obj", "num", "ope", "brt", "reg" ],
        reg:{
            com:public.COM.SLASH,
            str:"(\"(?:[^\"\\\\]|\\\\[\\s\\S])*\"|'(?:[^'\\\\]|\\\\[\\s\\S])*')|",
            bui:"\\b(alert|all|anchor|anchors|area|assign|blur|button|checkbox|clearInterval|clearTimeout|clientInformation|close|closed|confirm|constructor|crypto|defaultStatus|document|element|elements|embed|embeds|event|fileUpload|focus|frame|innerHeight|innerWidth|link|location|mimeTypes|navigate|navigator|frames|frameRate|hidden|history|image|images|offscreenBuffering|open|opener|option|options|outerHeight|outerWidth|onblur|onclick|onerror|onfocus|onkeydown|onkeypress|onkeyup|onmouseover|onload|onmouseup|onmousedown|onsubmit|packages|pageXOffset|pageYOffset|parent|password|pkcs11|plugin|prompt|propertyIsEnum|radio|screenX|screenY|scroll|secure|self|status|submit|setTimeout|setInterval|taint|text|textarea|top|window)\\b|",
            key:"\\b(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|foreach|final|finally|float|for|from|function|false|goto|if|implements|import|in|instanceof|int|interface|let|long|native|NaN|new|null|of|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|true|throws|transient|try|typeof|then |var|void|volatile|while|with)\\b|",
            obj:"\\b(Array|apply|Boolean|concat|call|cos|charAt|Date|decodeURI|decodeURIComponent|eval|encodeURI|encodeURIComponent|escape|fixed|getTime|hasOwnProperty|Infinity|indexOf|isFinite|isNaN|isPrototypeOf|join|log|lastIndexOf|Math|match|max|min|Number|Object|push|pop|print|prototype|parseFloat|parseInt|RegExp|reset|replace|String|substring|substr|sub|sup|slice|sort|shift|search|slice|splice|split|select|toString|toLowerCase|toUpperCase|toSource|unshift|unescape|untaint|valueOf|write|writeln)\\b|",
            num:public.NUM,
            ope:"(\\+|\\-|\\*|\\/|\\%|\\=|\\==|\\===|\\!=|\\!==|\\&=|\\*=|\\+=|\\-=|\\<=|\\>=|\\&lt;|\\&gt;|\\?|\\.|\\,|\\;|\\~|\\`|\\!|\\:|\\^|\\\"|'|\\&amp;|\\|)|",
            brt:"(\\[|\\]|\\{|\\}|\\(|\\))|",
            reg:"(?:^|[^\\)\\]\\}])(\\/(?!\\*)(?:\\.|[^\\/\n])+?\\/[gim]*)|"
        }
    };
    language.json = {
        cls:[ "com", "attr", "str", "num", "brt" ],
        reg:{
            com:public.COM.SLASH,
            attr:"([^{\\n\\$\\|]*?):|",
            str:public.STR,
            num:public.NUM,
            brt:"(\\{|\\}|\\[|\\])|"
        }
    };
    language.php = {
        cls:[ "com", "mrk", "str", "key", "vars", "obj", "num", "ope", "brt" ],
        reg:{
            com:public.COM.SLASH,
            mrk:"(&lt;\\?php|\\?&gt;)|",
            str:public.STR,
            key:"(?:[^$_@a-zA-Z0-9])?(and|base64_decode|base64_encode|copy|Cos|count|crypt|current|date|dbase_close|delete|dir|dirname|each|end|else|elseif|endif|if|ereg|eregi|eval|exec|Exp|explode|extract|exception|fclose|or|substr|this|xor|mktime|str_replace|strrpos|mail|function|while|for|foreach)(?![$_@a-zA-Z0-9])|",
            "var":"(\\$[\\w][\\w\\d]*)|",
            obj:"(?:[^$_@A-Za-z0-9])?(array|as|break|case|class|const|continue|default|die|do|echo|empty|exit|extends|global|include|include_once|isset|list|new|print|require|require_once|return|static|switch|unset|use|var|final|interface|implements|public|private|protected|abstract|clone|try|catch|throw|int|string|bool|classic|object)(?:[^$_@A-Za-z0-9])|",
            num:public.NUM,
            ope:"(\\+|\\-|\\*|\\/|\\%|\\=|\\==|\\===|\\!=|\\!==|\\&=|\\*=|\\+=|\\-=|\\<=|\\>=|\\&lt;|\\&gt;|\\?|\\.|\\,|\\;|\\~|\\`|\\!|\\:|\\^|\\\"|'|\\&amp;|\\|)|",
            brt:"(\\[|\\]|\\{|\\}|\\(|\\))|"
        },
        wrapper:"html",
        content:{
            lang:"php",
            wrapper:"(<\\?php(?:[\\s\\S]*?)\\?>)"
        }
    };
    language.shell = {
        cls:[ "com", "key", "key", "vars", "path", "url" ],
        reg:{
            com:public.COM.HASH,
            linux:"\\b(cd|cp|du|fuser|install|chmod|chown|apt-get|apt-cdrom|apt-cache|basename|find|ln|locate|ls|dir|mkdir|mv|pwd|rename|rm|rmdir|touch|updatedb|whereis|which|ar|arj|bunzip2|bzcat|bzip2|bzip2recover|bzless|bzmore|compress|cpio|dump|gunzip|gzexe|gzip|lha|resotre|tar|unarj|uncompress|unzip|zcat|zforce|zip|zipinfo|znew|cat|cksum|cmp|col|colrm|comm|csplit|cut|diff3|diff|diffstat|ed|emacs|ex|expand|fmt|fold|grep|egrep|fgrep|head|ispell|jed|joe|join|less|look|more|od|paste|pico|sed|sort|spell|split|sum|tac|tail|tee|tr|unexpand|uniq|vi|wc|alias|bg|bind|declare|dirs|echo|enable|eval|exec|exit|export|fc|fg|hash|history|jobs|kill|logout|popd|pushd|set|shopt|ulimit|umask|unalias|unset|accept|cancel|disable|enable|lp|lpadmin|lpc|lpq|lpr|lprm|lpstat|pr|reject|bc|cal|clear|consoletype|ctrlaltdel|date|dircolors|eject|halt|hostid|hwclock|info|login|man|md5sum|mesg|mtools|mtoolstest|poweroff|reboot|shutdown|sleep|stat|talk|wall|whatis|who|whoami|write|yes|chfn|chsh|finger|gpasswd|groupadd|groupdel|groupmod|groups|grpck|grpconv|grpunconv|logname|passwd|pwck|pwconv|pwunconv|su|useradd|userdel|usermod|users|init|killall|nice|nohup|pgrep|pidof|pkill|ps|pstree|renice|w|watch|badblocks|blockdev|chattr|convertquota|df|dumpe2fs|e2fsck|e2image|e2label|edquota|fdisk|findfs|fsck|grub|hdparm|lilo|lsattr|mkbootdisk|mke2fs|mkfs|mkinitrd|mkisofs|mknod|mkswap|mktemp|mount|parted|quota|quotacheck|quotaoff|quotaon|quotastat|repquota|swapoff|swapon|sync|tune2fs|umount|depmod|dmesg|free|insmod|iostat|ipcs|kernelversion|lsmod|modinfo|modprobe|mpstat|rmmod|sar|slabtop|sysctl|tload|top|uname|uptime|vmstat|startx|xauth|xhost|xinit|xlsatoms|xlsclients|xlsfonts|xset|chroot|nmap|scp|sftp|slogin|ssh|sudo|awk|gawk|expr|gcc|gdb|ldd|make|nm|perl|php|test|arch|at|atq|atrm|batch|chkconfig|crontab|last|lastb|logrotate|logsave|logwatch|lsusb|patch|rpm|runlevel|service|telinit|yum|dnsdomainname|domainname|hostname|ifcfg|ifconfig|ifdown|ifup|nisdomainname|route|ypdomainname|arp|arping|arpwatch|dig|elinks|elm|host|ipcalc|lynx|mail|ncftp|netstat|nslookup|pine|ping|rsh|telnet|tftp|tracepath|traceroute|wget|arptables|ip|iptables|iptables-save|iptables-restore|tcpdump|ab|apachectl|exportfs|htdigest|htpasswd|httpd|mailq|mysqladmin|msqldump|mysqlimport|mysqlshow|nfsstat|sendmail|showmount|smbclient|smbmount|smbpasswd|squid|sshd|dpkg|cmake|source)\\b|",
            dos:"\\b(winver|wupdmgr|wscript|mstsc|net|start|stop|netstat|regedit|cmd|chkdsk|gpedit|ping|ipconfig|kill|del|move|at|telnet|open|copy|xcopy|arp|dir|set|pause|if|goto|call|for|echo|echo|findstr|find|title|color|prompt|ver|winver|format|md|replace|ren|tree|type|more|taskmgr|tlntadmn|exit|path|REM|netsh)\\b|",
            par:"(\\s\\-.*?\\s|\\:.*?\\!)|",
            path:"(\\/.*\\s|\\/.*\\n)|",
            url:"([a-zA-z]+\\:\\/\\/[^\\s]*)|"
        }
    };
    var sqlKey = "backup|alter|print|if|abs|avg|case|cast|coalesce|convert|count|current_timestamp|current_user|day|isnull|left|lower|month|nullif|replace|right|session_user|space|substring|sum|system_user|upper|user|yearabsolute|action|add|after|alter|as|asc|at|authorization|begin|bigint|binary|bit|by|cascade|char|character|check|checkpoint|close|collate|column|commit|committed|connect|connection|constraint|contains|continue|create|cube|current|current_date|current_time|cursor|database|date|deallocate|dec|decimal|declare|default|delete|desc|distinct|double|drop|dynamic|else|end|end-exec|escape|except|exec|execute|false|fetch|first|float|for|force|foreign|forward|free|from|full|function|global|goto|grant|group|grouping|having|hour|ignore|index|inner|insensitive|insert|instead|int|integer|intersect|into|is|isolation|key|last|level|load|local|max|min|minute|modify|move|name|national|nchar|next|no|numeric|of|off|on|only|open|option|order|out|output|partial|password|precision|prepare|primary|prior|privileges|procedure|public|read|real|references|relative|repeatable|restrict|return|returns|revoke|rollback|rollup|rows|rule|schema|scroll|second|section|select|sequence|serializable|set|size|smallint|static|statistics|table|temp|temporary|then|time|timestamp|to|top|transaction|translation|trigger|true|truncate|uncommitted|union|unique|update|values|varchar|varying|view|when|where|with|workall|use|createtable|dbcc|while|droptable|setup|nocount", sqlOpe = "all|and|any|between|cross|in|join|like|not|null|or|outer|some";
    language.sql = {
        cls:[ "com", "key", "obj", "vars", "str", "num" ],
        reg:{
            com:"(\\-\\-.*|\\/\\*[\\s\\S]*?\\*\\/)|",
            key:"\\b(" + sqlKey + "|" + sqlKey.toUpperCase() + ")\\b|",
            obj:"\\b(" + sqlOpe + "|" + sqlOpe.toUpperCase() + ")\\b|",
            vars:"(\\@[\\w][\\w\\d]*)|",
            str:public.STR,
            num:public.NUM
        }
    };
    language.apache = {
        cls:[ "com", "mrk", "key", "obj", "vars", "str", "num", "obj" ],
        reg:{
            com:public.COM.HASH,
            mark:"(&lt;\\/?\\w+(?:.*?)&gt;)|",
            key:"\\b(ServerRoot|PidFile|Mutex|Listen|LoadModule|User|Group|ServerAdmin|ServerName|DocumentRoot|DirectoryIndex|Require|ErrorLog|LogLevel|LogFormat|CustomLog|Redirect|Alias|ScriptAlias|ScriptAliases|Scriptsock|AllowOverride|Options|TypesConfig|AddType|AddEncoding|AddHandler|Filters|AddOutputFilter|MIMEMagicFile|ErrorDocument|MaxRanges|EnableMMAP|EnableSendfile|Supplemental|Server-pool|Include|Configure|SSLSessionCache|SSLSessionCacheTimeout|LimitRequestBody|SSLRandomSeed|BrowserMatch|RequestHeader|unset|DNT|Order|Allow|OFFExecCGI|FollowSymLinks|Indexes|None|Deny|prefork|StartServers|MinSpareServers|MaxSpareServers|MaxClients|MaxRequestsPerChild|UserDir|chmod|warn|RewriteMap|RewriteCond|RewriteRule|ExpiresActive|ExpiresByType)\\b|",
            obj:"\\b(All|all|On|on|off|Off)\\b|",
            vars:"([\\%|\\$]{\\/?\\w+(?:.*?)\\})|",
            str:public.STR,
            num:public.NUM,
            brt:"(\\s\\[\\/?\\w+(?:.*?)\\])|"
        }
    };
    language.markdown = language.mkdown = language.md = language.mkd = {
        cls:[ "key", "key", "mrk", "obj", "obj", "mrk", "url", "", "str", "url" ],
        reg:{
            h1_6:public.COM.HASH,
            h1:"(.*?\\n[=_]{1}.+\\n)|",
            strong:"([*_]{2}.+?[*_]{2})|",
            itc:"([*_]{1}.+?[*_]{1})|",
            quote:"(\\&gt;\\s.*)|",
            mark:"(&lt;\\/?\\w+(?:.*?)&gt;)|",
            link:"((\\[(.*?)\\])|\\((.*?)\\)|[a-zA-z]+\\:\\/\\/[^\\s]*|\\/.*\\s|\\/.*\\n)|"
        },
        include:[ {
            lang:[ "([^`|^`\\s].*\\n)" ],
            wrapper:"(\\```[\\s\\S]*?\\```)"
        } ]
    };
    language.java = language.jsp = language.jsf = {
        cls:[ "com", "str", "key", "num", "ope", "brt", "reg" ],
        reg:{
            com:public.COM.SLASH,
            str:"(\"(?:[^\"\\\\]|\\\\[\\s\\S])*\"|'(?:[^'\\\\]|\\\\[\\s\\S])*')|",
            key:"\\b(strictfp|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|false|true|null)\\b|",
            num:public.NUM,
            ope:"(\\+|\\-|\\*|\\/|\\%|\\=|\\==|\\===|\\!=|\\!==|\\&=|\\*=|\\+=|\\-=|\\<=|\\>=|\\&lt;|\\&gt;|\\?|\\.|\\,|\\;|\\~|\\`|\\!|\\:|\\^|\\\"|'|\\&amp;|\\|)|",
            brt:"(\\[|\\]|\\{|\\}|\\(|\\))|",
            reg:"(?:^|[^\\)\\]\\}])(\\/(?!\\*)(?:\\.|[^\\/\n])+?\\/[gim]*)|"
        }
    };
    highlight.addOptions({
        langs:language
    });
    for (var lang in language) highlight.extendLanguage(lang, language[lang]);
    var themes = {}, im = ' !important',public = {
        PRE:'font-family:Consolas,Lucida Console'+im+';'+im+';line-height:20px'+im+'; position: relative'+im+';*padding-bottom: 20px'+im+'; cursor: text'+im+'; overflow: hidden'+im+';width: auto'+im+'; margin:10px auto'+im+'; padding:10px'+im+';display:block'+im+';border-radius:0'+im+';',
        TYPE:'position:absolute'+im+'; top:10px'+im+'; right:10px'+im+';font-style: italic'+im+';font-size: 20px'+im+';z-index: -1'+im+';opacity: 0.4'+im+';filter:alpha(opacity=40)'+im+'; z-index:1'+im+';',
        WARP:'white-space:pre-wrap'+im+';word-wrap:break-word'+im+';',
        OL_SPA:'Letter-spacing: 0.1px'+im+';padding:0'+im+';margin:0'+im+';',
        OL_LINE:'padding-left:40px'+im+';',
        OL_LIST:'display: block'+im+';padding:0'+im+';margin:0'+im+';border:none'+im+';padding-left:10px'+im+';list-style: none'+im+';',
        OL_LIST_LINE:'list-style: decimal outside'+im+';'
    };
    themes.light = {
        'public':public,
        main:'border:1px #f0f0f0 solid'+im+';background:#FFFFFF'+im+';color:#000066'+im+';',
        type:'color: goldenrod'+im+';',
        list:'border-left:#ddd solid 2px'+im+';',
		hover:'background:#f2f2f2'+im+';',
		hover_line:'border-left:#999 solid 2px '+im+';',
        com:'color:#999'+im+';',
        mrk:'color:#00f'+im+'; font-weight: bold'+im+';',
        vars:'color:#f0f'+im+';',
        key:'color:#009 '+im+';font-weight: bold'+im+';',
        str:'color:#00f'+im+';',
        num:'color:#f00'+im+';',
        obj:'color:#099'+im+';',
        path:'color:#00f'+im+';',
        url:'color:#00f '+im+'; text-decoration:underline'+im+';',
        brt:'color:#000099'+im+';font-weight:bold'+im+';',
        ope:'color:#009'+im+';',
        attr:'color:#909'+im+';',
        reg:'color:#006600'+im+';',
        tag:'color:#00f'+im+';',
        bui:'color:#909'+im+';',
        slt:'color:#f0f'+im+';'
    };
    themes.gray = {
        'public':public,
        main:'border:1px #f0f0f0 solid'+im+';background:#f9f9f9'+im+';color:#000066'+im+';',
        type:'color: goldenrod'+im+';',
        list:'border-left:#ddd solid 2px'+im+';',
		hover:'background:#ddd'+im+';',
		hover_line:'border-left:#666 solid 2px '+im+';',
        com:' color:#007400'+im+';',
        mrk:' color:#00f'+im+'; font-weight: bold'+im+';',
        vars:' color:#0854FF'+im+';',
        key:' color:#AA0D91'+im+';'+im+';',
        str:' color:#C41A16'+im+';',
        num:' color:#f00'+im+';',
        obj:' color:#41AAB1'+im+';',
        path:' color:#C41A16 '+im+';',
        url:' color:#C41A16 '+im+'; text-decoration:underline'+im+';',
        brt:' color:#000'+im+';font-weight:bold'+im+';',
        ope:' color:#009'+im+';',
        attr:' color:#909'+im+';',
        reg:' color:#f00'+im+';',
        tag:' color:#881280'+im+';',
        bui:' color:#DB00DB'+im+';',
        slt:'color:#f0f'+im+';'
    };
    themes.blue = {
        'public':public,
        main:'background:#102144'+im+';color:#C7D4E2'+im+';',
        type:'color: #7A8994'+im+';',
        list:'border-left:#204187 solid 2px'+im+';',
		hover:'background:#0A152A'+im+';',
		hover_line:'border-left:#000 solid 2px '+im+';',
        com:' color:#606C68'+im+';',
        mrk:' color: #EB03DF'+im+'; font-weight: bold'+im+';',
        vars:' color:#8DFFFF'+im+';',
        key:' color:#8D8DFF '+im+';font-weight: bold'+im+';',
        str:' color:#8CC21D'+im+';',
        num:' color:#05FFFF'+im+';',
        obj:' color:#63A7FF'+im+';',
        path:' color:#8CC21D '+im+';',
        url:' color:#8CC21D '+im+'; text-decoration:underline'+im+';',
        brt:' color:#FFBD2E'+im+';font-weight:bold'+im+';',
        ope:' color:#FFAE00'+im+';',
        attr:' color:#D9684C'+im+';',
        reg:' color:#ff7d27'+im+';',
        tag:' color:#8D8DFF'+im+';',
        bui:' color:#EB03DF'+im+';',
        slt:'color:#EB03DF'+im+';'
    };
    themes.red = {
        'public':public,
        main:'background:#240612'+im+';color:#FFEAEA'+im+';',
        type:'color: #7A8994'+im+';',
        list:'border-left:#5B0D2C solid 2px'+im+';',
		hover:'background:#130208'+im+';',
		hover_line:'border-left:#000 solid 2px '+im+';',
        com:' color:#0056D0'+im+'; background:#000'+im+';',
        mrk:' color: #EB03DF'+im+'; font-weight: bold'+im+'; ',
        vars:' color:#FD971F'+im+'; ',
        key:' color:#DA1A6E '+im+';font-weight: bold'+im+';',
        str:' color:#05D8FF '+im+';background:#400A5E'+im+';',
        num:' color:#f00'+im+';',
        obj:' color:#A6E22E'+im+';',
        path:' color:#05D8FF '+im+';background:#400A5E'+im+';',
        url:' color:#05D8FF '+im+'; background:#400A5E'+im+';',
        brt:' color:#FFBD2E'+im+';font-weight:bold'+im+';',
        ope:' color:#FFAE00'+im+';',
        attr:' color:#66D9EF'+im+';',
        reg:' color:#f00'+im+';background:#490612'+im+';',
        tag:' color:#FF0077'+im+';',
        bui:' color:#EB03DF'+im+';',
        slt:'color:#EB03DF'+im+';'
    };
    themes.dark = {
        'public':public,
        main:'background:#394147'+im+';color:#fff'+im+';',
        type:'color: #7A8994'+im+';',
        list:'border-left:#546068 solid 2px'+im+';',
		hover:'background:#2F3539'+im+';',
		hover_line:'border-left:#000 solid 2px '+im+';',
        com:' color:#3AE857'+im+'; ',
        mrk:' color: #EB03DF'+im+'; font-weight: bold'+im+'; ',
        vars:' color:#f0f'+im+';',
        key:' color:#FFAE00 '+im+';font-weight: bold'+im+';',
        str:' color:#05D8FF'+im+';',
        num:' color:#f00'+im+';',
        obj:' color:#A6E22E'+im+';',
        path:' color:#05D8FF '+im+';',
        url:' color:#05D8FF '+im+'; text-decoration:underline'+im+';',
        brt:' color:#FFBD2E'+im+';font-weight:bold'+im+';',
        ope:' color:#FFAE00'+im+';',
        attr:' color:#ff0'+im+';',
        reg:' color:#ff7d27'+im+';',
        tag:' color:#FF0077'+im+';',
        bui:' color:#EB03DF'+im+';',
        slt:'color:#EB03DF'+im+';'
    };
    highlight.addOptions({
        themes:themes
    });
    return highlight;
});