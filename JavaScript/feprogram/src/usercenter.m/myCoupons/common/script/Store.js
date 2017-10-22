'use strict';


//引用变量
import app from './app';
module.exports = {
    ershoucheAPI: '',
    xincheAPI: '',
    userAPI: '',
    /**
    * 获取卡卷列表
    * @param 参数:stateid，validateCode
    * @return Promise
    */
    GetMyCouponCard: function (params) {
        var _this = this;
        return new Promise((resolve, reject) => {
           app.ajax({
                url: _this.userAPI + '/CouponCard/GetMyCouponCard',
                type: 'POST',
                data: params,
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
            //resolve({"Result":true,"Message":"获取已激活的卡券成功","Data":[{"UserReceiveId":1195,"CouponCardId":84,"CardTitle":"C2券卡券标题","CardDescription":"C2券卡券描述","CardInfoType":1065,"CardInfoName":"免息","CardInfoNameDes":null,"CardInfoValue":"0","CardNo":"**** **** **** ****","CardPassWord":"**** ****","ExpiryDate":"\/Date(1493274511637)\/","ExpiryDateText":"2017-04-27","StateId":1013,"ObtainChannel":1002,"ActivateChannel":1001,"ActivateChannelName":"还款","CouponCardNo":"6441C9A566E54FFF"}],"RowCount":1})
      })
      
    },
    /**
  * ReceiveCouponCard 
  * @param 参数:mobile， sign(此参数会写道js变量)
  * @return Promise
  */
    ReceiveCouponCard: function (params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: window.ReceiveCouponCardAPiUrl || (_this.userAPI + '/CouponCard/ReceiveCouponCard'),
                type: 'POST',
                data: params,
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });

        })
    },
    /**
    *获取手机验证码 
    *@param     seconds     倒计时时间，单位秒
    *           tel_id      手机号input输入框ID 字符串
    *           gvc_id      验证码触发容器ID 字符串
    *           line        业务线
    *           url         接口路径 
    *           successFunc 成功的回调函数 
    * @return Promise
    */
    getCode: function (data, successFunc) {
        var _this = this;
        var defaultData = {
            seconds: 60,
            tel_id: 'mobile',
            gvc_id: 'GetValidateCode',
            line: '550',
            url: CODE_GETTING_URL
        }
        var Tdata = $.extend(defaultData, data);

        if (Tdata.seconds <= 0) {
            alert(倒计时时间不能小于0);
            return false;
        };
        if ($("#" + Tdata.gvc_id).hasClass("disable")) {
            return false;
        };

        var telNum = $("#" + Tdata.tel_id).val().replace(/ /g, "");
        if (_this.IsPhoneNumber(telNum)) {
            tools.$ajax({
                url: Tdata.url,
                data: { codelen:4, mobile: telNum, line: Tdata.line, __RequestVerificationToken: Tdata.__RequestVerificationToken },
                success: function (res) {
                    successFunc(res);
                }
            });
            $("#" + Tdata.gvc_id).addClass("disable").text(Tdata.seconds + "秒后获取");
            window.tmo = setInterval(function () {
                if (--Tdata.seconds == 0) {
                    clearInterval(tmo);
                    $("#" + Tdata.gvc_id).removeClass("disable").text("获取验证码");
                    return;
                }
                $("#" + Tdata.gvc_id).text(Tdata.seconds + "秒后获取");
            }, 1000);
            return true;
        } else {
            Tools.showAlert('手机号格式不正确');
            return false;
        }
    },
    /**
    *验证手机验证码 
    *@param     number      验证码
    *           tel_id      手机号input输入框ID 字符串 
    *           line        业务线
    *           url         接口路径 
    *           successFunc 成功的回调函数      
    * @return Promise
    */
    checkCode: function (data, successFunc) {
        var defaultData = {
            number: '',
            tel_id: 'mobile',
            gvc_id: 'GetValidateCode',
            line: '550',
            url: CODE_VALIDATING_URL
        }
        var Tdata = $.extend(defaultData, data);

        if (Tdata.number == "") {
            return ""
        }
        // if (Check.getCode()) {
        var flag = null;
        tools.$ajax({
            url: Tdata.url,
            data: { mobile: $("#" + Tdata.tel_id).val().replace(/ /g, ""), validatecode: Tdata.number, line: Tdata.line, __RequestVerificationToken: Tdata.__RequestVerificationToken },
            success: successFunc,
            error: function (req, status, text) {
                alert(status);//req.responseText;
            }
        });
        // };
    }, IsPhoneNumber: function (number) {
        var phoneRexp = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
        if (number == "") {
            return "";
        } else {
            return phoneRexp.test(number);
        }
    },
    /**
  *  添加卡券 
  * @param 参数:card号 
  * @return Promise
  */
    add_card: function (params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.userAPI + '/CouponCard/ExchangeCard',
                type: 'POST',
                data: params,
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });

        })
    },
    /**
      *  领取卡券 
      * @param 参数:couponCardId 
      * @return Promise
      */
    receive: function (params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: receiveUrl,
                type: 'POST',
                data: params,
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
    },

}

