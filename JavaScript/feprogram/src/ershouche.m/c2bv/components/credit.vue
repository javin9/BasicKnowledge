<template>
    <dt>信用记录</dt>
    <dd class="credit">
        <span v-for="itmes in credit" v-bind:data-id="itmes.id" v-text:="itmes.txt" v-bind:class="itmes.classname"
              v-on:click="clickspan('credit',credit,itmes)"></span>
    </dd>
</template>

<script>
    export default{
        name: 'credit',
        props: ['credit','showhide','getdata','clickspan'],
        questions:[],
        ready(){
        }
    }
</script>