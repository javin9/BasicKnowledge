/**
 * Created by liuhaiwei on 2017/3/23.
 */
import '../css/ershouche.scss';
import './result.scss';
import Vue from 'vue';
var wm = new Vue({
    el:'#infopage',
    ready(){
        this.init();
    },
    components: {},
    template:``,
    data:{
        test:true,
    },
    methods: {
        init(){
            let _self=this
            $('.tabs li').on('click', function () {
                let _this = $(this), num = Number(_this.attr('data-id')), con = $('.list_cont_box .list_new_cont')
                $('.tabs li').removeClass('cur')
                _this.addClass('cur')
                console.log(num,num===0,num===1)
                if (num === 0) {
                    $('.tab_cont_box .conter').addClass('hide')
                    $('.tab_cont_box .conter').eq(num).removeClass('hide')
                } else if (num === 1) {
                    $('.tab_cont_box .conter').addClass('hide')
                    $('.tab_cont_box .conter').eq(num).removeClass('hide')
                }
            })
        },
    },

})

//声明变量





