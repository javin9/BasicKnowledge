<template>
    <!--call info box-->
    <section class="call_info">
        <div class="inputwrap">
            <i class="tel"></i>
            <span class="tit">手机号</span>
            <div class="input" >
                <input type="tel" maxlength="11" placeholder="请输入您的手机号" name="mobileNumber" v-model="mobileNumber" @input="checkMobileNumber" @blur="checkMobileNumber" @focus="checkMobileNumber" @keydown.space.prevent pattern="[0-9]*" id="" v-bind:class="mobileNumbercla ? 'col_red' : ''" />
                <!--<div class="error"></div>-->
                <div class="error-btn" v-show="mobilError"><span></span></div>
                <div class="empty-btn" v-show="mobilDel" @touchend="emptyInput('mobileNumber', $event)" ><span></span></div>
            </div>
        </div>
        <div class="inputwrap validate-code-wrap" v-show="codeHideShow">
            <i class="code"></i>
            <span class="tit">验证码</span>
            <div class="input">
                <input type="tel" maxlength="6" placeholder="请输入验证码" name="mobileValidateCode" v-model="mobileValidateCode" @focus="checkValidateCode" @input="checkValidateCode" @blur="checkValidateCode" @keydown.space.prevent pattern="[0-9]*" id="te" v-bind:class="codeClass ? 'col_red' : ''" />
                <span class="get-validate-code" :class="{disabled: getValidateCodeDisabled || !mobileNumberRight}" @click="getValidateCode" v-text="getValidateCodeText"></span>
                <div class="error-btn" v-show="codeError"><span></span></div>
                <div class="empty-btn" v-show="codeDel" @touchend="emptyInput('mobileValidateCode', $event)"><span></span></div>
            </div>
        </div>
    </section>
</template>

<script>
    import check from 'libs/check/m.js';
    export default{
        name: 'login',
        props: ['getdata'],
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
                codeclass: false,
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
                mobilDel:false,
                codeDel:false,
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
                        if (check.isPhoneNumber(val)) {
                            _self.getdata.mobile=val
                            _self.mobileNumberRight = true;
                        } else {
                            _self.mobileNumberRight = false;
                        }
                        //console.log('m-ffff',this.mobileNumbercla)

                    case 'input':
                        // 录入到达11位后，验证手机号是否正确
                        if (val.length >= 11 && !check.isPhoneNumber(val)) {
                            tools.showAlert('请输入正确手机号');
                            this.mobileNumbercla=true
                            checkpass = false;
                        }else {
                            this.codeHideShow = true;
                            this.mobileNumbercla=false
                            this.getdata.mobile=val
                            //判断是否是和登陆的是同一个手机号
                            /*if (val == this.mobileUser){
                                this.codeHideShow = false;

                            }*/
                        }
                        if (check.isPhoneNumber(val)) {
                            this.getdata.mobile=val
                            this.mobileNumberRight = true;
                        } else {
                            this.mobileNumberRight = false;
                        }
                        this.mobilDel=true;
                        //console.log('m-iii',this.mobileNumbercla)
                        break;
                    case 'blur':
                        this.mobilDel=false;
                        // 非空时验证
                        if (val.length > 0 && !check.isPhoneNumber(val)) {
                            this.mobileNumbercla=true
                            checkpass = false;
                            this.mobilError=true;
                            tools.showAlert('请输入正确手机号');
                        }else {
                            this.getdata.mobile=val
                        }
                        //console.log('m-bbb',this.mobileNumbercla)
                        break;
                    case 'submit':
                        // 完整验证
                        //console.log('submit');//alert('submit')
                        if (!check.isPhoneNumber(val)) {
                            $('#test').addClass('pulse')
                            setTimeout(function () {
                                $('#test').removeClass('pulse')
                            },1000)
                            this.mobileNumbercla=true
                            checkpass = false;
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
                        _self.codeDel=true;
                        _self.codeClass = false;
                        if (val.length > 0 && val.length < 6) {
                            /*tools.showAlert('请输入正确验证码ffffff');*/
                            checkpass = false;
                        }
                        //console.log('y-fff:',_self.codeClass)
                    case 'input':
                        _self.codeError=false;
                        _self.codeDel=true;
                        _self.codeClass=false;
                        if (val.length > 0 && val.length < 6) {

                            checkpass = false;
                        }
                        //console.log('y-iii',_self.codeClass);
                        break;
                    case 'blur':
                        _self.codeDel=false;
                        // 非空时验证
                        if (val.length > 0 && val.length < 6) {
                            _self.codeError=true;
                            _self.codeClass=true;
                            tools.showAlert('请输入正确验证码');

                            checkpass = false;
                        }
                        //console.log('y-bbb',_self.codeClass)
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
            getValidateCode: function(event) {
                var self = this;
                if (!this.getValidateCodeDisabled && this.checkMobileNumber({type: 'submit', target: 'input[name=mobileNumber]'})) {
                    $('input[name="mobileValidateCode"]').focus();
                    $.ajax({
                        url: ershoucheUrl+InterfaceUrl.GetCode,
                        type: 'post',
                        data: {
                            mobile: this.mobileNumber
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

            // 清除输入框
            emptyInput: function(name, event) {
                if (name==='mobileNumber'){
                    this.mobileNumber = '';
                }
                if (name==='mobileValidateCode'){
                    this.mobileValidateCode = '';
                }
            },

        },
    }
</script>


