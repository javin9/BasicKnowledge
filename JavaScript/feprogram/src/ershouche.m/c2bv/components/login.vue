<template>
    <div class="fourinfo" v-if:showhide="fourinfo">
        <form action="#">
            <div class="inputwrap">
                <i class="tel"></i>
                <span class="tit">手机号</span>
                <div class="input">
                    <input type="tel" maxlength="11" placeholder="请输入您的手机号" name="mobileNumber" v-model="mobileNumber" @input="checkMobileNumber"
                           @blur="checkMobileNumber" @keydown.space.prevent pattern="[0-9]*"/>
                    <!--<div class="error"></div>-->
                    <div class="empty-btn" v-show="mobileNumber" @touchend="emptyInput('mobileNumber', $event)" ><span></span></div>
                </div>
            </div>
            <div class="inputwrap validate-code-wrap">
                <i class="code"></i>
                <span class="tit">验证码</span>
                <div class="input">
                    <input type="tel" maxlength="6" placeholder="请输入验证码" name="mobileValidateCode" v-model="mobileValidateCode" @input="checkValidateCode"
                           @blur="checkValidateCode" pattern="[0-9]*" @keydown.space.prevent/>
                    <span class="get-validate-code" :class="{disabled: getValidateCodeDisabled || !mobileNumberRight}" @click="getValidateCode" v-text="getValidateCodeText"></span>

                    <div class="empty-btn" v-show="mobileValidateCode" @touchend="emptyInput('mobileValidateCode', $event)"><span></span></div>
                </div>
            </div>
            <div class="error"></div>
            <div class="btn-wrap">
                <span class="submit-btn" v-bind:class="{disabled: submitBtnDisabled}" @click="submitOrder">开始评估</span>
            </div>
        </form>
    </div>
</template>

