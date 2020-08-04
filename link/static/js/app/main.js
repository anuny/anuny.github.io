var conn = '';
var database = {
    connect: function (c) {
        conn = 'http://www.thankwork.cn/link/'+c
    }
};
var layout = {
    mainWidth: function (h, c) {
        var ww = $(window).width();
        var hw = h.width();
        c.css({
            width: ww - hw,
            marginLeft: hw
        })
    }, addEditbox: function (c) {
        if (c) {
            var box = '';
            box += '<div class="edit-bg"><div class="edit-box">';
            if (c.indexOf('edit_addCat') >= 0) {
                box += '<div class="sitename"><input type="text" id="addcat" value="" placeholder="分类名称"/></div>'
            }
            if (c.indexOf('edit_addLink') >= 0) {
                box += '<div class="choiceCat"><select name="category" class="category" id="choiceCat">' + c[1] + '</select> </div><div class="sitename"><input type="text" id="sitename" value="" placeholder="网站名称"/></div><div class="sitename"><input type="text" id="sitealt" value=""  placeholder="网站描述" /></div><div class="siteurl"><input type="text" id="siteurl" value="" placeholder="网站地址"/></div>'
            }
            if (c.indexOf('edit_edit') >= 0) {
                box += '<div class="sitename"><input type="text" id="sitename" value="' + c[1] + '" placeholder="网站名称" /></div><div class="sitename"><input type="text" id="sitealt" value="' + c[2] + '" placeholder="网站描述"/></div><div class="siteurl"><input type="text" id="siteurl" value="' + c[3] + '" placeholder="网站地址"/></div>'
            }
            if (c.indexOf('edit_del') >= 0) {
                box += '<div class="del-choice">确定删除网站" ' + c[1] + '"吗? </div>'
            }
            if (c.indexOf('edit_delCat') >= 0) {
                box += '<div class="del-choice">确定删除分类" ' + c[1] + '"吗? </div>'
            }
            if (c.indexOf('edit_editCat') >= 0) {
                box += '<div class="sitename"><input type="text" id="editcat" value="' + c[1] + '" /></div>'
            }
            if (c.indexOf('user_login') >= 0) {
                box += '<div class="sitename"><input type="password" id="pas" value="" placeholder="登录密码"/></div>'
            }
            box += '<div class="button"><div class="submit">提交</div><div class="cancel">取消</div></div></div></div>';
            $('body').append(box)
        }
    }
};
var data = {
    ajax: function (s) {
        $.ajaxSettings.async = false;
        $.getJSON(s, function (data) {
            var $main = $('#main');
            var strHtml = '';
            $main.empty();
            $.each(data, function (infoIndex, conCat) {
                var cat = conCat['category'];
                var info = conCat['info'];
                strHtml += '<li>';
                strHtml += '<h3><span class="ico"></span><span class="category">' + cat + '</span></h3>';
                strHtml += '<ul id="category' + infoIndex + '">';
                $.each(info, function (infoIndex, conInfo) {
                    var name = conInfo['name'];
                    var alt = conInfo['alt'];
                    var links = conInfo['link'];
                    //var iconame = 'favicon.ico';
                    var a = document.createElement('a');
                    a.href = links;
					ico = '//api.byi.pw/favicon/?url='+a.hostname;
					a = null;
					strHtml += '<li><div> <span class="ico"><img src="' + ico + '" width="16" height="16"  alt="" onerror=this.src="static/images/ie.ico" return false  /></span> <span class="link"><a href="' + links + '" target="_blank" title="' + name + ' -' + alt + '"><strong>' + name + '</strong> - <i>' + alt + '</i></a></span> </div></li>'
                });
                strHtml += '</ul>';
                strHtml += '</li>'
            });
            $main.html(strHtml)
        })
    }
};
var edit = {
    addCat: function () {
        layout.addEditbox('edit_addCat');
        $(".submit").click(function () {
            var cat = new Array();
            $("ul#main").find('h3').each(function (i) {
                cat[i] = $(this).text()
            });
            addData = $("#addcat").val();
            if ($.inArray(addData, cat) >= 0) {
                alert('分类已经存在！');
                return false
            }
            edit.save(addData);
            $('.edit-bg').fadeOut().remove()
        });
        $('.cancel').click(function () {
            $('.edit-bg').fadeOut().remove()
        })
    }, addLink: function () {
        var cat = '';
        $("ul#main").find('h3').each(function (index) {
            cat += '<option value="' + index + '">' + $(this).text() + '</option>'
        });
        edit_addLink = ['edit_addLink', cat];
        layout.addEditbox(edit_addLink);
        $('.submit').click(function () {
            var choiceCat = $("#choiceCat").find("option:selected").text();
            var choiceCatId = $("#choiceCat").find("option:selected").val();
            var sitename = $('#sitename').val();
            var sitealt = $('#sitealt').val();
            var siteurl = $('#siteurl').val();
            var urlList = new Array();
            $("ul#main span.link").find('a').each(function (index) {
                urlList[index] = $(this).attr('href')
            });
            if (!sitename) {
                alert('请填写名称!');
                return false
            }
            if (!sitealt) {
                alert('请填写描述!');
                return false
            }
            if (!siteurl) {
                alert('请填写网址!');
                return false
            }
            if ($.inArray(siteurl, urlList) >= 0) {
                alert('该网址已经存在！');
                return false
            }
            var addData = [choiceCat, choiceCatId, sitename, sitealt, siteurl];
            edit.save(addData);
            $('.edit-bg').fadeOut().remove()
        });
        $('.cancel').click(function () {
            $('.edit-bg').fadeOut().remove()
        })
    }, edit: function () {
        $("ul#main>li").hover(function () {
            hasEdit = $(this).find('h3').find('span').hasClass("catEdit");
            if (!hasEdit) {
                $(this).addClass('editing');
                $(this).find('h3 span.ico').attr('class', 'del').append('<a href="javascript:" class="delCat" title="删除"></a>');
                $(this).find('h3').append('<span class="catEdit"><a href="javascript:" class="editCat" title="编辑"></a></span>')
            }
            catName = $(this).find('h3').text();
            catList = $(this);
            $(this).find('h3 a.delCat').on('click', function () {
                edit_delCat = ['edit_delCat', catName];
                layout.addEditbox(edit_delCat);
                $('.submit').click(function () {
                    catList.remove();
                    $('.edit-bg').fadeOut().remove()
                });
                $('.cancel').click(function () {
                    $('.edit-bg').fadeOut().remove()
                })
            });
            $(this).find('h3 a.editCat').on('click', function () {
                edit_editCat = ['edit_editCat', catName];
                layout.addEditbox(edit_editCat);
                $('.submit').click(function () {
                    catList.find('h3 span.category').text($('#editcat').val());
                    $('.edit-bg').fadeOut().remove()
                });
                $('.cancel').click(function () {
                    $('.edit-bg').fadeOut().remove()
                })
            })
        }, function () {
            $(this).removeClass('editing');
            $(this).find('h3 span.del').attr('class', 'ico').empty();
            $(this).find('h3 span.catEdit').remove()
        });
        $("ul#main>li>ul>li").hover(function () {
            var objList = $(this);
            var objLink = objList.find('.link a');
            var oldName = objLink.find('strong').text();
            var oldAlt = objLink.find('i').text();
            var oldLink = objLink.attr('href');
            objLink.hide();
            objList.find('div').append('<span class="name"><strong>' + oldName + '</strong> - <i>' + oldAlt + '</i></span><a href="javascript:" class="editThis" title="编辑"></a>');
            objList.find('.ico').hide();
            objList.find('div').append('<a href="javascript:" class="del" title="删除"></a>').show();
            var objDel = objList.find('a.del');
            objList.find('a.editThis').on('click', function () {
                var sitename = $(this).siblings('.link').find('a strong').text();
                var sitealt = $(this).siblings('.link').find('a i').text();
                var siteurl = $(this).siblings('.link').find('a').attr('href');
                edit_edit = ['edit_edit', sitename, sitealt, siteurl];
                layout.addEditbox(edit_edit);
                $('.submit').click(function () {
                    objLink.find('strong').text($('#sitename').val());
                    objLink.find('i').text($('#sitealt').val());
                    objLink.attr('href', $('#siteurl').val());
                    $('.edit-bg').fadeOut().remove()
                });
                $('.cancel').click(function () {
                    objLink.find('strong').text(oldName);
                    objLink.find('i').text(oldAlt);
                    objLink.attr('href', oldLink);
                    $('.edit-bg').fadeOut().remove()
                })
            });
            objDel.on('click', function () {
                edit_del = ['edit_del', oldName];
                layout.addEditbox(edit_del);
                $('.submit').click(function () {
                    objList.remove();
                    $('.edit-bg').fadeOut().remove()
                });
                $('.cancel').click(function () {
                    $('.edit-bg').fadeOut().remove()
                })
            })
        }, function () {
            $(this).find('div').children().remove('.editThis,.name,.del');
            $(this).find('a').show();
            $(this).find('.ico').show()
        });
        $("ul#main").dragsort({
            placeHolderTemplate: "<ul class='placeHolder'><li></li></ul>"
        });
        var catID = '';
        $('#main ul').each(function (index) {
            catID += ',#category' + index
        });
        catID = catID.replace(',', '');
        $(catID).dragsort({
            dragSelector: "div",
            dragBetween: true,
            placeHolderTemplate: "<li class='placeHolder'><div></div></li>",
            scrollSpeed: 100
        })
    }, save: function (addData) {
        var catID = '';
        $('#main ul').each(function (index) {
            catID += ',#category' + index
        });
        catID = catID.replace(',', '');
        var newData = '[';
        $(catID).each(function (index) {
            newData += '{';
            newData += '"category":"' + $(this).siblings('h3').text() + '",';
            newData += '"info": [';
            var listHtml = '';
            $(this).find('li').each(function () {
                listHtml += '{';
                listHtml += '"name":"' + $(this).find('.link a strong').text() + '",';
                listHtml += '"alt":"' + $(this).find('.link a i').text() + '",';
                listHtml += '"link":"' + $(this).find('.link a').attr('href') + '"';
                listHtml += '},'
            });
            if (addData) {
                if (addData instanceof Array) {
                    if (index == addData[1]) {
                        listHtml += '{"name":"' + addData[2] + '","alt":"' + addData[3] + '","link":"' + addData[4] + '"}'
                    }
                }
            };
            listHtml = listHtml.replace(/\,$/, '');
            newData += listHtml;
            newData += ']';
            newData += '},'
        });
        if (addData) {
            if (addData instanceof Array) {} else {
                newData += '{"category":"' + addData + '","info": []}'
            }
        }
        newData = newData.replace(/\,$/, '');
        newData += ']';

        function editPost() {
            $.ajax({
                type: "POST",
                url: conn,
                data: {
                    newData: newData
                },
                success: function (msg) {
                    var ajaxfun = true;
                    ajaxfun = msg;
                    if (ajaxfun) {
                        window.location.reload()
                    }
                }
            })
        };
        editPost()
    }
};
var user = {
    login: function () {
        $.ajax({
            type: "POST",
            url: "http://www.thankwork.cn/link/login.php",
            success: function (msg) {
                if (msg) {
                    editMenu.great();
                    database.connect(msg)
                } else {
                    editMenu.login()
                }
            }
        })
    }, lgoinout: function () {
        var cookiename = 'SAFDGhjklJH4565';
        $.ajax({
            type: "POST",
            url: "http://www.thankwork.cn/link/login.php",
            data: {
                dc: cookiename
            },
            success: function (msg) {
                window.location.reload()
            }
        })
    }
};
var rightMenu = {
    fun: function () {
        var WW = $(window).width() - 10;
        var WH = $(window).height() - 10;
        var LW = $('.editmenu').width();
        var LH = $('.editmenu').height();
        $(document).mousemove(function (e) {
            X = e.clientX;
            Y = e.clientY;
            if (WW - X < LW) {
                X = WW - LW
            }
            if (WH - Y < LH) {
                Y = WH - LH
            }
        });
        $(document).mouseup(function (event) {
            if (event.button == 2) {
                $('.editmenu').css({
                    left: X,
                    top: Y
                });
                if ($('.editmenu').css('display') == 'none') {
                    $('.editmenu').fadeIn()
                }
            }
        });
        $('.editmenu').hover(function () {
            $(document).unbind('click')
        }, function () {
            $(document).bind('click', function () {
                $('.editmenu').hide()
            })
        });
        $(document).bind("contextmenu", function (e) {
            return false
        })
    }, save: function () {
        $('.editmenu').remove();
        $('body').append('<div class="editmenu"><ul><li class="savedata">保存返回</li></ul></div>');
        $('.editmenu').find('.savedata').click(function () {
            edit.save()
        })
    }, hide: function () {
        $('.editmenu').hide()
    }
};
var editMenu = {
    great: function () {
        $('body').append('<div class="editmenu"><ul><li class="weburl">添加网址</li><li class="webcat">添加分类</li><li class="editweb">编辑链接</li><li class="loginout">安全退出</li></ul></div>');
        $('.editmenu').find('.weburl').click(function () {
            rightMenu.hide();
            edit.addLink()
        });
        $('.editmenu').find('.webcat').click(function () {
            rightMenu.hide();
            edit.addCat()
        });
        $('.editmenu').find('.editweb').click(function () {
            rightMenu.save();
            seajs.use('dragsort', function () {
                edit.edit()
            })
        });
        $('.editmenu').find('.loginout').click(function () {
            user.lgoinout()
        });
        rightMenu.fun()
    }, login: function () {
        $('body').append('<div class="editmenu"><ul><li class="login">登陆管理</li></ul></div>');
        $('.editmenu').find('.login').click(function () {
            rightMenu.hide();
            layout.addEditbox('user_login');
            $('.submit').click(function () {
                var pass = $('#pas').val();
                $.ajax({
                    type: "POST",
                    url: "https://www.thankwork.cn/link/login.php",
                    data: {
                        pwd: pass
                    },
                    success: function (msg) {
                        if (msg) {
                            $('.edit-bg').fadeOut().remove();
                            $('.editmenu').remove();
                            editMenu.great();
                            database.connect(msg)
                        } else {
                            alert('密码错误!')
                        }
                    }
                })
            });
            $('.cancel').click(function () {
                $('.edit-bg').fadeOut().remove()
            })
        });
        rightMenu.fun()
    }
}
