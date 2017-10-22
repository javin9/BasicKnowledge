<template>
    <div class="information_box">
        <ul class="info_ul">
            <li class="itmes" v-on:click="selectCar(e)">
                <i class="i icon_1"></i>
                <div class="tit">选择车型</div>
                <div class="txt" v-html="getdata.carmodels"></div>
            </li>
            <li class="itmes" v-on:click="selecttime" id="selecttime">
                <i class="i icon_2"></i>
                <div class="tit">首次上牌</div>
                <div class="txt" v-html="getdata.timebrand"><span class="col_grey">请选择上牌时间</span></div>
            </li>
            <li class="itmes mli">
                <i class="i icon_3"></i>
                <div class="tit">表显里程</div>
                <div class="txt_2">
                    <div class="inp_box">
                        <input type="number" v-model="getdata.mileage" @input="mili" @blur="mili" @focus="mili" @keydown.space.prevent id="" v-bind:class="mobileNumbercla ? 'col_red' : ''" id="mili" placeholder="支持2位小数">
                    </div>
                    <div class="txt_box">万公里</div>
                </div>
            </li>
            <li class="itmes" v-on:click="selectcity()">
                <i class="i icon_4"></i>
                <div class="tit">上牌城市</div>
                <div class="txt" v-text="getdata.city">ali</div>
            </li>
        </ul>

        <picker :picker-data="pickerData" :title="title" type="android" @selected="onSelected" :default-index="defaultIndex" ></picker>
        <city-select v-bind:only-city-list="true" get-city-list="http://test.webapi.daikuan.com/base/region/GetCityList" share-city-url="http://test.webapi.daikuan.com/base/region/SearchCity" interface="http://test.webapi.daikuan.com/base/region/GetGroupingProvinceList" get-hot-areas-url="http://test.ershouche.mr.daikuan.com/Interface/GetHotAreas" @selected="selectedHanlder" location-city-id="201" location-city-name="北京" location-city-spell="beijing"></city-select>
    </div>
</template>

