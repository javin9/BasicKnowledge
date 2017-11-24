<template>
  <div class="project">
    <div class="add-project-box">
      <i class='fa fa-plus-square'></i>
      <span>创建项目</span>
    </div>
    <div class="block-content">
      这是工作台页面
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'Project',
    methods:{
     showHello:function (msg) {
       console.log(msg);
     }
    },
    created(){
      this.$bus.on('showHello',this.showHello);
    }
  }
</script>
<style>

</style>
