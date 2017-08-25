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
        <router-link :to="{ name: 'user', params: {id: 123 }}" tag="a">User</router-link>
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

    <router-view  class="center"></router-view>
    <router-view name="slider"></router-view>

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


