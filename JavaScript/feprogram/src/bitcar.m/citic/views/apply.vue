<template>
    <div class="header-title">易鑫车贷平台</div>
    <component-mobile el="mobile" title="申请人手机" mark="applicantMobile" :state="applicantMobileState"></component-mobile>
    <component-v-code :mobile-correct="mobileCorrect"></component-v-code>
    <component-name title="申请人姓名" mark="applicantName"></component-name>
    <component-id></component-id>
    <component-name title="客户经理姓名" mark="managerName"></component-name>
    <component-mobile title="客户经理手机" mark="managerMobile"></component-mobile>
    <component-btn v-show="btnShow" :disabled="btnDisabled" @submitclick="btnSubmit"></component-btn>
</template>

<script type="text/ecmascript-6">
    import ComponentMobile from '../components/form/mobile.vue'
    import ComponentName from '../components/form/name.vue'
    import ComponentBtn from '../components/form/button.vue'
    import ComponentId from '../components/form/id.vue'
    import ComponentVCode from '../components/form/vcode.vue'
    import check from 'libs/check/m';

    export default{
        props: {
            codeValidatingUrl:{
                type:String,
                default:''
            },
            applyOrderUrl:{
                type:String,
                default:''
            },
            citicFormDataUrl:{
                type:String,
                default:''
            },
            appInfo:{
                type:Object
            }
        },
        data(){
            return {
                winHeight:0,
                btnShow:true,
                citicSendInfoForm:null,
                mobileCorrect:false,
                valueItem:{
                    applicantName:"",
                    applicantMobile:"",
                    managerMobile:"",
                    managerName:"",
                    id:"",
                    vcode:""
                },
                checkItem:{
                    applicantName:false,
                    applicantMobile:false,
                    managerMobile:false,
                    managerName:false,
                    id:false,
                    vcode:false
                },
                applicantMobileState:"",
                btnDisabled:true
            }
        },
        components: {
            ComponentName,
            ComponentBtn,
            ComponentMobile,
            ComponentId,
            ComponentVCode
        },
        methods: {
            btnSubmit(){
                this.btnDisabled = true;
                tools.showAlert('提交中',1000000);
                let parameter = {
                    validatecode:this.valueItem.vcode,
                    mobile:this.valueItem.applicantMobile,
                    __RequestVerificationToken:$('input[name=__RequestVerificationToken]').val()
                };
                this.$http.post(this.codeValidatingUrl,parameter)
                    .then(response=>response.json().then(res=>{
                        if(res.Result){
                            this.applyOrder();
                        }else{
                            tools.showAlert(res.Message);
                            this.btnDisabled = false;
                        }
                    }))
            },
            applyOrder(){
                console.log(this.appInfo);
               let parameter = {
                   'CityId':this.appInfo.CityId,
                   'CarId':this.appInfo.CarId,
                   'Name':this.valueItem.applicantName,
                   'ApplyerTelphone':this.valueItem.applicantMobile,
                   'CustomerManagerName':this.valueItem.managerName,
                   'CustomerManagerMobile':this.valueItem.managerMobile,
                   'Channel':667,
                   'From':3044,
                   'CarPrice':this.appInfo.CarPrice,
                   'Orders':`${this.appInfo.PackageId}_${this.appInfo.ProductId}_0`,
                   'DownPayRate':this.appInfo.DownPayRate,
                   'LoanPeriod':this.appInfo.LoanPeriod,
                   'CertificateNumber':this.valueItem.id
               }
                this.$http.post(this.applyOrderUrl,parameter)
                    .then(response=>response.json().then(res=>{
                        if(res.Result){
                            tools.showAlert(`将由 ${this.appInfo.CompanyName} 为您进行在线审批！`,5000);
                            this.citicSendInfoForm = $("#citicSendInfoForm");
                            for(var item in res.Data){
                                this.citicSendInfoForm.find('input[name="'+ item +'"]').val(res.Data[item]);
                            }
                            console.log(this.citicSendInfoForm.find("input"))
                            this.citicSendInfoForm.submit();
                        }else{
                            tools.showAlert(res.Message);
                        }
                        this.btnDisabled = false;
                    }))
            }
        },
        computed: {},
        events:{
            mobileError(){
                this.applicantMobileState = "error"
            },
            inputStatus(status){
                if(status === "focus"){
                    this.btnShow = false;
                }else{
                    this.btnShow = true;
                }
            },
            checkForm(name,bln,val){
                this.checkItem[name] = bln;
                if(bln){
                    this.valueItem[name] = val;
                    if(name === "applicantMobile"){
                        this.mobileCorrect = true
                    }
                    if(this.valueItem.applicantName &&
                        this.valueItem.applicantMobile &&
                        this.valueItem.managerMobile &&
                        this.valueItem.managerName &&
                        this.valueItem.id &&
                        this.valueItem.vcode){
                        this.btnDisabled = false;
                    }
                }
            }
        },
        ready(){
            //修正按钮
            this.winHeight = $(window).height()
            $(window).resize(()=>{
                if($(window).height() >= this.winHeight){
                    this.btnShow = true;
                }
            });
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

</style>
