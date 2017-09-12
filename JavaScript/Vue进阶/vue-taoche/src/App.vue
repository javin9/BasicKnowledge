<template>
  <div id="app">
    <div class="header">
      <ul class="clearfix">
        <li>
          <router-link to="/"  exact>首页</router-link>
        </li>
        <li>
          <router-link to="/doc">文档</router-link>
        </li>
        <li>
           <router-link to="/about">关于</router-link>
        </li>
         <li>
           <router-link :to="{path:'/about'}" active-class="activeClass"  event="mouseover">关于2</router-link>
        </li>
        <li>
           <router-link to="/plan/我是大头鬼" >我是大头鬼</router-link>
        </li>
         <router-link to="/plan/我是大头鬼" tag="li">我是大头鬼2</router-link>
        <li>
           <router-link :to="index">联系我们</router-link>
        </li>
        <li>
           <router-link :to="index"><i></i><span>联系我们</span></router-link>
        </li>
        <li>
           <!-- 命名的路由 -->
        <router-link :to="{ name: 'user', params: {id:1}}" tag="a">User</router-link>
        </li>
         <li>
           <!-- 带查询参数，下面的结果为 /register?plan=private  设置 replace 属性的话，当点击时，会调用 router.replace() 而不是 router.push()，于是导航后不会留下 history 记录 -->
        <router-link :to="{ path: 'login', query: { plan: 'private' }}"  replace tag="a">Login</router-link>
        </li>
        <li>
           <router-link :to="{ path: '/abc'}" replace tag="a">ABC</router-link>
        </li>
      </ul>
    </div>
<!-- 过度模式 mode="out-in"   in-out/out-in -->

  <transition mode="out-in"   name="left">
      <router-view  class="center"></router-view>
  </transition>
    <!-- <router-view name="slider"></router-view> -->
   <input type="button" name="" @click="backClick"  value="Back">
   <input type="button" name="" @click="forwardClick"  value="Forward">
  </div>
</template>

<script>
  export default {
    name: 'app',
    data:function(){
      return {
         index:'/plan/联系我们'
      };
    },
    watch:{
      $route:function (to,from) {
        console.log(to);
        console.log(from);
      }
    },
    methods:{
       backClick:function () {
        console.log(this.$route);
        console.log(this);
         /* body... */
         this.$route.back();
       },
       forwardClick:function () {
        console.log(this.$route);
         /* body... */
           this.$route.forward();
       }

    }
  }
</script>
<style type="text/css">
 /* .v-enter{opacity:0;}  
  .v-enter-to{opacity:1;}
  .v-enter-active{transition:1s;}
  
  .v-leave{opacity:1;}
  .v-leave-to{opacity:0;}
  .v-leave-active{transition:1s;}*/
  
  .left-enter{transform:translateX(100%);}  
  .left-enter-to{transform:translateX(0);}
  .left-enter-active{transition:1s;}
  
  .left-leave{transform:translateX(0);}
  .left-leave-to{transform:translateX(-100%);}
  .left-leave-active{transition:1s;}

</style>


