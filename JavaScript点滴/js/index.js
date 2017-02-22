  $(function () {
            //猜你喜欢  start
            $.ajax({
                type: 'get',
                url: 'http://m.taoche.com/ajax/index/ajaxgetmyfavorite.ashx?from=index&r=' + (+new Date()),
                success: function (data) {
                    $("#carLike").html(data);
                }
            });
            //中间焦点图 帮买城市
            if (ttCity.indexOf("," + HeaderFunction.currentAreaId + ",") > -1) {
                $("#littpc").show();
                var banSwiper1 = new Swiper('.car-ban-swiper', {
                    pagination: '.pagination',
                    paginationClickable: true,
                    autoplayDisableOnInteraction: false,
                    loop: true
                });
            }// if end;

            var banSwiper2 = new Swiper('.car-scroll-txt', {
                autoplay: 1000,
                loop: true,
                direction: 'vertical',
                height: 30
            });
            //顶部焦点图
            ; (function () {
                window.setTimeout(function () {
                    var hidAd = $("#hidbanner"),
                        insList = hidAd.find("ins");
                    insList.each(function (i, item) {
                        var inc = $(item);
                        if (inc.css("display") === "none" || $.trim(inc.html()) == "") {
                            //cms广告显示
                            var cmsad = $("#hidcmsad li");
                            var cmsval = $(cmsad[i]).html()
                            if (cmsval != "") {
                                inc.parent().html(cmsval);
                            }
                            else {
                                inc.parent().remove();
                            }
                        }
                    });
                    if ($("#showbanner li").eq(0).html() == "")
                    {
                        $("#showbanner li").eq(0).remove();
                    }
                    hidAd.find("li").clone().appendTo("#showbanner");
                    hidAd.remove();
                    $("#hidcmsad").remove();

                    var lis = $("#showbanner").find("li"),
                        isloop = false;
                    isloop = lis.length > 1 ? true : false;
                    if (!!isloop) {
                        var banSwiper = new Swiper('.ban_swiper', {
                            pagination: '.pagination',
                            paginationClickable: true,
                            autoplay: 6000,
                            autoplayDisableOnInteraction: false,
                            loop: isloop
                        });
                    }
                }, 1000);
            })();
            //足迹
            ; (function ($) {
                var footprint = Cookie.getCookieDecode("taoche_userhistory");//envObj.GetLocals("m_taoche_com_footprint");
                if (!!footprint) {
                    footprint = JSON.parse(footprint);
                    if (footprint.length > 0) {
                        var liFormat = '',
                            spell = "http://" + HeaderFunction.currentAreaSpell + ".m.taoche.com",
                            footHref = "";
                        for (var i = 0, footprintLen = footprint.length; i < footprintLen; i++) {
                            footHref = spell + footprint[i].url;
                            liFormat += '<li><a logctags="_dcv.push([\'_trackEvent\',\'二手车M站\',\'首页\',\'足迹\',\'\'])"  logwt="wap_index_history"  href="' + footHref + '">' + footprint[i].name + '</a></li>';
                        }
                        $("#footprintUl").html(liFormat);
                        $("#footprintId").show();
                    }
                }
            })($);
            //url重写
            ; (function ($) {
                var spell = "http://" + HeaderFunction.currentAreaSpell;
                $("a.datahref").each(function () {
                    var self = $(this),
                        href = self.attr("data-href"),
                        url = spell + ".m.taoche.com";
                    url += href;//分开写优化性能
                    self.attr("href", url);
                });
                //非帮忙城市我要贷款链接
                if (!(bangmaiCity.indexOf("," + HeaderFunction.currentAreaId + ",") > -1)) {
                    $(".car-item .item4 a").attr("href", "http://cooper.m.taoche.com/mtaoche/chedai/?frompage=1");
                    $(".carli_l2 a").attr("href", "http://cooper.m.taoche.com/mtaoche/chedai/?frompage=1");
                }
            })($);
            ; (function ($) {
                var head = $(".index-head"),
                    headfixed = head.offset().top;
                $(window).scroll(function () {
                    var scrollTop = $(document).scrollTop();
                    scrollTop > headfixed ? head.addClass('headfixed') : head.removeClass('headfixed');
                });
            })($);

            //搜索弹层显示高度设置2016.11.1
            HeaderSearch.initial();
            initHistorySearch();
            //异步加载默认的热门搜索内容
            $.ajax({
                type: 'get',
                dataType: 'jsonp',
                url: 'http://m.taoche.com/ajax/ajaxsearchitem.ashx',
                data: { id: IpLocation.AreaId || 0 },
                jsonpCallback: "callback",
                success: function (data) {
                    if (!!data) {
                        $("#strHotSearch").html(data);
                        var spell = "http://" + HeaderFunction.currentAreaSpell,
                            strHotSearch = $("#strHotSearch");
                        strHotSearch.html(data);
                        strHotSearch.find("a.search_href").each(function () {
                            var self = $(this),
                                href = self.attr("data-href"),
                                url = spell + ".m.taoche.com";
                            url += href;//分开写优化性能
                            self.attr("href", url);
                        });
                        $(document).on(clickEventName["touchend"], "#strHotSearch li.zhibaoche", function () {
                            var key = $(this).find("a").text();
                            HeaderSearch.saveSearchWord(key);
                            return false;
                        });
                        $(document).on(clickEventName["touchend"], "#strHotSearch li:not(.zhibaoche)", function () {
                            var key = $(this).find("a").text();
                            searchClick(key);
                            return false;
                        });
                    }
                }
            });
            //关闭
            $("#ser_close").click(function () {
                $("#txtSearch").css("color", "#ccc").val("");
                $("#SearchDropDownListId").html("");
                $(this).hide();
            });
            //搜索
            $("#txtSearch").focus(function () {
                window.setTimeout(function () {
                    !!$.trim($("#txtSearch").val()) ? $("#ser_close").show() : $("#ser_close").hide();
                }, 300);
            }).blur(function () {
                var val = $(this).val();
                setTimeout(function () {
                    if (val.indexOf("搜") > -1) {
                        $("#ser_close").hide();
                    }
                }, 25);
            }).keyup(_.debounce(function () {
                !!$.trim($("#txtSearch").val()) ? $("#ser_close").show() : $("#ser_close").hide();
            }, 1000));
            //清除历史记录
            $("#clearHistory").click(function () {
                $("#divHistory").hide();
                Cookie.deleteCookie("HeaderRecentSearchWord", "/", "taoche.com");
            });
            //改变
            $('#txtSearch').bind('input propertychange', function () {
                if ($(this).val() != "") {
                    $("#divInit").hide();
                } else {
                    $("#SearchDropDownListId").hide();
                }
            });
            $("#btnSearch").click(function () {
                var txtSearch = $.trim(($("#txtSearch").val()).replace(/搜|试试|”|“/ig, ""));
                if (!!txtSearch) {
                    searchClick(txtSearch);
                }
            });
            //打开弹层
            $("a.search_custom").click(function () {
                $(".search-wrap").show();
                searPop();
            });
            //点击返回按钮关闭搜索弹层
            $("#goback").click(function () {
                $(".search-wrap").hide();
                $("body>div.basic").show();
            });
            //搜索层辅助方法
            function searPop() {
                $(window).scrollTop(0);
                $("#txtSearch").trigger("click").focus();
                var search_wrap = $("#search_wrap");
                $("body>div.basic").hide();
                if (!search_wrap.hasClass('not')) {
                    var windowH = $(window).height();
                    search_wrap.height(windowH).addClass("not");
                    $("#SearchDropDownListId").css({ "min-height": windowH });
                }
            }//searPop end
        });
        //历史记录
        function initHistorySearch() {
            var hisHtml = "";
            var cookie = Cookie.getCookie(HeaderSearch.keywordCacheKey);
            if (!!cookie) {
                var cookieArray = cookie.split("|");//显示9个
                if (cookieArray.length > 9) {
                    cookieArray.length = 9;
                }
                for (var i = 0, len = cookieArray.length; i < len; i++) {
                    var keyword = cookieArray[i];
                    if (!keyword) {
                        continue;
                    }
                    if (keyword == "保障车")
                        hisHtml += "<li><a href=\"http://" + HeaderFunction.currentAreaSpell + ".m.taoche.com/buycar/pges5bxcdza/\" onclick= \"clickact('wap_buycar_search_hot_ycbzc');\">" + keyword + "</a></li>";
                    else if (keyword == "品牌认证车")
                        hisHtml += "<li><a href=\"http://" + HeaderFunction.currentAreaSpell + ".m.taoche.com/buycar/pges3bxcdza/\" onclick= \"clickact('wap_buycar_search_hot_pprzc');\">" + keyword + "</a></li>";
                    else if (keyword == "准新车")
                        hisHtml += "<li><a href=\"http://" + HeaderFunction.currentAreaSpell + ".m.taoche.com/all/?newcar=1\" onclick= \"clickact('wap_buycar_search_hot_zxc');\">" + keyword + "</a></li>";
                    else
                        hisHtml += "<li><a href=\"javascript:;\" onclick= \"clickact('wap_buycar_search_lsjl_all_" + (i + 1) + "');searchClick('" + keyword + "')\">" + keyword + "</a></li>";
                }
                $("#divHistory").show();
            }
            else {
                $("#divHistory").hide();
            }
            $("#divHistorySearch").html(hisHtml);
        }
        function searchClick(text) {
            var url = "http://" + HeaderFunction.currentAreaSpell + ".m.taoche.com";
            HeaderSearch.saveSearchWord(text);
            window.location.href = "http://search.taoche.com/SearchHandler.ashx?pfrom=wap&kw=" + encodeURI(text) + "&areaid=" + HeaderFunction.currentAreaId + "&areatype=" + HeaderFunction.currentAreaType + "&target=" + url + "&spell=" + HeaderFunction.currentAreaSpell;
        }