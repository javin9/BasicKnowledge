import './chelun.scss'
import carThirdLevel from 'libs/carSelect/carThirdLevel.js';
import citySelect from 'libs/citySelect';
import selectControl from 'libs/selectControl';
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
/**********************************************/
var Qual = {
    Career: [
		{ ID: 73, Name: "公务员/事业单位" },
		{ ID: 74, Name: "企业主" },
		{ ID: 75, Name: "个体户" },
		{ ID: 76, Name: "上班族" },
		{ ID: 77, Name: "无固定职业" }
    ],
    MonthIncome: [
		{ ID: 66, Name: "3000元以下" },
		{ ID: 67, Name: "3000-5000元" },
		{ ID: 68, Name: "5000-8000元" },
		{ ID: 69, Name: "8000-12000元" },
		{ ID: 108, Name: "12000-20000元" },
		{ ID: 109, Name: "20000元以上" }
    ],
    IsHaveDrivingLicense: [
		{ ID: 1, Name: "有驾照（考取中）" },
		{ ID: 0, Name: "无驾照" }
    ],
    MaritalStatus: [
		{ ID: 216, Name: "未婚" },
		{ ID: 215, Name: "已婚" }
    ],
    Credit: [
		{ ID: 71, Name: "信用良好" },
		{ ID: 72, Name: "少数逾期" },
		{ ID: 70, Name: "长期多次逾期" },
		{ ID: 256, Name: "无信用记录" }
    ],
    Education: [
		{ ID: 175, Name: "硕士及以上" },
		{ ID: 174, Name: "本科" },
		{ ID: 173, Name: "大专" },
		{ ID: 172, Name: "高中或技校或职业学校" },
		{ ID: 171, Name: "初中及以下" }
    ],
    HouseState: [
		{ ID: 79, Name: "自有全款" },
		{ ID: 80, Name: "自有贷款" },
		{ ID: 81, Name: "租赁" }
    ],
    Insurance: [
		{ ID: 1, Name: "有本地社保" },
		{ ID: 0, Name: "无本地社保" }
    ],
    Funds: [
		{ ID: 1, Name: "有公积金" },
		{ ID: 0, Name: "无公积金" }
    ],
    qualInit: function () {
        HeaderInit({
            title: "详细资料",
            leftFn: function () {
                var qualLS = GetLS("qualLS");
                var certNumber = $("#CertificateNumber").val() || "";
                if (!check.isID(certNumber) && certNumber != "") {
                    qualLS.CertificateNumber = null;
                    SetLS("qualLS", qualLS);
                    return $(".alertCon").ShowAlert("身份证输入错误", 2000);
                }
                window.location.href = "index?" + window.location.href.split("?")[1];
            }
        }, getQueryString("header"));

        this.qualDataInit();
    },
    findName: function (arr, val) {
        if (arr instanceof Array) {
            var name;
            $.each(arr, function (i, obj) {
                if (obj.ID == val) {
                    name = obj.Name;
                }
            });
            return name;
        }
    },
    qualDataInit: function () {
        var self = this;
        var qualLS = GetLS("qualLS") || {};
        $("#CertificateNumber").val(qualLS.CertificateNumber || "");
        for (var key in qualLS) {
            $("#" + key + "Trigger .r_chose").text(Qual.findName(Qual[key], qualLS[key])).css("color", "#333");
        }

        /* $(".triggerEvt").each(function () {
            var triggerId = $(this).attr("id");
            var id = triggerId.split("Trigger")[0];
            var afterSelId = id + "AfterSel";

            new NewPop({
                type: "normal",
                triggerId: triggerId, 	//触发id
                afterSel: afterSelId,	//回填容器ID
                arr: Qual[id],
                subBack: function ($li, data) {
                    qualLS[id] = data.id;
                    SetLS("qualLS", qualLS);
                    $("#" + triggerId + " .r_chose").css("color", "#333");
                }
            });
        }); */

        $("#CertificateNumber").blur(function () {
            qualLS = GetLS("qualLS") || {};
            qualLS.CertificateNumber = $(this).val();
            SetLS("qualLS", qualLS);
        }).on("keyup",function(){
            var str =  $(this).val();
            if (str.length>18)
                $(this).val(str.substring(0,18));
        });

        $(".backBtn").on("click", function () {
            var qualLS = GetLS("qualLS");
            var certNumber = $("#CertificateNumber").val() || "";
            var url = "index?" + window.location.href.split("?")[1];
            if (!check.isID(certNumber) && certNumber != "") {
                qualLS.CertificateNumber = '';
                SetLS("qualLS", qualLS);
                return $(".alertCon").ShowAlert("身份证输入错误", 2000);
            } else {
                qualLS.CertificateNumber = certNumber;
                SetLS("qualLS", qualLS);
                if (url.match(/CertificateNumber=(.?)\d+/gi)) {
                    url = url.replace(/CertificateNumber=(.?)\d+/gi, 'CertificateNumber=' + certNumber);
                }
            }
            window.location.href = url;
        });

        // 创建selectControl
        $(".triggerEvt").each(function () {
            var triggerId = $(this).attr("id");     //触发id
            var id = triggerId.split("Trigger")[0]; // id
            var afterSelId = id + "AfterSel";       //回填容器id
            var optionsData = self[id];
            var i, max, className;

            // dom
            var html = '<aside class="sel-control-box" data-aslider="' + id.toLowerCase() + '">' +
                            '<div class="asilder_wrapper">' +
                                '<div class="sel-ctrl-fun-btn">' +
                                '<div class="sel-ctrl-close font-nav">取消</div>' +
                                '<div class="sel-ctrl-title font-nav"></div>' +
                                '<div class="sel-ctrl-complete font-nav">确定</div>' +
                            '</div>' +
                            '<div class="scroll">' +
                                '<ul class="slider">';
            // { ID: 79, Name: "自有全款" }
            for (i = 0, max = optionsData.length; i< max; i++) {
                className = i ? '' :  'cur';
                html += '<li class="' + className + '" data-id="' + optionsData[i].ID + '">' + optionsData[i].Name + '</li>';
            }
            html += '</ul></div></div></aside>';
            $('body').append(html);

            // bind
            $(this).attr('data-aslider-in', id.toLowerCase() + '|fade|bottom')

        });

        $(".triggerEvt").selectControl({
            CallBacks: function (data) {
                var triggerId = $(data.item).attr("id");     //触发id
                var id = triggerId.split("Trigger")[0]; // id
                qualLS[id] = data.id;
                SetLS("qualLS", qualLS);
                $(data.item).find('.r_chose').text(data.txt).css("color", "#333");
            }
        });
    }
}

$(function () {
    Qual.qualInit();
});
