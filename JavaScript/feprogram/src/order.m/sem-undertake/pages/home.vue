<template>
    <div id="rapidLoan">
        <div class="container rapidloan">
            <ul class="info_ul">
                <!-- <li class="itmes" v-on:click="selectcity()" v-if="showcity">
                    <i class="i icon_1"></i>
                    <div class="tit">城&emsp;市</div>
                    <div class="txt" v-text="cityname"></div>
                </li>

                <li class="itmes" v-on:click="selectCar(e)" v-if="showcity">
                    <i class="i icon_2"></i>
                    <div class="tit">车&emsp;型</div>
                    <div class="txt" v-if="carname">{{carname}}</div>
                    <div class="txt grey" v-else>请选择车型</div>
                </li> -->
                <!--show-button="showButton"-->

                <mobile-verify v-if="showmobilecode" class="mobile-verify" :mobile="mobile" :disabled="disabledSubmit" @update="mobliecode" :getcode-api="getcodeurl" :checkcode-api="checkcodeApi" :show-icons="showIcons" :show-code-input="showCodeInput"></mobile-verify>

                <li class="itmes mli" v-if="showname">
                    <i class="i icon_3"></i>
                    <div class="tit">姓&emsp;名</div>
                    <div class="txt_2">
                        <component-input v-model="name" type="text" placeholder="请输入姓名" :class="{'input-error': inpname}" @blur="checkValid('name')" @focus="checkInput('name')" @input="checkTxt('name')" maxlength="8"></component-input>
                    </div>
                </li>
                <li class="itmes mli" v-if="showid">
                    <i class="i icon_4"></i>
                    <div class="tit">身份证</div>
                    <div class="txt_2">
                        <component-input v-model="idnumber" type="text" placeholder="请输入身份证号" :class="{'input-error': inpidnumber}" @blur="checkValid('idnumber')" @focus="checkInput('idnumber')" @input="checkTxt('idnumber')" maxlength="18"></component-input>
                    </div>
                </li>

            </ul>
            <div class="component-mobile-verify-button" v-on:click="submit()">
                <a href="javascript:void(0)" v-bind:class="disabledcla ? '' :'disabled'">立即申请</a>
            </div>

        </div>
    </div>
</template>

<style scoped>
.mobile-verify {


    .component-mobile-verify-button {}
}

@import 'sassHelper/mixin';
@import 'sassHelper/vars';
</style>

<script>
import MobileVerify from 'libs/vue-components/mobile-verify'

import check from 'libs/check/m'
import city from 'libs/citySelect'
import car from 'libs/carSelect'
import aes from "libs/aes";


import ComponentInput from 'libs/vue-components/elements/input.vue'


