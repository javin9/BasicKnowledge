import './tencent.scss';
import 'zepto/src/touch';
import carSelect from 'libs/carSelect';
import carThirdLevel from 'libs/carSelect/carThirdLevel.js';
import citySelect from 'libs/citySelect';
import check from 'libs/check/m.js';

var downpaymentArr = {
    noLimit:[
        {"ID":0,"Name":"0%"},
        {"ID":0.1,"Name":"10%"},
        {"ID":0.2,"Name":"20%"},
        {"ID":0.3,"Name":"30%","Sel":"sel"},
        {"ID":0.4,"Name":"40%"},
        {"ID":0.5,"Name":"50%"},
        {"ID":0.6,"Name":"60%"},
        {"ID":0.7,"Name":"70%"}
    ],
    normal: [
        {"ID":0,"Name":"0%"},
        {"ID":0.1,"Name":"10%"},
        {"ID":0.2,"Name":"20%"},
        {"ID":0.3,"Name":"30%","Sel":"sel"},
        {"ID":0.4,"Name":"40%"},
        {"ID":0.5,"Name":"50%"},
        {"ID":0.6,"Name":"60%"},
        {"ID":0.7,"Name":"70%"}
    ],
    rent: [
        {"ID":0,"Name":"0%"},
        {"ID":0.1,"Name":"10%"},
        {"ID":0.2,"Name":"20%"},
        {"ID":0.3,"Name":"30%","Sel":"sel"},
        {"ID":0.4,"Name":"40%"},
        {"ID":0.5,"Name":"50%"},
        {"ID":0.6,"Name":"60%"},
        {"ID":0.7,"Name":"70%"}
    ]
};

var LoanTermType = [
    { "ID": 12, "Name": "1年", "Text": "还款1年" },
    { "ID": 24, "Name": "2年", "Text": "还款2年" },
    { "ID": 36, "Name": "3年", "Text": "还款3年","Sel":"sel"},
    { "ID": 48, "Name": "4年", "Text": "还款4年" },
    { "ID": 60, "Name": "5年", "Text": "还款5年" }
];
/**********公用方法*********/
var ajaxUrl = {};
function $ajax(opt) {
    if (ajaxUrl[opt.url]) {
        return false;
    }
    ajaxUrl[opt.url] = true;
    opt.cache = true;
    opt.dataType = opt.dataType ? opt.dataType : "json";
    opt.type = opt.type ? opt.type : "POST";
    opt.error = function (XMLHttpRequest, textStatus) {
        var status = XMLHttpRequest.status;
        if (status == 0)
            return;
        else if (status == 500)
            alert("服务器错误");
        else
            alert("请求失败");
    };
    opt.goSuccess = opt.success;
    opt.success = function (res) {
        if (opt.goSuccess)
            opt.goSuccess(res);
    }
    opt.complete = function () {
        delete ajaxUrl[opt.url];
    }
    $.ajax(opt);
}
function SetLS(key, json) {
    try {
        window.localStorage.setItem(key, JSON.stringify(json));
    } catch(_) {
        alert("本地储存写入错误，若为safari浏览器请关闭无痕模式浏览。");
    }
}

/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function GetLS(key) {
    var str = window.localStorage.getItem(key);
    if (str != null && str != "")
        return JSON.parse(str);
    else
        return false;
}

/**
 * 清除缓存
 * @param Striong key  保存数据的key，如果不传清空所有缓存数据
 */
function ClearLS(key) {
    if (key)
        window.localStorage.removeItem(key);
    else
        window.localStorage.clear();
}
function checkPhone(phone) {
    var phoneRexp = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
    if (!phoneRexp.test(phone) || phone == "")
        return false;
    return true;
}
function getQueryString(name) { //截取url参数值
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
//校验姓名
var nameRexp = new RegExp(/^[\u4e00-\u9fa5]{2,8}$/);//2-8位汉字
var PassPort = new RegExp(/^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/);
var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
function IdCardValidate(idCard) {
    idCard = idCard.trim(); //去掉字符串头尾空格
    if (idCard.length == 15) {
        return isValidityBrithBy15IdCard(idCard); //进行15位身份证的验证
    } else if (idCard.length == 18) {
        var a_idCard = idCard.split(""); // 得到身份证数组
        if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param a_idCard 身份证号码数组
 * @return
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var sum = 0; // 声明加权求和变量
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i]; // 加权求和
    }
    valCodePosition = sum % 11; // 得到验证码所位置
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}
/**
 * 验证18位数身份证号码中的生日是否是有效生日
 * @param idCard 18位书身份证字符串
 * @return
 */
function isValidityBrithBy18IdCard(idCard18) {
    var year = idCard18.substring(6, 10);
    var month = idCard18.substring(10, 12);
    var day = idCard18.substring(12, 14);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}
/**
 * 验证15位数身份证号码中的生日是否是有效生日
 * @param idCard15 15位书身份证字符串
 * @return
 */
function isValidityBrithBy15IdCard(idCard15) {
    var year = idCard15.substring(6, 8);
    var month = idCard15.substring(8, 10);
    var day = idCard15.substring(10, 12);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}
//去掉字符串头尾空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 通过身份证判断是男是女
 * @param idCard 15/18位身份证号码
 * @return 'female'-女、'male'-男
 */
function maleOrFemalByIdCard(idCard) {
    idCard = trim(idCard.replace(/ /g, "")); // 对身份证号码做处理。包括字符间有空格。
    if (idCard.length == 15) {
        if (idCard.substring(14, 15) % 2 == 0) {
            return 'female';
        } else {
            return 'male';
        }
    } else if (idCard.length == 18) {
        if (idCard.substring(14, 17) % 2 == 0) {
            return 'female';
        } else {
            return 'male';
        }
    } else {
        return null;
    }
}

var HeaderInit = function (ops, flag) {
    if (!flag)
        return;
    HeaderInit.leftFn = function () {
        ops.leftFn && ops.leftFn();
    }
    var header = '<header class="ub hd">' +
        '	<div class="hd-back" onclick="HeaderInit.leftFn();"></div>' +
        '	<div class="ub-f1 tx-c">' + ops.title + '</div>' +
        '	<div class="hd-forward vib"></div>' +
        '</header>';
    $(".bodyEvt").prepend(header);
}
function getCount(obj) {//获取对象个数
    var count = 0;
    for (var key in obj) {
        if ((obj[key]||obj[key]===0)&&key!="Code")
            count++;
    }
    return count;
}
$.fn.ShowAlert = function (_txt, time) {
    $(this).find('p').text(_txt);
    $(this).show();
    setTimeout(function () {
        $(this).hide();
    }.bind(this), time || 2000);
    return this;
};
/**
 *模拟睡眠
 *@param int numberMillis  传入毫秒值
 */
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function htmlScroll(scrollTo, time) {
    var scrollFrom = parseInt(document.documentElement.scrollTop) || parseInt(document.body.scrollTop),
        i = 0,
        runEvery = 5; // run every 5ms

    scrollTo = parseInt(scrollTo);
    time /= runEvery;

    var interval = setInterval(function () {
        i++;

        document.documentElement.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
        document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

        if (i >= time) {
            clearInterval(interval);
        }
    }, runEvery);
}

