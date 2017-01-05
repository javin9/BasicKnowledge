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
            var guid = $("#hidGuid").val();
            //获取
            function getOldData(isbtn) {
                isbtn = isbtn || false;
                $.ajax({
                    type: 'get',
                    async: false,
                    url: '/ajax/getcarimgs.ashx',
                    data: { key: guid },
                    success: function (data) {
                        data = eval("(" + data + ")");
                        var imgArr = data.Data || [];
                        if (!!imgArr.length) {
                            $(".upload-pictures-tit").eq(1).show().siblings('.upload-pictures-tit').hide();
                            var arr = imgArr[0];
                            var imgUrl = "http://img5.taoche.cn/1b/" + arr.Name,
                                imgMd5 = arr.Md5;
                            imgStr = '<a href="javascript:;" class="uploadA"><img  class="lazy" data-src="' + imgUrl + '" alt="车源图片"  src="http://image.bitautoimg.com/uimg/index120401/images/picholder.gif"></a><a href="javascript:;" class="upload-pictures-close  oldImg">关闭</a>';
                            $("#container").html(imgStr).attr("data-md5", imgMd5);
                        } else {
                            $(".upload-pictures-tit").eq(0).show().siblings('.upload-pictures-tit').hide();
                        }
                    }
                });//
            }
            getOldData();
            //懒加载
            $("img.lazy").lazyload({
                event: "sporty"
            });
            setTimeout(function () { $("img.lazy").trigger("sporty") }, 100);
            //创建实例
            var f1 = new TaocheUp({
                'input': document.getElementById('uploadId'),									//必传，input type='file'元素。
                'postUrl': "/ajax/imgupload.ashx",								//上传文件的接受页
                'fileFilter': ['jpg', 'jpeg', 'png', 'bmp', 'tif'], 	//文件类型过滤器。为空表示不限定  'mp4', 'ogg', 'mov',
                'maxSize': 10 * 1024 * 1024,							//文件大小限制。为空表示不限  5M
                'scale': 1,
                'param': {
                    key: guid
                }
            });
            ///回调的示例
            f1.onSelect = function (start, end) {
                //以下是错误处理
                if (!!this.error.length) {
                    $("#btnSureUpload").hide();
                    alert(this.error[0].errorType);
                }
                $(".upload-pictures-tit").eq(0).hide().siblings(".upload-pictures-tit").show();
            };
            f1.beforeSend = function () {
                backgroundC.load('mark-ext', 'bgCen');
                $(document).on("touchmove", "body", function () {
                    return false;
                });
                $(".mark-ext").show();
            };
            f1.onUpProgress = function (i, e, len) {
                var progress = ((e.loaded / e.total).toFixed(2) * 100 - 1) + "%";
                $("#onprogressspan").css({ "width": progress });
            };
            f1.onUpLoadend = function (index, response) {
                response = eval("(" + response + ")");
                if (this.isAllUpEnd() && response.Status == 1) {
                    window.location.href = '/uploadimg/result.aspx';
                    $(".mark-ext,.upload-pictures").hide();
                    return false;
                } else {
                    alert("上传失败，错误代码=" + response.Status);
                }
            };
            f1.createHtml = function (blobUrl, index) {
                //console.log(index);
                $("#container").html('<a href="javascript:;" class="uploadA"><img src="' + blobUrl + '" alt="车源图片"></a><a href="javascript:;" class="upload-pictures-close newImg"  data-index="' + index + '">关闭</a>');
                $("#btnSureUpload").show();
            };
            f1.error = function () {
                //window.location.reload();
            }
            //注册事件
            $(document).on(clickEventName["touchstart"], ".uploadA", function (ev) {
                touchHelper.startX = touchHelper.getCoord(ev, 'X');
                touchHelper.startY = touchHelper.getCoord(ev, 'Y');
            });
            $(document).on(clickEventName["touchend"], ".uploadA", function (ev) {
                if (Math.abs(touchHelper.getCoord(ev, 'X') - touchHelper.startX) < 10 && Math.abs(touchHelper.getCoord(ev, 'Y') - touchHelper.startY) < 10) {
                    $("#uploadId").trigger('click');
                }
            });
            //
            $(document).on("click", "#btnSureUpload", function () {
                var md5 = $("#container").attr("data-md5");
                if (!!md5) {
                    f1.param["md5"] = md5;
                }

                f1.upAjax();
            });
            $(document).on(clickEventName['touchend'], ".upload-pictures-close", function () {
                var that = $(this);
                if (that.hasClass('oldImg')) {
                    if (!that.hasClass('not')) {
                        var md5 = $("#container").attr("data-md5");
                        $.ajax({
                            type: 'post',
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
                                //console.log(data);
                                if (data.Status === 1) {
                                    afterRemove();
                                } else {
                                    alert('删除失败');
                                }
                            }
                        });
                    }
                } else {
                    var index = parseInt(that.attr("data-index") || 0);
                    //console.log(f1);
                    f1.removeNewOne(index);
                    afterRemove();
                }

            });
            function afterRemove() {
                $("#container").html('<img src="http://image.bitautoimg.com/taoche/2016taoche_m/bcar-bg-pic.png" alt="车源图片" /><i><a href="javascript:;" class="uploadA"></a></i>');
                $("#btnSureUpload").hide();
                $(".upload-pictures-tit").eq(1).hide().siblings(".upload-pictures-tit").show();
            }
        });