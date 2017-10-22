<template>
    <div class="easyask_box" id="easyask">
        <div class="title">
            <div class="left">易问答</div>
            <div class="right"><a v-bind:href="moreexp">更多问答<i></i></a></div>
        </div>
        <div class="easyask_conter">
            <ul class="ul">
                <li class="item" v-for="itmes in easyask" v-bind:data-id="itmes.expertid">
                    <!--<a v-bind:href="itmes.url"></a>-->
                        <h6 class="tit">
                            <div class="hot"><i>热</i></div>
                            <div class="txt" v-text="itmes.question">汽车空调不制冷是什么原因？</div>
                        </h6>
                        <div class="info" v-text="itmes.answer">空调不制冷首先检查是否缺氟，检查压缩机是否工作，压缩机正常检查蒸发器是否脏污阻塞……</div>

                        <div class="footer">
                            <div class="l">
                                <span class="img"><img src="../images/imgbg.html.png" v-bind:data-echo="itmes.src"></span>
                                <span class="name" v-text="itmes.name">周伯通</span>
                            </div>
                            <div class="r">
                                <span class="time" v-text="itmes.time">一小时前</span>
                                <span v-on:click="thumbup(itmes)" v-bind:class="[itmes.showclassnum?'parise colred':'parise']">赞(<strong class="num" v-text="itmes.good">--</strong>)</span>
                            </div>
                        </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default{
        el: '#easyask',
        ready(){
            this.init();
        },
        //数据：
        data() {
            return {
                expertid:'',
                moreexp:'',//'http://m.daikuan.com/ExpertQuestion/Index/',
                classa:{parisered:false,clickdefault:true},
                classnum:true,
                classcol:false,
                easyask:[],
            }
        },
        methods: {
            //事件
            thumbup(val) {
                let  _self = this,_this=$(this)
                if (val.clickdefault){
                    val.showclassnum = true
                    val.clickdefault = false
                    ++val.good
                    $.ajax({
                        url:ershoucheUrl+'interface/clickagree/?questionid='+val.id+'&agreeuserid='+loanUserId+'&deviceid='+deviceId,
                        type: 'get',
                        beforeSend: function () {
                        },
                        success: function (data) {

                        }
                    })

                }
            },
            init:function () {
                let _self = this;
                $.ajax({
                    url: ershoucheUrl + "interface/getexpertandquestionlist",
                    type: 'get',//
                    success: function (res) {
                        let easydata = res.Data,len=easydata.length>=2?2:easydata.length
                        for (var i = 0; i < len; ++i) {
                            var pdata = {},
                                data = easydata[i],
                                q=data.Question[0],
                                e=data.Expert;
                            pdata.id=q.ID
                            pdata.expertid=e.ID
                           /* pdata.url=xincheUrl+'ExpertQuestion/Index/?businessLine=551&expertId='+data.Expert.ID+'&sortOrder=hot'*/
                            pdata.question=q.Question
                            pdata.answer=q.Answer
                            pdata.src=e.HeadPicture
                            pdata.name=e.Name
                            pdata.time=q.AnswerTimeText
                            pdata.good=q.PraiseCount
                            pdata.showclassnum=false;
                            pdata.clickdefault=true;
                            _self.easyask.push(pdata)
                            _self.expertid=res.Data[0].Expert.ID
                            _self.moreexp=xincheUrl+'expertquestion/index/?businessline=551&expertid='+_self.expertid+'&sortorder=new'
                        }
                        /*http://m.daikuan.com/ExpertQuestion/ClickAgree/?questionId=42&agreeUserId=772991&deviceId=e6a5bfaa-0910-426d-8184-5c8afdf4c96b
                        * 提问标题:Question.Question
                        * 答题内容:Question.Answer
                        * 顾问头像:Expert.HeadPicture
                        * 顾问名字:Expert.Name
                        * 时间:Question.AnswerTimeText
                        * 点赞数量:Question.PraiseCount
                        * 请求借口:Question.ID
                        * */
                    }
                })
            },
        }
    }



</script>