<script>
  import check from 'libs/check/m.js';
  export default{
        name: 'login',
        props: ['sodata','easing','login','professional', 'monthlyincome','social','credit','house','carprice','downpayment'],
        data(){
            return {
                // 提交订单弹层
                carLayerVisible: false,
                mobileNumber:tools.getCookie('mobile')||'',
                mobileValidateCode: '',
                mobileNumberRight: false,
                getValidateCodeDisabled: false,
                getValidateCodeText: '获取验证码',
                getValidateCodeGap: 60,
                intervalValidateCode: null,
                submitBtnDisabled: false,
            }

        },
        components:{
           /* list:list,*/
        },
        questions:[],
        ready(){
            let _self=this
            //验证手机号是否是登陆用户 tools.showAlert('努力评估中',10000);
            //console.log('mobli:',this.mobileNumber,'getCookie:',tools.getCookie('mobile'),'dmts252:',tools.getCookie('dmts252'),'setCookie:',tools.setCookie('hasVisit','false'))
            if (check.isPhoneNumber(this.mobileNumber)) {
                this.mobileNumberRight = true;
            } else {
                this.mobileNumberRight = false;
            }
            $('.num_box .num').addClass('init')


        },
        methods:{
            // 验证手机号
            checkMobileNumber: function(event) {
                var elem = event.target,
                        val = this.mobileNumber,
                        checkpass = true;

                switch (event.type) {
                    case 'input':
                        // 录入到达11位后，验证手机号是否正确
                        if (val.length >= 11 && !check.isPhoneNumber(val)) {
                            this.showError(elem, '请输入正确手机号');
                            checkpass = false;
                        }
                        if (check.isPhoneNumber(val)) {
                            this.mobileNumberRight = true;
                        } else {
                            this.mobileNumberRight = false;
                        }
                        break;
                    case 'blur':
                        // 非空时验证
                        if (val.length > 0 && !check.isPhoneNumber(val)) {
                            this.showError(elem, '请输入正确手机号');
                            checkpass = false;
                        }
                        break;
                    case 'submit':
                        // 完整验证
                        if (!check.isPhoneNumber(val)) {
                            this.showError(elem, '请输入正确手机号');
                            checkpass = false;
                        }
                        break;
                    default:
                        break;
                }

                if (checkpass) {
                    this.removeError(elem);
                    return true;
                } else {
                    return false;
                }
            },

            // 验证验证码
            checkValidateCode: function(event) {
                var elem = event.target,
                        val = this.mobileValidateCode,
                        checkpass = true;

                switch (event.type) {
                    case 'blur':
                        // 非空时验证
                        if (val.length > 0 && val.length < 6) {
                            this.showError(elem, '请输入正确验证码');
                            checkpass = false;
                        }
                        break;
                    case 'submit':
                        // 完整验证
                        if (val.length < 6) {
                            this.showError(elem, '请输入正确验证码');
                            checkpass = false;
                        }
                        break;
                    default:
                        break;
                }

                if (checkpass) {
                    this.removeError(elem);
                    return true;
                } else {
                    return false;
                }
            },

            // 显示错误提示
            showError: function(elem, msg) {
                //$(elem).siblings('.error').text(msg);
                $('.error').text(msg);
            },

            // 移除错误提示
            removeError: function(elem) {
                //$(elem).siblings('.error').text('');
                $('.error').text('');
            },

            // 清除输入框
            emptyInput: function(name, event) {
                //console.log(this[name], event)
                this[name] = '';
                if (name==='mobileNumber'){
                    this.mobileNumberRight = false;
                }
                //console.log(name, event)
                //$(event.target).text('');
                // $(event.target).siblings('input').focus();
            },

            // 输入框焦点
            inputFocus: function(e) {
                // //alert($(e.target).attr('name'))
            },

            // 获取验证码
            getValidateCode: function(event) {
                var self = this;
                if (!this.getValidateCodeDisabled && this.checkMobileNumber({type: 'submit', target: 'input[name=mobileNumber]'})) {
                    $('input[name="mobileValidateCode"]').focus();
                    var token = $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
                    $.ajax({
                        url: ershoucheUrl+InterfaceUrl.GetCode,
                        type: 'post',
                        data: {
                            mobile: this.mobileNumber,__RequestVerificationToken:token
                        },
                        dataType: 'json',
                        success: function(res) {
                            if (res.Result) {
                                var countdown = self.getValidateCodeGap;
                                self.getValidateCodeDisabled = true;
                                self.getValidateCodeText = countdown + '秒后获取';
                                self.intervalValidateCode = setInterval(function() {
                                    if (countdown > 1) {
                                        countdown--;
                                        self.getValidateCodeText = countdown + '秒后获取';
                                    } else {
                                        self.getValidateCodeText = '获取验证码';
                                        self.getValidateCodeDisabled = false;
                                        self.getValidateCodeGap = 60;
                                        clearInterval(self.intervalValidateCode);
                                    }
                                }, 1000);
                            } else {
                                self.getValidateCodeDisabled = false;
                                tools.showAlert(res.Message);
                            }
                        },
                        error: function(res) {
                            self.getValidateCodeDisabled = false;
                        }
                    });
                }
            },
            // 提交订单
            submitOrder: function(event) {
                var self = this;
                var checkAll = this.checkMobileNumber({type: 'submit', target: 'input[name=mobileNumber]'});
                checkAll = this.checkValidateCode({type: 'submit', target: 'input[name=mobileValidateCode]'}) && checkAll;
                if (this.checkMobileNumber({type: 'submit', target: 'input[name=mobileNumber]'})===false){
                    this.checkMobileNumber({type: 'submit', target: 'input[name=mobileNumber]'})
                }else if (this.checkValidateCode({type: 'submit', target: 'input[name=mobileValidateCode]'})===false){
                    this.checkValidateCode({type: 'submit', target: 'input[name=mobileValidateCode]'})
                }
                /*this.morehreflink=this.sodata.if.listcarprice.replace('|','z')*/
                console.log(!this.submitBtnDisabled ,this.submitBtnDisabled , checkAll)
                if (!this.submitBtnDisabled && checkAll) {
                    this.submitBtnDisabled = true;
                    $.ajax({
                        url: ershoucheUrl+'Loan/Login?mobile='+this.mobileNumber+'&code='+this.mobileValidateCode,
                        type: 'post',
                        dataType: 'json',
                        beforeSend:function () {
                            /*tools.showAlert('努力评估中',10000);*/
                        },
                        success: function(res) {
                            if (res.Result) {
                                tools.getLoginStatus();
                                self.sodata.if.userlogin=self.mobileNumber
                                let data=res.Data
                                if (!data.isnewuser){
                                    if (data.professional!== -1){
                                        self.sodata.if.professional=self.sodata.getdata.professional=data.professional
                                        data.professional
                                        self.professional.forEach((val,i)=>{
                                            if (val.id==data.professional){
                                                self.sodata.imgclass.professional=val.imgclass
                                            }
                                        })
                                    }
                                    if (data.monthlyincome!== -1){
                                        self.sodata.if.monthlyincome=self.sodata.getdata.monthlyincome=data.monthlyincome
                                        self.monthlyincome.forEach((val,i)=>{
                                            if (val.id==data.monthlyincome){
                                                self.sodata.imgclass.monthlyincome=val.imgclass
                                            }
                                        })
                                    }
                                    if (data.social!== -1){
                                        self.sodata.if.social=self.sodata.getdata.social=data.social
                                        self.social.forEach((val,i)=>{
                                            if (val.id==data.social){
                                                self.sodata.imgclass.social=val.imgclass
                                            }
                                        })
                                    }
                                    if (data.credit!== -1){
                                        self.sodata.if.credit=self.sodata.getdata.credit=data.credit
                                        self.credit.forEach((val,i)=>{
                                            if (val.id==data.credit){
                                                self.sodata.imgclass.credit=val.imgclass
                                            }
                                        })
                                    }
                                    if (data.house!== -1){
                                        self.sodata.if.house=self.sodata.getdata.house=data.house
                                        self.house.forEach((val,i)=>{
                                            if (val.id==data.house){
                                                self.sodata.imgclass.house=val.imgclass
                                            }
                                        })
                                    }
                                }
                                //关闭登陆页面
                                self.sodata.if.easing = false
                                self.sodata.if.login = false
                                //二手车价 首付比例
                                self.sodata.if.pagebefore = true
                                self.sodata.if.pageone = true;
                                self.sodata.if.txt='选择我的购车方案'


                                // 清空验证码
                                self.mobileValidateCode = '';
                                self.getValidateCodeText = '获取验证码';
                                self.getValidateCodeDisabled = false;
                                if (self.intervalValidateCode) {
                                    clearInterval(self.intervalValidateCode);
                                }
                                self.sodata.if.fadecarprice=false
                                self.sodata.if.fade='conterbox hook'
                                setTimeout(function () {
                                    self.sodata.if.fade='conterbox'
                                },1000)
                                //console.log(self.sodata.getdata)

                            } else {
                                // 验证码错误
                                if (res.Data === -1) {
                                    self.showError('input[name=mobileValidateCode]', '请输入正确验证码');
                                    // 其他错误
                                } else {
                                    tools.showAlert(res.Message);
                                }
                            }
                        },
                        error: function(res) {
                            tools.showAlert(res.Message);
                        },
                        complete: function() {
                            /*$('#showAlertBox').attr('style','opacity: 0; display: none;')
                            $('body').unbind('touchmove');
                            */
                            self.submitBtnDisabled = false;
                        }
                    });
                }
            },
        },
    }
</script>