/**********************************************/
var Index = {
    carPrice: null,
    carDealerPrice:null,
    carId: null,
    cityId: "",
    cityName: "",
    packageType: 0,
    downPaymentRate: 0.3,//首付比例
    downPaymentPrice: 0,
    repaymentPeriod: 36,//还款期限
    pageIndex: 1,  //分页
    pageSize: 10,  //分页
    pageMax: null, //分页
    chooseNum: 0,  //选中列表的记录数
    sortName: "MR", //列表排序
    hasLoading: true,
    moved: false,
    indexInit: function () {
        HeaderInit({//初始化头部
            title: "申请贷款",
            leftFn: function () {
                history.go(-1);
            }
        }, getQueryString("header"));

        this.indexStatusInit(status || 0);//根据腾讯跳转过来的状态初始化数据
    },
    indexStatusInit: function (type) {
        var self = this;
        switch (parseInt(type)) {
            case 0:
                $("#citySel").removeClass('default');
                break;
            case 1:
                // 已经帮用户切换车款了
                $("#citySel").removeClass('default');
                $(".alertCon").ShowAlert("抱歉，该款暂未提供贷款服务，为您切换至" + carSerialName + "其它款供您参考", 3000);
                Index.hasLoading = false;
                break;
            case 2:
                Index.hasLoading = false;
                $("#citySel").removeClass('default');
                $(".sorryCon").ShowAlert("抱歉，该车尚无贷款服务", 9999999);
                // 选车,用1级选车控件
                self.chooseCar();
                $(".sorry .back").on("click", function () {
                    history.go(-1);
                });
                $(".sorry .close").on("click", function () {
                    $(".sorryCon").hide();
                });
                $(".b-sreturn").hide();
                break;
            case 3:
                $("#citySel").addClass('default');
                break;
            default:
                break;
        }

        this.indexDataInit();//数据初始化
        this.indexEventInit();//事件绑定初始化

        this.indexCheckInit();//校验

    },
    indexDataInit: function () {
        Index.cityId = cityId;
        Index.cityName = cityName;
        Index.carId = CarId;

        var qualLS = GetLS("qualLS") || {};
        qualLS.cityId = Index.cityId;
        qualLS.carId = Index.carId;

        // todo check
        //$ eidt by qianyuan
        if (document.referrer.indexOf("Qualification") < 0) {
            // 首次进入页面（从融360或腾讯进入）情况
            //console.log('first');
            //console.log(qualLS);
            var name = window.name || '';
            var telephone = window.telephone || '';
            var certificateNumber = window.certificateNumber || '';

            // 姓名
            if (name && check.isName(name)) {
                qualLS.Name = name;
            } else {
                qualLS.Name = '';
            }

            // 电话
            if (telephone && check.isPhoneNumber(telephone)) {
                qualLS.Telphone = telephone;
                initTel(telephone, qualLS.Telphone);
            } else {
                qualLS.Telphone = '';
            }

            // 身份证号
            if (certificateNumber && check.isID(certificateNumber)) {
                qualLS.CertificateNumber = certificateNumber;
            } else {
                qualLS.CertificateNumber = '';
            }

            // 存储
            SetLS("qualLS", qualLS);
        } else {
            // 资质页返回情况
            //console.log('second');
            //console.log(qualLS);
            // 电话特殊处理
            var telephone = window.telephone || '';
            if (telephone && check.isPhoneNumber(telephone)) {
                // 本地存储无号码，则使用url电话
                if (!qualLS.Telphone) {
                    qualLS.Telphone = telephone;
                    SetLS("qualLS", qualLS);
                }
                initTel(telephone, qualLS.Telphone);
            }
        }

        // 当进入页面时url带电话时候的操作
        // urlTel: url里的电话
        // localTel: 本地存储的电话（首页填过，再跳到资质页填写，再返回时会有）
        function initTel(urlTel, localTel) {
            if (urlTel === localTel) {
                $('#validatecode').css('display', 'none !important').attr('disabled', 'disabled').find('input').removeClass('i-input');  // 不再需要填写验证码
                qualLS.Code = '';
                SetLS("qualLS", qualLS);
            }
            $('#Telphone').bind('input', function() {
                var val = $(this).val();
                if (val !== urlTel) {
                    $('#validatecode').removeAttr('style').removeAttr('disabled').find('input').addClass('i-input');
                    // 解决一开始隐藏元素不能绑定blur事件
                    $('#Code').unbind('blur').bind('blur', function () {
                        Index.checkInput(this);
                    });
                } else {
                    $('#validatecode').css('display', 'none !important').attr('disabled', 'disabled').find('input').removeClass('i-input');
                    $('#validatecode').next('.validate_text').addClass('hide');
                }
            });
        }

        // 回填显示
        $("#Telphone").val(qualLS.Telphone || '');
        $("#Code").val(qualLS.Code || '');
        $("#Name").val(qualLS.Name || '');
        $("#CertificateNumber").val(qualLS.CertificateNumber || '');
        // todo temp delete
        // Index.showCertification('1234', 'abc');
        // Index.showRecommendedProduct('123');
        //$ qianyuan end

        $(".index_info_img>img").attr("src", carSerialImgUrl);
        $("#carSel")
            .text(car.carSerialShowName + " " + carYear + "款" + carName)
            .data('id', CarId)
            .data('price', carPriceText)
            .data('img', carSerialImgUrl)
            .data('otherdata', carBrandName + carSerialName + " " + carYear + "款" + carName);

        $(".index_info_tt>span").text(textBeforeCarPrice + ":");
        $(".index_info_tt>em").text(carPriceText + "万");
        Index.carDealerPrice = carPriceText;

        this.carPrice = carPriceText, this.carId = CarId;

        // 选车
        var self = this;
        $('#carTrigger').bind('click', function(e) {
            self.changeCar();
        });
        // 选城市
        $('#cityTrigger').bind('click', function() {
            self.changeCity();
        });

        // 进度条
        $("#percent").text((getCount(qualLS) / 14 * 100).toFixed(0) + "%");
        // 首付
        $("#downPaymentPrice").text((Index.downPaymentRate * carPriceText).toFixed(2));
        $("#repaymentPeriod").text(this.repaymentPeriod);

        //初始化tab
        /* $.each(packageType,function(i,item){
         if (item.ID == 0)
         return item.Sel = "sel";
         }); */
        $(".index_screening").append(this.getIndexTypeHtml(downpaymentArr.noLimit, "dm"), this.getIndexTypeHtml(LoanTermType, "lt"));

        if($("#citySel").hasClass('default')){
            $("#citySel").text('选择购车城市');
            $(".f_btn").addClass('disable');
            $("#list").html('<div class="no-location">您的系统定位已关闭，请选择<b id="selCityB">购车城市</b></div>');
            $(".m-pages").hide();

            $('#selCityB').click(function() {
                self.changeCity();
            });
        }else{
            $("#citySel").data("id", Index.cityId).text(Index.cityName);
            $(".m-pages").show();
            Index.loadList();//初始化列表
        }
    },
    getDealerQuote: function () {
        Index.hasLoading && $('.loading').removeClass("hide");
        $.ajax({
            url: preurl + "/GetDealderQuoteInfo",
            data: { cityid: Index.cityId, cityname: Index.cityName, carId: Index.carId },
            dataType: 'json',
            success: function (res) {
                if (res.Result) {
                    $(".index_info_tt>span").text(res.Data.TextBeforeCarPrice + ":");
                    $(".index_info_tt>em").text(res.Data.CarPriceText + "万");
                    Index.carDealerPrice = res.Data.CarPriceText;
                    // 首付
                    $("#downPaymentPrice").text((Index.downPaymentRate * Index.carDealerPrice).toFixed(2));
                    //刷新列表
                    Index.loadList();
                }
            },
            error: function() {
                Index.hasLoading && $('.loading').addClass("hide");
            }
        });
    },
    getIndexTypeHtml: function (arr, flag) {
        var mark = flag || "";

        var html = '<div class="sin_screen">';
        for (var i = 0; i < Math.ceil(arr.length / 2) ; i++) {
            html += '<div class="ub ub-f1">';
            for (var j = 0; j < 2; j++) {
                var _text = arr[2 * i + j] && arr[2 * i + j].Text || "";
                if (arr[2 * i + j]) {
                    var cont = '';
                    if (flag == "pk") {
                        if (arr[2 * i + j].ID == 7)
                            cont += '<div class="sin_desc" style="position:absolute;">弹性贷款由首付、月供、尾款三部分组成，尾款处理灵活</div>';
                        else if (arr[2 * i + j].ID == 12)
                            cont += '<div class="sin_desc">以租代购以长租形式逐月支付租金租期结束可购买、置换、返还</div>';
                    }
                    var sel = arr[2 * i + j].Sel?"sel":"";
                    html += '<div class="ub-f1 ub-con index_sin_sel ' + mark + ' ' + sel + '" data-id="' + arr[2 * i + j].ID + '" data-text="' + _text + '"><div class="sin_name">' + arr[2 * i + j].Name + '</div>' + cont + '</div>';
                }
                else
                    html += '<div class="ub-f1 ub-con index_sin_sel vib"> </div>';
            }
            html += '</div>';
        }
        html += '</div>';

        return html;
    },
    indexEventInit: function () {
        $("#jumpQual").bind('tap', function (e) {
            if(Index.moved)return;
            window.location.href = "Qualification?" + window.location.href.split("?")[1];
        });
        $("body").children().on("click", ".sin_opt.able", function () {//点击tab

            if(Index.moved) { return; }
            var h = $("#index_mtd_nav").offset().top;
            htmlScroll(h, 200);

            var $screen = $('#screen');
            var $dom = $screen.find('.sin_screen').eq($(this).index());
            if ($(this).hasClass("open")) {
                $(this).removeClass("open");
                $screen.animate({height: 0}, 200);
                $dom.fadeOut(200);
                $('#maskLayer').fadeOut(200);
                $("#tab").parent().css({"z-index":999});
            } else {
                $(this).addClass("open").siblings().removeClass("open");
                $dom.fadeIn(200).siblings().fadeOut(200);
                $screen.animate({height: $dom[0].scrollHeight}, 200);
                if ($('#maskLayer').css('display') === 'none') {
                    $('#maskLayer').fadeIn(200);
                }
                $("#tab").parent().css({"z-index":9999});

                var $this = $(this);
                $(document).bind('click', function (e) {
                    var e = e || window.event;
                    var elem = e.target || e.srcElement;
                    while (elem) { //循环判断至跟节点，防止点击的是div子元素
                        if (elem.id && (elem.id == 'screen' || elem.id == 'tab')) {
                            return;
                        }
                        elem = elem.parentNode;
                    }
                    $this.removeClass("open");
                    $screen.animate({height: 0}, 200);
                    $dom.fadeOut(200);
                    $('#maskLayer').fadeOut(200);
                    $("#tab").parent().css({"z-index":999});
                });
            }
        });
        $("body").children().on("click", ".index_sin_sel", function () {//点击tab下选项
            var index = $(this).parents(".sin_screen").index();
            var $tab = $(".index_list .sin_opt").eq(index);
            var text = $(this).data("text") || $(this).find(".sin_name").text(), id = $(this).data("id");
            var flag = 0;

            if ($(this).hasClass("pk")) {
                var downpaymentType;
                switch (parseInt(id || 0)) {
                    case 0 :
                        text = "产品类型";
                        downpaymentType = downpaymentArr.noLimit;
                        $(".index_list .sin_opt").eq(1).addClass("able").find(".sin_opt_text").text("首付30%").data("id", "0.3");
                        Index.downPaymentRate = 0.3;
                        $("#downPaymentPrice").text((Index.downPaymentRate * Index.carDealerPrice).toFixed(2));
                        $(".index_list .sin_opt").eq(2).find(".sin_opt_text").text("还款3年").data("id", 36);
                        Index.repaymentPeriod = 36;
                        $("#repaymentPeriod").text(Index.repaymentPeriod);
                        $(".index_sin_sel.lt").each(function(){
                            $(this)[$(this).data("id")==36?"addClass":"removeClass"]("sel");
                        });
                        break;
                    // case 11:
                    //     $(".index_list .sin_opt").eq(1).removeClass("able").find(".sin_opt_text").text("首付比例").data("id", "");
                    //     Index.downPaymentRate = 0;
                    //     downpaymentType = [];
                    //     break;
                    case 12:
                        downpaymentType = downpaymentArr.rent;
                        $(".index_list .sin_opt").eq(1).addClass("able").find(".sin_opt_text").text("首付30%").data("id", "0.3");
                        Index.downPaymentRate = 0.3;
                        $("#downPaymentPrice").text((Index.downPaymentRate * Index.carDealerPrice).toFixed(2));
                        $(".index_list .sin_opt").eq(2).find(".sin_opt_text").text("还款1年").data("id", 12);
                        Index.repaymentPeriod = 12;
                        $("#repaymentPeriod").text(Index.repaymentPeriod);
                        $(".index_sin_sel.lt").each(function(){
                            $(this)[$(this).data("id")==12?"addClass":"removeClass"]("sel");
                        });
                        break;
                    default:
                        downpaymentType = downpaymentArr.normal;
                        $(".index_list .sin_opt").eq(1).addClass("able").find(".sin_opt_text").text("首付30%").data("id", "0.3");
                        Index.downPaymentRate = 0.3;
                        $("#downPaymentPrice").text((Index.downPaymentRate * Index.carDealerPrice).toFixed(2));
                        $(".index_list .sin_opt").eq(2).find(".sin_opt_text").text("还款3年").data("id", 36);
                        Index.repaymentPeriod = 36;
                        $("#repaymentPeriod").text(Index.repaymentPeriod);
                        $(".index_sin_sel.lt").each(function(){
                            $(this)[$(this).data("id")==36?"addClass":"removeClass"]("sel");
                        });
                        break;
                }
                $(".index_screening>.sin_screen").eq(1).replaceWith(Index.getIndexTypeHtml(downpaymentType, "dm"));
                $("#downPaymentPrice").text((Index.downPaymentRate * Index.carDealerPrice).toFixed(2));//首付
                Index.packageType = id;
            } else if ($(this).hasClass("dm")) {
                Index.downPaymentRate = id;
                if (Index.downPaymentRate == 0){
                    $("#downPaymentPrice").text("0");
                    $("#downPaymentPrice").parent().html($("#downPaymentPrice").parent().html().replace('万', '元'));
                }
                else {
                    $("#downPaymentPrice").text((Index.downPaymentRate * Index.carDealerPrice).toFixed(2));//首付
                    $("#downPaymentPrice").parent().html($("#downPaymentPrice").parent().html().replace('元', '万'));
                }
            } else if ($(this).hasClass("lt")) {
                Index.repaymentPeriod = id;
                $("#repaymentPeriod").text(Index.repaymentPeriod);
            }

            $(this).parents(".sin_screen").find(".index_sin_sel").removeClass("sel");
            $(this).addClass("sel");
            $tab.removeClass("open");
            $tab.find(".sin_opt_text").text(!$(this).hasClass("dm") ? text : "首付" + text).data("id", id);

            $(this).parents("#screen").animate({height: 0}, 200);
            $(this).parents(".sin_screen").fadeOut(200);
            $('#maskLayer').fadeOut(200);
            $("#tab").parent().css({"z-index":999});

            Index.pageIndex = 1;
            $("#list").html("").css('min-height', document.documentElement.clientHeight);
            Index.loadList(true);
        });
        /* $("body").children().on("click", ".list_pat_sel", function (e) {//选择列表
         e.stopPropagation();//阻止事件冒泡
         var length = $(".sin_list.sel").length;
         var $parent = $(this).parents(".sin_list");
         if ($parent.hasClass("gq"))return;
         if ($parent.hasClass('sel'))
         $parent.removeClass("sel");
         else {
         if (length >= 5)
         $(".alertCon").ShowAlert("最多选择5种产品", 3000);
         else
         $parent.addClass("sel");
         }
         }); */
        $('#list').on('tap', '.sin_list', function(e) {
            var elem = $(e.target);
            if (Index.moved) {
                return;
            } else if (elem.hasClass('adviser') || elem.parents('.adviser').length) {
                if (!elem.hasClass('adviser')) {
                    elem = elem.parents('.adviser')[0];
                } else {
                    elem = elem[0];
                }
                Index.putAdviserreport(elem);
            } else {
                // var length = $(".sin_list.sel").length;
                var $product = $(this);
                if ($product.hasClass("gq")) { return false; }
                if ($product.hasClass('sel')) {
                    $product.removeClass("sel");
                    $('#f_btn').addClass('disable').find('div').text('请选择金融产品');
                } else {
                    /* if (length >= 5) {
                     $(".alertCon").ShowAlert("最多选择5种产品", 3000);
                     } else {
                     $product.addClass("sel");
                     } */
                    $product.addClass("sel").siblings().removeClass('sel');
                    $('#f_btn').removeClass('disable').find('div').text('提交');
                }
            }
        });
        // $("body").children().on("click", ".sin_list:not(.right-icon)", function (e) {//选择列表
        /*$("body").children().on("click", ".sin_list:not(.right-icon) .link_detail", function (e) {//选择列表
         if (Index.moved) return;

         if ($(e.target).attr('class') == "adviser")
         return;
         // SetLS("scrollTop",document.body.scrollTop);
         //http://192.168.145.9:8030/tencent/beijing/m117721/p109971/d100043584?source=714
         // 跳转详情
         var productid = $(this).parents(".sin_list").data("productid");
         $.ajax({
         url: preurl + "/GetCitySpellByCityId?cityid=" + Index.cityId,
         type: "get",
         dataType: "json",
         success: function (res) {
         window.location.href = xinche + "tengxun/" + res.Spell + "/m" + Index.carId + "/p" + productid;
         }
         });
         });*/

        // 首页数据提交
        // edit by qiany 2017/4/11 start
        // $(".f_btn").click(Index.indexSubmit);
        $('#f_btn').bind({
            'touchmove': function(e) {
                e.preventDefault();
                e.stopPropagation();
            },
            'touchend': function(e) {
                e.preventDefault();
                e.stopPropagation();
                Index.indexSubmit();
            }
        });
        $('.alertCon').bind({
            'touchstart': function(e) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
        // edit by qiany 2017/4/11 end

        $("body").children().on("click", ".result-close", function () {//关闭result弹窗
            $(".resultCon").hide();
        });
        $(".result-close").siblings().on("click",function(e){
            e.stopPropagation();
        });
        //点击展示更多金融产品
        $(".m-pages > a").off("tap").on("tap", function () {
            if ($(this).is(".m-pages-none"))
                return;
            if ($(this).is(".m-pages-next")) {
                Index.pageIndex = Index.pageIndex + 1;
            }
            Index.loadList();
        });

        var u = navigator.userAgent, app = navigator.appVersion;//处理ios输入法弹起fixed问题
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isiOS){
            $("body").on("focus","input",function(){
                $(".f_btn").css("display","none");
            }).on("blur", "input", function () {
                $(".f_btn").css("display","block");
            });
        }

        var x,y,X,Y;

        document.addEventListener('touchstart',function(event){
            Index.moved = false ; // Index.moved用于判断是否滑动
            x = event.targetTouches[0].screenX ;
            y = event.targetTouches[0].screenY ;
        });
        document.addEventListener('touchmove',function(event){
            if( $('#maskLayer').css('display') == 'block' ){
                event.preventDefault();
            }
            if(Index.moved) return;
            X = event.targetTouches[0].screenX ;
            Y = event.targetTouches[0].screenY ;
            if(X-x != 0 || Y-y !=0) Index.moved = true;
        });

        // 顾问
        /* $('body').on('click', '.sin_list .adviser', function(e) {
         // 拨号
         e.preventDefault();
         var h = $(this).attr('href');
         if (h.indexOf(',') > -1) {
         tools.ifPopExtnum(h);
         } else {
         location.href = h;
         }
         }); */

        //不显示验证码
        // todo check, 某些渠道不需要验证码的情况；记得提交时也不要校验手机号和验证码
        /* if (isneedValidatecode == "False") {
         $(".validatecode").remove();
         } */
    },
    loadList: function (scroll) {
        var data = new Object();
        $(".f_btn").removeClass('disable');
        data["carPrice"] = Index.carDealerPrice;
        data["carId"] = Index.carId;
        data["cityId"] = Index.cityId;
        data["downPaymentRate"] = Index.downPaymentRate.toString();
        data["repaymentPeriod"] = Index.repaymentPeriod.toString();
        data["ChannelCode"] = "";
        data["sortName"] = "MR";
        data["packageType"] = Index.packageType.toString();
        data["job"] = "0";
        data["credit"] = "0";
        data["house"] = "0";
        data["socialSecurity"] = "0";
        data["fund"] = "0";
        data["isDiscount"] = false;
        data["pageIndex"] = Index.pageIndex;
        data["pageSize"] = Index.pageSize;

        Index.selCount = $('#list').children('.sin_list.sel').length;

        $.ajax({
            url: listUrl,
            type: "get",
            data: data,
            dataType: "jsonp",
            beforeSend: function(){
                Index.hasLoading && $('.loading').removeClass("hide");
            },
            success: function (res) {
                if (res.Result) {
                    Index.pageMax = Math.ceil(res.RowCount / 10);
                    if (Index.pageIndex == Index.pageMax) {
                        $('.m-pages').hide();
                        $('.m-pages-next').addClass('m-pages-none');
                    } else {
                        $('.m-pages').show();
                        $('.m-pages-next').removeClass('m-pages-none');
                    }
                    var items = res.Data, html = '';
                    $.each(items, function (i, item) {
                        if (item.PackageId != 4128 && item.PackageId != 4129) {
                            html += Index.getSinIndexListHtml(i, item);
                        }
                    });
                    html = $("#list").html() + html;
                    if (items.length==0&&Index.pageIndex==1){
                        $('.m-pages').hide();
                        html = "<div style='padding: 10% 0;text-align:center;color:#333;'>暂无符合条件的贷款产品</div>";
                    }
                    $("#list").html(html);
                    Index.getAdviserHtml(items);
                }
            },
            complete: function(){
                Index.hasLoading && $('.loading').addClass("hide");
                if (scroll){
                    setTimeout(function(){
                        // var H = $(".hd").outerHeight() + $(".index_first_nav").outerHeight() + $(".index_info").outerHeight() + $(".index_mtd_nav").outerHeight();
                        //$('body').stop().animate({ scrollTop: H }, 400);
                    }, 400);
                }
                Index.hasLoading = true;
                // if (GetLS("scrollTop")){
                //     $('body').stop().animate({ scrollTop: GetLS("scrollTop") }, 1000);
                //     ClearLS("scrollTop");
                // }
            }
        });
    },
    getSinIndexListHtml: function (i, item, selcount) {
        var recom = '';
        var pfn = '';
        var TjIcon = false;

        // 过期
        var GqIcon = (item.HasPromotion && item.PromotionLeftTime === '') ? true : false;
        // 推荐
        /* if (GqIcon) {
         TjIcon = false;
         } else {
         if (item.IsRecommended || (item.HasPromotion && item.PromotionLeftTime !== '')) {
         TjIcon = true;
         } else {
         TjIcon = false;
         }
         } */
        var sel = '';
        /* if (TjIcon && Index.selCount < 3 && !GqIcon) {
         sel = "sel";
         Index.selCount += 1;
         } else if (GqIcon) {
         sel = "gq";
         } */
        // 非置顶第一条选中
        if (GqIcon) {
            sel = "gq";
        } else if (!item.IsTop && Index.selCount < 1) {
            sel = "sel";
            Index.selCount += 1;
        }

        var colorArr =["color_26", "color_24", "color_27"];
        if(item.PackageFeatureIcon1 != null && item.PackageFeatureIcon2 != null){
            pfn = '<em class="' + colorArr[0] + '">' + item.PackageFeatureIcon1 + '</em>' +
                '<em class="' + colorArr[1] + '">' +item.PackageFeatureIcon2 + '</em>';
        }

        // 申请信息
        var CommonRequirementTypeHtml = "";
        switch (item.CommonRequirementType) {
            case 1:
                CommonRequirementTypeHtml = '<span class="level_one">严格</span>';
                break;
            case 2:
                CommonRequirementTypeHtml = '<span class="level_two">一般</span>';
                break;
            case 3:
                CommonRequirementTypeHtml = '<span class="level_three">宽松</span>';
                break;
            default:
                CommonRequirementTypeHtml = '<span class="level_two">一般</span>';
        }

        // 评价信息
        var CommentCountHtml = '';
        if (item.CommentCount == 0 || item.CommentCount == '' || item.CommentCount == null) {
            CommentCountHtml = '<span class="evaluation">暂无评价</span>';
        } else {
            var CommentScoreNum = item.CommentScore;
            var CommentScoreNumHtml = '';
            if (parseInt(CommentScoreNum) == CommentScoreNum) {
                CommentScoreNumHtml = item.CommentScore + '.0';
            } else {
                CommentScoreNumHtml = item.CommentScore;
            }
            CommentCountHtml = '<span class="font-title col_red">' + CommentScoreNumHtml + '</span>分／<span class="evaluation">' + item.CommentCount + '条评价</span>';
        }

        // 礼包
        //8、礼：礼包：PackageGiftValueAmount套餐礼包价值，为0不显示
        var PackageGiftValueAmountHTML = "";
        if (item.PackageGiftValueAmount != 0) {
            PackageGiftValueAmountHTML = item.PackageGiftValueAmount;
        }
        //9、付：在线支付1元押金抵1000元，两个数字字段名分别为：DepositAmount，OffsetDownPaymentAmount
        //item.DepositAmount
        //10、惠：MultiLabel，双竖杠分隔（PC站特殊标签说明：MultiLabelRemark，双竖杠分隔，与标签一一对应）ApplyCondition
        var MultiLabelHTML = "";
        if (item.MultiLabel != null && item.MultiLabel != "") {
            var label = item.MultiLabel;//
            MultiLabelHTML = label.replace(/\|\|/g, "；");
        }
        var liFuHui = '';
        if (item.PackageGiftValueAmount || item.MultiLabel) {
            liFuHui = 'yes';
        } else {
            liFuHui = '';
        }
        var html = '<div class="sin_list ' + sel + '" data-PackageId="' + item.PackageId + '" data-ProductId="' + item.ProductId + '" data-IsRecommended="' + item.IsRecommended + '" data-CompanyId="' + item.CompanyId+ '">' +
            '   <i class="right-icon"></i>' +
                // '   <a class="adviser" href="tel:800000">' +
                // '       <div class="ub box">' +
                // '           <img src="http://img1.bitautoimg.com/chedai/2004cff9-a01d-4892-9482-f188cdbd4654.jpg" class="avaImg" />' +
                // '           <span class="name">李闯</span>' +
                // '           <img src="' + BASEURL + '/css/Tencent/img/tel.png")" class="ub-f1 telImg" />' +
                // '       </div>' +
                // '   </a>' +
            '	<div class="list_pat_sel"><div class="list_sel"></div></div>' +
            '	<div class="list_pat_con">' +
            '       <div class="list_wrap">' +
            '           <div class="link_detail">' +
            '		        <div class="dl apply_title">' +
            '			       <img src="' + item.CompanyLogoUrl.replace(/http:/gi, '') + '" class="list_sin_pic"/><h1 class="list_sin_name"><em>' + item.PackageName + '</em><span>(' + item.CompanyName + ')</span></h1><i class="list_sin_icon ' + recom + '"></i>' +
            '              </div>' +
            '               <div class="dl apply_price">' +
            '                   <div class="dt">申请信息：' + CommonRequirementTypeHtml + '</div>' +
            '               </div>' +
            '               <div class="dl apply_evaluation">' +
            '                   <div class="dt">' + CommentCountHtml + ' </div>' +
            '               </div>' +
            '               <div class="apply_tag">' + pfn + '</div>' +
            '           </div>' +
            '           <div class="list_sin_mon">' +
            '              <p><em>' + parseFloat(item.MonthlyPaymentText) + '</em>' + (item.MonthlyPaymentText.indexOf('万') > -1 ? '万' : '元') + '/月</p>' +
            '              <div>总成本' + (Index.packageType == 12 ? item.ServiceFeeText : item.TotalCostText) + '</div>' +
            '           </div>' +
            '           </div>' +
            '      <ul class="img_info ' + (liFuHui == "" ? "hide" : "") + '">' +
            '          <li class="' + (MultiLabelHTML == "" ? "hide" : "") + '"><i class="hui">惠</i>' + MultiLabelHTML + '</li>' +
                // '          <li class="' + (item.DepositAmount == 0 || item.DepositAmount == null || item.OffsetDownPaymentAmount == 0 || item.OffsetDownPaymentAmount == null ? "hide" : "") + '"><i class="fu">付</i>在线支付' + item.DepositAmount + '元抵' + item.OffsetDownPaymentAmount + '元</li>' +
            '          <li class="' + (PackageGiftValueAmountHTML == "" ? "hide" : "") + '"><i class="li">礼</i>贷款成功即送' + PackageGiftValueAmountHTML + '礼包</li>' +
            '      </ul>' +
            (item.IsTop ? '<div class="istop">置顶</div>' : '') +
            '   </div>' +
            '</div>';
        return html;

    },
    indexCheckInit: function () {
        // $(".index_info .i-input").on("focus",function(){
        // 	$(".f_btn").addClass("hide");//处理ios输入法弹起按钮位置问题
        // })
        $("#Telphone").on("keyup",function(){
            var str = $(this).val();
            if (str.length>11)
                $(this).val(str.substring(0,11));
            if (str.length >= 11) {
                Index.checkInput(this);
            }
        });

        $("#Code").on("keyup", function () {
            var $dom = $(this).parent().parent().next(".validate_text");
            if ($(this).val().length > 4)
                $(this).val($(this).val().substring(0, 4));
            if ($(this).val().length == 4) {
                /* var qualLS = GetLS("qualLS") || {};
                 if ($(this).val() === "") {
                 qualLS.Code = null;
                 SetLS("qualLS", qualLS);
                 return $dom.removeClass("hide");
                 } else {
                 qualLS.Code = $(this).val();
                 SetLS("qualLS", qualLS);
                 } */
                $.ajax({
                    url: preurl + "/checkcode",
                    type: "POST",
                    data: { mobile: $("#Telphone").val(), validatecode: $("#Code").val() },
                    dataType: 'json',
                    success: function (res) {
                        if (res.Result)
                            $dom.addClass("hide");
                        else
                            $dom.removeClass("hide").text('请填写正确的验证码');
                    }
                });
            }
        });

        // edit by qiany
        $(".index_info .i-input").on("blur", function() {
            Index.checkInput(this);
        });

        $("#GetValidateCodeBtn").click(function () {
            if ($(this).hasClass("disable"))
                return;
            if (checkPhone($("#Telphone").val())) {
                $('#Code').focus();
                $.ajax({
                    url: preurl + "/getcode",
                    type: "POST",
                    data: {
                        codelen: 4,
                        mobile: $("#Telphone").val(),
                        __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
                    },
                    dataType: "json"
                });
                var n = 60;
                $("#GetValidateCodeBtn").addClass("disable").text(n + "秒后获取");
                var tmo = setInterval(function () {
                    if (--n == 0) {
                        clearInterval(tmo);
                        $("#GetValidateCodeBtn").removeClass("disable").text("获取校验码");
                        return;
                    }
                    $("#GetValidateCodeBtn").text(n + "秒后获取");
                }, 1000);
            } else {
                $("#Code").parent().parent().next(".validate_text").removeClass("hide").text('请填写正确的手机号');
            }
        });
    },

    checkInput: function(elem) {
        // $(".f_btn").removeClass("hide");//处理ios输入法弹起按钮位置问题

        var name = $(elem).attr("name");
        var val = $(elem).val();
        var $dom = $("#Code").parent().parent().next(".validate_text");
        var qualLS = GetLS("qualLS") || {};
        switch (name) {
            case "Telphone":
                if (!checkPhone(val) || val == "") {
                    $dom.removeClass("hide").text('请填写正确的手机号');
                    qualLS.Telphone = null;
                }
                else {
                    $dom.addClass("hide");
                    qualLS.Telphone = val;
                }
                SetLS("qualLS", qualLS);
                $("#percent").text((getCount(qualLS) / 14 * 100).toFixed(0) + "%");
                break;
            case "Code":
                // edit by qiany， 不存储验证码
                /* if (val === ""){
                 qualLS.Code = null;
                 SetLS("qualLS", qualLS);
                 return $dom.removeClass("hide");
                 } else {
                 qualLS.Code = val;
                 SetLS("qualLS", qualLS);
                 } */
                if (val.length < 4) {
                    $dom.removeClass("hide").text('请填写正确的验证码');
                } else {
                    $dom.addClass("hide");
                }
                break;
            case "Name":
                if (val == "" || !val.match(nameRexp)) {
                    $dom.removeClass("hide");
                    qualLS.Name = null;
                }
                else {
                    $dom.addClass("hide");
                    qualLS.Name = val;
                }
                SetLS("qualLS", qualLS);
                $("#percent").text((getCount(qualLS) / 14 * 100).toFixed(0) + "%");
                break;
        }
    },

    indexSubmit: function () {
        var $fBtn = $("#f_btn");
        if(!$fBtn.hasClass('disable')){
            $fBtn.addClass('disable');

            // 表单验证
            var flag = true;
            var inputs = $(".index_info .i-input");
            var validateText = $("#Code").parent().parent().next(".validate_text");
            for (var i = 0; i < inputs.length; i++) {
                Index.checkInput(inputs[i]);
                if (!validateText.hasClass("hide")) {
                    flag = false;
                    break;
                }
            };
            if (!flag) {
                $fBtn.removeClass('disable');
                htmlScroll(0, 400);
                return false;
            }

            // edit by qianyuan ，验证码隐藏时候，跳过验证直接提交
            if ($('#validatecode').attr('disabled') === 'disabled'/* || isneedValidatecode == "False" */) {    // todo check 某些渠道不需要验证码？
                Index.submitOrder();
            } else {
                // 先验证验证码，再提交
                // 其实验证码在失去焦点或者输入变化时已验证过，此处为保（重）险（复）验证
                checkValidateCode(Index.submitOrder);
            }
            // qianyuan end

            // 验证码校验方法
            function checkValidateCode(successFunc) {
                $.ajax({
                    url: preurl + "/checkcode",
                    type: "POST",
                    data: {mobile: $("#Telphone").val(), validatecode: $("#Code").val()},
                    dataType: 'json',
                    success: function(respond) {
                        if (respond.Result) {
                            successFunc();
                        } else {
                            $fBtn.removeClass('disable');
                            $('.alertCon').ShowAlert(respond.Message, 3000);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $fBtn.removeClass('disable');
                        $('.alertCon').ShowAlert(errorThrown, 3000);
                    }
                });
            }
        }
    },
    // 提交订单（-edit）
    // 生成订单
    submitOrder: function() {
        var data = new Object();
        $(".index_info").find(".i-input").each(function (i) {
            data[$(this).attr("name")] = $(this).val();
        });

        data.Orders = "";
        data.Products = "";
        $("#list .sin_list.sel").each(function (i) {
            var arr = new Array();
            arr.push($(this).data("packageid"));
            arr.push($(this).data("productid"));
            arr.push($(this).data("isrecommended") ? 1 : 0);

            data.Orders += arr.join("_") + ",";
            data.Products += $(this).data("productid") + "_";
        });
        if (!data.Orders.length) {
            $('.alertCon').ShowAlert('请选择至少一款金融产品', 3000);
            $("#f_btn").removeClass('disable');
            return false;
        } else {
            data.Orders = data.Orders.substr(0, data.Orders.length - 1);
        }

        if (data.Products.length > 0) {
            data.Products = data.Products.substr(0, data.Products.length - 1);
        }

        var viewLoanOrder = {};
        //viewLoanOrder.Name = $("#Name").val();
        viewLoanOrder.Name = '';
        //viewLoanOrder.CertificateNumber = '';
        viewLoanOrder.Telphone = $("#Telphone").val();
        viewLoanOrder.Telephone = $("#Telphone").val();
        viewLoanOrder.CityId = Index.cityId;
        viewLoanOrder.CarId = Index.carId;
        viewLoanOrder.CarPrice = Index.carPrice;
        viewLoanOrder.Orders = data.Orders;
        //viewLoanOrder.Channel = _channel;
        //viewLoanOrder.Source = _source;
        //viewLoanOrder.DealerID = _dealerId;
        //viewLoanOrder.DealerName = _dealerName;
        //viewLoanOrder.SourceDicName = _sourceDicName;
        viewLoanOrder.From = tools.getUrlParam('From');
        viewLoanOrder.ForgeryId = $("#forgeryToken").val();
        viewLoanOrder.Channel = channel;
        viewLoanOrder.pordercode = 20;

        $.ajax({
            type: 'POST',
            url: preurl + '/AddLoanOrder',
            headers: Index.getAjaxHeader(),
            data: viewLoanOrder,
            dataType: "json",
            beforeSend: function () {
                $('.alertCon').ShowAlert('提交中...', 9999999);
                // 禁止滚动
                $(window).bind('touchmove', function(e) {
                    e.preventDefault();
                });
            },
            success: function (res) {
                if (res.Result) {
                    // -edit by qianyuan，
                    // 去掉原来的资质页，也不提交响应资料了

                    // $('.alertCon').hide();
                    /* var OrderID = res.Message.split('-')[0];
                     var LoanUserID = res.Message.split('-')[1];
                     var ViewQualification = {};
                     ViewQualification.CertificateType = "105"; //证件类型
                     ViewQualification.CertificateNumber = GetLS("qualLS").CertificateNumber; //证件号码
                     ViewQualification.Career = GetLS("qualLS").Career; //职业身份
                     ViewQualification.Income = GetLS("qualLS").MonthIncome; //收入
                     ViewQualification.Insurance = GetLS("qualLS").Insurance; //社保
                     ViewQualification.Funds = GetLS("qualLS").Funds; //公积金
                     ViewQualification.Credit = GetLS("qualLS").Credit; //信用
                     ViewQualification.HouseState = GetLS("qualLS").HouseState; //住房状态
                     ViewQualification.OrderID = OrderID; //订单号
                     ViewQualification.LoanUserID = LoanUserID; //用户编号
                     var type = ViewQualification.CertificateType;
                     var number = ViewQualification.CertificateNumber;

                     var postdata = {
                     "qualification": JSON.stringify(ViewQualification),
                     "productIds": data.Products,
                     "carId": Index.carId,
                     "cityId": Index.cityId,
                     "carPrice": Index.carPrice,
                     "orderId": OrderID
                     };

                     $.ajax({
                     url: preurl + "/AddQualification",
                     data: postdata,
                     async: false,
                     success: function (res) {
                     if (res.Result) {
                     //弹出结果页
                     if (res.Data.length > 0) {
                     $(".resultCon .resEvt").each(function () {
                     $(this).text(res.Data[0][$(this).data("name")]);
                     });
                     $('.alertCon').hide();
                     $(".resultCon").ShowAlert("", 999999);
                     }
                     } else {
                     $('.alertCon').ShowAlert(res.Message, 3000);
                     }
                     $fBtn.removeClass('disable');
                     }
                     }) */

                    // todo 提交成功从这里开始，判断是否实名认证过
                    // res = {"Result":true,"Message":"","Data":"331485225542590-2713264-2","RowCount":1}
                    // res.Data = 订单号 - 用户id - 实名认证状态（1：已认证，2：未认证）
                    var orderID = res.Data.split('-')[0],
                        userID = res.Data.split('-')[1],
                        hasCertificated = res.Data.split('-')[2];
                    if (hasCertificated === '1') {
                        // 已认证：跳过实名认证步骤，直接进入下单成功及推荐产品
                        Index.showRecommendedProduct(orderID, userID);
                    } else {
                        // 未认证：弹出实名认证步骤
                        Index.showCertification(orderID, userID);
                        $('.alertCon').hide();
                    }
                } else {
                    $('.alertCon').ShowAlert(res.Message, 2000); // edit by qiany 2017/4/11
                    $("#f_btn").removeClass('disable');
                    $(window).unbind('touchmove');
                }
            }
        });
    },

    // 实名认证（-new)
    // 提交订单后没有实名认证过的用户填写，可跳过
    showCertification: function(orderId, userID) {
        var $certification = $("#certification"),
            $name = $certification.find('#Name'),
            $certificatenumber = $certification.find('#CertificateNumber'),
            $error = $certification.find('.validate_text'),
            $inputs = $certification.find('.i-input');

        // 显示资质弹层
        // 用以处理，ios下fixed元素会在键盘出现消失时，定位bug，去掉缓动
        $certification.removeClass('no-transition');
        setTimeout(function() {
            $certification.addClass('no-transition');
        }, 400);
        $certification.show().addClass('enter');

        // 下面的代码为绑定事件，只绑定一次
        if ($certification.hasClass('initailed')) {
            return;
        } else {
            $certification.addClass('initailed');

            // 输入框失去焦点，验证
            $inputs.bind({
                'blur': function (e) {
                    for (var i = 0, max = $inputs.length; i < max; i++) {
                        if (!checkInput($inputs[i]) || $inputs.eq(i).attr('name') === $(this).attr('name')) {
                            break;
                        }
                    }
                    // 用以处理，ios下fixed元素会在键盘出现消失时，定位bug
                    $(window).trigger('resize');
                    $(window).trigger('scroll');
                },
                'focus': function() {
                    // 用以处理，ios下fixed元素会在键盘出现消失时，定位bug
                    $(window).trigger('resize');
                    $(window).trigger('scroll');
                },
                'input': function () {
                    if ($(this).parents('.rowbox').hasClass('error')) {
                        checkInput(this);
                    }
                    var val = $(this).val();
                    if (val !== val.trim()) {
                        $(this).val(val.trim());
                    }
                }
            });

            // 验证
            function checkInput(elem) {
                var $elem = $(elem),
                    validateResult = true,
                    errorText = '';

                switch ($elem.attr('name')) {
                    case 'Name':
                        validateResult = $elem.val().trim() && check.isName($elem.val());
                        errorText = '请填写正确姓名';
                        break;
                    case 'CertificateNumber':
                        validateResult = $elem.val().trim() && check.isID($elem.val());
                        errorText = '请填写正确身份证号';
                        break;
                    default:
                        break;
                }

                if (validateResult) {
                    $error.addClass('hide').text('');
                    $certification.find('.rowbox').removeClass('error');
                    return true;
                } else {
                    $error.removeClass('hide').text(errorText);
                    $certification.find('.rowbox').removeClass('error');
                    $elem.parents('.rowbox').addClass('error');
                    return false;
                }
            }

            // 提交，验证
            $certification.find('.submit-btn').bind('click', function () {
                var $btn = $(this),
                    validatePass = true;

                for (var i = 0, max = $inputs.length; i < max; i++) {
                    validatePass = validatePass && checkInput($inputs[i]);
                    if (!validatePass) {
                        break;
                    }
                }

                if (validatePass) {
                    $.ajax({
                        type: 'POST',
                        url: preurl + '/identification',
                        data: {
                            orderid: orderId,
                            name: $name.val(),
                            certificatenumber: $certificatenumber.val()
                        },
                        beforeSend: function () {
                            $('.alertCon').ShowAlert('提交中...', 9999999);
                        },
                        success: function (respond) {
                            // 认证成功
                            if (respond.Result) {
                                // 暂时不隐藏“提交中”提示，等结果加载完成再隐藏
                                Index.showRecommendedProduct(orderId, userID);
                            } else {
                                $error.removeClass('hide').text(respond.Message);
                                $('.alertCon').hide();
                            }
                        },
                        error: function (respond) {
                            if (respond.Message) {
                                $(".resultCon").ShowAlert(respond.Message, 3000);
                            } else {
                                $(".resultCon").ShowAlert('认证失败，请重试！', 3000);
                            }
                        }
                    })
                }
            });

            // 跳过此步
            $certification.find('.next-btn').bind('tap', function () {
                // 清空表单
                $certification.addClass('passed');
                $inputs.val('');
                // 跳过
                $('.alertCon').ShowAlert('请稍后...', 9999999);
                Index.showRecommendedProduct(orderId, userID);
            });
        }
    },

    // 获取推荐产品（-new）
    // 下单成功界面推荐的产品
    showRecommendedProduct: function(orderId, userID) {
        var $recommended = $('#recommended-product'),
            $certification = $("#certification");

        // 获取推荐产品
        $.ajax({
            type: 'get',
            url: preurl + '/getrecommentlist',
            data: {
                orderid: orderId
            },
            success: function(respond) {
                if (respond.Result) {
                    var items = respond.Data.length ? respond.Data.slice(0, 2) : [],
                        html = '';
                    $.each(items, function (i, item) {
                        html += Index.getSinIndexListHtml(i, item);
                    });
                    // 如果返回的推荐数量不足2个，从列表中补充
                    if (items.length < 2) {
                        var sinlists = $('#list .sin_list');
                        var count = items.length;
                        for (var i = 0; i < sinlists.length && count < 2; i++) {
                            if (!sinlists.eq(i).hasClass('sel')) {
                                html += $('<div>').append(sinlists.eq(i).clone().removeClass('has-adviser')).html();
                                count++;
                            }
                        }
                    }
                    $recommended.find('dl.recommended dd').html(html);
                    $recommended.find('.sin_list').addClass('sel');
                }
                $('.alertCon').hide();
                $certification.removeClass('enter');
                setTimeout(function() { $certification.hide(); }, 400);
                $recommended.show();
            },
            error: function () {
                $recommended.find('dl.recommended').hide();
                $('.alertCon').hide();
                $certification.removeClass('enter');
                setTimeout(function() { $certification.hide(); }, 400);
                $recommended.show();
            }
        });

        // 下面的代码为绑定事件，只绑定一次
        if ($recommended.hasClass('initailed')) {
            return;
        } else {
            $recommended.addClass('initailed');
            $recommended.on('tap', '.sin_list', function () {
                if ($(this).hasClass('sel')) {
                    $(this).removeClass('sel');
                } else {
                    $(this).addClass('sel');
                }
            });

            $recommended.find('.submit-btn').bind('tap', function () {
                var products = $recommended.find('.sin_list.sel');
                if (products.length) {
                    Index.submitRecommendedOrder(orderId, userID, products);
                } else {
                    // 没选择推荐产品直接关闭
                    $recommended.fadeOut(400);    // 隐藏推荐产品弹层
                    $("#f_btn").removeClass('disable');
                    $('#Code').val(''); // 清空验证码（防止重复下单？）
                    $(window).unbind('touchmove');
                }
            });
        }
    },

    // 提交推荐产品订单（-new)
    // 下单成功界面推荐的产品，确认下单
    submitRecommendedOrder: function(orderId, userID, products) {
        var $recommended = $('#recommended-product'),
            orders = '',
            arr = [];

        if (products.length) {
            products.each(function (i) {
                arr = [];
                arr.push($(this).data("packageid"));
                arr.push($(this).data("productid"));
                arr.push($(this).data("isrecommended") ? 1 : 0);
                orders += arr.join("_") + ",";
            });
            if (orders.length) {
                orders = orders.substr(0, orders.length - 1);
            }

            var viewLoanOrder = {};
            viewLoanOrder.Name = $("#Name").val();
            //viewLoanOrder.CertificateNumber = $("#CertificateNumber").val();
            viewLoanOrder.Telphone = $("#Telphone").val();
            viewLoanOrder.Telephone = $("#Telphone").val();
            viewLoanOrder.CityId = Index.cityId;
            viewLoanOrder.CarId = Index.carId;
            viewLoanOrder.CarPrice = Index.carPrice;
            viewLoanOrder.Orders = orders;
            viewLoanOrder.From = tools.getUrlParam('From'); // edit by qiany todo check
            viewLoanOrder.ForgeryId = $("#forgeryToken").val();
            viewLoanOrder.Channel = channel;

            $.ajax({
                type: 'POST',
                url: preurl + '/AddMoreOrder',
                headers: Index.getAjaxHeader(),
                data: viewLoanOrder,
                dataType: "json",
                beforeSend: function () {
                    $('.alertCon').ShowAlert('提交中...', 999999);
                },
                success: function (res) {
                    if (res.Result) {
                        $('.alertCon').ShowAlert('同时申请成功！');
                    } else {
                        $('.alertCon').ShowAlert(res.Message, 3000);
                    }
                },
                complete: function () {
                    $recommended.fadeOut(400);    // 隐藏推荐产品弹层
                    $("#f_btn").removeClass('disable');
                    $('#Code').val(''); // 清空验证码（防止重复下单？）
                    $(window).unbind('touchmove');
                }
            });
        }
    },

    // 防止刷单的参数，通过ajax的header传递 (-new)
    getAjaxHeader: function() {
        var validatetoken = tools.getCookie('validatetoken'),
            validatetokens = validatetoken.split('&'),
            headers = {},
            statement = [];
        for (var i = 0, max = validatetokens.length; i < max; i++) {
            statement = validatetokens[i].split('=');
            headers[statement[0]] = statement[1];
        }
        return headers;
        // console.log(headers);
    },

    getAdviserHtml: function (items) {
        // 金融顾问
        var adviserHTML = "";
        var companyids = "";
        for (var i = 0; i < items.length; i++) {
            companyids += items[i].CompanyId + ",";
        }
        if (companyids.length > 0)
            companyids = companyids.substr(0, companyids.length - 1);

        $.ajax({
            type: 'get',
            url: adviserApi + 'v2/group/getadviserlist',
            data: {
                CityId: Index.cityId,
                CompanyIds: companyids
                // BusinessLineId: window.BusinessLine // 业务线id
            },
            dataType: 'jsonp',
            success: function (data) {
                if (data.Result && data.Data != null && data.Data.length > 0) {
                    for (var i = 0; i < data.Data.length; i++) {
                        //adviserHTML = '<a class="adviser" href="tel:' + data.Data[i].CN400 + ',' + data.Data[i].ExTen + '" Exten=' + data.Data[i].ExTen + ' AdviserId=' + data.Data[i].Id + ' CallingNumber=' + data.Data[i].CN400 + '><div class="ub box"><img src="' + data.Data[i].Photo + '" class="avaImg" /><span class="name">' + data.Data[i].Name + '</span><div class="ub-f1 telImg"></div></div></a>';
                        adviserHTML = `<a class="adviser" href="tel:${data.Data[i].Adviser.CN400}" AdviserId="${data.Data[i].Adviser.Id}" CallingNumber="${data.Data[i].Adviser.CN400}"><div class="ub box"><img src="${data.Data[i].Adviser.Photo.replace(/http:/gi, '')}" class="avaImg" /><span class="name">${data.Data[i].Adviser.Name}</span><div class="ub-f1 telImg"></div></div></a>`;
                        //$("div[data-companyid=" + data.Data[i].CompanyId + "]").find(".right-icon").html(adviserHTML);
                        $('#list .sin_list').each(function() {
                            if ($(this).attr('data-companyid').trim() === data.Data[i].CompanyId.toString().trim()) {
                                $(this).find(".right-icon").html(adviserHTML);
                                $(this).addClass('has-adviser');
                            }
                        });
                    }
                }
            }
        });
    },
    putAdviserreport: function (data) {
        var requesttype = "";
        var u = navigator.userAgent;
        var fromcode = "";
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS){
            fromcode = "txxwapp2";
            requesttype = "3";
        }
        else{
            fromcode = "txxwapp7";
            requesttype = "4";
        }

        $.ajax({
            type: 'get',
            url: adviserApi + 'user/putadviserreport',
            data: {
                AdviserId: $(data).attr("adviserid"),
                Exten:  $(data).attr("exten"),
                CityId: cityId,
                CarId: CarId,
                PackageId: $(data).parent().parent().attr("data-packageid"),
                FromId: fromcode,
                RequestType: requesttype
            },
            dataType: 'jsonp',
            //cache: true,
            success: function (data) {
            }
        })
    },
    chooseCar: function() {
        carSelect.carSelect({
            onlyOnSale: true,
            showLevel: 2,
            showAllBrand: true,
            showSerialImg:true,
            hide: false
        }, function (result) {
            var serialid = result.brand.id;
            var url = window.location.href;
            if (url.lastIndexOf('#') > -1) {
                url = url.slice(0, url.lastIndexOf('#'));
            }
            if (url.match(/serialid=(.?)\d+/gi)) {
                url = url.replace(/serialid=(.?)\d+/gi, 'serialid=' + serialid);
            } else if (url.match(/\?/gi)) {
                url =  url + '&serialid=' + serialid;
            } else {
                url = url + '?serialid=' + serialid;
            }
            window.location.href = url;
        });
    },
    changeCar: function() {
        carThirdLevel.carThirdLevel({
            showSerialImg: false,
            onlyOnSale: true,
            showLevel: 3,
            showAllBrand: true,
            showSearch: true,
            hide: false,
            showSerialImg: true,
            type: ""
        }, {
            brand: {
                id: car.serialId,
                logo: car.masterBrandLogo,
                name: car.carSerialShowName,
                price: car.carPrice,
                spell: car.carSerialAllSpell,
                masterBrandId: car.masterBrandId,
                masterBrandName: car.masterBrandName
            }
        }, function (result) {
            var $carSelectThirdLevel = $('#carSelectThirdLevel');
            $carSelectThirdLevel.find('.carSelectThirdLevel-content').removeClass('drawAni2');
            $carSelectThirdLevel.find('.carSelectThirdLevel-close-btn').hide();
            setTimeout(function () {
                $carSelectThirdLevel.remove();
            }, 300);

            // 信息回显
            Index.carDealerPrice = parseFloat(result.carType.price);
            Index.carPrice = parseFloat(result.carType.price);
            //$(".index_info_img>img").attr("src", $li.find("a").data("img"));
            $(".index_info_tt>em").text(Index.carPrice + '万');
            $("#carSel").text(result.brand.name + ' ' + result.year + '款' + result.carType.name);
            $("#downPaymentPrice").text((Index.downPaymentRate * Index.carDealerPrice).toFixed(2));

            // 重新加载产品列表
            setTimeout(function() {
                Index.carId = result.carType.id;
                Index.pageIndex = 1;
                $("#list").html("");
                Index.getDealerQuote();
            }, 200);

            //更改url
            /* var url = window.location.href;
             var carId = result.carType.id;
             if (url.lastIndexOf('#') > -1) {
             url = url.slice(0, url.lastIndexOf('#'));
             }
             if (url.match(/carId=(.?)\d+/gi)) {
             url = url.replace(/carId=(.?)\d+/gi, 'carId=' + carId);
             } else if (url.match(/\?/gi)) {
             url =  url + '&carId=' + carId;
             } else {
             url = url + '?carId=' + carId;
             }
             var json = { time: new Date().getTime() };
             window.history.pushState(json, "", url); */
            history.back();
        });

        setTimeout(function() {
            $('#carSelectThirdLevel').css('height', document.documentElement.clientHeight);
            $('.carSelectThirdLevel-content .wrapper').css('height', document.documentElement.clientHeight - $('.carSelectThirdLevel-content .carSelectThirdLevel-header').height())
        }, 300);
    },
    changeCity: function() {
        citySelect.citySelect(city, function (result) {
            // 信息回显
            $("#citySel").removeClass('default').text(result.CityName);

            // 重新加载产品列表
            Index.cityId = result.CityId;
            Index.cityName = result.CityName;
            Index.pageIndex = 1;
            $("#list").html("");
            Index.getDealerQuote();

            //更改url
            /* var url = window.location.href;
             var cityId = result.CityId;
             if (url.lastIndexOf('#') > -1) {
             url = url.slice(0, url.lastIndexOf('#'));
             }
             if (url.match(/cityid=(.?)\d+/gi)) {
             url = url.replace(/cityid=(.?)\d+/gi, 'cityid=' + cityId);
             } else if (url.match(/\?/gi)) {
             url = url + '&cityid=' + cityId;
             } else {
             url = url + '?cityid=' + cityId;
             }
             var json = { time: new Date().getTime() };
             window.history.pushState(json,"",url); */
        });
    }
}

$(function() {
    Index.indexInit();
});
