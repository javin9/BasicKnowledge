<template>
    <div class="number_easing">
        <div class="bg_border">
            <div class="num_box">
                <div class="num"></div>
                <div class="num"></div>
                <div class="num"></div>
                <div class="dou"></div>
                <div class="num"></div>
                <div class="num"></div>
                <div class="num"></div>
            </div>
            <div class="yuan"></div>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'easing',
        props: ['sodata'],
        data(){
            return {
                //显示隐藏
                fourinfo:true,
                sharebox:false,
                easingnum:'',
                easingnumtxt:'',
            }
        },
        components:{
            /*list:list,*/
        },
        questions:[],
        ready(){
            let _self=this
            $('.num_box .num').addClass('init')
            /*alert(_self.sodata.if.easingNumber)*/
            if (_self.sodata.if.easingNumber!==''){
                _self.easing();
            }
        },
        methods:{
            //数字滚动
            easing:function () {
                let _self=this;
                function numRand() {
                    //console.log(_self.sodata.if.easingNumber)
                    return _self.sodata.if.easingNumber;
                    //return 456789;
                }
                var isBegin = false,
                        dpr = $('html').attr('data-dpr'),
                        u = 50*dpr,
                        leg=$('.num').length,////console.log(index,leg)//index 0-5,leg 1-6
                        foreachi=leg,
                        bgy ='';

                if (dpr ==1){
                    bgy=1000/2*2
                }else if (dpr ==2){
                    bgy=1000*2
                }else if (dpr ==3){
                    bgy=(1000/2+1000)*2
                }
                $(".num").css('backgroundPositionY',0);
                var result = numRand();
                $('#res').text('摇奖出现的结果 = '+result);
                var num_arr = (result+'').split('');
                $(".num").each(function(index,val){
                    var _num = $(this);
                    _num.removeClass('init')
                    foreachi--
                    setTimeout(function(){
                        let y=''
                        if (num_arr[index]==0){
                            y = -(bgy)//70*5=350*2 - 350
                        }else {
                            y =-(u*num_arr[index])
                        }
                        _num.animate({backgroundPositionY: y},3000,'swing');

                    }, foreachi * 300);
                });
            },

        },
    }
</script>
