/*
    表单效验
        给效验的模块根节点添加 Class checkApp
        所有input or textarea 添加属性 name，value对应后台模型Key
        选择项
            添加 Class checkChose进行非空验证
        输入项
            PASS_NULL对象添加输入非空验证
*/
var citySCode = "冀辽皖苏鄂晋吉粤宁京豫黑鲁浙桂蒙闽川渝津云湘新赣甘陕贵青藏琼沪";
var checkBloor = false;
var ID2STR = {
    Name: "姓名",
    ChineseName: "姓名",
    FourName: "姓名",
    UserName: "姓名",
    ApprovalUserName: "贷款人姓名",
    SpouseName: "配偶姓名",
    ImmediateName: "直系亲属姓名",

    Phone: "手机号",
    Telphone: "手机号",
    Telephone: "手机号",
    SpouseMobile: "配偶电话",
    ImmediateTelphone: "直系亲属电话",
    LinkmanTelphone: "联系人手机号",
    ApplyerTelphone: "手机号",

    UnitPhoneNumber: "公司座机",

    CertificateNumber: "证件号码",
    SpouseCertificateNumber: "配偶身份证号",
    IDCard: "身份证号",
    IDCard1: "身份证号",
    HukouID: "户口簿号",
    InvoiceTitle: "发票抬头",
    InvoiceNumber: "发票号",
    InvoiceDate: "发票日期",
    CarNumber: "车牌号",
    NewCarNumber: "车牌号",
    AllCarNumber: "车牌号",
    LicenseNumber: "车牌号",
    BJ_CarNumber: "车牌号",
    ValidateCode: "验证码",

    FamilyYearIncome: "家庭年收入",
    YearIncome: "年收入（税后）",
    RepaymentMoenyMonth: "当月还款总额",
    HouseLoanMonthPay: "房贷",
    CarLoanMonthPay: "车贷",
    MonthIncome: "月收入",
    DisposableMoenyMonth: "月可支配金额",
    REmail: "邮箱",
    Email: "邮箱",
    Mail: "邮箱",
    HouseholdRegisterAddress: "户籍详细地址",
    LivingDetailAddress: "现居住详细地址",
    UnitAddress: "公司详细地址",
    Address: "详细地址",
    UnitName: "公司名称",
    UnitDepartment: "部门",
    firstDate: "还款提醒日期",
    NRBrandModel: "品牌型号",//**不是必填的品牌型号
    BrandModel: "品牌型号",//**
    NREngineNo: "发动机号",//**不是必填的
    EngineNo: "发动机号",//**
    EngineNo1: "发动机号",//**
    NRFrameNum: "车架号",//**不是必填的车架号
    FrameNum: "车架号",//**
    FrameNum1: "车架号",//**
    FrameNo: "车架号",//阳光验证方式2-17位
    FrameNo1: "车架号",//阳光验证方式2-17位
    LoanCarName: "贷款机构",//**
    Jiashi: "驾驶证号",//**
    Junguan: "军官证号",//**
    Huzhao: "护照号",//**
    Taibao: "港澳回乡证或台胞证号",//**
    Password: "密码",
    InsuranceName: "姓名",
    ExchangeCode: "9位兑换码",
    NewCarFirstRegisterDate: "注册日期",
    FirstRegisterDate: "注册日期",
    NRFirstRegisterDate: "注册日期",//不是必填
    shyDate: "商业险起保日期",
    jqDate: "交强险起保日期",
    InsuredName: "被保人姓名",
    InvoiceNumber: "发票号",
    InvoiceDate: "发票日期",
    DateMonth: "到期日期",
    TransferDate: "过户日期",
    starDate: "保险起期",
    Datetime: "提醒日期",
    RemindDate: "提醒日期",//不必填验证
    StartDate: "起保日期",
    EndDate: "终保日期",
    CompanyName: "组织机构代码",
    CompanyName: "企业名称",
    OrganizeCode: '组织机构代码',
    carPrice: '车价',
    DrivingCity: '行驶证登记地区'
};
var PASS_NULL = {
    Email: true,
    Mail: true,
    Carema: true,
    NRFrameNum: true,
    NRBrandModel: true,
    NREngineNo: true,
    NRFirstRegisterDate: true
};
var invoiceNumberReg = new RegExp(/^(([0-9]){8})$/);
var Chinese = new RegExp(/^[\u4E00-\u9FA5]+$/);
var Chinese1 = new RegExp(/^([\u4E00-\u9FA5]|[*])+$/);
var chejiahao = new RegExp(/^([0-9]|[a-zA-Z]){10}([*]|[0-9]|[a-zA-Z]){4}([0-9]|[a-zA-Z]){3}$/);
var fadongjihao = new RegExp(/^([0-9]|[a-zA-Z]){2}([*]|[0-9]|[a-zA-Z])+([0-9]|[a-zA-Z]){1,2}$/);
var carPrice = new RegExp(/^[0-9]+.{1}[0-9]{1,2}|[0-9]+$/);
var numAndStr = new RegExp(/^([0-9]{1}|[a-zA-Z]{1})$/);
var numStrReg = new RegExp(/^(([0-9]|[a-zA-Z]){1,10})$/);
var phoneRexp = new RegExp(/^1[3|5|7|8][0-9]{9}$/);
var hukouRexp = new RegExp(/^[0-9]{11}$/);//户口簿
var landlineRexp = new RegExp(/^0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}$/);
var nameRexp = new RegExp("^([\\u4e00-\\u9fa5]{2,15}|(([a-zA-Z]\\s?){4,30})+)$");
var nameRexp2 = new RegExp("^((?!.*?运输|.*代理|.*物流|.*货运代理|.*货运运输).*)$");
var fournameRexp = new RegExp("^([\\u4e00-\\u9fa5]{2,4})$");
var chineseNameRexp = new RegExp("^([\\u4e00-\\u9fa5]{2,15})$");
var retMail = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
var username2 = /^([\\u4e00-\\u9fa5]{2,15}|([a-zA-Z]{4,30}\\s?)+)$/;
var PassPort = new RegExp(/^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/);
var carNumberRexp = new RegExp(/^[\u4e00-\u9fa5]{1}[a-z_A-Z]{1}[0-9_a-z_A-Z]{5,6}$/);
var AllCarNumberRexp = new RegExp(/^([\u4e00-\u9fa5]{1}[a-z_A-Z]{1}[0-9_a-z_A-Z]{5,6}|[\u4e00-\u9fa5]{1}[*]{1}|[\u4e00-\u9fa5]{1}[A-Z]{1}[*]{1})$/);
var BJcarNumberRexp = new RegExp(/^京{1}[a-z_A-Z]{1}[0-9_a-z_A-Z]{5,6}$/);//北京
var newCarNumberRexp = new RegExp(/^[\u4e00-\u9fa5]{1}|([\u4e00-\u9fa5]{1}[A-Z]{1})[*]{1}$/);//新车
var LicenseNumberRexp = new RegExp(/^[\u4e00-\u9fa5]{1}[a-z_A-Z]{1}[0-9_a-z_A-Z]{5,6}$/);
var idcardReg = new RegExp("^(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X)$");  //身份证
var jiashiReg = new RegExp("^(\\d{15})$");//驾驶证
var junguanReg = new RegExp("^政字第(\\d{8})号$");//军官证
var huzhaoReg = new RegExp("^(P\\d{7}|G\\d{8}|S\\d{7,8}|D\\d+|1[4,5]\\d{7})$");//护照
var taibaoReg = new RegExp("^[a-zA-Z]([0-9]{9})$"); //台胞证
var passwordReg = new RegExp(/^(([0-9]|[a-zA-Z]){6,10})$/);
var exchangeCodeReg = new RegExp(/^(([0-9]|[a-zA-Z]){9})$/);
var exchangeCodeKeyupReg = new RegExp(/^(([0-9]|[a-zA-Z]){1,9})$/);
var organizeReg = new RegExp(/^[a-zA-Z\d]{8}\-[a-zA-Z\d]$/);
var companyName = /^([\\u4e00-\\u9fa5]{30})$/;
$(function () {
    $("#GetValidateCodeBtn").click(function () {
        if ($(this).hasClass("disable"))
            return;
        if (PhoneCheck($("#Telphone"))) {
            $ajax({
                url: "/user/GetMobileValidateCode",
                data: { mobile: $("#Telphone").val() }
            });
            var n = 119;
            $("#GetValidateCodeBtn").addClass("disable").text(n + "秒后获取");
            var tmo = setInterval(function () {
                if (--n == 0) {
                    clearInterval(tmo);
                    $("#GetValidateCodeBtn").removeClass("disable").text("获取校验码");
                    return;
                }
                $("#GetValidateCodeBtn").text(n + "秒后获取");
            }, 1000);
        }
    });
    $(".checkApp a").click(function () {
        $(this).find("input[type!='hidden']").focus();
    });
    $(".checkApp input,textarea").on("keyup", function () {
        var $li = $(this).parents('li');
        if ($li.css("display") == "none")
            return;
        var name = $(this).attr("name");
        var val = TrimAll($(this).val());
        var type = $(this).attr("type");
        if (type == "hidden" || type == "checkbox" || $(this).hasClass("hide"))
            return;
        var str = "";
        if ((name == "SpouseMobile" || name == "Phone" || name == "Telphone" || name == "Telephone" || name == "ImmediateTelphone" || name == "LinkmanTelphone" || name == "ApplyerTelphone") &&
            !val.match(phoneRexp)) {
            var arr = val.split('');
            for (var i = 0; i < arr.length; i++) {
                if (isNaN(arr[i])) {
                    str = "请输入正确的11位手机号码";
                }
                if (i == 1 && arr[i] != 3 && arr[i] != 5 && arr[i] != 7 && arr[i] != 8) {
                    str = "请输入正确的11位手机号码";
                }
            }
        } else if (
            (name == "UnitPhoneNumber") &&
            !val.match(landlineRexp)
        ) {
            str = "请输入正确的座机号码（xxx-xxxxxxxx）";
        }
        else if (
            (name == "UserName" || name == "SpouseName" || name == "ImmediateName" || name == "ApprovalUserName") &&
            !val.match(nameRexp)
        ) {
            str = "姓名为2-15个中文字符（英文4-30）";
        } else if (
            (name == "CarNumber")) {
            if (val.length >= 7 && !val.match(carNumberRexp)) {
                str = "请输入正确的车牌号";
            } else if (citySCode.indexOf(val.substr(0, 1)) == -1)
                str = "请输入正确的车牌号";
        }
        else if (name == "Name" && val != "") {
            val = val.trim();//去掉两端的空格
            if (!val.match(nameRexp)) {
                var arr = val.split('');
                for (var i = 0; i < arr.length; i++) {
                    if (!isNaN(arr[i])) {
                        str = "姓名为2-15个中文字符（英文4-30）";
                    }
                }
            }
        }
        else if (name == "InsuranceName" && (!val.match(nameRexp) || !val.match(nameRexp2)) && val != "") {
            var arr = val.split('');
            for (var i = 0; i < arr.length; i++) {
                if (!isNaN(arr[i])) {
                    str = "姓名为2-15个中文字符（英文4-30）";
                }
            }
            if (!val.match(nameRexp2)) {
                str = "仅支持9座及以下私家车投保";
            }
        }
        else if (name == "FourName" && val != "") {
            val = val.trim();//去掉两端的空格
            if (!val.match(fournameRexp)) {
                var arr = val.split('');
                for (var i = 0; i < arr.length; i++) {
                    if (!isNaN(arr[i])) {
                        str = "姓名为2-4个中文字符";
                    }
                }
            }
        } else if (name == "ChineseName" && val != "") {
            val = val.trim();//去掉两端的空格
            if (!val.match(chineseNameRexp)) {
                str = "姓名为2-15个中文字符";
            }
        }
        else if (name == "HukouID" && !val.match(hukouRexp) && val != "") {
            str = "请输入正确的户口簿号";
        }
        else if (
            (name == "Email" || name == "Mail" || name == "REmail") && !retMail.test(val) && val != "") {
            str = "请输入正确的邮箱";
        } else if (name == "CertificateNumber" || name == "SpouseCertificateNumber") {
            var CertificateType = $("input[name='CertificateType']").val();
            if (CertificateType == '') {

            }
            if (CertificateType == "105" && !IdCardValidate(val)) {
                str = "请输入正确的证件号码";
            } else if (CertificateType == "106" && !val.match(PassPort)) {
                str = "请输入正确的证件号码";
            }
        } else if ((name == "YearIncome" || name == "FamilyYearIncome" || name == "RepaymentMoenyMonth" || name == "MonthIncome" || name == "HouseLoanMonthPay" || name == "CarLoanMonthPay" || name == "DisposableMoenyMonth")) {
            if (isNaN(Number(val)))
                str = "请输入数字";
            else if (Number(val) < 1)
                str = "请输入有效数字";
            else if ((Number(val) + "").length >= 10)
                str = ID2STR[name] + "最多10位数字";
        }
        else if (val != "" && (name == "FrameNum" || name == "NRFrameNum")) {//车架17
            val = val.replace(/\s/g, "");
            val = val.toUpperCase();
            //判断是否包含汉字 并不可含I、O、Q中的任意一个字母
            var arr = val.split('');
            for (var i = 0; i < arr.length; i++) {
                if (Chinese.test(arr[i]) || !arr[i].match(numAndStr)) {
                    str = "您输入的车架号格式错误，请录入英文字符";
                    break;
                }
                //不可含I、O、Q中的任意一个字母
                if (arr[i] == "I" || arr[i] == "O" || arr[i] == "Q") {
                    str = "车架号不可含I、O、Q中的任意一个字母";
                    break;
                }
            }
        }
        else if (name == "FrameNum1") {//车架17
            val = val.replace(/\s/g, "");
            val = val.toUpperCase();
            //判断是否包含汉字 并不可含I、O、Q中的任意一个字母
            var arr = val.split('');
            if (chejiahao.test(val)) {
                for (var i = 0; i < arr.length; i++) {
                    //不可含I、O、Q中的任意一个字母
                    if (arr[i] == "I" || arr[i] == "O" || arr[i] == "Q") {
                        str = "车架号不可含I、O、Q中的任意一个字母";
                        break;
                    }
                }
            } else {
                str = "您输入的车架号格式错误，请录入英文字符或数字";
            }
        }
        else if (name == "FrameNo") {//阳光车架2-17
            val = val.replace(/\s/g, "");
            val = val.toUpperCase();
            //判断是否包含汉字 并不可含I、O、Q中的任意一个字母
            var arr = val.split('');
            for (var i = 0; i < arr.length; i++) {
                if (Chinese.test(arr[i]) || !arr[i].match(numAndStr)) {
                    str = "您输入的车架号格式错误，请录入英文字符或数字";
                    break;
                }
                //不可含I、O、Q中的任意一个字母
                if (arr[i] == "I" || arr[i] == "O" || arr[i] == "Q") {
                    str = "车架号不可含I、O、Q中的任意一个字母";
                    break;
                }
            }
        }
        else if (val != "" && (name == "EngineNo" || name == "NREngineNo")) {//发动机4-16
            val = val.replace(/\s/g, "");
            //判断是否包含汉字
            var arr = val.split('');
            for (var i = 0; i < arr.length; i++) {
                if (Chinese.test(arr[i]) || (!arr[i].match(numAndStr) && arr[i] != '-')) {
                    str = "您输入的发动机号格式错误，请录入英文字符";
                    break;
                }
            }
        }
        else if (name == "EngineNo1") {//发动机4-16
            val = val.replace(/\s/g, "");
            //判断是否包含汉字
            var arr = val.split('');
            if (fadongjihao.test(val)) {
            } else {
                str = "您输入的发动机号格式错误，请录入英文字符";
            }
        }
            //else if (name == "IDCard" && !val.match(idcardReg) && val != "") {//身份证号
        else if (name == "IDCard" && val != "") {//身份证号
            var res = isCardID(val);
            if (res != true) {
                str = "您输入的身份证号长度或格式错误";
            }
        } else if (name == "IDCard1" && val != "") {//身份证号
            var res = isCardID1(val);
            if (res != true) {
                str = "您输入的身份证号长度或格式错误";
            }
        }
        else if (name == "Jiashi" && !val.match(jiashiReg) && val != "") {//驾驶证
            str = "您输入的驾驶证号长度或格式错误";
        }
        else if (name == "Junguan" && !val.match(junguanReg) && val != "") {//军官
            str = "您输入的军官证号长度或格式错误";
        }
        else if (name == "Huzhao" && !val.match(huzhaoReg) && val != "") {//护照
            str = "您输入的护照号长度或格式错误";
        }
        else if (name == "Taibao" && !val.match(taibaoReg) && val != "") {//台胞
            str = "您输入的台胞证号长度或格式错误";
        }
        else if (name == "Password" && val != "" && !val.match(numStrReg)) {//密码
            str = "请输入包含6-10位数字、字母的密码";
        } else if (name == "ExchangeCode" && val != "" && !val.match(exchangeCodeKeyupReg)) {//兑换码
            str = "请输入9位包含数字、字母的兑换码";
        } else if (name == "carPrice" && val != "" && !val.match(carPrice)) {//兑换码
            var arr = val.split('');
            for (var i = 0; i < arr.length; i++) {
                if (isNaN(arr[i])) {
                    str = "请输入车价";
                }
                if (i == 0 && arr[i] == ".") {
                    str = "请输入正确的车价";
                }
            }
        }
        $(".xqtis").hide().addClass("hide");
        // if (str != "")
        //     $li.next(".xqtis").text(str).show().removeClass("hide");
        // else
        //     $li.next('.xqtis').hide();
    });
    $(".checkApp input,textarea").on("blur", function () {
        checkInputVal($(this), true, 'blur');
    });
});
function PhoneCheck($dom) {
    var val = $dom.val();
    var $li = $dom.parents('li');
    if (!val.match(phoneRexp)) {
        $li.next(".xqtis").text("请输入正确的11位手机号").show().removeClass("hide");
        return false;
    }
    return true;
}
function SubmitCheck1($checkApp) {
    if (!$checkApp)
        $checkApp = $(".checkApp");
    var flag = false;
    isSubmitCheck = true;
    $checkApp.find("select").change();
    $checkApp.find("input,textarea").blur();
    $checkApp.find(".tag").each(function () {
        if (!($(this).css("display") == "none")) {
            flag = true;
            return;
        }
    });
    return !flag;
}
function SubmitCheck(checkType) {
    var flag = false;
    var len = $(".checkApp input,textarea").length;
    if (checkType) {
        $(".checkApp input,textarea").each(function () {
            var isTrue = checkInputVal($(this), true);
            if (!isTrue) {
                flag = true;
                return false;
            }
        });
    } else {
        $(".checkApp input,textarea").each(function () {
            if ($(this).is(':visible')) {
                var $li = $(this).parents('li');
                var isTrue = checkInputVal($(this), false);
                if (!isTrue) {
                    flag = true;
                    $li.next('.xqtis').show().removeClass("hide");
                    $li.next('.xqtis').siblings('.xqtis').hide();
                    return !flag;
                    return false;
                }
            }
        });
    }
    $(".checkApp .checkChose").each(function () {
        var $li = $(this).parents('li');
        if (!$(this).hasClass("active") && $li.css("display") != "none") {
            flag = true;
            $li.next('.xqtis').show().removeClass("hide");
            $li.next('.xqtis').siblings('.xqtis').hide();
            $li.parent('ul').siblings('ul').find('.xqtis').hide();
            return;
        }
    });
    $(".xqtis").each(function () {
        if ($(this).parent("ul").css("display") != "none" && $(this).css("display") != "none") {
            flag = true;
            return;
        }
    });
    if (flag) {
        var firstXqtis = $(".xqtis:visible").first();
        $(".xqtis:visible").hide();
        firstXqtis.show();
    }
    return !flag;
}
function checkInputVal(dom, showError, eventType) {
    var $this = dom;
    var $li = $this.parents('li');
    if ($li.css("display") == "none" || $li.attr("display") == "none" || $this.attr("type") == 'file')
        return true;
    var name = $this.attr("name");
    var val = $this.val();
    var type = $this.attr("type");
    if (type == "hidden" || type == "checkbox" || $this.hasClass("hide") || type == 'file')
        return;
    var str = "";
    if (name == "Email" || name == "Mail") {
        $this.val(val);
    }
    if ($this.val() == "" && !PASS_NULL[name]) {
        if (name == "NewCarFirstRegisterDate" || name == "InvoiceDate" || name == "TransferDate" || name == "shyDate" || name == "jqDate")
            str = "请选择" + ID2STR[name];
        else if ($li.hasClass("checkChose"))
            str = "请选择" + ID2STR[name];
        else
            str = "请输入" + ID2STR[name];
    } else if (name == "FirstRegisterDate" || name == "NRFirstRegisterDate") {
        if ($this.val() == "") {
            if (name != "NRFirstRegisterDate")
                str = "请选择" + ID2STR[name];
        } else {
            var NowDate = new Date().getTime();//发证日期
            var FirstRegisterDate = new Date(val).getTime(); //注册日期
            var result = (NowDate - FirstRegisterDate) / (24 * 60 * 60 * 1000);
            var isDate = new Date(val);
            isDate == 'Invalid Date' ? str = '请选择正确的日期' : '';
            result < 0 ? str = '注册日期不能大于今天' : '';
        }
    } else if ((name == "SpouseMobile" || name == "Phone" || name == "Telphone" || name == "Telephone" || name == "ImmediateTelphone" || name == "LinkmanTelphone" || name == "ApplyerTelphone") &&
        !val.match(phoneRexp)) {
        str = "请输入正确的11位手机号";
    } else if ((name == "UnitPhoneNumber") && !val.match(landlineRexp)) {
        str = "请输入正确的座机号码（xxx-xxxxxxxx）";
    } else if ((name == "InvoiceNumber") && !val.match(invoiceNumberReg)) {
        str = "请输入8位数字发票号";
    } else if ((name == "UserName" || name == "SpouseName" || name == "ImmediateName" || name == "ApprovalUserName") && !val.match(nameRexp)) {
        str = "姓名为2-15个中文字符（英文4-30）";
    } else if (name == "CarNumber") {
        if (!val.match(carNumberRexp)) {
            str = "请输入正确的车牌号";
        } else if (citySCode.indexOf(val.substr(0, 1)) == -1)
            str = "请输入正确的车牌号";
    } else if (name == "NewCarNumber") {
        if (!val.match(newCarNumberRexp)) {
            str = "请输入正确的车牌号";
        }
    } else if (name == "AllCarNumber") {
        if (!val.match(AllCarNumberRexp)) {
            str = "请输入正确的车牌号";
        }
    } else if (name == "BJ_CarNumber") {
        if (!val.match(carNumberRexp)) {
            str = "请输入正确的车牌号";
        } else if (!val.match(BJcarNumberRexp)) {
            str = "仅限北京车牌";
        }
    } else if (name == "LicenseNumber") {
        if (!val.match(LicenseNumberRexp)) {
            str = "请输入正确的车牌号";
        } else if (citySCode.indexOf(val.substr(0, 1)) == -1)
            str = "请输入正确的车牌号";
    } else if (name == "FourName" && val != "") {
        val = val.trim();//去掉两端的空格再验证
        if (!val.match(fournameRexp))
            str = "姓名为2-4个中文字符";
    } else if (name == "ChineseName" && val != "") {
        val = val.trim();//去掉两端的空格再验证
        if (!val.match(chineseNameRexp))
            str = "姓名为2-15个中文字符";
    }
    else if (name == "Name" && val != "") {
        val = val.trim();//去掉两端的空格再验证
        if (!val.match(nameRexp))
            str = "姓名为2-15个中文字符（英文4-30）";
    } else if (name == "InsuranceName" && (!val.match(nameRexp) || !val.match(nameRexp2)) && val != "") {
        str = "姓名为2-15个中文字符（英文4-30）";
        if (!val.match(nameRexp2)) {
            str = "仅支持9座及以下私家车投保";
        }
    } else if (name == "HukouID" && !val.match(hukouRexp) && val != "") {
        str = "请输入正确的户口簿号";
    }
    else if ((name == "Email" || name == "Mail" || name == "REmail") && !retMail.test(val) && val != "") {
        str = "请输入正确的邮箱";
    } else if (name == "CertificateNumber" || name == "SpouseCertificateNumber") {
        var CertificateType = $("input[name='CertificateType']").val();
        if (CertificateType == '') {

        }
        if (CertificateType == "105" && !IdCardValidate(val)) {
            str = "请输入正确的证件号码";
        } else if (CertificateType == "106" && !val.match(PassPort)) {
            str = "请输入正确的证件号码";
        }
    } else if ((name == "YearIncome" || name == "FamilyYearIncome" || name == "RepaymentMoenyMonth" || name == "MonthIncome" || name == "HouseLoanMonthPay" || name == "CarLoanMonthPay" || name == "DisposableMoenyMonth")) {
        if (isNaN(Number(val)))
            str = "请输入数字";
        else if (Number(val) < 1)
            str = "请输入有效数字";
        else if ((Number(val) + "").length >= 10)
            str = ID2STR[name] + "最多10位数字";
    } else if (val != "" && (name == "FrameNum" || name == "NRFrameNum")) {//车架17
        val = val.replace(/\s/g, "");
        val = val.toUpperCase();
        if (val.length != 17) {
            str = "您输入的车架号长度错误，请录入17位";
        }
        //判断是否包含汉字 并不可含I、O、Q中的任意一个字母
        var arr = val.split('');
        for (var i = 0; i < arr.length; i++) {
            if (Chinese.test(arr[i]) || !arr[i].match(numAndStr)) {
                str = "您输入的车架号格式错误，请录入英文字符或数字";
                break;
            }
            //不可含I、O、Q中的任意一个字母
            if (arr[i] == "I" || arr[i] == "O" || arr[i] == "Q") {
                str = "车架号不可含I、O、Q中的任意一个字母";
                break;
            }
        }
    }
    else if (name == "FrameNum1") {//车架17
        val = val.replace(/\s/g, "");
        val = val.toUpperCase();
        if (val.length != 17) {
            str = "您输入的车架号长度错误，请录入17位";
        }
        //判断是否包含汉字 并不可含I、O、Q中的任意一个字母
        var arr = val.split('');
        if (chejiahao.test(val)) {
            for (var i = 0; i < arr.length; i++) {
                //不可含I、O、Q中的任意一个字母
                if (arr[i] == "I" || arr[i] == "O" || arr[i] == "Q") {
                    str = "车架号不可含I、O、Q中的任意一个字母";
                    break;
                }
            }
        } else {
            str = "您输入的车架号格式错误，请录入英文字符或数字";
        }
    } else if (name == "FrameNo") {//阳光车架2-17
        val = val.replace(/\s/g, "");
        val = val.toUpperCase();
        if (val.length < 2 || val.length > 17) {
            str = "您输入的车架号长度错误，长度为2-17位";
        }
        //判断是否包含汉字 并不可含I、O、Q中的任意一个字母
        var arr = val.split('');
        for (var i = 0; i < arr.length; i++) {
            if (Chinese.test(arr[i]) || !arr[i].match(numAndStr)) {
                str = "您输入的车架号格式错误，请录入英文字符或数字";
                break;
            }
            //不可含I、O、Q中的任意一个字母
            if (arr[i] == "I" || arr[i] == "O" || arr[i] == "Q") {
                str = "车架号不可含I、O、Q中的任意一个字母";
                break;
            }
        }
    }
    else if (val != "" && (name == "EngineNo" || name == "NREngineNo")) {//发动机4-16
        val = val.replace(/\s/g, "");
        if (val.length < 4 || val.length > 16)
            str = "您输入的发动机号长度错误，长度为4-16位";
        //判断是否包含汉字
        var arr = val.split('');
        for (var i = 0; i < arr.length; i++) {
            if (Chinese.test(arr[i]) || (!arr[i].match(numAndStr) && arr[i] != '-')) {
                str = "您输入的发动机号格式错误，请录入英文字符";
                break;
            }
        }
    }
    else if (name == "EngineNo1") {//发动机4-16
        val = val.replace(/\s/g, "");
        if (val.length < 4 || val.length > 16)
            str = "您输入的发动机号长度错误，长度为4-16位";
        //判断是否包含汉字
        var arr = val.split('');
        if (fadongjihao.test(val)) {
        } else {
            str = "您输入的发动机号格式错误，请录入英文字符";
        }
    } else if (name == "IDCard" && val != "") {//身份证号
        var res = isCardID(val);
        if (res != true) {
            str = "您输入的身份证号长度或格式错误";
        }
    }
    else if (name == "IDCard1" && val != "") {//身份证号
        var res = isCardID1(val);
        if (res != true) {
            str = "您输入的身份证号长度或格式错误";
        }
    } else if (name == "Jiashi" && !val.match(jiashiReg) && val != "") {//驾驶证
        str = "您输入的驾驶证号长度或格式错误";
    } else if (name == "Junguan" && !val.match(junguanReg) && val != "") {//军官
        str = "您输入的军官证号长度或格式错误";
    } else if (name == "Huzhao" && !val.match(huzhaoReg) && val != "") {//护照
        str = "您输入的护照号长度或格式错误";
    } else if (name == "Taibao" && !val.match(taibaoReg) && val != "") {//台胞
        str = "您输入的台胞证号长度或格式错误";
    } else if (name == "Password" && val != "" && !val.match(passwordReg)) {//密码
        str = "请输入包含6-10位数字、字母的密码";
    } else if (name == "carPrice" && val != "" && !val.match(carPrice)) {//兑换码
        str = "请输入车价";
    }
    if (showError && eventType == 'keyup') {
        if (str != "")
            $li.next(".xqtis").text(str).show().removeClass("hide");
        else
            $li.next('.xqtis').hide();
    } else if (showError && eventType != 'keyup') {
        if (str != "") {
            $li.next(".xqtis").text(str).show().removeClass("hide");
            $li.next(".xqtis").siblings(".xqtis").addClass("hide").hide();
            $li.parents('ul').siblings('.xqtis').find(".xqtis").addClass("hide").hide();
            checkBloor = false;
        } else {
            $li.next('.xqtis').hide();
            checkBloor = true;
        }
    } else {
        if (str != "") {
            $li.next(".xqtis").text(str);
            checkBloor = false;
        } else {
            checkBloor = true;
        }
    }
    return checkBloor;
}
var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
function IdCardValidate(idCard) {
    idCard = TrimAll(idCard); //去掉字符串头尾空格
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
//身份证号码验证
var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
function isCardID(sId) {
    var iSum = 0;
    var info = "";
    if (!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
    var sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null) return "你的身份证地区非法";
    var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    var d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    if (iSum % 11 != 1) return "你输入的身份证号非法";
    return true;
}
function isCardID1(sId) {
    var iSum = 0;
    var info = "";
    if (!/^\d{10}([*]{4}|[0-9]{4})([0-9]{3}(\d|x))$/i.test(sId)) return "你输入的身份证长度或格式错误";
    var sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null) return "你的身份证地区非法";
    if (sId.indexOf("*") == -1) {
        var  sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
        var d = new Date(sBirthday.replace(/-/g, "/"));
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
        for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
        if (iSum % 11 != 1) return "你输入的身份证号非法";
    } else { }
    return true;
}
function ValidCheck() {
    var flag = false;
    $(".xqtis").each(function () {
        if (!($(this).css("display") == "none") && !($(this).css("display") == "list-item")) {
            flag = true;
            return;
        }
    });
    return !flag;
}


var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
function IdCardValidate(idCard) {
    idCard = TrimAll(idCard); //去掉字符串头尾空格
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
function TrimAll(str) {
    var value = str.replace(/\s/gi, "");
    return value;
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
function KeyUpCheck(name) {
    if (name == "") {

    }
}
// 验证带*号或者不带*号的身份证号
function checkIdCard(val){
    if(val.indexOf('*')>=0 ){
        return isCardID1(val);
    }else{
        return isCardID(val);
    }
}
window.checkIdCard = checkIdCard;
window.SubmitCheck = SubmitCheck;
window.SubmitCheck1 = SubmitCheck1;
window.checkInputVal = checkInputVal;
window.isCardID1 = isCardID1;
window.isCardID = isCardID;