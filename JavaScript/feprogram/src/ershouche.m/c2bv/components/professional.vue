<template>
    <dt>职业身份</dt>
    <dd class="professional">
        <span v-for="itmes in professional" v-bind:data-id="itmes.id" v-text:="itmes.txt" v-bind:class="itmes.classname"
              v-on:click="clickspan('professional',professional,itmes)"></span>
    </dd>
</template>

<script>
    export default{
        name: 'professional',
        props: ['professional','showhide','getdata','clickspan'],
        questions:[],
        ready(){

        }
    }
</script>