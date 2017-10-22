<template>
    <div id="template">
        <div class="imgbox">
            <div class="yixinnoe"></div>
            <div class="yixintwo"></div>
            <div class="yixinthree"></div>
            <div class="people">
                <div class="credit"><div v-bind:class="sodata.imgclass.credit" class="p_1"></div></div>
                <div class="professional"><div v-bind:class="sodata.imgclass.professional"></div></div>
                <div class="carprice"><div v-bind:class="sodata.if.fadecarprice?'':'hook p_1'"></div></div>
                <!--<div class="downpayment">首付比例</div>-->
            </div>
            <div class="monthlyincome"><div v-bind:class="sodata.imgclass.monthlyincome"></div></div>
            <div class="house"><div v-bind:class="sodata.imgclass.house"></div></div>
            <div class="social"><div v-bind:class="sodata.imgclass.social"></div></div>
        </div>
        <h6 class="h6">{{sodata.if.txt}}</h6>
        <easing v-if="sodata.if.easing" v-bind:sodata="sodata"></easing>
        <login v-if="sodata.if.login" v-bind:sodata="sodata" v-bind:professional="professional"
               v-bind:monthlyincome="monthlyincome"
               v-bind:social="social"
               v-bind:credit="credit"
               v-bind:house="house"
               v-bind:carprice="carprice"
               v-bind:downpayment="downpayment"></login>
        <dl v-bind:class="sodata.if.fade" v-if="sodata.if.pagebefore">
            <!--第一页-->
            <carprice v-if="sodata.if.pageone" v-bind:showhide="sodata.if.carprice" v-bind:carprice="carprice" v-bind:getcarprice="sodata.getdata.carprice" v-bind:clickspan="clickspan"></carprice>
            <downpayment v-if="sodata.if.pageone" v-bind:showhide="sodata.if.downpayment" v-bind:downpayment="downpayment" v-bind:getdownpayment="sodata.getdata.downpayment" v-bind:clickspan="clickspan"></downpayment>
            <!--第二页-->
            <professional v-if="sodata.if.pagetwo" v-bind:showhide="sodata.if" v-bind:professional="professional" v-bind:getdata="sodata.getdata" v-bind:clickspan="clickspan" ></professional>
            <monthlyincome v-if="sodata.if.pagetwo" v-bind:showhide="sodata.if" v-bind:monthlyincome="monthlyincome" v-bind:getdata="sodata.getdata" v-bind:clickspan="clickspan"></monthlyincome>
            <!--第三页-->
            <house v-if="sodata.if.pagethree" v-bind:showhide="sodata.if.house" v-bind:house="house" v-bind:gethouse="sodata.getdata.house" v-bind:clickspan="clickspan"></house>
            <credit v-if="sodata.if.pagethree" v-bind:showhide="sodata.if.credit" v-bind:credit="credit" v-bind:getcredit="sodata.getdata.credit" v-bind:clickspan="clickspan"></credit>
            <social v-if="sodata.if.pagethree" v-bind:showhide="sodata.if.social" v-bind:social="social" v-bind:getsocial="sodata.getdata.social" v-bind:clickspan="clickspan"></social>
        </dl>
        <div class="tab_page" v-if="sodata.if.pagebefore">
            <div class="s_box" v-if="sodata.if.pageone">
                <span class="cur"></span>
                <span></span>
                <span></span>
            </div>
            <div class="s_box" v-if="sodata.if.pagetwo">
                <span></span>
                <span class="cur"></span>
                <span></span>
            </div>
            <div class="s_box" v-if="sodata.if.pagethree">
                <span></span>
                <span></span>
                <span class="cur"></span>
            </div>
        </div>
        <!--第四页-->
        <pagefour v-if="sodata.if.pagefour" v-bind:sodata="sodata" v-bind:channelurl="channelurl" v-ref="valid"></pagefour>
    </div>
</template>

