import './list.scss'
import 'zepto/src/touch';
    var cardlist = {
        init: function () {
            var RowCountListNumb = null;
            var iPage = 1;
            var items = 4;
            var scroolF = true;
            var NavConF = true;
            $('.more_box').hide();
            $.ajax({
                type: 'post',
                url: recProListUrl + '?rightsAndInterests=' + rightAndInterest + '&level=' + cardLevel + '&pageIndex=' + iPage + '&pageSize=' + items + '&companyId=' + companyId,
                dataType: 'json',
                success: function (res) {
                    fristList(res)
                },
                error: function (res) {
                    tools.showAlert(res.Message);
                }
            })
            ///List?companyId=-1&rightsAndInterests=-1&level=-1&source=540   companyId= 银行 rightsAndInterests=用途  level-等级
            ////recProListUrl?rightsAndInterests=-1&level=-1&pageIndex=1&pageSize = 6&companyId = -1 列表页数据接口
            ////////所有银行
            $('#companyId').off('click').on('click', function (e) { e.preventDefault();e.stopPropagation();tapTit('#companyId_con') });
            $('#companyId_con').on('click', 'li', function () {
                companyId = $(this).attr('data-id');
                var txt = $(this).text();
                $('#companyId').html(txt + '<i class="tip_bot"></i>');
                $('#companyId').attr('data-id', $(this).attr('data-id'));
                $('#companyId_con li').removeClass('cur');
                $(this).addClass('cur');
                $('#companyId_con').hide();
                $('#maskLayer').hide();
                NavConF = true;
                //var sourceURL = tools.getUrlParam('source');
                iPage = 1;
                // console.log(rightAndInterest, cardLevel, iPage, items, companyId)
                $.ajax({
                    type: 'post',
                    url: recProListUrl + '?rightsAndInterests=' + rightAndInterest + '&level=' + cardLevel + '&pageIndex=' + iPage + '&pageSize=' + items + '&companyId=' + companyId,
                    dataType: 'json',
                    success: function (res) {
                        textList(res)
                    },
                    error: function (res) {
                        tools.showAlert(res.Message);
                    }
                })
            })
            ////////所有用途
            $('#AllPurpose').off('click').on('click', function (e) {e.preventDefault();e.stopPropagation();tapTit('#AllPurpose_con') });
            $('#AllPurpose_con').on('click', 'li', function () {
                rightAndInterest = $(this).attr('data-id');
                var txt = $(this).text();
                $('#AllPurpose').html(txt + '<i class="tip_bot"></i>');
                $('#AllPurpose').attr('data-id', $(this).attr('data-id'));
                $('#AllPurpose_con li').removeClass('cur');
                $(this).addClass('cur');
                $('#AllPurpose_con').hide();
                $('#maskLayer').hide();
                NavConF = true;
                iPage = 1;
                $.ajax({
                    type: 'post',
                    url: recProListUrl + '?rightsAndInterests=' + rightAndInterest + '&level=' + cardLevel + '&pageIndex=' + iPage + '&pageSize=' + items + '&companyId=' + companyId,
                    dataType: 'json',
                    success: function (res) {
                        RowCountListNumb =res.RowCount;
                        textList(res)
                    },
                    error: function (res) {
                        tools.showAlert(res.Message);
                    }
                })
            })
            ////////所有等级
            $('#level').off('click').on('click', function (e) {e.preventDefault();e.stopPropagation(); tapTit('#level_con') });
            $('#level_con').on('click', 'li', function () {
                cardLevel = $(this).attr('data-id');
                var txt = $(this).text();
                $('#level').html(txt + '<i class="tip_bot"></i>');
                $('#level').attr('data-id', $(this).attr('data-id'));
                $('#level_con li').removeClass('cur');
                $(this).addClass('cur');
                $('#level_con').hide();
                $('#maskLayer').hide();
                //var sourceURL = tools.getUrlParam('source');
                iPage = 1;
                // console.log(rightAndInterest, cardLevel, iPage, items, companyId)
                $.ajax({
                    type: 'post',
                    url: recProListUrl + '?rightsAndInterests=' + rightAndInterest + '&level=' + cardLevel + '&pageIndex=' + iPage + '&pageSize=' + items + '&companyId=' + companyId,
                    dataType: 'json',
                    success: function (res) {
                        textList(res)
                    },
                    error: function (res) {
                        tools.showAlert(res.Message);
                    }
                })
            })
            //////////////////////////////////////////////////////////textList start
            function textList(res) {
                var resData = res.Data;
                if (res.RowCount == 0) {
                    $('.creditList_con').hide();
                    $('#creditDefault').show();
                } else {
                    $('.more_box').hide();
                    $('.creditList_con').show();
                    $('#creditDefault').hide();
                    $('#creditListNumber').html('');
                    $('#creditListNumber').text(res.RowCount);
                    if (res.RowCount > 4) {
                        $('.more_box').show();
                    }
                    for (var index in res.Data) {
                        var label = res.Data[index].Label;
                        if (label) {
                            var labelArr = label.split("|");
                            res.Data[index].labelArr = labelArr;
                        } else {
                            res.Data[index].labelArr = null;
                        }
                    }
                    $('.credotList_ul').html('');
                    for (var i = 0; i < resData.length; i++) {
                        var IsHaveGift = resData[i].IsHaveGift //是否有礼 fasle表示没有，true表示有礼
                        var IsRecommend = resData[i].IsRecommend //是否推荐
                        var RecommendReason = resData[i].RecommendReason //推荐理由
                        var labelTag = resData[i].LabelList//推荐标签
                        //var html = template.render('#recommendLI', { resData: resData });
                        if (IsRecommend == false) {
                            resData[i].RecommendReason = '暂无';
                            labelTag = 0;
                        }
                        if (resData[i].RecommendReason == null) {
                            RecommendReason = '暂无';
                        } else { RecommendReason = '推荐理由：' + resData[i].RecommendReason }

                        $('.credotList_ul').append(
                            '<li class="item">'
                            + '<a href="/' + city.citySpell + '/proc' + resData[i].ID + '/?source=' + source + '">'
                            + '<div class="img_box"><img src="' + resData[i].ImgUrl + '" /></div>'
                            + '<div class="tit font-ctn">' + resData[i].Name + '<i class="font-label jian">荐</i><i class="font-label li">礼</i></div>'
                            + '<div class="font-22 col_grey9 info">' + RecommendReason + '</div>'
                            + '<div class="col_grey6 has font-24"><span class="col_red">' + resData[i].ApplyNum + '</span>人已申请</div>'
                            + '<div class="label font-label"></div>'
                            + '</a>'
                            + '</li>'
                        );

                        if (labelTag == 0) {
                            // alert('labelTag == 0')
                        } else {
                            for (var s = 0; s < labelTag.length; s++) {
                                $('.credotList_ul .item').eq(i).find('.label').append('<span class="tag">' + resData[i].LabelList[s] + '</span>')
                            }
                        }
                        if (IsHaveGift == true) {
                            $('.credotList_ul .item').eq(i).find('.li').show();
                        } else {
                            $('.credotList_ul .item').eq(i).find('.li').hide();
                        }
                        if (IsRecommend == true) {
                            $('.credotList_ul .item').eq(i).find('.jian').show();
                        } else {
                            $('.credotList_ul .item').eq(i).find('.jian').hide();
                        }
                    }
                }


            }
            ///////////////////////////////////////////////////////textList end
            //////////////////////////////////////////////////////////fristList start
            function fristList(res) {
                var resData = res.Data;
                RowCountListNumb = res.RowCount;
                soTabnNav();/////获取所有银行 获取所有用途 获取所有等级
                //判断 开始
                if (res.RowCount == 0) {
                    $('.more_box').hide();
                    $('.creditList_con').hide();
                    $('#creditDefault').show();
                } else {
                    $('.more_box').hide();
                    $('.creditList_con').show();
                    $('#creditDefault').hide();
                    $('#creditListNumber').html('');
                    $('#creditListNumber').text(res.RowCount);
                    if (res.RowCount > 4) {
                        $('.more_box').show();

                    }
                    for (var index in res.Data) {
                        var label = res.Data[index].Label;
                        if (label) {
                            var labelArr = label.split("|");
                            res.Data[index].labelArr = labelArr;
                        } else {
                            res.Data[index].labelArr = null;
                        }
                    }
                    $('.credotList_ul').html('');
                    for (var i = 0; i < resData.length; i++) {
                        var IsHaveGift = resData[i].IsHaveGift //是否有礼 fasle表示没有，true表示有礼
                        var IsRecommend = resData[i].IsRecommend //是否推荐
                        var RecommendReason = resData[i].RecommendReason //推荐理由
                        var labelTag = resData[i].LabelList;//推荐标签
                        if (IsRecommend == false) {
                            resData[i].RecommendReason = '暂无';;
                            labelTag = 0;
                        }
                        if (resData[i].RecommendReason == null) {
                            RecommendReason = '暂无';
                        } else { RecommendReason = '推荐理由：' + resData[i].RecommendReason }
                        $('.credotList_ul').append(
                            '<li class="item">'
                            + '<a href="/' + city.citySpell + '/proc' + resData[i].ID + '/?source=' + source + '">'
                            + '<div class="img_box"><img src="' + resData[i].ImgUrl + '" /></div>'
                            + '<div class="tit font-ctn">' + resData[i].Name + '<i class="font-label jian">荐</i><i class="font-label li">礼</i></div>'
                            + '<div class="font-22 col_grey9 info">' + RecommendReason + '</div>'
                            + '<div class="col_grey6 has font-24"><span class="col_red">' + resData[i].ApplyNum + '</span>人已申请</div>'
                            + '<div class="label font-label"></div>'
                            + '</a>'
                            + '</li>'
                        );

                        if (labelTag == 0) {
                            // alert('labelTag == 0')
                        } else {
                            for (var s = 0; s < labelTag.length; s++) {
                                $('.credotList_ul .item').eq(i).find('.label').append('<span class="tag">' + resData[i].LabelList[s] + '</span>')
                            }
                        }
                        if (IsHaveGift == true) {
                            $('.credotList_ul .item').eq(i).find('.li').show();
                        } else {
                            $('.credotList_ul .item').eq(i).find('.li').hide();
                        }
                        if (IsRecommend == true) {
                            $('.credotList_ul .item').eq(i).find('.jian').show();
                        } else {
                            $('.credotList_ul .item').eq(i).find('.jian').hide();
                        }
                    }
                }
            }
            ///////////////////////////////////////////////////////fristList end
            //////////////////////////////////////////////////////////second start
            function second(res) {
                var resData = res.Data;
                soTabnNav()//获取所有银行 获取所有用途 获取所有等级
                //判断 开始
                if (res.RowCount == 0) {
                    $('.more_box').hide();
                } else {
                    //var RowCountJ = res.RowCount + $('#creditListNumber').html();
                    $('.more_box').hide();
                    $('.creditList_con').show();
                    $('#creditDefault').hide();
                    $('#creditListNumber').html('');
                    $('#creditListNumber').text(res.RowCount);
                    if (res.RowCount > 4) {
                        $('.more_box').show();
                    }
                    if (iPage * 4 >= res.RowCount) {
                        $('.more_box').hide();
                    }
                    for (var index in res.Data) {
                        var label = res.Data[index].Label;
                        if (label) {
                            var labelArr = label.split("|");
                            res.Data[index].labelArr = labelArr;
                        } else {
                            res.Data[index].labelArr = null;
                        }
                    }
                    for (var i = 0; i < resData.length; i++) {
                        var IsHaveGift = resData[i].IsHaveGift //是否有礼 fasle表示没有，true表示有礼
                        var IsRecommend = resData[i].IsRecommend //是否推荐
                        var RecommendReason = resData[i].RecommendReason //推荐理由
                        var labelTag = resData[i].LabelList;//推荐标签
                        if (IsRecommend == false) {
                            resData[i].RecommendReason = '暂无';;
                            labelTag = 0;
                        }
                        if (resData[i].RecommendReason == null) {
                            RecommendReason = '暂无';
                        } else { RecommendReason ='推荐理由：'+ resData[i].RecommendReason }
                        $('.credotList_ul').append(
                            '<li class="item">'
                            + '<a href="/' + city.citySpell + '/proc' + resData[i].ID + '/?source=' + source + '">'
                            + '<div class="img_box"><img src="' + resData[i].ImgUrl + '" /></div>'
                            + '<div class="tit font-ctn">' + resData[i].Name + '<i class="font-label jian">荐</i><i class="font-label li">礼</i></div>'
                            + '<div class="font-22 col_grey9 info">' + RecommendReason + '</div>'
                            + '<div class="col_grey6 has font-24"><span class="col_red">' + resData[i].ApplyNum + '</span>人已申请</div>'
                            + '<div class="label font-label"></div>'
                            + '</a>'
                            + '</li>'
                        );
                        var iPageI = Number((iPage - 1) * 4 + i)
                        if (labelTag == 0) {
                            // alert('labelTag == 0')
                        } else {
                            for (var s = 0; s < labelTag.length; s++) {
                                $('.credotList_ul .item').eq(iPageI).find('.label').append('<span class="tag">' + resData[i].LabelList[s] + '</span>')
                            }
                        }
                        if (IsHaveGift == true) {
                            $('.credotList_ul .item').eq(iPageI).find('.li').show();
                        } else {
                            $('.credotList_ul .item').eq(iPageI).find('.li').hide();
                        }
                        if (IsRecommend == true) {
                            $('.credotList_ul .item').eq(iPageI).find('.jian').show();
                        } else {
                            $('.credotList_ul .item').eq(iPageI).find('.jian').hide();
                        }
                    }
                }
            }
            ///////////////////////////////////////////////////////second end
            function tapTit(con) {
                $('.NavCon').hide();
                // console.log(NavConF);
                if (NavConF) {
                    $(con).show();
                    $('#maskLayer').show();
                    var navHei = $('.creditList_nav_list').height()+$('.header-bar').height();
                    $('#maskLayer').css({ 'top': navHei+'px' })
                    $('#maskLayer').css({ 'z-index': '1' })
                    NavConF = false
                } else {
                    NavConF = true;
                    $('#maskLayer').hide();
                }



            }
            $('#maskLayer').on('click', function () {
                $(this).hide();
                $('.NavCon').hide();
                NavConF = true;
            })
            ////////////////////////////////////////////////点击更多滚动
            //$(window).scroll(function () {
            //    var docBodyScrTop = document.body.scrollTop;//滚动高度
            //    var documentHeight = $(document.body).height();//文档高度
            //    var windowHeight = $(window).height();//窗口高度
            //    if (docBodyScrTop + windowHeight > documentHeight && scroolF) {
            //        scroolF = false
            //        moreFun();
            //    }
            //});
            ///////////////////////////////////////////////点击更多 function
            function moreFun() {
                ++iPage;
                var RowCountDivision = RowCountListNumb / items;//除数
                var RowCountRemainder = RowCountListNumb % items;//求余数 (保留整数)
                // console.log(iPage, iPage*4,RowCountListNumb, RowCountDivision, RowCountRemainder)
                if (iPage == 1) {
                    $.ajax({
                        type: 'post',
                        url: recProListUrl + '?rightsAndInterests=' + rightAndInterest + '&level=' + cardLevel + '&pageIndex=' + iPage + '&pageSize=' + items + '&companyId=' + companyId,
                        dataType: 'json',
                        success: function (res) {
                            $('.credotList_ul').html();
                            second(res)
                            scroolF = true
                        },
                        error: function (res) {
                            tools.showAlert(res.Message);
                        }
                    })
                    return false;
                } else if (iPage <= RowCountDivision && iPage > 1) {
                    $.ajax({
                        type: 'post',
                        url: recProListUrl + '?rightsAndInterests=' + rightAndInterest + '&level=' + cardLevel + '&pageIndex=' + iPage + '&pageSize=' + items + '&companyId=' + companyId,
                        dataType: 'json',
                        success: function (res) {
                            second(res)
                            scroolF = true
                        },
                        error: function (res) {
                            tools.showAlert(res.Message);
                        }
                    })
                } else if (RowCountRemainder != 0) {
                    $.ajax({
                        type: 'post',
                        url: recProListUrl + '?rightsAndInterests=' + rightAndInterest + '&level=' + cardLevel + '&pageIndex=' + iPage + '&pageSize=' + items + '&companyId=' + companyId,
                        dataType: 'json',
                        success: function (res) {
                            remainder(res)
                            scroolF = true
                        },
                        error: function (res) {
                            tools.showAlert(res.Message);
                        }
                    })
                } else {
                    //alert('亲，没有了');
                    $('.more_box').hide();
                }
            }
            //////////////////////////////////////////////点击更多 按钮
            $('.more_box').on('tap', function (e) {
                moreFun()
            })
            //////////////////////////////////////////////////////////点击更多 按钮有余数 start
            function remainder(res) {
                var resData = res.Data;
                soTabnNav()
                //判断 开始
                $('.more_box').hide();
                for (var index in res.Data) {
                    var label = res.Data[index].Label;
                    if (label) {
                        var labelArr = label.split("|");
                        res.Data[index].labelArr = labelArr;
                    } else {
                        res.Data[index].labelArr = null;
                    }
                }
                for (var i = 0; i < resData.length; i++) {
                    var IsHaveGift = resData[i].IsHaveGift //是否有礼 fasle表示没有，true表示有礼
                    var IsRecommend = resData[i].IsRecommend //是否推荐
                    var RecommendReason = resData[i].RecommendReason //推荐理由
                    var labelTag = resData[i].LabelList;//推荐标签
                    if (IsRecommend == false) {
                        resData[i].RecommendReason = '暂无';
                        labelTag = 0;
                    }
                    if (resData[i].RecommendReason == null) {
                        RecommendReason = '暂无';
                    }  else { RecommendReason = '推荐理由：' + resData[i].RecommendReason }
                    $('.credotList_ul').append(
                        '<li class="item">'
                        + '<a href="/' + city.citySpell + '/proc' + resData[i].ID + '/?source=' + source + '">'
                        + '<div class="img_box"><img src="' + resData[i].ImgUrl + '" /></div>'
                        + '<div class="tit font-ctn">' + resData[i].Name + '<i class="font-label jian">荐</i><i class="font-label li">礼</i></div>'
                        + '<div class="font-22 col_grey9 info">' + RecommendReason + '</div>'
                        + '<div class="col_grey6 has font-24"><span class="col_red">' + resData[i].ApplyNum + '</span>人已申请</div>'
                        + '<div class="label font-label"></div>'
                        + '</a>'
                        + '</li>'
                    );
                    var iPageI = Number((iPage - 1) * 4 + i)
                    if (labelTag == 0) {
                        // alert('labelTag == 0')
                    } else {
                        for (var s = 0; s < labelTag.length; s++) {
                            $('.credotList_ul .item').eq(iPageI).find('.label').append('<span class="tag">' + resData[i].LabelList[s] + '</span>')
                        }
                    }
                    if (IsHaveGift == true) {
                        $('.credotList_ul .item').eq(iPageI).find('.li').show();
                    } else {
                        $('.credotList_ul .item').eq(iPageI).find('.li').hide();
                    }
                    if (IsRecommend == true) {
                        $('.credotList_ul .item').eq(iPageI).find('.jian').show();
                    } else {
                        $('.credotList_ul .item').eq(iPageI).find('.jian').hide();
                    }
                }
            }
            ///////////////////////////////////////////////////////点击更多 按钮有余数 end
            ///////////////////////////////////////////////////////获取所有银行 获取所有用途 获取所有等级 begin
            //$(document).on('click', function (e) {
            //    var target=$(e.target);
            //    var self = this;
            //    if (target.parents('.credListNav').length <= 0) {
            //        $('.NavCon').hide();
            //    }
            //})
            function soTabnNav() {
                //获取所有银行 companyId
                $('#companyId_con ul li').each(function (i, n) {
                    if ($(this).attr('data-id') == companyId) {
                        $(this).addClass('cur');
                        var txt = $(this).find('span').text();
                        $('#companyId span').text(txt)
                    }
                })
                //获取所有用途 rightAndInterest
                $('#AllPurpose_con ul li').each(function (i, n) {
                    if ($(this).attr('data-id') == rightAndInterest) {
                        $(this).addClass('cur');
                        var txt = $(this).find('span').text();
                        $('#AllPurpose span').text(txt)
                    }
                })
                //获取所有等级 cardLevel
                $('#level_con ul li').each(function (i, n) {
                    if ($(this).attr('data-id') == cardLevel) {
                        $(this).addClass('cur');
                        var txt = $(this).find('span').text();
                        $('#level span').text(txt)
                    }
                })
                //////////////////////////////////////////
            }
            ///////////////////////////////////////////////////////获取所有银行 获取所有用途 获取所有等级 end
        },
    }
    cardlist.init()


