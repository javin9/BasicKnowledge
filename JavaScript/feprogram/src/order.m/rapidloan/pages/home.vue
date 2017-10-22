<template>
    <component-header v-bind:title="titlecontentvue"></component-header>
    <div id="rapidLoan">
        <div class="banner">
            <div class="bg" v-if="isimgshow"></div>
            <img src="../images/banner.html.png" v-else v-bind:src="focusbannerurl" />
        </div>
        <ul class="ullist">
            <li>
                <dl class="ri-border">
                    <dd class="img1"></dd>
                    <dt class="ri-dt">
                    <div class="txt1">申请快</div>
                    <div class="t1">20秒提交贷款申请</div>
                    </dt>
                </dl>
                <dl>
                    <dd class="img2"></dd>
                    <dt class="ri-dt">
                    <div class="txt1">产品多</div>
                    <div class="t1">万种产品在线比价</div>
                    </dt>
                </dl>
            </li>
            <li>
                <dl class="ri-border">
                    <dd class="img3"></dd>
                    <dt class="ri-dt">
                    <div class="txt1">材料少</div>
                    <div class="t1">只需身份证就能贷</div>
                    </dt>
                </dl>
                <dl>

                    <dd class="img4"></dd>
                    <dt class="ri-dt">
                    <div class="txt1">审批快</div>
                    <div class="t1">在线审批快速提车</div>
                    </dt>
                </dl>
            </li>
        </ul>
        <div class="container rapidloan">
            <!--<mobile-verify class="mobile-verify" :disabled="disabledSubmit" @submit="submit" :getcode-api="getCodeApi" :checkcode-api="checkcodeApi"></mobile-verify>-->

            <!-- 优惠卷 -->
            <div class="coupons" v-if="isshowcouponcard" @click="coupons()">
                <div class="cou-txt">领优惠，抵费率</div>
                <div class="cou-btn">
                    <span class="btn-blue" v-if="coupontxt">领取</span>
                    <span class="btn-grey" v-if="!coupontxt">已领取</span>
                </div>
            </div>
            <ul class="info_ul">
                <li class="itmes" v-on:click="selectcity()" v-if="showcity">
                    <i class="i icon_1"></i>
                    <div class="tit">城&emsp;市</div>
                    <div class="txt" v-text="cityname"></div>
                </li>

                <li class="itmes" v-on:click="selectCar(e)" v-if="showcity">
                    <i class="i icon_2"></i>
                    <div class="tit">车&emsp;型</div>
                    <div class="txt" v-if="carname">{{carname}}</div>
                    <div class="txt grey" v-else>请选择车型</div>
                </li>
                <!--show-button="showButton"-->
                <mobile-verify v-if="showmobilecode" class="mobile-verify" :disabled="disabledSubmit" @update="mobliecode" :getcode-api="getCodeApi"
                               :checkcode-api="checkcodeApi" :show-icons="showIcons"></mobile-verify>

                <li class="itmes mli" v-if="showname">
                    <i class="i icon_3"></i>
                    <div class="tit">姓&emsp;名</div>
                    <div class="txt_2">
                        <component-input v-model="name" type="text" placeholder="请输入姓名" :class="{'input-error': inpname}"
                                         @blur="checkValid('name')" @focus="checkInput('name')" @input="checkTxt('name')" maxlength="8"></component-input>
                    </div>
                </li>
                <li class="itmes mli" v-if="showid">
                    <i class="i icon_4"></i>
                    <div class="tit">身份证</div>
                    <div class="txt_2">
                        <component-input v-model="idnumber" type="text" placeholder="请输入身份证号" :class="{'input-error': inpidnumber}"
                                         @blur="checkValid('idnumber')" @focus="checkInput('idnumber')" @input="checkTxt('idnumber')" maxlength="18"></component-input>
                    </div>
                </li>

            </ul>
            <div class="component-mobile-verify-button" v-on:click="submit()"> <a href="javascript:void(0)" v-bind:class="disabledcla ? '' :'disabled'">立即申请</a> </div>

        </div>
    </div>
    <component-footer></component-footer>
</template>

<style scoped>

    .mobile-verify{


    .component-mobile-verify-button{

    }
    }

    @import 'sassHelper/mixin';
    @import 'sassHelper/vars';


</style>

