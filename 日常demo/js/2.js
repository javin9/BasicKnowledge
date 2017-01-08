$(function () {
        /*用于页面弹出层的功能类*/
        var backgroundC = {
            $: function (id) { return document.getElementById(id); }
            , dElement: function () {
                return (document.compatMode && document.compatMode != "BackCompact") ? document.documentElement : document.body;
            }
            , style: function (o) {	//获取全局样式表、内嵌样式（不能设置）
                return o.currentStyle || document.defaultView.getComputedStyle(o, null);
            }
            , alpha: function (o, num) {//设置透明度	
                o.style.filter = 'alpha(opacity=' + num + ')';
                o.style.backgroundColor = '#000';
                o.style.opacity = num / 100;
            }
            , load: function (showId, bgId) {
                var obj = this.$(bgId);
                /*2011年改版的页面宽度是950，如果当前浏览器窗口宽度小于950，会强行把背景宽度设为950，以避免拖动水平滚动条时出现未被背景覆盖的区域*/
                // obj.style.width = this.dElement().clientWidth < 950 ? '950px' : this.dElement().clientWidth + 'px';
                obj.style.width = this.dElement().clientWidth + 'px';
                obj.style.height = (this.dElement().scrollHeight > this.dElement().clientHeight ? this.dElement().scrollHeight : this.dElement().clientHeight) + 'px';
                obj.style.display = 'block';
                this.alpha(obj, 50);
                var showObj = this.$(showId);
                showObj.style.display = 'block';
                // showObj.style.left = (this.dElement().clientWidth - parseInt(this.style(showObj).width)) / 2 + 'px';
                showObj.style.left = ((this.dElement().clientWidth - parseInt(this.style(showObj).width)) / 2) - 10 + 'px';
                var scrolt = document.documentElement.scrollTop || document.body.scrollTop
                showObj.style.top = ((this.dElement().clientHeight - showObj.clientHeight) / 2 + scrolt) + 'px';
                /*在浏览器窗口大小发生变化时重新加载背景和浮层，以适应新的窗口尺寸*/
                window.onresize = function () {
                    if (backgroundC.$(showId).style.display != "none") {
                        backgroundC.load(showId, bgId);
                    }
                }
                //document.body.style.overflow = "hidden";
            }
            , close: function (showId, bgId) {
                jQuery("#" + showId).fadeOut('slow');
                jQuery("#" + bgId).fadeOut('slow');
            }
        };
            var guid = $("#hidGuid").val(),
            newCount = 10,
            total = 0,
            allowUp = true,
            finish = 0;

            function getOldData(isbtn) {
                isbtn = isbtn || false;
                $.ajax({
                    type: 'get',
                    async: false,
                    url: '/ajax/getcarimgs.ashx',
                    data: { key: guid },
                    success: function (data) {
                        data = eval("(" + data + ")");
                        if (data.Status === 1) {
                            var json = data.Data;
                            if (!!json && !!json.length) {//有数据
                                var ajaxLen = json.length;
                                var imgStr = '';
                                for (var ajaxK = 0; ajaxK < ajaxLen; ajaxK++) {
                                    imgStr += '<li   class="oldImg"><div class="c-box" ><a href="javascript:;"><img class="lazy"  data-img="adaptive"  src="http://image.bitautoimg.com/uimg/index120401/images/picholder.gif"  data-src="http://img5.taoche.cn/1d/' + json[ajaxK].Name + '"  /></a> </div><a href="javascript:;" class="upload-pictures-close  oldImg" data-md5="' + json[ajaxK].Md5 + '" >关闭</a></li>';
                                }
                                var previewul = $("#previewul");
                                previewul.find("li.oldImg").remove();//删除之前的
                                previewul.prepend(imgStr);//添加新的

                                //懒加载
                                $("img.lazy").lazyload({
                                    event: "sporty"
                                });
                                setTimeout(function () { $("img.lazy").trigger("sporty") }, 100);

                                var oldCount = ajaxLen;
                                var waitCount = $("li.newImg").length,
                                    nowCount = waitCount + oldCount,
                                    gap = 10 - nowCount;
                                if (gap <= 0) {
                                    if (!isbtn) {//首次加载提示
                                        //alert("最多传10张，已到上限");
                                    }
                                    $("#previewul_li").hide();
                                }
                                //还能传几张提示
                                newCount = gap > 0 ? gap : 0;
                                $("#count-em").text(newCount);
                                if (isbtn) {
                                    if (gap < 0) {
                                        if (oldCount === 10) {
                                            f1["count"] = 0;//
                                            allowUp = false;
                                            $("#btnSureUpload").hide();
                                        } else {
                                            var allowCount = nowCount - 10;
                                            f1["count"] = allowCount;
                                        }
                                        alert("最多可上传10张");

                                    } else {

                                    }//   if (gap<0) { end
                                }// if (isbtn) {

                            } else {

                            }//else 结束   if (!!json&&!!json.length) {//有数据

                        }// if (data.Status === 1) {
                    }
                });
            }
            getOldData();//查询数据


            //创建实例
            var f1 = new TaocheUp({
                'input': document.getElementById('uploadId'),									//必传，input type='file'元素。
                'postUrl': "/ajax/imgupload.ashx",								//上传文件的接受页
                'fileFilter': ['jpg', 'jpeg', 'png', 'bmp', 'tif'], 	//文件类型过滤器。为空表示不限定  'mp4', 'ogg', 'mov',
                'maxSize': 10 * 1024 * 1024,							//文件大小限制。为空表示不限  5M
                'scale': 0.9,
                'ismulti': true,
                'count': newCount,
                'param': {
                    "key": guid
                }
            });

            ///回调的示例
            f1.onSelect = function (start, end, count) {
                finish = 0;
                //以下是错误处理
                var errorLen = this.error.length;
                if (!!errorLen) {
                    $("#btnSureUpload").hide();
                    alert(this.error[0].errorType);
                }
                total = count;
                //上传总数
                $("#uptotal").text(count);
                //多图上传时候，进度条文案
                if (count > 1) {
                    $("#progress-multi").show();
                    $("#progress-singlep").hide();
                } else {
                    $("#progress-multi").hide();
                    $("#progress-singlep").show();
                }
                var oldCount = $("#previewul").find("li.oldImg").length;
                var nowCount = count + oldCount;
                var surplus = nowCount >= 10 ? 0 : (10 - nowCount);//剩余多少个能输入
                //还能传几个
                $("#count-em").text(surplus);
                if (surplus === 0) { $("#previewul_li").hide(); }
                //上传按钮显示
                if (!!$("#previewul").find("li.newImg").length) {
                    $("#btnSureUpload").show();
                }

            };
            f1.beforeSend = function () {
                backgroundC.load('mark-ext', 'bgCen');
                $(document).on("touchmove", "body", function () {
                    return false;
                });
                $(".mark-ext").show();
            };
            f1.onUpProgress = function (i, e, len) {
                if (len === 1) {
                    //$("#progress-multi").hide();
                    var progress = ((e.loaded / e.total).toFixed(2) * 100 - 1) + "%";
                    $("#onprogressspan").css({ "width": progress });
                } else {
                    //$("#progress-singlep").hide();
                }

            };
            f1.onUpLoadend = function (index, response, len) {
                response = eval("(" + response + ")");
                if (response.Status == 1) {
                    if (this.isAllUpEnd()) {
                        window.location.href = '/uploadimg/result.aspx';
                        $(".mark-ext,.upload-pictures").hide();
                    } else {
                        if (len > 1) {
                            var upfinishObj = $("#upfinish");
                            finish = finish + 1;
                            finish>=10?10:finish;
                            upfinishObj.text(finish);
                            var progress = (finish / total).toFixed(2) * 100 + "%";
                            $("#onprogressspan").css({ "width": progress });
                        }
                    }
                }
            };
            f1.createHtml = function (blobUrl, index) {
                $("#previewul_li").before(' <li data-index="' + index + '"  class="newImg"><div class="c-box" ><a href="javascript:;"><img  data-img="adaptive"  src="' + blobUrl + '" alt="默认上传图"></a> </div><a href="javascript:;" class="upload-pictures-close" data-index="' + index + '">关闭</a></li>');
            };
            f1.errorCallback = function (i, response) {
                //TODO 错误处理接口  失败的i
                $("#previewul").find("li[data-index='" + i + "']").find("img").attr("src", "http://image.bitautoimg.com/taoche/2016taoche_m/bcar-min-bg.jpg");
                if (this.isAllUpEnd()) {
                    alert("上传失败");
                    //window.location.reload();
                }
            }

            //注册事件
            $(document).on("click", ".uploadButton", function () {
                if (f1 !== null) {
                    $("#uploadId").trigger('click');
                }
            });
            //上传
            $(document).on("click", "#btnSureUpload", function () {
                getOldData(true);
                if (allowUp) {
                    f1.upAjax();
                }
            });
            //删除
            $(document).on(clickEventName['touchend'], ".upload-pictures-close", function () {
                var that = $(this);
                if (that.hasClass('oldImg')) {//已经在服务器上
                    if (!that.hasClass('not')) {
                        var md5 = that.attr("data-md5");
                        $.ajax({
                            type: 'post',
                            async:false,
                            url: '/ajax/delcarimg.ashx',
                            data: {
                                md5: md5,
                                key: guid
                            },
                            beforeSend: function () {
                                that.addClass('not');
                            },
                            success: function (data) {
                                data = eval("(" + data + ")");
                                f1.removeOldOne();
                                if (data.Status === 1) {
                                    that.parent("li.oldImg").remove();
                                    afterRemove();
                                } else {
                                    alert('删除失败');
                                }
                                that.removeClass('not');
                            }
                        });
                    }

                } else {
                    var index = parseInt(that.attr("data-index") || 0);
                    f1.removeNewOne(index);
                    //移除该项
                    that.parent("li").remove();
                    afterRemove();
                }
            });
            function afterRemove() {
                var ul = $("#previewul"),
                           liArr = ul.find("li:not(#previewul_li)"),
                           liArrLen = liArr.length;
                var surplus = liArrLen >= 10 ? 0 : (10 - liArrLen);//剩余多少个能输入
                $("#count-em").text(surplus);
                if (liArrLen < 10) {
                    $("#previewul_li").show();
                    allowUp = true;
                }
                if (liArrLen === 10) {
                    if (!!$("li.newImg").length) {
                        allowUp = true;
                        $("#btnSureUpload").show();
                    }
                }
            }// afterRemove end

        });