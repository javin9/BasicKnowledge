<template>
    <dt>住房情况</dt>
    <dd class="house">
        <span v-for="itmes in house" v-bind:data-id="itmes.id" v-text:="itmes.txt" v-bind:class="itmes.classname"
              v-on:click="clickspan('house',house,itmes)"></span>
    </dd>
</template>

<script>
    export default{
        name: 'house',
        props: ['house','showhide','getdata','clickspan'],
        questions:[],
        ready(){
        }
    }
</script>