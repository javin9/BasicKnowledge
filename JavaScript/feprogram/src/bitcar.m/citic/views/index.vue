<template>
    <div class="header-title">易鑫车贷平台</div>
    <div class="form-wrapper">
        <component-city :cur-city="curCity"></component-city>
        <component-car></component-car>
        <component-institution :institution="institutionData" :emergency-contact-institution="80"></component-institution>
    </div>
    <component-mask :click="closeMask"></component-mask>
    <div class="select-wrapper" v-el:select-wrapper>
        <div :class="{'cur':downPaymentsShow||periodShow}">
            <div :class="{'option':true,'cur':curDownPaymentsClass}" @click="optionClickHandler('downPayments')">首付:{{downPayments*100}}%<i class="arrow"></i></div>
            <div :class="{'option':true,'cur':curPeriodClass}" @click="optionClickHandler('period')">期限:{{period}}期<i class="arrow"></i></div>
            <div class="option">参考价:{{referencePrice}}万</div>
            <component-select class="option-result" name="downPayments" :default-data="downPaymentsData" :is-show="downPaymentsShow" @selected="selectedHandler"></component-select>
            <component-select class="option-result" name="period" :default-data="periodData" :is-show="periodShow" @selected="selectedHandler"></component-select>
        </div>
    </div>

    <!--缺省-->
    <div class="default-box" v-show="isDefault && !isEmpty">
        <div class="default-img"></div>
        <div class="default-title">抱歉哦！没有找到匹配的金融产品~</div>
    </div>

    <div class="default-box fallback-box" v-show="isEmpty">
        <div class="default-title">请选择车型及金融机构</div>
    </div>

    <!--列表数据-->
    <ul class="list-box" v-show="!isDefault && listData.length>0">
        <li v-for="item in listData" >
            <i @click="itemClickhandler($event,$index)"></i>
            <img src="{{item.CompanyLogoUrl}}"/>
            <div>{{item.PackageName}}({{item.CompanyName}})</div>
        </li>
    </ul>
    <!--加载中-->
    <div class="login-box" v-show="isLoading">
        <div class="login-img"></div>
    </div>
    <div class="pages" @click="paging" v-show="isShowPages">
        点击展示更多金融产品
    </div>
    <component-btn @submitclick="submitClick" :disabled="btnDisabled"></component-btn>
</template>