<script>
    /*### 使用
     <picker :picker-data="pickerData" :title="title" type="android" @selected="onSelected" :default-index="defaultIndex" ></picker>
     ### props
     * pickerData : Array, 选项数据，如果是多个选项则如需要传入一个多纬数组
     * title: String, 选项的标题
     * type: String, 选择框的类型 'ios','android'两种,默认 ios
     * selected: Function, 选择结果回调函数
     * defaultIndex: Array, 默认选项从0开始
     ### events
     * openPicker: 显示选择弹层*/
    import car from 'libs/carSelect';
    import datePicker from 'libs/datePicker';
    import picker from 'libs/vue-components/picker/index.vue';
    import CitySelect from 'libs/vue-components/city-select'
    import check from 'libs/check/m.js';

    export default{
        name: 'information',
        props: ['getdata','other'],
        data(){
            return{
                pickerData:[],
                title:'弹层',
                defaultIndex:[6],
                index:'',
            }
        },
        ready(){
            let _self=this;
           /* var datePicker2 = new datePicker({
                'trigger': '#selecttime', //标签id
                'type': 'ym', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
                'minDate':_self.getdata.timemin, //最小日期 '1900-1-1',
                'maxDate':_self.getdata.timemax , //最大日期//new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
                CallBacks: function(obj){
                    console.log(obj,_self.getdata.timemin,_self.getdata.timemax)
                    /!*month: "06"
                     year:2011*!/
                }
            });*/
        },
        components: {'picker': picker,'CitySelect': CitySelect,},
        methods: {
            //选车型
            selectCar(e){
                var _self = this;
                car.carSelect({
                    onlyOnSale: true,
                    showLevel: 3,
                    showAllBrand: false,
                    showSearch:false,
                    hide:true
                }, function (res) {
                    console.log(res)
                    let min='',max='',cardata=Number(res.year),getyear=new Date().getFullYear(),getmonth=new Date().getMonth()
                    _self.getdata.carmodels = res.brand.masterBrandName+' '+res.brand.name+' '+res.year+'款'+' '+res.carType.name
                    _self.getdata.carmodelsid = res.carType.id
                    //2003 2017 6  cardata-1 cardata+2
                    if (cardata+2===getyear){
                        _self.getdata.timemin= cardata-1+'-'+'1'
                        _self.getdata.timemax= getyear+'-'+getmonth
                    }else if (cardata+2<getyear){
                        _self.getdata.timemin= (cardata-1)+'-'+'1'
                        _self.getdata.timemax= (cardata+2)+'-'+'1'
                    }else if (cardata+2>getyear){
                        _self.getdata.timemin= (cardata-1)+'-'+'1'
                        _self.getdata.timemax= getyear+'-'+getmonth
                    }

                    //首次上牌 重置
                    _self.getdata.timebrand='<span class="col_grey">选择上牌时间</span>'
                    //
                    if (_self.getdata.timemin===''&&_self.getdata.timemax ===''){
                        tools.showAlert('请先选择车型');
                    }else {
                        var datePicker2 = new datePicker({
                            'trigger': '#selecttime', //标签id
                            'type': 'ym', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
                            'minDate':_self.getdata.timemin, //最小日期 '1900-1-1',
                            'maxDate':_self.getdata.timemax, //最大日期//new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
                            CallBacks: function(obj){
                                _self.getdata.timebrand=obj.year+'年'+obj.month+'月'

                            }
                        });
                    }
                    _self.other;
                })
            },
            //首次上牌
            selecttime(){
                let _self=this;
                if (_self.getdata.timemin===''&&_self.getdata.timemax ===''){
                    tools.showAlert('请先选择车型');
                }

                setTimeout(function () {
                    if ($('.date_yy').length!==0){
                        $('.date_yy').css('transform','translate3d(0px, 6em, 0px)')
                        $('.date_yy').attr('top','6em')
                    }
                },200)

            },
            //表显里程
            mili: function(event) {
                var _self=this, elem = event.target,
                        val = _self.getdata.mileage,//.replace(/\s/g, "")
                        checkpass = true;
                _self.getdata.mileage=val;
                switch (event.type) {
                    case 'focus':
                        fib(val)
                    case 'input':
                        fib(val)
                        break;
                    case 'blur':
                        fib(val)
                        break;
                    default:
                        break;
                }
                function fib(val) {
                    if (val.indexOf('.')!==-1){
                        let befor=val.split('.')[0],atfter=val.split('.')[1],bleg=befor.length,aleg=atfter.length
                        if (bleg>2||aleg>2){
                            _self.getdata.mileage=befor.substring(0,2)+'.'+atfter.substring(0,2)
                        }
                    }else {
                        _self.getdata.mileage=_self.getdata.mileage.substring(0,2)
                    }
                }

            },
            //城市
            selectcity(){
                this.$broadcast('showCitySelect');
            },
            selectedHanlder(res){
                let _self=this
                _self.getdata.city=res.name
                _self.getdata.cityid=res.id

            },



            //点击li 呼出数据:
            sel(i,items){
                /*console.log('qian:',this.defaultIndex)*/
                let _self=this,a=Number(items.defaultIndex)
                _self.defaultIndex[0]=a
                _self.pickerData=items.data
                this.$broadcast('openPicker')
                _self.index=i;
                console.log('hou:',this.defaultIndex,_self.index)
            },
            onSelected(res){
                console.log('reshuoqu:',this.defaultIndex,res,this.index)
                let _self=this
                _self.valid[_self.index].txt=res[0].text;
                if (_self.index===0){
                    _self.getdata.professional=res[0].text;
                    _self.getdata.professionalid=res[0].value;
                }else if (_self.index===1){
                    _self.getdata.monthlyincome=res[0].text;
                    _self.getdata.monthlyincomeid=res[0].value;
                }else if (_self.index===2){
                    _self.getdata.social=res[0].text;
                    _self.getdata.socialid=res[0].value;
                }else if (_self.index===3){
                    _self.getdata.house=res[0].text;
                    _self.getdata.houseid=res[0].value;
                }
            },
            //获取所以数据 提交
            /*getdata:{//传送数据
             professional:professional||'',//职业身份
             monthlyincome:monthlyincome||'',//每月收入
             social:social||'',//社保情况
             house:house||'',//住房情况
             mobile:tools.getCookie('mobile')||'',
             },http://test.ershouche.m.daikuan.com/Interface/SubmitThread?mobile=185187481428&code=448679&source=8888*/
            submit(){
                let _self=this, valmob =_self.getdata.mobile,valcode =_self.getdata.code,codetrue=false;
                if (valcode.length !==6) {
                    codetrue=true
                }

                if (!check.isPhoneNumber(valmob)){
                    tools.showAlert('请输入正确手机号');
                }else if (codetrue){
                    tools.showAlert('请输入正确验证码');
                }else {
                    console.log(_self.getdata)
                    $.ajax({
                        url: ershoucheUrl+'Interface/SubmitThread?mobile='+valmob+'&code='+valcode+'&source='+source+'&channel='+channel,
                        type: 'post',
                        data: {
                            professional:_self.getdata.professionalid,//职业身份
                            monthlyincome:_self.getdata.monthlyincomeid,//每月收入
                            social:_self.getdata.socialid,//社保情况
                            house:_self.getdata.houseid,//住房情况
                        },
                        dataType: 'json',
                        success: function(res) {
                            if (res.Result){
                                window.href=ershoucheUrl+'/ok'
                            }else {
                                tools.showAlert(res.Message);
                            }
                        }
                    })
                }
            },
            //点击span 数据

        },
    }
</script>
<style>
    .carSelectSecondLevel-carlist-detail-price,.carSelectThirdLevel-carlist-detail-price{display: none!important;}
    .carSelectThirdLevel-carlist-detail-name{line-height:1.3rem;}
</style>