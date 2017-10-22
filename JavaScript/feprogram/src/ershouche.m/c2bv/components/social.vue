<template>
    <dt>社保情况</dt>
    <dd class="social">
        <span v-for="itmes in social" v-bind:data-id="itmes.id" v-text:="itmes.txt" v-bind:class="itmes.classname"
              v-on:click="clickspan('social',social,itmes)"></span>
    </dd>
</template>

<script>
    export default{
        name: 'social',
        props: ['social','showhide','getdata','clickspan'],
        questions:[],
        ready(){
        }
    }
</script>