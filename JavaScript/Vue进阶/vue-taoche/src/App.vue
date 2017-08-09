<template>
  <div id="app">


    <div class="header">
      <ul class="clearfix">
        <li>
          <router-link to="/">首页</router-link>
        </li>
        <li>
          <router-link to="/doc">文档</router-link>
        </li>
        <li>
           <router-link to="/about">关于</router-link>
        </li>
         <li>
           <router-link :to="{path:'/about',component:about}">关于2</router-link>
        </li>
        <li>
           <router-link to="/plan/我是大头鬼">我是大头鬼</router-link>
        </li>
        <li>
           <router-link to="/plan/我是大头鬼" tag="div">我是大头鬼2</router-link>
        </li>
        <li>
           <router-link :to="index">联系我们</router-link>
        </li>
        <li>
           <router-link :to="index"><i></i><span>联系我们</span></router-link>
        </li>
      </ul>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data:function(){
      return {
         index:'/plan/联系我们'
      };
    }
  }
</script>


