<template>
    <section class="car_info_box">
        <div class="img"><img src={{carInfo.img}} data-echo={{carInfo.img}}></div>
        <div class="info">
            <h6>{{carInfo.fullName}}</h6>
            <div class="txt">{{carInfo.desc}}</div>
            <div class="price">{{carInfo.price}}</div>
        </div>
    </section>
</template>

<script>
    export default{
        el: '#template',
        props: ['easing'],
        ready(){
        },
        data(){
            return {
                data: '',
                carInfo:carInfoHtml
            }
        },
        components: {
        },
        methods: {
            //初始化数据:

            //获取贷款额度的接口

            //点击span 数据

        },
    }
</script>