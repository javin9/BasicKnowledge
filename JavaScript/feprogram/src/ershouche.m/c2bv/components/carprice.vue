<template>
    <dt>二手车价</dt>
    <dd class="carprice">
        <span v-for="itmes in carprice" v-bind:data-id="itmes.id" v-text:="itmes.txt" v-bind:class="itmes.classname"
              v-on:click="clickspan('carprice',carprice,itmes)"></span>
    </dd>
</template>

<script>
    export default{
        name: 'carprice',
        props: ['carprice','showhide','getdata','clickspan'],
        questions:[],
        ready(){
        }
    }
</script>