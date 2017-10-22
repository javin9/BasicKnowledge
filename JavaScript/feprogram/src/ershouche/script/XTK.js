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
    ershoucheAPI:'',
    xincheAPI:'',
     Action: {
        handlers: new Array(),

        model:function (actionName, handler) {
            this.actionName = actionName;
            this.handler = handler;
        },
        /*＊
        获取this的参数
        */
        getParamter:function(element, paramterName) {
            return $(element).attr(paramterName);
        },
        /*＊
        行为
        */
        handle:function(action, element) {
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
        bind:function(element) {
            var self = this;
            if (element) {
                if (!!!element.binded) {
                    var action = this.getParamter(element, 'action');
                    self.handle(action, element);
                    element.binded = true;
                }
            } else {
                $('[action]').each(function() {
                    self.bind(this);
                });
            }
        },
        /*
        注册
        */
        register:function(actionName, handler) {
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
XTK.Action.register('GET-COMMENT-LIST',  function(element) {
    var self = this;
    //packageId,pageIndex,pageSize
    this.params={
        packageId:'4308',
        pageIndex:1,
        pageSize:50,
        pageCount:0
    };
    this.formatTime=function(shijianchuo){
            var self = this;
            //time是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d);
        }
    //获取参数
     this.container= $(element).attr('container');
     this.params.packageId=$(element).attr('data-packgeId');
     this.evaluationQuotes=[];
     //渲染html
     this.render_Comment=function(container){
         XTKStore.ershoucheAPI=XTK.ershoucheAPI;
         XTKStore.getPackageComment(self.params).then(function(res){
                if(res.Data){
                    var _data = res.Data;
                    if(_data.length>0){
                        self.params.pageCount = Math.ceil(res.RowCount/self.params.pageSize);//计算总页码
                        $.each(_data, function(index, val) {
                            var _evaluation={}
                            _evaluation.carAllName =!val.CarBaseInfo?"":val.CarBaseInfo.CarSerialShowName +' '+val.CarBaseInfo.CarYear+'款 '+val.CarBaseInfo.CarName;
                            _evaluation.nickName = val.UserComment.NickName;
                            _evaluation.content = val.UserComment.ProductJudgeContent?val.UserComment.ProductJudgeContent:((val.UserComment.ProductTag)?'':'该用户仅评分，未填写评价内容');
                            _evaluation.serviceScore = String(val.UserComment.ProductJudgeScore*20) +"%"

                            var dataTime = val.UserComment.UpdateTime.split("(")[1].split(")")[0];
                            _evaluation.updateTime = self.formatTime(parseInt(dataTime));

                            if(val.UserComment.ProductTag){
                                 var tags = val.UserComment.ProductTag.split("|");
                                for(var i = 0 ;i<tags.length;i++){
                                    if(tags[i] == "" || typeof(tags[i]) == "undefined"){
                                      tags.splice(i,1);
                                      i= i-1;     
                                    }            
                                }

                                _evaluation.tags = tags;
                            }else{
                                _evaluation.tags = "";
                            }

                            self.evaluationQuotes.push(_evaluation);
                        });
                         var html='';
                        html+='<ul id="evaluationList" class="margin-top20">';
                        for(var i=0;i<self.evaluationQuotes.length;i++){
                            var evaluation=self.evaluationQuotes[i];
                           html+='<li>';
                                html+='<header>';
                                    html+=' <span class="font-28 font-bold">'+evaluation.nickName+'</span>';
                                    html+='<span class="grade-star">';
                                       html+=' <div style="width:'+evaluation.serviceScore+'"></div>';
                                   html+=' </span>';
                                html+='</header>';
                                for(var j=0;j<evaluation.tags.length;j++){
                                html+='<label class="font-24">'+evaluation.tags[j]+'</label>';
                                }
                                html+='<div class="font-ctn">'+evaluation.content+'</div>';
                                html+='<footer class="font-24">'+evaluation.updateTime+' '+evaluation.carAllName+'</footer>';
                            html+='</li>';
                            }
                        html+='</ul>';
                    var dom=$(element).attr('data-html');
                    $(dom+'').html(html);
                    }else{
                        //没有数据
                        //var html='';
                        // html+='<div class="default-box">  <div class="font-28">暂无评价</div> <div class="font-ctn">贷款申请成功后，即可进行评价～</div></div>';
                         var dom=$(element).attr('data-html');
                         $(dom+'').hide();
                         $('.bg_f2').hide();
                    }
                }

         })
     }
     $(element).click( function() {
        self.render_Comment();
   });

});


