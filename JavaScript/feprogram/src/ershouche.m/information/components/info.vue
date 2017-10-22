<template>
    <div class="information_box">
        <ul class="info_ul">
            <li class="itmes" v-for="(index,items) in valid" v-on:click="sel(index,items)">
                <i class="i" v-bind:class="items.icon"></i>
                <div class="tit" v-text="items.title"></div>
                <div class="txt" v-html="items.txt"></div>
            </li>
        </ul>
        <div class="red_btn" v-on:click="submit">提交</div>
        <picker :picker-data="pickerData" :title="title" type="android" @selected="onSelected" :default-index="defaultIndex" ></picker>
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
    import picker from 'libs/vue-components/picker/index.vue';
    import check from 'libs/check/m.js';
    export default{
        name: 'information',
        props: ['valid','getdata'],
        data(){
            return{
                pickerData:[],
                title:'弹层',
                defaultIndex:[6],
                index:'',
            }
        },
        ready(){
            //console.log(this.getdata)
//            this.pickerData=this.valid[0].data
//            console.log('pickerData',this.valid[0].data,'-','-',this.pickerData);
        },
        components: {'picker': picker,},
        methods: {
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
                }else if (valcode==='000000'){
                    codetrue=false;
                    _self.getdata.code=''
                }



                if (!check.isPhoneNumber(valmob)){
                    tools.showAlert('请输入正确手机号');
                }else if (codetrue){
                    tools.showAlert('请输入正确验证码');
                }else {
                    console.log(_self.getdata)
                    $.ajax({
                        url: ershoucheUrl+'Interface/SubmitThread?mobile='+valmob+'&code='+valcode+'&source='+source,
                        type: 'post',
                        data: {
                            professional:_self.getdata.professionalid,//职业身份
                            monthlyincome:_self.getdata.monthlyincomeid,//每月收入
                            social:_self.getdata.socialid,//社保情况
                            house:_self.getdata.houseid,//住房情况
                            CityId:city.CityId,//城市id
                        },
                        dataType: 'json',
                        success: function(res) {
                            if (res.Result){
                                let channelurl = ''
                                let channels = tools.getUrlParam('channel')||''
                                if(channels){
                                    channelurl='&channel='+channels
                                }
                                window.location.href=ershoucheUrl+'custompageresult/?carId='+car.carId+'&carPrice='+car.carPrice+channelurl
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