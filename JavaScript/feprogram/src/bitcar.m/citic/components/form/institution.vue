<template>
    <dl class="components-institution">
        <dt>金融机构</dt>
        <dd class="arrow-right" @click="institutionHandler">{{{defaultInstitution}}}</dd>
    </dl>
    <picker :picker-data="pickerData" type="android" @selected="onSelected" :default-index="defaultIndex" ></picker>
</template>

<script>
    import Picker from 'libs/vue-components/picker';
    export default{
        props: {
            institution:{
                type:Array,
                default:[]
            },
            emergencyContactInstitution:{
                type:Number,
                default:0
            }
        },
        data(){
            return {
                pickerData:this.institution,
                defaultIndex:[],
                defaultInstitution:'<span style="color:#C4C4C4">请选择金融机构</span>',
                defaultId: 0
            }
        },
        watch:{
            defaultInstitution(value){
                if(this.defaultInstitution.indexOf("span")<0){
                    this.$dispatch("checkForm","institution",true,this.defaultId)
                }else{
                    this.$dispatch("checkForm","institution",false)
                }
            }
        },
        components: {
            Picker
        },
        methods: {
            onSelected(res){
                this.defaultInstitution = res[0].text;
                this.defaultId = res[0].value;
            },
            institutionHandler(){
                this.$broadcast('openPicker');
            }
        },
        computed: {},
        ready(){
            if(this.emergencyContactInstitution>=1){
                this.$dispatch("checkForm","institution",true,this.emergencyContactInstitution)
                this.institution.forEach((item,index)=>{
                    if(item.value === this.emergencyContactInstitution){
                        this.defaultId = this.emergencyContactInstitution
                        this.defaultIndex = [index];
                        if(item.text){
                            this.defaultInstitution = item.text;
                        }
                        return false;
                    }else{

                    }
                })
            }else{
                this.$dispatch("checkForm","institution",false);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './_mixin.scss';
    .components-institution{
        @include form-element();
        border-bottom:none;
    }
</style>
