<template>
    <dl class="components-relationship">
        <dt>关系</dt>
        <dd class="arrow-right" v-html="defaultRelationship" @click="relationshipHandler"></dd>
    </dl>
    <picker :picker-data="pickerData" type="android" @selected="onSelected" :default-index="defaultIndex" ></picker>
</template>

<script type="text/ecmascript-6">
    import Picker from 'libs/vue-components/picker';
    export default{
        props: {
            relationship:{
                type:Array,
                default:[]
            },
            emergencyContactRelationship:{
                type:Number,
                default:0
            }
        },
        data(){
            return {
                pickerData:this.relationship,
                defaultIndex:[],
                defaultRelationship:'<span style="color:#C4C4C4">请选择与紧急联系人的关系</span>',
                defaultId:0
            }
        },
        watch:{
            defaultRelationship(){
                if(this.defaultRelationship.indexOf("span")<0){
                    this.$dispatch("checkForm","relationship",true,this.defaultId)
                }else{
                    this.$dispatch("checkForm","relationship",false)
                }
            }
        },
        components: {
            Picker
        },
        methods: {
            onSelected(res){
                this.defaultRelationship = res[0].text;
                this.defaultId = res[0].value;
            },
            relationshipHandler(){
                this.$broadcast('openPicker');
            }
        },
        computed: {},
        ready(){
//            console.log(this.relationship)
            if(this.emergencyContactRelationship>=1){
                this.$dispatch("checkForm","relationship",true,this.emergencyContactRelationship)
                this.relationship.forEach((item,index)=>{
                    if(item.value === this.emergencyContactRelationship){
                        this.defaultIndex = [index];
                        if(item.text){
                            this.defaultRelationship = item.text;
                        }
                        return false;
                    }else{

                    }
                })
            }else{
                this.$dispatch("checkForm","relationship",false);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-relationship{
        @include form-element();
    }
</style>
