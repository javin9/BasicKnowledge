<template>
  <p class="bg-info">正确配置hosts后，使用http://placehold.it/300x200为占位图片，宽x高</p>
  <br>
  <h3>宽X高</h3>
  <div class="input-wrapper">
    <input type="tel" placeholder="宽" v-model="width">&nbsp;X
    <input type="tel" placeholder="高" v-model="height">
  </div>
  <br>
  <h3>预览:</h3>
  <img :src="src">
</template>

<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    .bg-info{
      border-radius:10px;
      padding:20px;
      color:$normal-color;
    }

    input-wrapper{
      input{
        display: inline-block;
        width: 100px;
      }
    }
</style>

<script>
	import Clipboard from 'clipboard'
  export default{
      data(){
        return {
          width: 100,
          height:100
        }
      },

      computed:{
        src(){
          return `http://placehold.it/${this.width}x${this.height}`
        }
      },

      ready(){
      }
  }
</script>
