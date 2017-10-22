<template>
    <!--call info box-->
    <section class="call_info">
        <div class="inputwrap">
            <i class="tel"></i>
            <span class="tit">手机号</span>
            <div class="input" >
                <input type="tel" maxlength="11" placeholder="请输入手机号" name="mobileNumber" v-model="mobileNumber" @input="checkMobileNumber" @blur="checkMobileNumber" @focus="checkMobileNumber" @keydown.space.prevent pattern="[0-9]*" id="" v-bind:class="mobileNumbercla ? 'col_red' : ''" />
                <!--<div class="error"></div>-->
                <div class="error-btn" v-if="mobilError"><span></span></div>
                <div class="empty-btn" v-if="mobilDele" @touchend="emptyInput('mobileNumber', $event)" ><span></span></div>
            </div>
        </div>
        <div class="inputwrap validate-code-wrap" v-show="codeHideShow">
            <i class="code"></i>
            <span class="tit">验证码</span>
            <div class="input">
                <input type="tel" maxlength="6" placeholder="请输入验证码" name="mobileValidateCode" v-model="mobileValidateCode" @input="checkValidateCode" @blur="checkValidateCode" @focus="checkValidateCode" @keydown.space.prevent pattern="[0-9]*" id="te" v-bind:class="codenumberClass ? 'col_red' : ''" />
                <span class="get-validate-code" :class="{disabled: getValidateCodeDisabled || !mobileNumberRight}" @click="getValidateCode" v-text="getValidateCodeText"></span>
                <div class="error-btn" v-if="codeError"><span></span></div>
                <div class="empty-btn" v-if="codeDel" @touchend="emptyInput('mobileValidateCode', $event)"><span></span></div>
            </div>
        </div>
    </section>
</template>

