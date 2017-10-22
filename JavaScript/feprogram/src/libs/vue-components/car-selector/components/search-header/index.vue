<template>
  <form class="component-search-header" @submit="submitHandler" action="">
    <a href="javascript:void(0)" class="component-search-header-close" @click="closeHandler" v-if="hasArrow"></a>
    <div class="component-search-header-form">
      <div class="component-search-header-form-input">
        <span></span>
        <input type="search" :placeholder="placeholder" :class="{'has-clear-icon': value && focused}" @focus="focusHandler" @blur="blurHandler" v-model="value" @touchstart="searchClickHandler" v-el:search>
      </div>
    </div>
    <a href="javascript:void(0)" @click="closeHandler" v-if="!hasArrow" class="cancel">取消</a>
  </form>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';
  
  .component-search-header{
    @include borderBottom;
    position: relative;
    width: 100%;
    height: px2rem(88);
    background-color: #fff;
    display:flex;
    box-sizing:border-box;
    padding:px2rem(12) px2rem(20);
    z-index: 100;
    align-items: center;

    &-form{
      flex:1;
      display:flex;
      height: px2rem(64);

      &-input{
        @include border;
        background: #fff;
        flex:1;
        display: block;
        display:flex;
        align-items: center;
        border-radius:px2rem(5);

        > span{
          @include size(px2rem(40));
          background: url(./search-icon.png) no-repeat center center;
          margin:0 px2rem(15);
          background-size: contain;
          display: block;
        }

        > input{
          font-size:px2rem(26);
          border:0;
          padding:0;
          margin:0;
          flex:1;
          display: block;
          height: px2rem(50);
          line-height: px2rem(50);

          &.has-clear-icon{
            background: url(./del.png) no-repeat right px2rem(20) center;
            background-size: px2rem(34) px2rem(30);
          }

          &::placeholder{
            color:$normal-color;
          }
        }
      }
    }

    &-close{
      display: block;
      width: px2rem(40);
      background: url(./arrow.png) no-repeat center center;
      height: 100%;
      background-size: px2rem(16) px2rem(30);
      margin-right: px2rem(30);
    }

    .cancel{
      @include fsize(30);
      color:$normal-color;
      margin-left: px2rem(30);
      text-decoration: none;
    }
  }
</style>

<script>
export default {
  props:{
    placeholder : String,
    defaultLink: String,
    cancel: Function,
    focus: Function,
    hasArrow: Boolean
  },

  data () {
    return {
      value: '',
      focused: false
    }
  },

  watch:{
    value(value){
      this.$emit('change', value)
    }
  },

  events:{
    resetSearchHeader(){
      this.value = ''
    }
  },

  methods: {
    searchClickHandler(e){
      const offset = $(this.$els.search).offset()
      const clear = offset.left + offset.width - 70
      if(e.touches[0].pageX > clear && this.focused){
        this.value = ''
        e.preventDefault()
        return false
      }
    },
    focusHandler(){
      this.focused = true
      this.focus()
    },
    blurHandler(){
      this.focused = false
    },
    closeHandler(){
      this.$emit('resetSearchHeader')
      this.cancel()
    },

    submitHandler(e){
      if(this.value){
        this.$emit('search')
      }else if(this.defaultLink){
        window.location.href = this.defaultLink
      }
      e.preventDefault()
      return false
    }
  }
}
</script>