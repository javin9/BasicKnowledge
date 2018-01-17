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
      </ul>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
/*
  <!-- hash模式 -->
    <!-- <div class="header">
      <ul class="clearfix">
        <li><a href="#/">首页</a></li>
        <li><a href="#/doc">文档</a></li>
        <li><a href="#/about">关于</a></li>
      </ul>
    </div> -->

    <!-- history 模式  会刷新页面 多页面应用   -->
   <!--  <div class="header">
      <ul class="clearfix">
        <li><a href="/">首页</a></li>
        <li><a href="/doc">文档</a></li>
        <li><a href="/about">关于</a></li>
      </ul>
    </div> -->
*/
export default {
  name: 'app'
}
</script>