<script>
    import check from 'libs/check/m.js';
    export default{
        name: 'login',
        props: ['getdata','other'],
        ready(){
            let _self=this
            //验证手机号是否是登陆用户,是否和登陆手机号一至
            /*if (check.isPhoneNumber(this.mobileNumber)&&this.mobileUser===this.mobileNumber) {
                this.mobileNumberRight = true;
                this.codeHideShow = false;
                this.getdata.mobile=this.mobileUser
                this.getdata.code=true
            } else {
                this.mobileNumberRight = false;
                this.codeHideShow = true;
                this.getdata.code=false
            }*/
            /*$('#test').on('keyup mouseout input',function(){
                var $this = $(this),
                        v = $this.val();
                /\S{2}/.test(v) && $this.val(v.replace(/\s/g,'').replace(/(.{4})/g, "$1 "));
            });*/
        },
        data(){
            return{
                // 提交订单弹层
                mobileNumbercla: false,
                codenumberClass: false,
                codeHideShow:true,
                mobileNumber:this.getdata.mobile,
                mobileValidateCode: '',
                mobileNumberRight: false,
                getValidateCodeDisabled: false,
                getValidateCodeText: '获取验证码',
                getValidateCodeGap: 60,
                intervalValidateCode: null,
                submitBtnDisabled: false,
                //
                mobilError:false,
                codeError:false,
                mobilDele:false,
                codeDel:false,
                ////
                mobilDeltest:false,
            }
        },
        components: {},
        methods: {
            // 验证手机号
            checkMobileNumber: function(event) {
                var _self=this, elem = event.target,
                        val = _self.mobileNumber,//.replace(/\s/g, "")
                        checkpass = true;
                _self.getdata.mobile=val;
                switch (event.type) {
                    case 'focus':
                        _self.mobilError=false;
                        if (val.length>0){
                            _self.mobilDele=true;
                        }else {
                            _self.mobilDele=false;
                        }
                        if (val.length > 0 && !check.isPhoneNumber(val)) {
                            _self.getdata.mobile=val
                            _self.mobileNumberRight = true;
                            _self.getdata.mobilefa=true
                        } else {
                            _self.mobileNumberRight = false;
                            _self.getdata.mobilefa=false
                        }

                    case 'input':
                        // 录入到达11位后，验证手机号是否正确
                        if (val.length>0){
                            _self.mobilDele=true;
                        }else {
                            _self.mobilDele=false;
                        }
                        if (val.length >= 11 && !check.isPhoneNumber(val)) {
                            tools.showAlert('请输入正确手机号');
                            this.mobileNumbercla=true
                            checkpass = false;
                            _self.getdata.mobilefa=false
                        }else {
                            this.codeHideShow = true;
                            this.mobileNumbercla=false
                            this.getdata.mobile=val
                            _self.getdata.mobilefa=true
                            //判断是否是和登陆的是同一个手机号
                            /*if (val == this.mobileUser){
                                this.codeHideShow = false;

                            }*/
                        }
                        if (check.isPhoneNumber(val)) {
                            this.getdata.mobile=val
                            this.mobileNumberRight = true;
                            _self.getdata.mobilefa=true
                        } else {
                            this.mobileNumberRight = false;
                            _self.getdata.mobilefa=false
                        }
                        break;
                    case 'blur':
                        this.mobilDele=false;
                        // 非空时验证
                        if (val.length > 0 && !check.isPhoneNumber(val)) {
                            this.mobileNumbercla=true
                            checkpass = false;
                            this.mobilError=true;
                            tools.showAlert('请输入正确手机号');
                            _self.getdata.mobilefa=false
                        }else {
                            this.getdata.mobile=val
                            _self.getdata.mobilefa=true
                        }
                        break;
                    default:
                        break;
                }


                if (checkpass) {
                    return true;
                } else {
                    return false;
                }
            },

            // 验证验证码
            checkValidateCode: function(event) {
                var _self=this,
                        elem = event.target,
                        val = _self.mobileValidateCode,
                        checkpass = true;
                _self.getdata.code=val;
                switch (event.type) {
                    case 'focus':
                        _self.codeError=false;
                        /*_self.codeDel=true;*/
                        _self.codenumberClass = false;
                        if (val.length>0){
                            _self.codeDel=true;
                        }else {
                            _self.codeDel=false;
                        }
                        if (val.length > 0 && val.length < 6) {
                            /*tools.showAlert('请输入正确验证码ffffff');*/
                            checkpass = false;
                            _self.getdata.codefa=false
                        }else if (val.length !== 0){
                            _self.getdata.codefa=true
                        }
                    case 'input':
                        _self.codeError=false;
                        /*_self.codeDel=true;*/
                        _self.codenumberClass=false;
                        if (val.length>0){
                            _self.codeDel=true;
                        }else {
                            _self.codeDel=false;
                        }
                        if (val.length > 0 && val.length < 6) {
                            checkpass = false;
                            _self.getdata.codefa=false
                        }else if(val.length !== 0) {
                            _self.getdata.codefa=true
                        }
                        break;
                    case 'blur':
                        _self.codeDel=false;
                        // 非空时验证
                        if (val.length > 0 && val.length < 6) {
                            _self.codeError=true;
                            _self.codenumberClass=true;
                            _self.getdata.codefa=false
                            tools.showAlert('请输入正确验证码');
                            _self.getdata.codefa=false
                            checkpass = false;
                        }else if(val.length !== 0){
                            _self.getdata.codefa=true
                        }
                        console.log('y-bbb',_self.codenumberClass)
                        break;
                    default:
                        break;
                }

                if (checkpass) {
                    return true;
                } else {
                    return false;
                }
            },


            // 获取验证码

            /*
             var params = { mobile: telNum, line: Tdata.line };
            var token = Tdata.__RequestVerificationToken || $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
             if (token) {
             params.__RequestVerificationToken = token
             }
             */
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
            //
            valdel:function(val,del) {
                if (val.length>0){
                    del=true;
                }else {
                    del=false;
                }
            },
            // 清除输入框
            emptyInput: function(name, event) {

                //console.log(this[name], event)
                this[name] = '';
                if (name==='mobileNumber'){
                    this.mobileNumberRight = false;
                    this.getdata.codefa=false
                    this.getdata.mobilefa=false
                }
                this.codeDel=false;
                this.mobilDele=false;
                $(event.target).siblings('input').focus();
                //console.log(name, event)
                //$(event.target).text('');
                // $(event.target).siblings('input').focus();
            },
        },
    }
</script>


