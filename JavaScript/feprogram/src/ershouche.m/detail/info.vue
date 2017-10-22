<template>
    <div class="detail_car_info">
        <div class="car_name">{{viewPackageInfo.name}}</div>
        <div class="car_info">
            <div class="fl">
                <span class="col_red">首付 {{tomoney(viewPackageInfo.downPayment*10000)}}起</span>
                <span class="col_grey9" v-show="viewPackageInfo.newCarPrice=='0.00'">车主报价:{{viewPackageInfo.price}}万</span>
                <span class="col_grey9" v-show="viewPackageInfo.newCarPrice!='0.00'">车主报价:{{viewPackageInfo.price}}万/新车含税:{{parseFloat(viewPackageInfo.newCarPrice).toFixed(2)}}万</span>
            </div>
        </div>
        <div v-show="viewPackageInfo.IsGuZhi" class="car-jinzhengu">
            <span class="car-jinzhengu-title">精真估</span>
            <span class="car-jinzhengu-text">参考区间:{{viewPackageInfo.intervalPrice}}万</span>
        </div>
        <div class="car-desc">
            已选:"首付{{viewPackageInfo.downPaymentRate*100}}%" "还款{{viewPackageInfo.repaymentPeriod}}期" "{{viewPackageInfo.packageName}}"
            <i></i>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

export default {
    props: ['viewPackageInfo']
    ,
    data() {

    },
    watch: {
    },
    events: {

    }
    ,
    methods: {
        tomoney(qian) {
            qian = (parseFloat(qian) / 10000);
            return (qian >= 1 ? qian.toFixed(2) + "万" : parseInt(qian * 10000) + '元')
        },
        LimitNumber(txt) {
            var str = txt;
            if (str.length > 5) {
                str = str.substr(0, 5) + '...';
                return str;
            } else {
                return str;
            }

        }
    },
    ready() {
    }
    ,
    components: {

    }
}
</script>