<script>
    import easing from './easing.vue';
    import login from './login.vue';
    import professional from './professional.vue';
    import monthlyincome from './monthlyincome.vue';
    import social from './social.vue';
    import credit from './credit.vue';
    import house from './house.vue';
    import carprice from './carprice.vue';
    import downpayment from './downpayment.vue';
    import pagefour from './pagefour.vue';
    /*import pagefive from './pagefive.vue';*/
    export default{
        el: '#template',
        props: ['easing','login','professional', 'monthlyincome','social','credit','house','carprice','downpayment','channelurl'],
        ready(){
            this.init();
        },
        data(){
            return {
                data: '',
                type:'A',
                sodata:{
                    if:{
                        professional:false,//职业身份
                        monthlyincome:false,//每月收入(元)
                        social:false,//社保情况
                        credit:false,//信用记录
                        house:false,//住房情况
                        carprice:false,//车价对应值
                        downpayment:false,//首付系数
                        txt:'10秒极速评估',
                        easing:true,
                        login:true,
                        pageone:false,//第一页
                        pagetwo:false,//第二页
                        pagethree:false,//第三页
                        pagebefore:false,//前三页
                        pagefour:false,//第四页
                        //pagefive:false,//第五页
                        fade:'conterbox',//动画
                        fadeone:true,//动画
                        fadetwo:true,//动画
                        fadethree:true,//动画
                        fadecarprice:true,//动画
                        listcarprice:'',//list-carprice
                        morehreflink:'',
                        //贷款额度:
                        easingNumber:'',
                        easingnumtxt:'',
                        //是否登陆
                        userlogin:'',
                        loanuserid:'',
                    },
                    getdata:{//传送数据
                        professional:'',//职业身份
                        monthlyincome:'',//每月收入
                        social:'',//社保情况
                        credit:'',//信用记录
                        house:'',//住房情况
                        carprice:'',//车价对应值
                        downpayment:''//首付系数
                    },
                    imgclass:{//点击后的class
                        professional:'',
                        monthlyincome:'',
                        social:'',
                        credit:'',
                        house:'',
                        carprice:'',
                        downpayment:''
                    }
                },

            }
        },
        components: {
            'easing': easing,
            'login': login,
            'professional': professional,
            'monthlyincome': monthlyincome,
            'social': social,
            'credit': credit,
            'house': house,
            'carprice': carprice,
            'downpayment': downpayment,
            'pagefour': pagefour,
            //'pagefive': pagefive
        },
       /* template: 'professional',*/
        methods: {
            //初始化数据:
            init:function () {
                let _self=this;
                _self.sodata.if.userlogin=tools.getCookie('mobile')
                $.ajax({
                    url: ershoucheUrl+'loan/GetLoanUserQualification',
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        if (res.Result) {
                            let data=res.Data
                            if (data.professional!== -1){
                                _self.sodata.if.professional=_self.sodata.getdata.professional=data.professional
                                _self.professional.forEach((val,i)=>{
                                    if (val.id==data.professional){
                                        _self.sodata.imgclass.professional=val.imgclass
                                    }
                                })
                            }
                            if (data.monthlyincome!== -1){
                                _self.sodata.if.monthlyincome= _self.sodata.getdata.monthlyincome=data.monthlyincome
                                _self.monthlyincome.forEach((val,i)=>{
                                    if (val.id==data.monthlyincome){
                                        _self.sodata.imgclass.monthlyincome=val.imgclass
                                    }
                                })
                            }
                            if (data.social!== -1){
                                _self.sodata.if.social=_self.sodata.getdata.social=data.social
                                _self.social.forEach((val,i)=>{
                                    if (val.id==data.social){
                                        _self.sodata.imgclass.social=val.imgclass
                                    }
                                })
                            }
                            if (data.credit!== -1){
                                _self.sodata.if.credit=_self.sodata.getdata.credit=data.credit
                                _self.credit.forEach((val,i)=>{
                                    if (val.id==data.credit){
                                        _self.sodata.imgclass.credit=val.imgclass
                                    }
                                })
                            }
                            if (data.house!== -1){
                                _self.sodata.if.house=_self.sodata.getdata.house=data.house
                                _self.house.forEach((val,i)=>{
                                    if (val.id==data.house){
                                        _self.sodata.imgclass.house=val.imgclass
                                    }
                                })
                            }
                            //关闭登陆页面
                            _self.sodata.if.easing = false
                            _self.sodata.if.login = false
                            //二手车价 首付比例
                            _self.sodata.if.pagebefore = true
                            _self.sodata.if.pageone = true;
                            _self.sodata.if.txt='选择我的购车方案';

                            _self.sodata.if.fadecarprice=false
                            /*_self.sodata.if.fade='conterbox hook'
                            setTimeout(function () {
                                _self.sodata.if.fade='conterbox'
                            },1000)*/
                        }
                    },
                    error: function(res) {
                        tools.showAlert(res.Message);
                    }
                });
            },
            //获取贷款额度的接口
            loanurl:function () {
                let _self=this
                $.ajax({
                    url: ershoucheUrl+'loan/getloan?mobile='+_self.sodata.if.userlogin+_self.channelurl,
                    type: 'post',
                    data: {
                        professional: _self.sodata.getdata.professional,
                        monthlyincome: _self.sodata.getdata.monthlyincome,
                        social: _self.sodata.getdata.social,
                        credit: _self.sodata.getdata.credit,
                        house: _self.sodata.getdata.house,
                        carprice: _self.sodata.getdata.carprice,
                        downpayment: _self.sodata.getdata.downpayment,
                        CityId:cityInfo.cityId

                    },
                    dataType: 'json',
                    beforeSend:function () {
                        /*tools.showAlert('努力评估中',10000);*/
                    },
                    success: function(res) {
                        if (res.Result) {
                            //滚动数据 此处应该有接口
                            _self.sodata.if.easingNumber = res.Data
                            _self.sodata.if.easingnumtxt=tools.addCmma(Number(_self.sodata.if.easingNumber))
                            //关闭前三页
                            _self.sodata.if.pagebefore=false
                            _self.sodata.if.pageone=false
                            _self.sodata.if.pagetwo=false
                            _self.sodata.if.pagethree=false
                            //打开第四页
                            _self.sodata.if.pagefour = true
                            _self.sodata.if.easing = true;
                            _self.sodata.if.list = true;
                            _self.sodata.if.txt='我的贷款额度'
                        } else {
                            tools.showAlert(res.Message);
                        }
                    },
                    error: function(res) {
                        tools.showAlert(res.Message);
                    },
                    complete: function() {
                        /*$('#showAlertBox').attr('style','opacity: 0; display: none;')
                         $('body').unbind('touchmove');
                         self.submitBtnDisabled = false;*/
                    }
                });
            },
            //点击span 数据
            clickspan:function (dataname,professional,itmes) {
                let _self=this,showif=_self.sodata.if,postdata=_self.sodata.getdata
                console.log(dataname,professional,itmes)
               /* $('.professional div').removeClass('hook');*/

                professional.forEach((val,i)=>{
                    professional[i].classname=''
                   // professional[i].imgclass='p_'+(i+1)
                })
                itmes.classname='cur'
                //itmes.imgclass=itmes.imgclass+' hook'
                /*getrofessional=itmes.id*/


                if (dataname==='professional'){
                    setTimeout(function () {
                        $('.professional div').removeClass('hook');
                    },1000)
                    _self.sodata.if.professional=true
                    _self.sodata.getdata.professional=itmes.id
                    _self.sodata.imgclass.professional=itmes.imgclass
                }else if (dataname==='monthlyincome'){
                    setTimeout(function () {
                        $('.imgbox .monthlyincome div').removeClass('hook');
                    },1000)
                    _self.sodata.if.monthlyincome=true
                    _self.sodata.getdata.monthlyincome=itmes.id
                    _self.sodata.imgclass.monthlyincome=itmes.imgclass
                }else if (dataname==='social'){
                    setTimeout(function () {
                        $('.imgbox .social div').removeClass('hook');
                    },1000)
                    _self.sodata.if.social=true
                    _self.sodata.getdata.social=itmes.id
                    _self.sodata.imgclass.social=itmes.imgclass
                }else if (dataname==='credit'){
                    setTimeout(function () {
                        $('.imgbox .credit div').removeClass('hook');
                    },1000)
                    _self.sodata.if.credit=true
                    _self.sodata.getdata.credit=itmes.id
                    _self.sodata.imgclass.credit=itmes.imgclass
                }else if (dataname==='house'){
                    setTimeout(function () {
                        $('.imgbox .house div').removeClass('hook');
                    },1000)
                    _self.sodata.if.house=true
                    _self.sodata.getdata.house=itmes.id
                    _self.sodata.imgclass.house=itmes.imgclass
                }else if (dataname==='carprice'){
                    _self.sodata.if.carprice=true
                    _self.sodata.getdata.carprice=itmes.id
                    _self.sodata.imgclass.carprice=itmes.imgclass
                    if (itmes.id==770){
                        _self.sodata.if.listcarprice='0|5'
                    }else if (itmes.id==771){
                        _self.sodata.if.listcarprice='5|10'
                    }else if (itmes.id==772){
                        _self.sodata.if.listcarprice='10|15'
                    }else if (itmes.id==773){
                        _self.sodata.if.listcarprice='15|20'
                    }else if (itmes.id==774){
                        _self.sodata.if.listcarprice='20|30'
                    }else if (itmes.id==1074){
                        _self.sodata.if.listcarprice='30|99999'
                    }
                    _self.sodata.if.morehreflink=_self.sodata.if.listcarprice.replace('|','z')
                }else if (dataname==='downpayment'){
                    _self.sodata.if.downpayment=true
                    _self.sodata.getdata.downpayment=itmes.id
                    _self.sodata.imgclass.carprice=itmes.imgclass
                }

                /*<!--第一页-->*/
                if (_self.sodata.if.carprice===true && _self.sodata.if.downpayment===true){
                    /*console.log()*/
                    let socialtrue=false
                    if (_self.sodata.getdata.social===0||_self.sodata.getdata.social===1){
                        socialtrue=true
                    }

                    if (_self.sodata.getdata.professional&&_self.sodata.getdata.monthlyincome&&socialtrue&&_self.sodata.getdata.credit&&_self.sodata.getdata.house){
                        _self.loanurl()
                    }else {
                        //关闭登陆页和第一页
                        _self.sodata.if.pageone=false
                        //打开第二页
                        _self.sodata.if.pagebefore=true
                        _self.sodata.if.pagetwo=true
                        _self.sodata.if.txt='选择我的个人资质'
                    }
                    /*_self.sodata.if.pagebefore=false
                    _self.sodata.if.pageone=false*/

                    if (_self.sodata.if.fadeone){
                        _self.sodata.if.fade='conterbox hook'
                        _self.sodata.if.fadeone=false
                        setTimeout(function () {
                            _self.sodata.if.fade='conterbox'
                        },1000)
                    }
                    //alert('1')
                }
                /*<!--第二页-->*/
                if (_self.sodata.if.professional===true && _self.sodata.if.monthlyincome===true){
                    _self.sodata.if.pagetwo=false
                    _self.sodata.if.pagethree=true
                    _self.sodata.if.txt='选择我的购车方案'
                    //alert(2+_self.sodata.if.fade+':'+_self.sodata.if.fadetwo)//fadetwo
                    if (_self.sodata.if.fadetwo){
                        _self.sodata.if.fade='conterbox hook'
                        _self.sodata.if.fadetwo=false
                        setTimeout(function () {
                            _self.sodata.if.fade='conterbox'
                        },1000)
                    }
                }
                /*<!--第三页-->*/
                if (_self.sodata.if.social===true && _self.sodata.if.credit===true && _self.sodata.if.house===true){
                    /*//关闭前三页
                    _self.sodata.if.pagebefore=false
                    _self.sodata.if.pageone=false
                    _self.sodata.if.pagetwo=false
                    _self.sodata.if.pagethree=false
                    //打开第四页
                    _self.sodata.if.pagefour = true
                    _self.sodata.if.easing = true;
                    _self.sodata.if.list = true;
                    _self.sodata.if.txt='我的贷款额度'*/
                    _self.loanurl()

                    if (_self.sodata.if.fadetwo){
                        _self.sodata.if.fade='conterbox hook'
                        _self.sodata.if.fadetwo=false
                        setTimeout(function () {
                            _self.sodata.if.fade='conterbox'
                        },1000)
                    }
                    //alert(3)
                }

                /*////console.log('hou:',_self.sodata.if.pageone,_self.sodata.if.pagetwo,_self.sodata.if.pagethree)*/
            }
        },
    }
</script>