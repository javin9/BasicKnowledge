<template>
    <div class="mask">
    </div>
    <div class="score-layer">
        本轮游戏得分为
        80
        已战胜了<b>92%</b>的小伙伴
    </div>
</template>

<script type="text/ecmascript-6">
    export default{}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .score-layer{
        width:px2rem(520);
        height:px2rem(660);
        background:#fff;
        border-radius: px2rem(15);
    }
</style>
