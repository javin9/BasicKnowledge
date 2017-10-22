<template>
    <dt>首付比例</dt>
    <dd class="downpayment">
        <span v-for="itmes in downpayment" v-bind:data-id="itmes.id" v-text:="itmes.txt" v-bind:class="itmes.classname"
              v-on:click="clickspan('downpayment',downpayment,itmes)"></span>
    </dd>
</template>

<script>
    export default{
        name: 'downpayment',
        props: ['downpayment','showhide','getdata','clickspan'],
        questions:[],
        ready(){
        }
    }
</script>