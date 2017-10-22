<template>
    <dl class="components-city">
        <dt>常住城市</dt>
        <dd class="arrow-right" @click="selCity">{{curCity.Name}}</dd>
    </dl>
</template>

<script type="text/ecmascript-6">
    import SelCity from 'libs/citySelect';
    export default{
        props: {
            curCity:{
                type:Object,
                default:{
                    Id:0,
                    Name:''
                }
            }
        },
        data(){
            return {}
        },
        components: {},
        methods: {
            selCity(){
                SelCity.citySelect({
                    isSaveCookie:false
                },  res => {
                    this.curCity={
                        Id:res.CityId,
                        Name:res.CityName
                    }
                    this.$dispatch("checkForm","city",true,res.CityId)
                });
            },
        },
        computed: {},
        ready(){
            if(this.curCity.Id<1){
                this.$dispatch("checkForm","city",false)
            }else{
                this.$dispatch("checkForm","city",true,this.curCity.Id)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-city{
        @include form-element();
    }
</style>
