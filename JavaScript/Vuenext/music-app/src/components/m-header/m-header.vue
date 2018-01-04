<template>
 <div class="m-header">
 	<div class="icon"></div>
 	<h1 class="header"><a class="logo">QQ音乐</a></h1>
 </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only  lang='css' 如果使用less 必须更改lang="less"-->
<style scoped lang="less">
@import "../../common/less/mixin.less";
   .header{background-color:#31C27C;color:#000;.fz(18px);height:80/@r;border-bottom:1px solid #eee;padding-left:10/@r;}
   .header .logo{display:inline-block;width:180/@r;height:50/@r;background:url('../../common/image/logo.png');background-size: 180/@r 50/@r;text-indent:-2rem;vertical-align:middle;margin-top:15/@r;}
   .header .title{vertical-align:middle;}
</style>