export default {
    props: ['source', 'channel', 'from', 'focusbannerurl', 'createorderurl', 'checkcodeurl', 'getcodeurl',
        'cityname', 'cityid', 'carid', 'carname', 'isshowcouponcard', 'isshowbottom', 'quafields', 'titlecontent', 'islogined', 'isauthenticated', 'showidnumber', 'showusername', 'showmobile', 'orders'],
    data() {
        return {
            showCodeInput: true,
            showIcons: true,
            showButton: false,
            applyCount: 0,
            orderHistory: [],
            GET_COUNT_API: `${window.APIURL}api/Other/GetNewCarLoanStatisticsInfo`,
            GET_ORDER_API: `${window.APIURL}api/LoanOrder/GetNewestLoanOrderApprovalInfo`,
            /*new*/
            titlecontentvue: this.titlecontent || '贷款购车',//标题字段
            isimgshow: false,//后台是否配置背景图片
            coupontxt: true,//是否展示领取优惠卷
            showcity: false,//是否显示城市
            showcar: false,//是否现实车系
            showmobilecode: false,//是不显示手机号验证码

            showname: false,//是否显示姓名
            showid: false,//是否显示身份证
            couponcardid: '',//领取卡券id
            couponcardidporary: '',//暂存-领取卡券id couponcardnameporary: '',//暂存-请求-卡券接口回应数据(alert)
            couponcardname: '',//请求-卡券接口回应数据(alert)
            mobile: '',//手机号
            code: '',//验证码
            name: '',//姓名
            inpname: false,//
            idnumber: '',//身份证件
            inpidnumber: false,

            disabledcla: false,
            line: 550,
            token: $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id') || '',
            //fun
            cityValid: this.cityid,
            carValid: this.carid,
            mobileValid: false,
            codeValid: false,
            nameValid: false,
            idnumberValid: false,
        }
    },
    computed: {
        /*disabledSubmit(){
         return this.cityId || this.carId || this.submiting || this.personalinfo
         },*/



    },
    methods: {
        mobileValidfun() {
            return check.isPhoneNumber($.trim(this.mobile)) ? this.mobileValid = true : this.mobileValid = false
        },
        codeValidfun() {
            return this.code.length !== 4 ? this.codeValid = false : this.codeValid = true
        },

        nameValidfun() {
            if (this.name.length > 0 && this.name == this.showusername) {
                this.nameValid = true;
                return;
            }
            return !check.isName($.trim(this.name)) ? this.nameValid = false : this.nameValid = true
        },
        idnumberValidfun() {
            if (this.idnumber.length > 0 && this.idnumber == this.showidnumber) {
                this.idnumberValid = true;
                return;
            }
            return !check.isID($.trim(this.idnumber)) ? this.idnumberValid = false : this.idnumberValid = true
        },
        submitbtn() {
            // console.log('this.nameValid', this.nameValid);
            if (this.cityValid && this.carValid && this.mobileValid && this.codeValid && this.nameValid && this.idnumberValid) {
                this.disabledcla = true
            } else {
                this.disabledcla = false
            }
            //debugger
        },
        coupons() {
            if (this.coupontxt) {
                this.coupontxt = false
                this.couponcardid = this.couponcardidporary
                tools.showAlert(this.couponcardname + '领取成功 下单后发放至您的个人账户')
            } else {
                tools.showAlert('已领取成功<br/>请勿重复领取')
            }

        },

        mobliecode(mobile, authcode) {
            this.mobile = mobile
            this.code = authcode
            this.mobileValidfun()
            this.codeValidfun()
            this.submitbtn()
        },
        selectcity() {
            city.citySelect(city, data => {
                this.cityname = data.CityName,
                    this.cityValid = this.cityid = data.CityId;
                this.submitbtn()
            })
        },

        selectCar() {
            car.carSelect({
                onlyOnSale: true,
                showLevel: 3,
                showAllBrand: false,
                showSearch: false,
                hide: false,
            }, data => {
                $('#carSelectComponent,#carSelectSecondLevel,#carSelectThirdLevel,#carSearch-container').remove()
                this.carValid = this.carid = data.carType.id
                this.carname = data.masterBrand.name + ' ' + data.brand.name + ' ' + data.carType.name
                this.carprice = data.carType.price
                this.submitbtn()
            })
        },
        submit() {
            if (this.disabledcla) {
                this.disabledcla = false
                if (this.mobile == this.showmobile) {
                    this.postData();
                } else {
                    const paramscode = {
                        mobile: this.mobile,
                        validatecode: this.code,
                        line: this.line,
                        __RequestVerificationToken: this.token
                    }
                    /*this.$http.post(this.getcodeApi, params, {emulateJSON: true}).then(response => response.json().then(res => {}))*/
                    // 校验验证码事件
                    this.$http.post(this.checkcodeurl, paramscode, { emulateJSON: true }).then(response => response.json().then(res => {
                        if (!res.Result) {
                            this.disabledcla = true
                            tools.showAlert(res.Message)
                        } else {
                            this.postData();
                        }
                    }))
                }
            }
            
        },
         postData() {
                this.disabledcla = false
                //提交数据
                const params = {
                    // CityName: this.cityname,
                    CityId: this.cityid,
                    // CarName: this.carname,
                    CarId: this.carid,
                    CouponCardId: this.couponcardid,
                    Source: this.source,
                    Channel: this.channel,
                    From: this.from,
                    orders: this.orders
                }
                if (this.mobile !== this.showmobile) {
                    params.Telephone = $.trim(this.mobile)
                    params.code = this.code
                }
                if (this.name !== this.showusername && this.idnumber !== this.showidnumber) {
                    params.Name = $.trim(this.name)
                    params.CertificateNumber = aes.encrypt(this.idnumber)
                }
                this.disabledcla = false
                tools.showAlert("提交中...")
                this.$http.post(this.createorderurl, params, { emulateJSON: true }).then(response => response.json().then(data => {
                    if (data.Result) {
                        this.disabledcla = false
                        $('body').unbind('touchmove');
                        $("#showAlertBox").fadeOut(300);
                        window.location.href = data.Data
                    } else {
                        tools.showAlert(data.Message)
                        this.disabledcla = true
                    }
                }))
            },
        /* input blur */
        checkValid(txt) {
            let _self = this
            if (txt === 'name') {
                this.nameValidfun()
                if (!_self.nameValid && this.name !== '') {
                    _self.inpname = true;
                    tools.showAlert('请输入正确姓名')
                } else {
                    _self.inpname = false;
                }
            }
            if (txt === 'idnumber') {
                this.idnumberValidfun()
                if (!_self.idnumberValid && this.idnumber !== '') {
                    _self.inpidnumber = true;
                    tools.showAlert('请输入正确身份证')
                } else {
                    _self.inpidnumber = false;
                }
            }
            this.submitbtn()
        },
        ///*----input focus ---*/
        checkInput(val) {
            let _self = this
            // 解决安卓手机，软键盘弹起，输入框遮挡
            let ua = navigator.userAgent.toLowerCase(),
                isAndroid = ua.match(/(Android)\s+([\d.]+)/);
            if(isAndroid){
                setTimeout(()=>{
                    let pannel = document.getElementById('rapidLoan');
                    pannel.scrollIntoView(true);
                    pannel.scrollIntoViewIfNeeded();
                }, 500)
            }
            if (val === 'name') {
                // this.nameValidfun()
                _self.inpname = false;
            }
            if (val === 'idnumber') {
                // this.idnumberValidfun()
                _self.inpidnumber = false;
            }
            this.submitbtn()
        },
        /*----input input---*/
        checkTxt(txt) {
            let _self = this
            if (txt === 'name') {
                // if (_self.name.length > 0) {
                    this.nameValidfun()
                // }
            }
            if (txt === 'idnumber') {
                // if(_self.idnumber.length > 0){
                    this.idnumberValidfun()
                // }
                if (_self.idnumber.length === 18) {
                    if (!_self.idnumberValid) {
                        _self.inpidnumber = true;
                    } else {
                        _self.inpidnumber = false;
                    }
                } else {
                    _self.inpidnumber = false;
                }
            }
            this.submitbtn()
        },
        loadVIewDom() {
            if (this.isauthenticated === 'true') {
                this.idnumber = this.showidnumber
                this.idnumberValid = true
                this.name = this.showusername
                this.nameValid = true

            }
            if (this.islogined === 'true') {
                this.mobile = this.showmobile
                this.showCodeInput = false
                this.mobileValid = true
                this.codeValid = true
            }
            this.submitbtn()
        }
    },
    watch: {
        mobile(value) {
            if (value !== this.showmobile) {
                if (this.islogined === 'true') {
                    if (this.isauthenticated === 'true') {
                        this.name = '';
                        this.idnumber = '';
                        this.isauthenticated = 'false';
                    }
                    this.islogined = 'false'
                    this.showCodeInput = true
                }
            }
        },
        name(value) {
            if (value !== this.showusername) {
                if (this.isauthenticated === 'true') {
                    this.idnumber = ''
                    this.isauthenticated = 'false';
                }
                if (this.islogined === 'true') {
                    this.mobile = ''
                    this.islogined = 'false'
                    this.showCodeInput = true
                }
            }
        },
        idnumber(value) {
            if (value !== this.showidnumber) {
                if (this.isauthenticated === 'true') {
                    this.name = ''
                    this.isauthenticated = 'false';
                }
                if (this.islogined === 'true') {
                    this.mobile = ''
                    this.islogined = 'false'
                    this.showCodeInput = true
                }
            }
        }
    }
    ,
    ready() {
        // this.from = tools.getUrlParam('from')
        let num = this.quafields
        if (num === '' || num == '') {
            this.showcity = true
            this.showcar = true
            this.showmobilecode = true
        } else {
            if (num.indexOf('1') != -1) {
                this.showcity = true
            }
            if (num.indexOf('2') != -1) {
                this.showcar = true
            }
            if (num.indexOf('3') != -1 || num.indexOf('4') != -1) {
                this.showmobilecode = true
            }
            if (num.indexOf('5') != -1) {
                this.showname = true
            } else {
                this.name = '';
                this.nameValid = true;
            }
            if (num.indexOf('6') != -1) {
                this.showid = true
            } else {
                this.idnumber = '';
                this.idnumberValid = true;
            }

        }
        if (this.focusbannerurl === '') {
            this.isimgshow = true;
        }
        if (this.isshowbottom === 'false') {
            $('.escdk13').hide();
        }
        //console.log(this)
        this.loadVIewDom()
    },

    components: {
        MobileVerify,
        ComponentInput
    }
}






</script>