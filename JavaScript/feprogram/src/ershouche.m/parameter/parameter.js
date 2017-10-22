import './parameter.scss';
import Vue from 'vue';
import bottombtn from '../components/bottombtn.vue';

var wm = new Vue({
    el: '#param',
    ready() {
        $('.param-nav .left').removeClass('hide');
        /*console.log(this.bottombtn)*/
    },
    data() {
        return {
            isShowClassify: false,
            isShowBtn: true,
            bottombtn: {
                src: this.getQueryString('src'),
                paydown: this.getQueryString('paydown'),
                monthly: this.getQueryString('monthly'),
                tel: this.getQueryString('tel'),
            }
        }
    },
    components: { 'bottombtn': bottombtn, },
    methods: {
        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        //分类icon事件
        showClassify(e) {
            e.stopPropagation();
            this.isShowClassify = !this.isShowClassify;
        },
        //点击除分类icon的事件
        setClassify() {
            this.isShowClassify = false;
        },
        //滚动模拟
        myscrollTop(scrollTo, time) {
            var scrollFrom = parseInt(document.body.scrollTop),
                i = 0,
                runEvery = 5; // run every 5ms

            scrollTo = parseInt(scrollTo);
            time /= runEvery;

            this.setClassify()

            var interval = setInterval(function() {
                i++;

                document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

                if (i >= time) {
                    clearInterval(interval);
                }
            }, runEvery);
        },
        onClickToScroll(id) {
            console.log(id)
            let _top = $('#' + id).offset().top;
            this.myscrollTop(_top, 400);
        },
        applyNow() {
            $("#orderInfoForm").find('input[name="Orders"]').val(this.getQueryString('Orders'));
            $("#orderInfoForm").find('input[name="CarId"]').val(this.getQueryString('carid'));
            $("#orderInfoForm").find('input[name="CityId"]').val(this.getQueryString('cityid'));
            $("#orderInfoForm").find('input[name="CarPrice"]').val(this.getQueryString('CarPrice'));
            $("#orderInfoForm").find('input[name="Source"]').val(this.getQueryString('Source'));
            $("#orderInfoForm").find('input[name="Channel"]').val(this.getQueryString('Channel'));
            $("#orderInfoForm").find('input[name="From"]').val(this.getQueryString('From'));
            $("#orderInfoForm").find('input[name="UcarId"]').val(this.getQueryString('UcarId'));
        }
    }
});