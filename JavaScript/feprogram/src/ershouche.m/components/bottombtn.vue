<template>
    <div class="bottom_submit" v-show="isShowBtn">
        <div class="car_info_box">
            <div class="img">
                <img v-bind:src="bottombtn.src">
            </div>
            <div class="txt">
                <div class="paydown">首付
                    <span class="col_red" v-text="bottombtn.paydown">-</span>
                </div>
                <div class="monthly">月供
                    <span class="col_red" v-text="bottombtn.monthly">-</span>
                </div>
            </div>
        </div>
        <a v-bind:href="'tel:'+bottombtn.tel" v-if="bottombtn.tel!=''" class="adviser_box">
            <i class="tell"></i>
            <span class="t">顾问</span>
        </a>
        <div class="submit_btn" v-on:click="submit()">立即申请</div>
    </div>
</template>

<script>

export default {
    name: 'information',
    props: ['bottombtn', 'submit', 'isShowBtn', 'applyNow'],
    data() {
        return {
            adviser: false,
        }
    },
    watch: {

    },
    ready() {

    },
    methods: {
        //生成订单:
        submit() {
            if (typeof (this.applyNow) == "function") {
                this.applyNow();
            }
            document.getElementById("orderInfoForm").submit();
        },
    },
}
</script>
