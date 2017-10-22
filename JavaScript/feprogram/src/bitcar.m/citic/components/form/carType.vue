<template>
    <dl class="components-car-type">
        <dt>车型</dt>
        <dd class="arrow-right" @click="selCarHandler">{{{defaultCar}}}</dd>
    </dl>
</template>

<script>
    import selCar from 'libs/carSelect';
    export default{
        props: {
            curCar:{
                type:Object
            },
        },
        data(){
            return {
                defaultCar:'<span style="color:#C4C4C4">请选车车型</span>',
            }
        },
        components: {},
        methods: {
            selCarHandler(){
                selCar.carSelect({
                    onlyOnSale: false,
                    showLevel: 3,
                    showAllBrand: false,
                    hide: true,
                    showSearch: false,
                    type: 'xinche'
                }, result => {
                    const brandName = result.brand.name.indexOf(result.masterBrand.name) >= 0 ? result.brand.name : `${result.masterBrand.name} ${result.brand.name}`
                    this.curCar = {
                        name: `${brandName} ${result.year}款 ${result.carType.name}`,
                        id: result.carType.id
                    }
                    this.defaultCar = `${brandName} ${result.year}款 ${result.carType.name}`;
                    this.$dispatch("checkForm","car",true,result.carType.id);
                })
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
    @import './mixin';
    .components-car-type{
        @include form-element();
    }
</style>
