import './indexnew.scss'
import Vue from 'vue'
import vueResource from 'vue-resource'
import HomeView from './pages/home'

Vue.use(vueResource)

new Vue({
    el: '#main',
    props:['source','channel','focusbannerurl','receivecouponcardurl','createorderurl','checkcodeurl','getcodeurl','successpageurl',
        'cityname','cityid','carid','carname','isshowcouponcard','isshowbottom','quafields','titlecontent'],
    template: `<home-view 
                    :source="source"
                    :channel="channel"
                    :from="from"
                    :focusbannerurl="focusbannerurl"
                    :receivecouponcardurl="receivecouponcardurl"
                    :createorderurl="createorderurl"
                    :checkcodeurl="checkcodeurl",
                    :getcodeurl="getcodeurl"
                    :successpageurl="successpageurl"
                    :cityname="cityname"
                    :cityid="cityid"
                    :carid="carid"
                    :carname="carname"
                    :isshowcouponcard="isshowcouponcard"
                    :isshowbottom="isshowbottom"
                    :quafields="quafields"
                    :titlecontent="titlecontent"
                    >
                </home-view>`,
    components: {
        HomeView
    },
    data(){
        return{
            from:tools.getUrlParam('from'),
        }
    },
    ready(){
    },
})
