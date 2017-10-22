<template>
    <header class="header-bar" id="header-bar" v-if="!hide">
        <a href="javascript:void(0)" class="back-btn" @click='back'></a>
        <h1 class="font-nav" v-text="headerTitle"></h1>
        <span></span>
    </header>
</template>


<script>
import hideType from 'libs/hideType'

export default {
    props: {
        headerTitle: String,
        preventBack: {
            default: false
        }
    },
    data: function() {
        return {
            hide: hideType.header
        }
    },
    computed: {},
    methods: {
        back() {
            if (!this.preventBack) {
                history.back();
            }
            this.$dispatch('header.back');
        }
    }
}
</script>