<template>
    <dt>每月收入(元)</dt>
    <dd class="monthlyincome">
        <span v-for="itmes in monthlyincome" v-bind:data-id="itmes.id" v-text:="itmes.txt" v-bind:class="itmes.classname"
              v-on:click="clickspan('monthlyincome',monthlyincome,itmes)"></span>
    </dd>
</template>

<script>
    export default{
        name: 'monthlyincome',
        props: ['monthlyincome','showhide','getdata','clickspan'],
    }
</script>