<script>
    import Header from 'libs/header'
    import Footer from 'libs/vue-components/footer'
    import MobileVerify from 'libs/vue-components/mobile-verify'

    import check from 'libs/check/m'
    import city from 'libs/citySelect'
    import car from 'libs/carSelect'
    import aes from "libs/aes";


    import ComponentInput from 'libs/vue-components/elements/input.vue'


    export default {
        props:['source','channel','focusbannerurl','receivecouponcardurl','createorderurl','checkcodeurl','getcodeurl','successpageurl',
            'cityname','cityid','carid','carname','isshowcouponcard','isshowbottom','quafields','titlecontent'],
        data () {
            return {
                showIcons:true,
                showButton:false,
                applyCount: 0,
                orderHistory: [],


                GET_COUNT_API: `${window.APIURL}api/Other/GetNewCarLoanStatisticsInfo`,
                GET_ORDER_API: `${window.APIURL}api/LoanOrder/GetNewestLoanOrderApprovalInfo`,
                /*new*/
                titlecontentvue:this.titlecontent||'贷款购车',//标题字段
                isimgshow:false,//后台是否配置背景图片
                coupontxt:true,//是否展示领取优惠卷
                showcity:false,//是否显示城市
                showcar:false,//是否现实车系
                showmobilecode:false,//是不显示手机号验证码

                showname:false,//是否显示姓名
                showid:false,//是否显示身份证
                couponcardid:'',//领取卡券id
                couponcardname:'',//请求-卡券接口回应数据(alert)
                couponcardidporary:'',//暂存-领取卡券id
                couponcardnameporary:'',//暂存-请求-卡券接口回应数据(alert)
                mobile:'',//手机号
                code: '',//验证码
                name:'',//姓名
                inpname:false,//
                idnumber:'',//身份证件
                inpidnumber:false,

                disabledcla:false,
                line:550,
                token:$('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id') || '',
                //fun
                cityValid:this.cityid,
                carValid:this.carid,
                mobileValid:false,
                codeValid:false,
                nameValid:false,
                idnumberValid:false,
            }
        },
        computed:{
            /*disabledSubmit(){
             return this.cityId || this.carId || this.submiting || this.personalinfo
             },*/



        },
        methods:{
            mobileValidfun (){
                return check.isPhoneNumber(this.mobile) ? this.mobileValid=true : this.mobileValid=false
            },
            codeValidfun (){
                return this.code.length!==4 ?  this.codeValid=false : this.codeValid=true
            },

            nameValidfun(){
                return  !check.isName(this.name) ?  this.nameValid=false : this.nameValid=true
            },
            idnumberValidfun(){
                return !check.isID(this.idnumber) ?  this.idnumberValid=false : this.idnumberValid=true
            },

            submitbtn(){
                   //console.log(this.cityValid , this.carValid , this.mobileValid , this.codeValid , this.nameValid , this.idnumberValid)
                if (this.cityValid && this.carValid && this.mobileValid && this.codeValid && this.nameValid && this.idnumberValid){
                    this.disabledcla = true
                }else {
                    this.disabledcla = false
                }
                //debugger
            },
            coupons(){
                if (this.coupontxt){
                    this.coupontxt=false
                    this.couponcardid=this.couponcardidporary
                    tools.showAlert(this.couponcardname+'领取成功 下单后发放至您的个人账户')
                }else {
                    tools.showAlert('已领取成功<br/>请勿重复领取')
                }

            },

            mobliecode(mobile, authcode){
                this.mobile = mobile
                this.code = authcode
                this.mobileValidfun ()
                this.codeValidfun ()
                this.submitbtn()
            },
            selectcity(){
                city.citySelect(city, data => {
                    this.cityname = data.CityName,
                            this.cityValid=this.cityid = data.CityId;
                    this.submitbtn()
                })
            },

            selectCar(){
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
            submit(){
                //console.log(this)
                if (this.disabledcla){
                    this.disabledcla = false
                    const paramscode = {
                        mobile:this.mobile,
                        validatecode: this.code,
                        line: this.line,
                        __RequestVerificationToken: this.token
                    }
                    /*this.$http.post(this.getcodeApi, params, {emulateJSON: true}).then(response => response.json().then(res => {}))*/
                    // 校验验证码事件
                    this.$http.post(this.checkcodeurl, paramscode, {emulateJSON: true}).then(response => response.json().then(res => {
                        if(!res.Result){
                            this.disabledcla = true
                            tools.showAlert(res.Message)
                        }else {
                            this.disabledcla = false
                            //提交数据
                            const params = {CityName: this.cityname,
                                CityId: this.cityid,
                                CarName: this.carname,
                                CarId: this.carid,
                                Telephone: this.mobile,
                                code: this.code,
                                Name:this.name,
                                CertificateNumber:aes.encrypt(this.idnumber),
                                CouponCardId:this.couponcardid,
                                Source: this.source,
                                Channel: this.channel,
                                From: this.from}
                            this.disabledcla = false
                            tools.showAlert("提交中...")
                            this.$http.post(this.createorderurl,params,{emulateJSON:true}).then(response => response.json().then(data =>{
                                if (data.Result){
                                    this.disabledcla = false
                                    window.location.href = data.Data
                                }else {
                                    tools.showAlert(data.Message)
                                    this.disabledcla = true
                                }
                            }))




                        }
                    }))
                }
            },
            /* input blur */
            checkValid(txt){
                let _self=this
                if (txt==='name'){
                    this.nameValidfun()
                    if(!_self.nameValid && this.name!==''){
                        _self.inpname=true;
                        tools.showAlert('请输入正确姓名')
                    }else {
                        _self.inpname=false;
                    }
                }
                if (txt==='idnumber'){
                    this.idnumberValidfun()
                    if(!_self.idnumberValid && this.idnumber!==''){
                        _self.inpidnumber=true;
                        tools.showAlert('请输入正确身份证')
                    }else {
                        _self.inpidnumber=false;
                    }
                }
                this.submitbtn()
                //console.log('blur')
            },
            ///*----input focus ---*/
            checkInput(val){
                let _self=this
                if (val==='name'){
                    _self.inpname=false;
                }
                if (val==='idnumber'){
                    _self.inpidnumber=false;
                }
                this.submitbtn()
            },
            /*----input input---*/
            checkTxt(txt){
                let _self=this
                if (txt==='name'){
                    if(_self.name.length>0){
                        this.nameValidfun()
                        /*if(!_self.nameValid && this.name!==''){
                            _self.inpname=true;
                        }else {
                            _self.inpname=false;
                        }*/
                    }
                }
                if (txt==='idnumber'){
                    this.idnumberValidfun()
                    if(_self.idnumber.length===18){
                        if(!_self.idnumberValid){
                            _self.inpidnumber=true;
                        }else {
                            _self.inpidnumber=false;
                        }
                    }else {
                        _self.inpidnumber=false;
                    }
                }
                this.submitbtn()
                //console.log('input')
            },
        },

        ready(){
            console.log(aes.encrypt('110103199901012318'))
            console.log(aes.encrypt(''))
            this.from= tools.getUrlParam('from')
            let num=this.quafields
            if (num===''||num==''){
                this.showcity=true
                this.showcar=true
                this.showmobilecode=true
            }else {
                if (num.indexOf('1')!=-1){
                    this.showcity=true
                }
                if (num.indexOf('2')!=-1){
                    this.showcar=true
                }
                if (num.indexOf('3')!=-1||num.indexOf('4')!=-1){
                    this.showmobilecode=true
                }
                if ( num.indexOf('5')!=-1){
                    this.showname=true
                }else {
                    this.name ='';
                    this.nameValid =true;
                }
                if (num.indexOf('6')!=-1){
                    this.showid=true
                }else {
                    this.idnumber='';
                    this.idnumberValid=true;
                }

                /*debugger
                * nameValid(){
                 return  check.isName(this.name)
                 },
                 idnumberValid(){
                 return check.isID(this.idnumber)
                 },*/
            }
            if (this.focusbannerurl===''){
                this.isimgshow=true;
            }
            if (this.isshowbottom==='false'){
                $('.escdk13').hide();
            }
            //console.log(this)
            if (this.isshowcouponcard==='false'){
                this.isshowcouponcard=false
            }else {
                this.isshowcouponcard=true
                //请求接口是否能点击 -- 领取
                const params={from:this.from,__RequestVerificationToken:this.token}
                this.$http.post(this.receivecouponcardurl, params ,{emulateJSON: true}).then(response => response.json().then(res => {
                    //console.log(res)
                    if(res.Result){
                        this.coupontxt=true
                        this.couponcardidporary=res.Data.CouponCardId
                        this.couponcardname=res.Data.CardFullName
                    }else {
                        this.coupontxt=false
                    }
                }))

            }

        },

        components: {
            'component-header': Header,
            'component-footer': Footer,
            MobileVerify,
            ComponentInput
        }
    }






</script>