<template>
    <mask :click="close"></mask>
    <div class="selector" v-if="show" transition="slideup">
      <ul>
        <li v-for="one in options" :class="{'current' : one === value}"><a href="javascript:void(0)" @click="change(one)">{{one}}期</a></li>
        <li><a href="javascript:void(0)" @click="close">取消</a></li>
      </ul>
    </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';


  .slideup-transition {
    transition: all .3s ease-out;
  }
  .slideup-enter, .slideup-leave {
    transform:translateY(100%);
  }
  .selector{
    position: fixed;
    bottom:0;
    left:0;
    z-index: 10000;
    background: #FAFAFA;
    width: 100%;

    ul{
      @include fsize(26);

      li{
        @include borderTop(#E5E5E5);
        line-height: px2rem(88);
        display: block;
        background: #fff;
        text-align: center;
        position: relative;

        a{
          color:#333;
          display: block;
          position: relative;
        }

        &.current a{
          color:#E9474D;

          &:after{
            content:' ';
            width:px2rem(26);
            height:100%;
            background: url(./select.png) no-repeat center center;
            background-size: px2rem(26) px2rem(19);
            position: absolute;
            left:50%;
            margin-left: px2rem(-80);
          }
        }

        &:first-child{
          border:0;
        }

        &:last-child{
          border:0;
          margin-top: px2rem(20);
        }
      }
    }
  }
</style>

<script>
  import Mask from 'libs/mask'

  export default {
    data () {
      return {
        show: '',
        options: [],
        value: ''
      }
    },

    watch: {
      show(value){
        if(value){
          this.$broadcast('showMask')
        }else{
          this.$broadcast('hideMask')
        }
      }
    },

    methods: {
      change(value){
        this.$dispatch('changeSelector', value)
        this.show = false
      },

      close(){
        this.show = false
      }
    },

    events: {
      showSelector(data){
        this.options = data.options
        this.value = data.value
        this.show = true
      },

      updateSelector(data){
        this.options = data.options
        this.value = data.value
      }
    },

    components:{
      Mask
    }
  }
</script>