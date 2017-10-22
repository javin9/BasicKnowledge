<template>
  <div class="component-button">
    <aside v-if="descriptionPosition === 'top'" :class="{'disabled':textDisabled}">{{description}}</aside>
    <a href="javascript:void(0)" class="button" :class="{disabled: disabled}" @click="submit()">{{text}}</a>
    <aside v-if="descriptionPosition === 'bottom'">{{description}}</aside>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  .button{
    @include fsize(32);
    color:#fff;
    display: block;
    margin:0 auto;
    width: px2rem(690);
    line-height: px2rem(90);
    background: $main-color;
    text-align: center;
    border-radius:px2rem($main-border-radius);

    &.disabled{
      background: $disabled-color;
    }
  }

  aside{
    @include fsize(24);
    color:$normal-color;
    margin:px2rem(10) px2rem(30);
    &.disabled{
      color:$disabled-color;
    }
  }
</style>

<script>
  export default {
    props:{
      description: String,
      text: String,
      disabled: Boolean,
      textDisabled:Boolean,
      event: {
        type: String,
        default: 'submitForm'
      },
      descriptionPosition: {
        type: String,
        default: 'top'
      }
    },
    data () {
      return {
      }
    },

    methods: {
      submit(){
        this.$dispatch(this.event)
      }
    }
  }
</script>