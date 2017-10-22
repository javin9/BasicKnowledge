/*直接打开提问*/
if(tools.getUrlParam('questionTips')=='1'){
    $(".eQ-con").addClass('hide');
    $(".placeholder").addClass('hide');
    $(".ask-question").addClass('hide');
    $("body").addClass('white-body');
    $('.ask-question-layer').removeClass('hide');
}

import './index.scss';
import check from 'libs/check/m';
import Vue from 'vue';

    var EQList = function () {
        var self = this
        this.businessNum =[550,551,552];
        this.curTab = this.businessNum[0];//业务切换标签
        this.userIdCookie = loanUserId;
        // alert(tools.getCookie("LoanUserId"));
        this.eQList = {
            pageCount:0,//总页码
            pageIndex:1,//评价当前页面
            pageSize:3,//每页条数
            scrollSign: false,//是否可以滚动
            orderTab:"zx",
            professionalID:2,//专家ID
            isAddQuestion:true,
            isCheckBtn:true,
        }

        this.getCodeUrl = '/ExpertQuestion/GetCode';
        this.checkCodeUrl =usercenter + '/User/CreateAccount';
        this.getQAUrl = "/ExpertQuestion/GetExpertAndQuestionAnswerByExpertId";
        this.clickAgreeUrl = '/ExpertQuestion/ClickAgree';
        this.addQuestionUrl = '/ExpertQuestion/AddQuestion';

        //DOM
        this.domCache={
            aQLayer: $('.ask-question-layer'),
            checkLayer:$('.check-layer'),
            maskLayer:$("#maskLayer"),
            checkBox:$('.check-layer .check-box'),
            successBox:$('.check-layer .success-box'),
            veCode:$("#veCode"),
            codeInput:$("#codeInput"),
            mobileInput:$("#mobileInput"),
            eQDefault:$(".eQDefault"),
            loading:$(".loading"),
            sliderUpBox:$(".sliderUp-box"),
            eQListCon:$(".eQ-list-con"),
            qTextarea:$("#qTextarea"),
            eQCon:$(".eQ-con"),
            placeholder:$(".placeholder"),
            askQuestion:$(".ask-question"),
            body:$("body"),
        }
        //数据绑定
        this.vm = new Vue({
            el: '#eQWrapper',
            data: {
                listArr:[],//列表
            }
        })
        this.init();
    }
    EQList.prototype ={
        init:function(){
            var self = this;
            self.initData();
            self.bindEvent();
            //获取数据
            self.getList();
        },
        //初始化数据
        initData:function(){
            var self = this;

            var _index = self.businessNum.indexOf(expertBusinessLine)
            self.eQList.professionalID=$('.eQ-con>footer>dl').eq(_index).find("dt").data("expert");
            $(".eQ-title>div").eq(_index).addClass('cur').siblings('div').removeClass('cur');
            self.curTab = self.businessNum[_index];
            $('.eQ-con>footer>dl').eq(_index).removeClass('hide').siblings('dl').addClass('hide');

            if(tools.getUrlParam('sortOrder') == "hot"){
                self.eQList.orderTab = "zr";
                $(".eQ-list-title-left").eq(_index).find("div").removeClass('cur').eq(1).addClass('cur');
            }

        },
        //切换层
        checkLayerState:function (num){
            var self = this;
            if(num == "success"){
                self.domCache.checkLayer.addClass('check-layer-success');
                self.domCache.successBox.removeClass('hide');
                self.domCache.checkBox.addClass('hide');
            }else{
                self.domCache.checkLayer.removeClass('check-layer-success');
                self.domCache.successBox.addClass('hide');
                self.domCache.checkBox.removeClass('hide');
            }
        },
        bindEvent:function(){
            var self = this;
            //移动站隐藏业务线导航
            if(!tools.getCookie("YiXinAppInfo")){
                $(".eQ-con header").remove();
            }else{
                $(".eQ-con header").removeClass("hide");
            }

            function closeLayer(){
                self.domCache.maskLayer.hide();
                $('body').unbind('touchmove');
                self.domCache.aQLayer.addClass('hide');
                self.domCache.checkLayer.addClass('hide');
            }


            function checkTel(){
                if($.trim(self.domCache.mobileInput.val()) =="" || !check.isPhoneNumber($.trim(self.domCache.mobileInput.val()))){
                    self.domCache.mobileInput.next("i").removeClass('hide');
                    return false;
                }else{
                    self.domCache.mobileInput.next("i").addClass('hide');
                    return true;
                }
            }

            self.domCache.eQCon.on('click', '.businessLine,.orderBy,.other-expert,.eQ-list-con .agree-box', function(event) {
                event.preventDefault();
                if($(this).hasClass('businessLine')){//业务线切换
                    $(this).addClass('cur').siblings('div').removeClass('cur');
                    var _index = $(this).index();
                    if(self.businessNum[_index] != self.curTab){
                        self.curTab = self.businessNum[_index];
                        self.eQList.professionalID = $('.eQ-con>footer>dl').eq(_index).find("dt").data("expert");
                        self.eQList.pageIndex = 1;
                        self.eQList.orderTab = "zx";
                        self.vm.listArr = [];
                        self.getList();
                    }
                    $('.eQ-con>footer>dl').eq(_index).removeClass('hide').siblings('dl').addClass('hide');
                }else if($(this).hasClass('orderBy')){//最新最热切换
                    $(this).addClass('cur').siblings('div').removeClass('cur');
                    var _orderTabStr=""
                    if($(this).text() == "最新"){
                        _orderTabStr = "zx";
                    }else if($(this).text() == "最热"){
                        _orderTabStr = "zr";
                    }
                    if(self.eQList.orderTab != _orderTabStr){
                        self.vm.listArr = [];
                        self.eQList.orderTab =_orderTabStr;
                        self.eQList.pageIndex = 1;
                        self.getList();
                    }
                    // console.log(self.orderTab)
                }else if($(this).hasClass('agree-box')){
                    if(!$(this).hasClass('cur')){
                        var _num = parseInt($(this).find("span").text());
                        _num+=1;
                        $(this).addClass('cur').find("span").text(_num);
                        self.clickAgree($(this).parent("dd").data("id"));
                    }
                }
            });

            //蒙层
            $("#maskLayer").on('click', function(event) {
                event.preventDefault();
                closeLayer();
            });

            $(".ask-question").on('click', '.other-expert,.questions-btn', function(event) {
                event.preventDefault();
                if($(this).hasClass('other-expert')){//更多专家
                    location.href="/ExpertQuestion/OtherExpert?expertId="+self.eQList.professionalID;
                }else if($(this).hasClass('questions-btn')){
                    // self.domCache.maskLayer.show();
                    self.domCache.eQCon.addClass('hide');
                    self.domCache.placeholder.addClass('hide');
                    self.domCache.askQuestion.addClass('hide');
                    self.domCache.body.addClass('white-body');

                    self.domCache.aQLayer.removeClass('hide');
                }
            });
            //发布问题层
            self.domCache.aQLayer.on('click', '.cancel-btn,.release-btn', function(event) {
                event.preventDefault();
                if($(this).hasClass('release-btn')){//发布按钮
                    if($.trim(self.domCache.qTextarea.val())==""){
                        self.domCache.qTextarea.addClass('err-warn');
                        setTimeout(function(){
                            self.domCache.qTextarea.removeClass('err-warn');
                        },1000)
                    }else{
                        if(loanUserId!=0){
                            //登录状态直接插留言
                            if(self.eQList.isAddQuestion){
                                self.addQuestion();
                            }else{
                                tools.showAlert("大侠手太快啦，等会儿再试试");
                            }
                        }else{
                            self.domCache.aQLayer.addClass('hide');
                            self.domCache.checkLayer.removeClass('hide');

                            self.domCache.maskLayer.show();
                            $('body').bind('touchmove',function(e){
                                e.preventDefault();
                            });
                            self.domCache.eQCon.removeClass('hide');
                            self.domCache.placeholder.removeClass('hide');
                            self.domCache.askQuestion.removeClass('hide');
                            self.domCache.body.removeClass('white-body');
                        }

                    }

                }else if($(this).hasClass('cancel-btn')){//取消按钮
                    self.domCache.eQCon.removeClass('hide');
                    self.domCache.placeholder.removeClass('hide');
                    self.domCache.askQuestion.removeClass('hide');
                    self.domCache.body.removeClass('white-body');
                    closeLayer();
                }
            });

            self.domCache.checkLayer.on('blur', '.check-phone-input', function(event) {
                event.preventDefault();
                if($(this).hasClass('check-phone-input')){
                    checkTel();
                }
            });
            //易问答验证层
            self.domCache.checkLayer.on('click', 'header>.expert-icon,#veCode,.check-layer-btn', function(event) {
                event.preventDefault();
                if($(this).hasClass('expert-icon')){
                    closeLayer();
                    self.checkLayerState("default");
                }else if($(this).attr("id")=="veCode"){
                    if(!self.domCache.veCode.hasClass('disable') && checkTel()){
                        self.getCode({
                            url:self.getCodeUrl,
                            telNum:$.trim(self.domCache.mobileInput.val())
                        },function(res){
                            if(!res.Result){
                                tools.showAlert(res.Message);
                            }

                        })
                    }

                }else if($(this).hasClass('check-layer-btn')){//提交按钮
                    if(checkTel() && $.trim(self.domCache.codeInput.val()) !=""){
                        self.domCache.codeInput.next("i").addClass('hide');
                        self.checkCode();

                    }else if($.trim(self.domCache.codeInput.val())==""){
                        self.domCache.codeInput.next("i").removeClass('hide');
                    }

                }
            });

            //滚动加载
            $(window).scroll(function(){
                var scrollHeight=document.body.scrollTop || document.documentElement.scrollTop;
                var moreHeight = $("#eQListCon").offset().top-$(window).height()+$("#eQListCon").height()-5;

                if (self.eQList.scrollSign) {

                    if(scrollHeight >= moreHeight && (self.eQList.pageIndex < self.eQList.pageCount)){
                        self.eQList.scrollSign = false;
                        ++ self.eQList.pageIndex;
                        self.domCache.sliderUpBox.removeClass('hide');
                        // self.domCache.sliderUpBox.html('数据加载中');
                        self.domCache.sliderUpBox.html('<i class="sliderUp"></i>向上滑动刷新');
                        self.getList();
                    }
                };
            });
        },
        //添加问题
        addQuestion:function(){
            var self = this;
            self.eQList.isAddQuestion = false;
            $.ajax({
                type:"POST",
                url: self.addQuestionUrl,
                data: {
                    'Question':self.domCache.qTextarea.val(),
                    'ProfessionalID':self.eQList.professionalID,
                    'QuestionUserId':loanUserId,
                    'BusinessLine':self.curTab,
                },
                beforeSend: function(request) {
                    request.setRequestHeader("__RequestVerificationToken", $('#forgeryToken').val());
                },
                success: function (res) {
                    self.eQList.isCheckBtn = true;
                    // self.eQList.isAddQuestion = true;
                    res = JSON.parse(res);
                    if(res.Result){
                        self.checkLayerState("success");
                        self.domCache.aQLayer.addClass('hide');
                        self.domCache.checkLayer.removeClass('hide');
                        self.domCache.eQCon.removeClass('hide');
                        self.domCache.maskLayer.show();

                        $('body').bind('touchmove',function(e){
                            e.preventDefault();
                        });
                        self.domCache.placeholder.removeClass('hide');
                        self.domCache.askQuestion.removeClass('hide');
                        self.domCache.body.removeClass('white-body');
                    }else{
                        tools.showAlert(res.Message);
                    }
                },
                error:function() {
                    self.eQList.isCheckBtn = true;
                    // self.eQList.isAddQuestion = true;
                }
            })
        },
        //点赞
        clickAgree:function(questionId){
            var self = this;
            tools.$ajax({
                type:"GET",
                url: self.clickAgreeUrl,
                data: {
                    'questionId':questionId,
                    'agreeUserId':self.userIdCookie,
                    'deviceId':deviceId,
                },
                success: function (res) {
                    console.log(res);
                }
            })
        },
        //获取列表数据
        getList:function(){
            var self  = this;

            if(self.eQList.pageIndex==1){
                self.domCache.loading.removeClass('hide');
                self.domCache.eQListCon.addClass('hide');
                self.domCache.eQDefault.addClass('hide');
                self.domCache.sliderUpBox.addClass('hide');
            }
            tools.$ajax({
                type:"GET",
                url: self.getQAUrl,
                data: {
                    'expertId':self.eQList.professionalID||0,
                    'pageIndex':self.eQList.pageIndex,
                    'pageSize':self.eQList.pageSize,
                    'orderBy':self.eQList.orderTab,
                    'userId':self.userIdCookie
                },
                success: function (res) {
                    var _data = res.Data.Question;
                    if(res.Result && _data.length>0){
                        self.eQList.pageCount = Math.ceil(res.RowCount/self.eQList.pageSize);//计算总页码
                        self.domCache.loading.addClass('hide');
                        self.domCache.eQListCon.removeClass('hide');
                        self.domCache.eQDefault.addClass('hide');
                        self.domCache.sliderUpBox.removeClass('hide');

                        $.each(_data, function(index, val) {
                            // console.log(parseInt(Math.random() *arrImg.length))
                            var _evaluation={}
                            _evaluation.Question = val.Question;
                            _evaluation.IsAgreedClass = val.IsAgreed?"cur":"";
                            _evaluation.QuestionUserHeadPortrait = val.QuestionUserHeadPortrait||arrImg[parseInt(Math.random() *arrImg.length)];
                            _evaluation.Answer = val.Answer;
                            _evaluation.ID = val.ID;
                            _evaluation.QuestionUserTel = val.QuestionUserTel;
                            _evaluation.AnswerTimeText = val.AnswerTimeText;
                            _evaluation.HeadPicture = res.Data.Expert.HeadPicture;
                            _evaluation.PraiseCount = val.PraiseCount;

                            self.vm.listArr.push(_evaluation);
                        });

                        // console.log(self.eQList.pageIndex +"__"+self.eQList.pageCount)
                        self.domCache.sliderUpBox.removeClass('hide');
                        if(self.eQList.pageIndex < self.eQList.pageCount){
                            self.eQList.scrollSign = true;
                            self.domCache.sliderUpBox.html('<i class="sliderUp"></i>向上滑动刷新');
                        }else{
                            self.eQList.scrollSign = false;
                            self.domCache.sliderUpBox.html('没有更多了~');
                        }
                    }else{
                        self.eQList.scrollSign = false;
                        self.domCache.sliderUpBox.addClass('hide');
                        self.domCache.loading.addClass('hide');
                        self.domCache.eQListCon.addClass('hide');
                        self.domCache.eQDefault.removeClass('hide');
                    }
                }
            });
        },
        /*获取验证码*/
        getCode: function (data, successFunc) {
            var defaultData = {
                seconds: 60,
                tel_id: 'mobileInput',
                gvc_id: 'veCode',
                line: '550',
                url: '',
                telNum:''
            }
            var Tdata = $.extend(defaultData, data);

            if ($("#" + Tdata.gvc_id).hasClass("disable")) {
                return false;
            };

            tools.$ajax({
                url: Tdata.url,
                data: { mobile: Tdata.telNum, line: Tdata.line },
                success: function (res) {
                    successFunc(res);
                }
            });

            $("#" + Tdata.gvc_id).addClass("disable").text(Tdata.seconds + "秒后获取");
            window.tmo = setInterval(function () {
                if (--Tdata.seconds == 0) {
                    clearInterval(tmo);
                    $("#" + Tdata.gvc_id).removeClass("disable").text("获取验证码");
                    return;
                }
                $("#" + Tdata.gvc_id).text(Tdata.seconds + "秒后获取");
            }, 1000);
        },
        checkCode:function(){
            var  self = this;
            self.eQList.isCheckBtn = false;
            tools.$ajax({
                url: self.checkCodeUrl,
                dataType:"jsonp",
                type:"GET",
                data: { mobile:self.domCache.mobileInput.val(),mobileValidateCode:self.domCache.codeInput.val()},
                success: function (res) {
                    if(res.Result){
                        loanUserId = res.Data;
                        if(self.eQList.isAddQuestion){
                            tools.getLoginStatus();
                            self.addQuestion();
                        }else{
                            tools.showAlert("大侠手太快啦，等会儿再试试");
                        }
                    }else{
                        tools.showAlert(res.Message);
                    }

                }
            });
        }
    }

    //走起
    new EQList();