<script>
    import ComponentHeader from 'libs/header/index.vue';
    import ComponentMask from 'libs/mask'
    import ComponentCity from '../components/form/city.vue';
    import ComponentCar from '../components/form/carType.vue';
    import ComponentInstitution from '../components/form/institution.vue'
    import ComponentSelect from '../components/form/select.vue'
    import ComponentBtn from '../components/form/button.vue'
    export default{
        props: {
            curCity:{
                type:Object,
                default:{
                    cityId: "201",
                    cityName: "北京",
                    citySpell: "beijing",
                    regionId: "201"
                }
            },
            carPriceInterface:{
                type:String
            },
            listInterface:{
                type:String
            },
            institutionData:{
                type:Array
            }
        },
        data(){
            return {
                scrollTop:0,
                pageIndex:1,
                pageSize:10,
                isShowPages:false,
                curPackageId:0,
                curProductId:0,
                btnDisabled:true,
                valueItem:{
                    city:this.curCity.cityId,
                    institution:null,
                    car:null
                },
                checkItem:{
                    city:false,
                    institution:false,
                    car:false
                },
                listData:[],
                isLoading:false,
                isDefault:true,
                isEmpty: true,
                isLoadedList: true,
                referencePrice:'0',
                downPayments:0.3,
                period:36,
                periodShow:false,
                curDownPaymentsClass:false,
                curPeriodClass:false,
                periodData:[{
                    text:'12期',
                    value:12,
                    isCur:false
                },{
                    text:'18期',
                    value:18,
                    isCur:false
                },{
                    text:'24期',
                    value:24,
                    isCur:false
                },{
                    text:'36期',
                    value:36,
                    isCur:true
                },{
                    text:'48期',
                    value:48,
                    isCur:false
                },{
                    text:'60期',
                    value:60,
                    isCur:false
                }],
                downPaymentsShow:false,
                orderInfoForm:null,
                downPaymentsData:[{
                                text:'0%',
                                value:0,
                                isCur:false
                            },{
                                text:'10%',
                                value:0.1,
                                isCur:false
                            },{
                                text:'20%',
                                value:0.2,
                                isCur:false
                            },{
                                text:'30%',
                                value:0.3,
                                isCur:true
                            },{
                                text:'40%',
                                value:0.4,
                                isCur:false
                            },{
                                text:'50%',
                                value:0.5,
                                isCur:false
                            },{
                                text:'60%',
                                value:0.6,
                                isCur:false
                            },{
                                text:'70%',
                                value:0.7,
                                isCur:false
                            }]
            }
        },
        components: {
            ComponentHeader,
            ComponentCity,
            ComponentCar,
            ComponentInstitution,
            ComponentSelect,
            ComponentMask,
            ComponentBtn
        },
        methods: {
            paging(){
                this.getList();
            },
            submitClick(){
                this.orderInfoForm.find('input[name="CityId"]').val(this.valueItem.city);
                this.orderInfoForm.find('input[name="CarId"]').val(this.valueItem.car);
                this.orderInfoForm.find('input[name="CompanyId"]').val(this.valueItem.institution);
                this.orderInfoForm.find('input[name="DownPayRate"]').val(this.downPayments);
                this.orderInfoForm.find('input[name="LoanPeriod"]').val(this.period);
                this.orderInfoForm.find('input[name="PackageId"]').val(this.curPackageId);
                this.orderInfoForm.find('input[name="ProductId"]').val(this.curProductId);
                this.orderInfoForm.find('input[name="CarPrice"]').val(this.referencePrice);
                this.btnDisabled = false;
                this.orderInfoForm.submit();
            },
            itemClickhandler(e,idx){
                if($(e.target).hasClass('cur')){
                    this.btnDisabled =  true;
                    $(e.target).removeClass('cur');
                }else{
                    $(e.target).addClass('cur').parent('li').siblings('li').find('i').removeClass('cur');
                    this.curPackageId = this.listData[idx].PackageId;
                    this.curProductId = this.listData[idx].ProductId;
                    this.btnDisabled =  false;
                }
            },
            pageScrollTop(){
                let mainHeight = $(window).height() + $('.select-wrapper').offset().top +1;
                $("#main").css({
                    'minHeight':mainHeight
                })
                tools.scroll($('.select-wrapper').offset().top+1,300);
            },
            getCarPrice(){
                this.$http.get(`${this.carPriceInterface}?cityId=${this.valueItem.city}&carId=${this.valueItem.car}`)
                    .then(response=>response.json().then(res=>{
                    if(res.Result){
                        this.referencePrice = res.Data.CarPriceText;
                        if(this.valueItem.institution){
                            this.listData=[];
                            this.pageIndex=1;
                            this.getList();
                        }
                    }
                }))

            },
            getList(){
                this.isLoading = true;
                this.isDefault = false;
                this.isEmpty = false;
                if(!this.isLoadedList){
                    tools.showAlert('大侠手太快了，等下再试试');
                    this.$broadcast('updateOption','downPayments',this.downPayments);
                    this.$broadcast('updateOption','period',this.period);
                    return false;
                }
                this.isLoadedList = false;
                this.$http.jsonp(`${this.listInterface}?cityId=${this.valueItem.city}&carId=${this.valueItem.car}&companyId=${this.valueItem.institution}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&downPaymentRate=${this.downPayments}&repaymentPeriod=${this.period}&carPrice=${this.referencePrice}`)
                    .then(response=>response.json().then(res=>{
                    this.isLoadedList = true;
                    if(res.Result){
                        if(res.Data.length>0){
                            this.isLoading = false;
                            this.isEmpty = false;
                            this.isDefault = false;
                            for(let i=0;i<res.Data.length;i++){
                                let _itemObj ={
                                    'CompanyLogoUrl':res.Data[i].CompanyLogoUrl,
                                    'PackageName':res.Data[i].PackageName,
                                    'CompanyName':res.Data[i].CompanyName,
                                    'PackageId':res.Data[i].PackageId,
                                    'ProductId':res.Data[i].ProductId
                                };
                                this.listData.push(_itemObj)
                            }
                        }else{
                            this.isLoading = false;
                            this.isDefault = true;
                            this.isEmpty = false;
                        }
                        if(this.pageIndex*this.pageSize<res.RowCount){
                            this.pageIndex++;
                            this.isShowPages = true;
                        }else{
                            this.isShowPages = false
                        }
                    }else{
                        this.isLoading = false;
                        this.isDefault = true;
                        this.isEmpty = true;
                    }
                }))
            },
            closeMask(){
                this.$broadcast('hideMask');
                $("#main").height('auto')
                this.periodShow = false;
                this.downPaymentsShow = false;
                this.curDownPaymentsClass = false;
                this.curPeriodClass = false;
            },
            optionClickHandler(str){
                if(str == 'downPayments'){
                    this.curDownPaymentsClass = ! this.curDownPaymentsClass;
                    this.curPeriodClass = false;
                    this.downPaymentsShow = !this.downPaymentsShow;
                    this.periodShow = false;
                }else{
                    this.curDownPaymentsClass = false;
                    this.curPeriodClass = !this.curPeriodClass;
                    this.periodShow = !this.periodShow;
                    this.downPaymentsShow = false;
                }
                if(this.downPaymentsShow || this.periodShow){
                    this.pageScrollTop();
                    this.$broadcast('showMask')
                }else{
                    $("#main").height('auto')
                    this.$broadcast('hideMask')
                }
            },
            selectedHandler(name,value){
                //选择首付期限
                this.$broadcast('hideMask')
                this.downPaymentsShow = false;
                this.periodShow = false;
                this.curDownPaymentsClass = false;
                this.curPeriodClass = false;

                if(this[name] != value && this.isLoadedList){
                    this[name] = value;
                }

                if(this.valueItem.city && this.valueItem.car &&this.valueItem.institution && this.referencePrice){
                    this.listData=[];
                    this.pageIndex=1;
                    this.getList();
                }
            }
        },
        computed: {

        },
        events:{
            checkForm(name,bln,val){
                this.checkItem[name] = bln;
                if(bln){
                    this.valueItem[name] = val;
                    if(this.valueItem.city && this.valueItem.car){
                        this.getCarPrice();
                    }
                }
            }
        },
        ready(){
            this.orderInfoForm = $("#orderInfoForm");
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .pages{
        height:px2rem(76);
        line-height:px2rem(76);
        display:block;
        color: #333;
        @include fsize(30);
        position:relative;
        top:px2rem(-156);
        text-align:center;
        background:#fff;
        border-top:px2rem(10) solid #f5f5f5;
    }
    .list-box{
        padding:px2rem(20) 0 px2rem(186) 0;
        li{
            display:flex;
            padding:px2rem(20) px2rem(30);
            img{
                display:block;
                width: px2rem(48);
                height: px2rem(48);
                margin-right:px2rem(20);
            }
            div{
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                @include fsize(30);
            }
            i{
                display:block;
                height: px2rem(48);
                width: px2rem(48);
                border-radius: 100%;
                background: transparent;
                border: 1px solid silver;
                margin-right:px2rem(26);
                &.cur{
                    position: relative;
                    border: 0;
                    background: #e9474d;
                    &:after {
                        content: ' ';
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        width: .26667rem;
                        height: .13333rem;
                        -webkit-transform: translate(-50%,-65%) rotate(-45deg);
                        transform: translate(-50%,-65%) rotate(-45deg);
                        border-left: .06667rem solid #fff;
                        border-bottom: .06667rem solid #fff;
                    }
                }
            }
        }
    }
    .login-box{
        padding-top: px2rem(20);
        margin-top: px2rem(20);
        min-height:px2rem(400);
        .login-img {
            width: px2rem(160);
            height: px2rem(160);
            margin: 0 auto;
            background: url(../../../common.m/images/loading_white.gif) no-repeat;
            background-size: px2rem(160) auto;
        }
    }

    .default-box {
        margin-top: px2rem(20);
        padding: px2rem(80) 0 px2rem(150);
        text-align: center;
        .default-img {
            width: px2rem(285);
            height: px2rem(186);
            margin: 0 auto;
            background: url(../../../common.m/images/no_data.png) no-repeat;
            background-size: 100%;
        }
        .default-title {
            padding: px2rem(50) 0 0;
            @include fsize(30);
            color: #333;
        }

        &.fallback-box{
            position: absolute;
            left:0;
            right:0;
            bottom:px2rem(140);
            top:px2rem(520);
            background: #fff;
            padding:0;
            line-height: 100%;
            text-align: center;
            margin:0;

            .default-title{
                padding:0;
                position: absolute;
                left:50%;
                top:50%;
                left:0;
                width: 100%;
                transform:translate(0,-50%);
            }
        }
    }
    .select-wrapper{
        background:#f5f5f5;
        z-index:8888;
        >div{
            position:relative;
            display:flex;
            padding:0 px2rem(30);
            text-align:center;
            z-index:8888;
            &.cur{
                background:#fff;
            }
         }
        .option{
            position:relative;
            flex: 1;
            line-height:px2rem(100);
            @include fsize(30);
            &:first-child{
                 text-align:left;
            }
            &:nth-child(3){
                 text-align:right;
                 width:px2rem(300);
                 flex: inherit;
            }
            &.cur{
                color:#e9474d;
                .arrow {
                    border-right:px2rem(10) solid transparent;
                    border-left:px2rem(10) solid transparent;
                    border-bottom:px2rem(10) solid #e9474d;
                    border-top: 0;
                }
             }
            .arrow {
                position:absolute;
                top:50%;
                transform: translate3d(0 ,-50%,0);
                width: 0;
                height: 0;
                border-left: px2rem(10) solid transparent;
                border-right:px2rem(10) solid transparent;
                border-bottom: 0;
                border-top: px2rem(10) solid #bebebe;
                margin-left:px2rem(10);
            }
        }
        .option-result{
            position: absolute;
            left:0;
            width:100%;
            top:px2rem(100);
        }
    }
</style>
