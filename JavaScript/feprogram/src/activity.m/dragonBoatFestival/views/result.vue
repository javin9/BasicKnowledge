<template>
    <section class="game-result-wrapper" v-show="isShow" transition="fade">
        <div class="mask"></div>
        <div class="game-result">
            <div class="content">
                <h3>本轮游戏得分为</h3>
                <h2 v-text="resultData.count"></h2>
                <p>已战胜了<em v-text="resultData.perinfo"></em>的小伙伴</p>
                <p>当前排名为<em v-text="resultData.rankinginfo"></em>名</p>
                <btn btn-text="查看游戏排名" btn-cls="btn" event-name="checkBoard"></btn>
                <h6>该排名为历史成绩中最高分数排名</h6>
            </div>
            <div class="close" @click="closeLayer"></div>
        </div>
    </section>
</template>
<script type="text/ecmascript-6">
    import btn from '../components/button.vue';
    export default{
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            resultData:{
                type: Object,
                default: {}
            }
        },
        components:{
            btn
        },
        methods:{
            closeLayer(){
                this.$dispatch('closeResult');
            },
            checkBoard() {
                this.$dispatch('checkBoard');
            }
        }
    };
</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .game-result-wrapper {
        position: fixed;
        width:px2rem(750);
        height:100%;
        left:50%;
        top:0;
        z-index: 100;
        -webkit-transform:translate3d(-50%,0,0);
        transform:translate3d(-50%,0,0);
    }
    .mask{
        background:rgba(0,0,0,0.6);
        position: absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index: 100;
    }
    .game-result{
        z-index:101;
        position:absolute;
        left:50%;
        top:50%;
        -webkit-transform:translate3d(-50%,-50%,0);
        transform:translate3d(-50%,-50%,0);
        .close{
            width:px2rem(72);
            height:px2rem(72);
            background:url("../images/close_btn.png") no-repeat left top;
            background-size:contain;
            margin:px2rem(30) auto 0 auto;
        }
        .content{
            box-sizing: border-box;
            width: px2rem(520);
            padding: px2rem(42) px2rem(30) px2rem(50);
            background:#fff;
            border-radius: px2rem(10);
            line-height: 1.5;
            text-align: center;

            h3 {
                @include fsize(36);
                color: #1a1a1a;
            }

            h2 {
                @include fsize(120);
                color: #ff7200;
            }

            p {
                @include fsize(32);
                color: #1a1a1a;

                em {
                    font-style: normal;
                    color: #ff7200;
                }
            }

            h6 {
                @include fsize(26);
                color: #5c5d5d;
            }

            .btn {
                margin: px2rem(30) auto px2rem(10);
            }
        }
    }
</style>


{"Result":true,"Message":"","Data":"[{\"name\":\"1\",\"list\":[\"MjAxNy0wNS0xNiAxNzowMjoxNjVjODYwMjU0OGJmYzRmOTNiYWNkNzk5NWNmZjQyZTEw\",\"MjAxNy0wNS0xNiAxNzowMjoxNjQzZDE4ZGYwMTBiYzQ5YjFhNjgwNWI2NjA0ZjZjZDdi\",\"MjAxNy0wNS0xNiAxNzowMjoxNjEzYzNmNTA4OWY3YjQxNzU5NDZkMGM3ZWQwOGFjOWQw\",\"MjAxNy0wNS0xNiAxNzowMjoxNjg2MDk2M2Q5ZGVkYzRmZDg4NTBkOThhNjVjNGRmNGZm\",\"MjAxNy0wNS0xNiAxNzowMjoxNjgxNzg4MDYzMDM4YjRmMjc4MDQ1NzVhMWQ4YTRkMTU5\",\"MjAxNy0wNS0xNiAxNzowMjoxNmU5MDlkM2U4MzEwYjQwZTNhODk0ZmU4YjE0ZmQ2ODE2\",\"MjAxNy0wNS0xNiAxNzowMjoxNjJjYTA4OWQ2N2E0YTQwYWFhOThhZWZkM2FiM2M4OTVi\",\"MjAxNy0wNS0xNiAxNzowMjoxNmY2NjcxMTgyN2EyODRjOTZiZTBkYTg2N2EzZmU0NWU0\",\"MjAxNy0wNS0xNiAxNzowMjoxNmIwMmVjNWY3OTFhNjQ1NjM4YmRkYTNkM2E3NTQ5NWE1\"]},{\"name\":\"2\",\"list\":[\"MjAxNy0wNS0xNiAxNzowMjoxNjdmZjBlOGViMmFlNDRhMzdhZGEzMGNhOTVlYTFmN2Q1\",\"MjAxNy0wNS0xNiAxNzowMjoxNmVjZWFiNzRlMzJmMjQ4MDY5YzljNWIyZDU5YTA0NWE2\",\"MjAxNy0wNS0xNiAxNzowMjoxNjIxN2MwNTZlYzAzYzQyYjU4NDU1NWRhNzk3MTFmN2Mz\",\"MjAxNy0wNS0xNiAxNzowMjoxNmVhMjAyMTkzYWM4MjRhZWRhMDNiMzI0OTZkNzE2Nzlh\",\"MjAxNy0wNS0xNiAxNzowMjoxNjcxMTExNTI5Y2FiNjQ4ZjliMGViOGY2ZTdmOTk4MGZj\",\"MjAxNy0wNS0xNiAxNzowMjoxNmY4MzNlZjIyYjk5YjQxODQ4Yjc2YjI0NGJhN2IxOTk1\",\"MjAxNy0wNS0xNiAxNzowMjoxNjhkYWUyMjhmNmE3NjQxMDlhMThjNjdhMzc4MDdkNzZj\",\"MjAxNy0wNS0xNiAxNzowMjoxNjA0MjkyYmIzYTBjNjRlNzk5ZjM4NDM4ZDk1MDJhZTgz\",\"MjAxNy0wNS0xNiAxNzowMjoxNjZkNmE3MmY4YmJmYTQ3ZjZhMTk4OTYzMzVlYmEwYmIx\"]}]","RowCount":1}