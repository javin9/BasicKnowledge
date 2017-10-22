<template>
    <dl class="components-city">
        <dt>购车城市</dt>
        <dd class="arrow-right" @click="selCityHandler">{{curCity.cityName}}</dd>
    </dl>
</template>

<script type="text/ecmascript-6">
    import SelCity from 'libs/citySelect';
    export default{
        props: {
            curCity:{
                type:Object,
                default:{
                    cityId:0,
                    cityName:''
                }
            }
        },
        data(){
            return {}
        },
        components: {},
        methods: {
            selCityHandler(){
                SelCity.citySelect({
                    isSaveCookie:false
                },  res => {
                    this.curCity={
                        cityId:res.CityId,
                        cityName:res.CityName
                    }
                    this.$dispatch("checkForm","city",true,res.CityId)
                });
            },
        },
        computed: {},
        ready(){
            if(this.curCity.cityId<1){
                this.$dispatch("checkForm","city",false)
            }else{
                this.$dispatch("checkForm","city",true,this.curCity.cityId)
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
