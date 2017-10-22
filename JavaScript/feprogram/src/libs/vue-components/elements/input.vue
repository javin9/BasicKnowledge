<template>
  <input 
    :class="classObj"
    :type="inputType" 
    :maxlength="maxlength"
    @focus="focusHandler"
    @blur="blurHandler"
    @touchstart="touchstartHandler"
    @input="inputHandler($event.target.value)"
  >
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  input{
    min-height:px2rem(44);

    &.input-with-clear{
      @include icons(clear, false);
      background-position: right center;
      background-position: right px2rem(20) center;
    }

    &.input-error{
      @include icons(error, false);
      background-position: right center;
      background-position: right px2rem(20) center;
      color:$main-color;
    }
  }
</style>

<script>
export default {
  props:{
    maxlength: {},
    type: {
      type: String,
      default: 'text'
    }
  },

  data () {
    return {
      // 是否聚焦
      focus: false,

      // 是否为空
      empty: true
    }
  },

  computed:{
    // 真实的input type
    inputType(){
      switch(this.type){
        case 'name':
          return 'text'
        case 'mobile':
        case 'digits':
          return 'tel'
        default :
          return this.type
      }
    },

    // 是否显示清空icon
    showClear(){
      return this.focus && !this.empty
    },

    // class控制
    classObj(){
      return {
        'input-with-clear' : this.showClear
      }
    }
  },

  methods: {
    // 获取组件外层dom属性
    attr(key){
      return this.$el.getAttribute(key)
    },

    // 触发dom事件，1.x中本身的emit无效
    triggerEvent(type='input'){
      $(this.$el).trigger(type)
    },

    // focus句柄
    focusHandler(e){
      this.focus = true
    },

    // blur句柄
    blurHandler(){
      this.focus = false
    },

    // input句柄
    inputHandler(value){
      if( (this.type === 'mobile' || this.type === 'digits') && /[^\d]/.test(value)){
        this.$el.value = this.$el.value.replace(/[^\d]/g, '')
      }else{
        this.empty = value === ''
      }
    },

    // touchstart句柄
    touchstartHandler(e){
      // 有清空icon的情况下需要判断点击区域是否是清空icon, 
      // 清空icon用背景是因为用元素会先触发文本框blur事件， 从而icon隐藏无法触发其click事件
      if(this.showClear){
        const target = $(e.target)
        const offset = target.offset()
        // 无效点击区域，相对于页面左边的范围
        const left = offset.left + offset.width - $(window).width() * 0.1
        // 当前点击的坐标x值
        const x = e.touches[0].pageX
        if(x >= left){
          this.$el.value = ''
          this.triggerEvent('input')
          e.preventDefault()
          return false
        }
      }
    },

    // 输入法输入结束句柄
    // compositionendHandler(){
      // if(this.type === 'name'){
      //   const value = this.$el.value
      //   if(value && value.length >= 8){
      //     this.$el.value = value.slice(0, 8)
      //     this.triggerEvent('input')
      //   }
      // }
    // }
  },

  created(){
    if(this.type === 'name'){
      this.maxlength = 8
    }
    if(this.type === 'mobile'){
      this.maxlength = 11
    }
  },

  ready(){
    // 渲染完毕先触发dom input, 同步empty状态
    this.triggerEvent('input')
  }
}
</script>