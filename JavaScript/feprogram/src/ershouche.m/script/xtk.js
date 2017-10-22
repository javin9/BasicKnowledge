'use strict';

//css
import './XTK.scss'
//js
import app from '../script/app';
import XTKStore from './XTKStore'
import tools from 'libs/tools';
var XTK = {
    // Toolkits
    //#region XTK.Action
    ershoucheAPI: '',
    xincheAPI: '',
    Action: {
        handlers: new Array(),

        model: function (actionName, handler) {
            this.actionName = actionName;
            this.handler = handler;
        },
        /*＊
        获取this的参数
        */
        getParamter: function (element, paramterName) {
            return $(element).attr(paramterName);
        },
        /*＊
        行为
        */
        handle: function (action, element) {
            for (var i in this.handlers) {
                var handler = this.handlers[i];
                if (handler.actionName == action) {
                    handler.handler.call(this, element);
                    return;
                }
            }
        },
        /**
        绑定
        */
        bind: function (element) {
            var self = this;
            if (element) {
                if (!!!element.binded) {
                    var action = this.getParamter(element, 'action');
                    self.handle(action, element);
                    element.binded = true;
                }
            } else {
                $('[action]').each(function () {
                    self.bind(this);
                });
            }
        },
        /*
        注册
        */
        register: function (actionName, handler) {
            this.handlers.push(new this.model(actionName, handler));
        }
    }
}
export default XTK;
/**
*实现评论功能
＊packageId,pageIndex,pageSize
*@返回评论列表
*/
XTK.Action.register('GET-COMMENT-LIST', function (element) {
    var self = this;
    //packageId,pageIndex,pageSize
    this.params = {
        packageId: '4308',
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0
    };

    this.formatTime = function (shijianchuo) {
        var self = this;
        //time是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    }
    //获取参数
    this.container = $(element).attr('container');
    this.params.packageId = $(element).attr('data-packgeId');
    this.evaluationQuotes = [];
    this.isLoad = false;
    //渲染html
    
    this.render_Comment = function (container) {
        var countPage= Math.ceil(Number(container)/self.params.pageSize);
        XTKStore.ershoucheAPI = XTK.ershoucheAPI;
        if(self.params.pageIndex<=countPage){
        XTKStore.getPackageComment(self.params).then(function (res) {
            if (res.Data) {
                self.params.pageIndex=Number(self.params.pageIndex+1);
                self.isLoad = false;
                var _data = res.Data;
                if (_data.length > 0) {
                    self.params.pageCount = Math.ceil(res.RowCount / self.params.pageSize);//计算总页码
                    $.each(_data, function (index, val) {
                        var _evaluation = {}
                        _evaluation.carAllName = !val.CarBaseInfo ? "" : val.CarBaseInfo.CarSerialShowName + ' ' + val.CarBaseInfo.CarYear + '款 ' + val.CarBaseInfo.CarName;
                        _evaluation.nickName = val.UserComment.NickName;
                        _evaluation.content = val.UserComment.ProductJudgeContent ? val.UserComment.ProductJudgeContent : ((val.UserComment.ProductTag) ? '' : '该用户仅评分，未填写评价内容');
                        _evaluation.serviceScore = String(val.UserComment.ProductJudgeScore * 20) + "%"

                        var dataTime = val.UserComment.UpdateTime.split("(")[1].split(")")[0];
                        _evaluation.updateTime = self.formatTime(parseInt(dataTime));

                        if (val.UserComment.ProductTag) {
                            var tags = val.UserComment.ProductTag.split("|");
                            for (var i = 0; i < tags.length; i++) {
                                if (tags[i] == "" || typeof (tags[i]) == "undefined") {
                                    tags.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                            _evaluation.tags = tags;
                        } else {
                            _evaluation.tags = "";
                        }
                        self.evaluationQuotes.push(_evaluation);
                    });
                    var html = '';
                    if (!$('#evaluationList')[0]) {
                        html += '<ul id="evaluationList" class="margin-top20">';
                    }

                    for (var i = 0; i < self.evaluationQuotes.length; i++) {
                        var evaluation = self.evaluationQuotes[i];
                        html += '<li>';
                        html += '<header>';
                        html += ' <span class="font-28 font-bold">' + evaluation.nickName + '</span>';
                        html += '<span class="grade-star">';
                        html += ' <div style="width:' + evaluation.serviceScore + '"></div>';
                        html += ' </span>';
                        html += '</header>';
                        for (var j = 0; j < evaluation.tags.length; j++) {
                            html += '<label class="font-24">' + evaluation.tags[j] + '</label>';
                        }
                        html += '<div class="font-ctn">' + evaluation.content + '</div>';
                        html += '<footer class="font-24">' + evaluation.updateTime + ' ' + evaluation.carAllName + '</footer>';
                        html += '</li>';
                    }
                    if (!$('#evaluationList')[0]) {
                        html += '</ul>';
                    }
                    var dom = $(element).attr('data-html');
                    if ($('#evaluationList li').length > 2) {
                        $('#evaluationList').append(html);
                    } else {
                        $(dom + '').html(html);
                    }
                   self.evaluationQuotes=[];

                } else {
                    //没有数据
                    //var html='';
                    // html+='<div class="default-box">  <div class="font-28">暂无评价</div> <div class="font-ctn">贷款申请成功后，即可进行评价～</div></div>';
                    var dom = $(element).attr('data-html');
                    $(dom + '').hide();
                    $('.bg_f2').hide();
                }
            }

        })
        }
    }
    $(element).click(function () {
        var commentCount=  $(element).attr('data-commentCount')
        if (!self.isLoad) {
            self.isLoad=true;
            self.render_Comment(commentCount);
        }
    });

});

/**
*实现易问答功能
*参数:questionId,agreeUserId,deviceId
*@返回易问答列表
*/
XTK.Action.register('GET-EXPERT-QUESTIONANSWER', function (element) {
    var self = this;
    //questionId,agreeUserId,deviceId
    this.params = {
        questionId: '',
        agreeUserId: 1,
        deviceId: 0
    }
    //获取参数
    this.container = $(element).attr('container');
    this.getRandomHeadPicture = function () {
        var list = [];
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-001.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-002.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-003.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-004.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-005.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-006.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-007.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-008.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-008.png');
        list.push('http://img1.bitautoimg.com/jinrong/newmweb/css/usercenter/images/car-008.png');
        return list[Math.floor(Math.random() * 10 + 1)];
    }
    //渲染html
    this.render_Question = function (container) {
        XTKStore.ershoucheAPI = XTK.ershoucheAPI;
        XTKStore.getExpertAndQuestionAnswerByExpertId(self.params).then(function (res) {
            if (res.Result) {
                var _data = res.Data;
                var expertAndQuestionList = _data;
                if (_data.length > 0) {
                    var html = '';
                    html += '<div class="eQ-con eQEvent ">';
                    if (expertAndQuestionList.Count > 0) {
                        var eq = expertAndQuestionList.FirstOrDefault();
                        html += '<dl>';
                        html += '<dt class="expert font-24">';
                        html += '<img src="' + eq.Expert.HeadPicture + '">';
                        html += '<b class="font-ctn">' + eq.Expert.Name + '</b>' + eq.Expert.Position + '';
                        html += '<div>' + eq.Expert.Introduction + '</div>';
                        html += '<div>';
                        if (eq.Expert.Label) {
                            var atlist = eq.Expert.Label.Replace('；', ';').Split(';');
                            for (var i = 0; i < atlist.length; i++) {
                                html += '<label>' + atlist[i] + '</label>';
                            }
                        }
                        html += '</div>';
                        html += '<a href="/ExpertQuestion/Index?businessLine=' + eq.Expert.BusinessLine + '&expertId=' + eq.Expert.ID + '" class="ask-btn font-26">点我提问</a>';
                        html += '</dt>';
                        html += '<dd class="eQ-list">';
                        html += '<ul class="eQ-list-con font-24">';

                        for (var j = 0; j < eq.Question.length; j++) {
                            var q = eq.Question[j];
                            html += '<li data-id="' + q.ID + '">';
                            html += '<dl>';
                            html += '<dt>';
                            if (q.QuestionUserHeadPortrait) {
                                html += '<img src="' + q.QuestionUserHeadPortrait + '>';
                            } else {
                                html += '<img src="' + GetRandomHeadPicture() + '">';
                            }
                            html += '<b class="font-28">' + q.Question + '</b>用户:' + q.QuestionUserTel + '';
                            html += '</dt>';
                            html += '<dd>';
                            html += '<img src="' + eq.Expert.HeadPicture + '">';
                            html += '<div class="font-ctn">' + q.Answer + '</div>';
                            html += '<span>' + q.AnswerTimeText + '</span><i class="pariseEvent">赞(<span>' + q.PraiseCount + '</span>)</i>';
                            html += '</dd>';
                            html += '</dl>';
                            html += '</li>';
                        }
                        html += ' </ul>';
                        html += '</dd>';
                        html += '</dl>';
                    }
                    html += '</div>';
                    $(element).html(html);
                    //易问答 点赞
                    $(".eQEvent").on('click', '.pariseEvent', function () {
                        var $that = $(this);
                        if (!$that.hasClass("cur")) {
                            var $num = $that.find("span");
                            var count = parseInt($num.text()) + 1;
                            var qId = $that.parents("li").data("id");
                            var params = {
                                questionId: qId,
                                agreeUserId: loanUserId,
                                deviceId: deviceId
                            }
                            XTKStore.clickAgree(params).then(function (re) {
                                if (re.Result) {
                                    $that.addClass("cur");
                                    $num.text(count);
                                } else {
                                    tools.showAlert(re.Message);
                                }
                            })
                        }
                    });
                } else {
                    //没有数据
                    var html = '';
                    html += '<div class="eQ-con eQEvent"> <div class="eQDefault font-24"><div class="font-28">暂无专家</div><div class="font-ctn">请您耐心等待</div></div></div>';
                    $(element).html(html);
                }
            }
        })
    }
    $(element).click(function () {
        self.render_Question();
    });

});


