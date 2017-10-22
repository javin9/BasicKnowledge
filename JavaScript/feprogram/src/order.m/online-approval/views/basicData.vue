<template>
    <div class="basic-data-wrapper">
        <div class="basic-data-main">
            <component-header title="基本信息"></component-header>
            <step-header :step-num="curStep"></step-header>
            <div class="step-wrapper step1-wrapper" v-show="curStep===1">
                <div class="step-tip">常住城市需与购车城市一致</div>
                <component-city :cur-city="curCity"></component-city>
                <component-address :value="qualification.LivingDetailAddress?qualification.LivingDetailAddress:''"></component-address>
            </div>
            <div class="step-wrapper step2-wrapper" v-show="curStep===2">
                <component-company :value="qualification.WorkUnit?qualification.WorkUnit:''"></component-company>
            </div>
            <div class="step-wrapper step3-wrapper" v-show="curStep===3">
                <div class="step-tip">请填写紧急联系人的相关信息</div>
                <component-relationship :relationship="relationship" :emergency-contact-relationship="qualification.EmergencyContactRelationship"></component-relationship>
                <component-name :value="qualification.EmergencyContact?qualification.EmergencyContact:''"></component-name>
                <component-mobile :value="qualification.EmergencyContactMobile?qualification.EmergencyContactMobile:''"></component-mobile>
            </div>
        </div>
    </div>
    <component-button :disabled="btnDisabled" @click="clickHandler" :text="btnTxt"></component-button>
</template>

<script type="text/ecmascript-6">
    import ComponentHeader from 'libs/header/index.vue';
    import StepHeader from '../components/stepHeader.vue';
    import ComponentButton from '../components/form/button.vue';
    import ComponentCity from '../components/form/city.vue';
    import ComponentAddress from '../components/form/address.vue';
    import ComponentCompany from '../components/form/company.vue';
    import ComponentRelationship from '../components/form/relationship.vue';
    import ComponentName from '../components/form/name.vue';
    import ComponentMobile from '../components/form/mobile.vue';
    export default{
        props: {
            relationship:{
                type:Array,
                default:[]
            },
            defaultCity:{
                type:Object,
                default:{
                    Id:0,
                    Name:'0'
                }
            },
            qualification:{
                type:Object,
                default:{}
            },
            addressSettingUrl:{
                type:String,
                default:''
            },
            workUnitSettingUrl:{
                type:String,
                default:''
            },
            contactSettingUrl:{
                type:String,
                default:''
            },
            toLoginUrl:{
                type:String,
                default:''
            },
            approvalInfoUrl:{
                type:String,
                default:''
            },
            step:{
                type:Number,
                default:0
            }
        },
        data(){
            return {
                curStep:this.step+1,
                curCity:this.defaultCity,
                btnDisabled:true,
                btnTxt:'下一步',
                childOrderId:tools.getUrlParam("childOrderId"),
                orderId:tools.getUrlParam("orderId"),
                defaultData:{},
                checkItem:{
                    city:false,
                    address:false,
                    company:false,
                    relationship:false,
                    name:false,
                    mobile:false
                },
                valueItem:{
                    city:'',
                    address:'',
                    company:'',
                    relationship:'',
                    name:'',
                    mobile:''
                }
            }
        },
        components: {
            ComponentHeader,
            StepHeader,
            ComponentButton,
            ComponentCity,
            ComponentAddress,
            ComponentCompany,
            ComponentRelationship,
            ComponentName,
            ComponentMobile
        },
        methods: {
            clickHandler(){
                if(!this.btnDisabled){
                    if(this.curStep == 1){
                        this.stepHandler(1);
                    }else if(this.curStep == 2){
                        this.stepHandler(2);
                    }else{
                        this.stepHandler(3);
                    }
                }
            },
            postData(url,params,step){
                this.btnDisabled = true;
                this.$http.post(url,params).then(response=>response.json().then(res=>{
                    if(res.Result){
                        this.btnDisabled = false;
                        if(step === 1){
                            this.curStep = 2;
                        }else if(step === 2){
                            this.curStep = 3;
                            this.btnTxt = "完成";
                        }else{
                            window.location.href = `${this.approvalInfoUrl}?orderId=${this.orderId}&childOrderId=${this.childOrderId}`;
                        }
                        this.btnState();
                    }else if(res.Data == -1){
                        this.btnDisabled = false;
                        window.location.href = this.toLoginUrl;
                    }else{
                        tools.showAlert(res.Message);
                        this.btnDisabled = false;
                    }
                }))

            },
            stepHandler(step){
                this.btnDisabled = true;
                var params={
                    childOrderId:this.childOrderId,
                    orderId:this.orderId
                };
                if(step === 1){
                    if(this.qualification.LiviingCityID && this.valueItem.city != this.qualification.LiviingCityID){
                        tools.showAlert("常住城市需与购车城市一致");
                        return false;
                    }
//                    params.cityId = this.valueItem.city;
                    if(this.qualification.LivingDetailAddress != this.valueItem.address){
                        params.address=this.valueItem.address;
                    }
                    this.postData(this.addressSettingUrl,params,1);
                }else if(step === 2){
                    if(this.qualification.WorkUnit != this.valueItem.company){
                        params.workUnit = this.valueItem.company
                    }
                    this.postData(this.workUnitSettingUrl,params,2);
                }else{
                    if(this.qualification.EmergencyContactRelationship != this.valueItem.relationship){
                        params.relationship = this.valueItem.relationship;
                    }
//                    console.log(this.qualification.EmergencyContact , this.valueItem.name)
                    if(this.qualification.EmergencyContact != this.valueItem.name){
                        params.contactName = this.valueItem.name;
                    }
                    if(this.qualification.EmergencyContactMobile != this.valueItem.mobile){
                        params.contactMobile = this.valueItem.mobile;
                    }
                    this.postData(this.contactSettingUrl,params);
                }
            },
            btnState(){
                if(this.curStep === 1 && this.checkItem.city && this.checkItem.address){
                    this.btnDisabled = false;
                }else if(this.curStep === 2 && this.checkItem.company){
                    this.btnDisabled = false;
                }else if(this.curStep === 3 && this.checkItem.relationship && this.checkItem.mobile && this.checkItem.name){
                    this.btnDisabled = false;
                }else{
                    this.btnDisabled = true;
                }
            }
        },
        events:{
          checkForm(name,bln,val){
            this.checkItem[name] = bln;
            if(bln){
                this.valueItem[name] = val;
            }
            this.btnState();
          }
        },
        computed: {},
        ready(){

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .basic-data-wrapper{
        height: auto;
        min-height: 100%;
        .basic-data-main{
            padding-bottom:px2rem(100);
        }
    }
    .step-tip{
        height:px2rem(66);
        padding:0 px2rem(30);
        background: #FFF4EA;
        @include fsize(26);
        color: #FF8C39;
        line-height:px2rem(66);
        margin-top:px2rem(10);
    }
    .step2-wrapper{
        border-top:px2rem(20) solid #f5f5f5;
    }
</style>
