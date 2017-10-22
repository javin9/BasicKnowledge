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
*公用头
*@返回 html
*/
XTK.Action.register('GET-HEADER', function (element) {
    var self = this;
    //参数
    this.params = {
    };
    //获取参数
    this.container = $(element).attr('container');
    //渲染html
    this.render_header = function (container) {
        var text = $(element).attr('data-text');
        var html = ` <header class="header-bar">
                    <a id="gobackHistoryList" onclick="window.history.go(-1); return false;"></a>
                    <h1 class="font-nav">${text}</h1>
                    <span></span>
                    </header> ` ;
        $(element).html(html);
    }
    this.render_header();
});

/**
*活动规则
*@返回 html
*/
XTK.Action.register('GET-RULES', function (element) {
    var self = this;
    //参数
    this.params = {
    };
    //获取参数
    this.container = $(element).attr('container');
    this.style = $(element).attr('data-class');
    if (!this.style) {
        this.style = 'rules-white';
    }
    //渲染html
    this.render_rules = function (container) {
        var html = '';
        if(window.location.href.toLocaleLowerCase().indexOf('couponcard')>=0){
            html = ` <div class="${this.style}">
                    <div class="rules-title">
                        <span class="gang-l"></span>
                        <span class="font">活动规则</span>
                        <span class="gang-r"></span>
                    </div>
                    <div>
                        <p class="fw-b">玩法介绍：</p>
                        <p>分享“优惠卡”（价值1000元的京东E卡）给您的好友（好友须在易鑫车贷30天内未下过订单），好友领取“优惠卡”并在易鑫车贷网站或App下单后，您会得到1张“同享卡”（价值1000元京东E卡），同享卡可叠加。</p>
                        <p class="fw-b">详细规则：</p>
                        <p class="fw-b">活动对象：</p>
                        <p>在易鑫车贷网站或App成功贷款购买新车的用户。</p>
                         <p class="fw-b">产品范围：</p>
                        <p>易鑫自营金融产品。即：金融产品标题后缀有“易鑫集团”字样的产品。例如：一证贷 (易鑫集团) 、两证通 (易鑫集团)。</p>
                        <p class="fw-b">发放激活机制：</p>
                        <p>优惠卡：您将“优惠卡”分享给好友，TA点击领取后，TA的账户可获得价值为1000元京东E卡，在易鑫集团个人中心查看。成功放款后可激活使用（激活后会正常显示账号和密码）；
    同享卡：好友下单后，您的账号中会自动收到1张“同享卡”（价值1000元的京东E卡），在易鑫集团个人中心查看。在好友贷款成功的前提下，您下一次对您的贷款订单进行还款操作，即可激活使用。若累计得到多张“同享卡”，每次还款仅可激活1张。
    </p>
                        <p class="fw-b">获取奖励数量：</p>
                        <p>每个账户可获得1张优惠卡，多张同享卡。</p>
                        <p class="fw-b">注意事项：</p>
                        <p>1、优惠卡仅能分享给好友，不能自己领取；</p>
                        <p>2、获得同享卡的用户不能再领取优惠卡；获得优惠卡的用户可继续领取同享卡；</p>
                        <p>3、成功提车手机号与下单贷款手机号一致，方可激活卡券；</p>
                        <p>4、拥有相同账户、手机号、微信号、支付账号、设备、银行卡的用户视为同一用户（适用于您及您的朋友）；</p>
                        <p>5、本活动中，未贷款成功前用户收到的卡券，处于未激活状态，仅作为提示，不进行兑换；</p>
                        <p>6、当用户按要求完成邀请好友、贷款购车、还款行为后，会得到易鑫积分奖励，该积分会被自动消耗，以用于激活前期发放的未激活状态的卡券，用户可使用该卡券获取京东E卡；</p>
                        <p>7、活动发放的优惠卡、同享卡均为价值1000元的京东E卡（电子形式京东礼品卡）。使用说明见京东官网 https://o.jd.com/market/index.action ；</p>
                        <p>8、任何违规套取奖品的行为，易鑫车贷平台拥有追回奖品、封停账号、以及追究法律责任的权利；</p>
                        <p>9、最终解释权归易鑫车贷所有，相关咨询电话：4000-598-598。</p>
                    </div>
                    </div>` ;
        }else{
            html = `<div class="${this.style}">
                        <div class="rules-title">
                            <span class="gang-l"></span>
                            <span class="font">活动规则</span>
                            <span class="gang-r"></span>
                        </div>
                        <div>
                            <p class="fw-b">玩法介绍：</p>
                            <p>您的好友分享“优惠卡”（价值500元的京东E卡）给您。在您领取“优惠卡”，并通过淘车或易鑫车贷平台下单且成交后，即可激活“优惠卡”。您的好友也会得到1张“同享卡”（价值100元京东E卡）。</p>
                            <p>同时，您也可以给其他好友分享“优惠卡”，经您分享的好友成交后，您即可得到“同享卡” （价值100元京东E卡），同享卡可叠加。</p>
                            <p class="fw-b">详细规则：</p>
                            <p class="fw-b">活动对象：</p>
                            <p>邀请人：淘车平台（或易鑫车贷）的注册用户（易鑫内部员工除外）。</p>
                            <p>被邀请人：在易鑫车贷（或淘车平台）上30天内未下过订单的用户。</p>
                             <p class="fw-b">产品范围：</p>
                            <p>易鑫自营金融产品。即：金融产品标题后缀有“易鑫集团”字样的产品。例如：一证贷 (易鑫集团) 、两证通 (易鑫集团)、鑫动融（易鑫集团）以及易鑫租赁出品的“开走吧”等。</p>
                            <p class="fw-b">发放激活机制：</p>
                            <p>优惠卡：您将“优惠卡”分享给好友，TA点击领取后（领券时间早于下单时间），TA的账户可获得价值为500元京东E卡，在个人中心可以查看。成功放款后可激活使用（激活后会正常显示账号和密码）；
        同享卡：好友下单后，您的账号中会自动收到1张“同享卡”（价值100元的京东E卡），在个人中心查看。在好友贷款成功后，即可激活使用。不限制激活张数。
        </p>
                            <p class="fw-b">获取奖励数量：</p>
                            <p>每个账户可获得1张优惠卡，多张同享卡。</p>
                            <p class="fw-b">注意事项：</p>
                            <p>1、优惠卡仅能分享给好友，不能自己领取；</p>
                            <p>2、获得同享卡的用户不能再领取优惠卡；获得优惠卡的用户可继续领取同享卡；</p>
                            <p>3、成功提车的用户手机号与下单贷款手机号必须一致，方可激活卡券；</p>
                            <p>4、拥有相同账户、手机号、微信号、支付账号、设备、银行卡的用户视为同一用户（适用于您及您的朋友）；</p>
                            <p>5、本活动中，未贷款成功前用户收到的卡券，处于未激活状态，仅作为提示，不进行兑换；</p>
                            <p>6、本次发放的优惠卡价值为500元京东E卡，同享卡为价值100元的京东E卡（电子形式京东礼品卡）。使用说明见京东官网 https://o.jd.com/market/index.action ；</p>
                            <p>7、任何违规套取奖品的行为，易鑫车贷平台拥有追回奖品、封停账号、以及追究法律责任的权利；</p>
                            <p>8、最终解释权归易鑫车贷所有，相关咨询电话：4000-598-598。</p>
                        </div>
                    </div>`;
        }
         

        $(element).html(html);
    }
    this.render_rules();
});


/**
*活动规则
*@返回 html
*/
XTK.Action.register('GET-NO-PRODUCT', function (element) {
    var self = this;
    //参数
    this.params = {
    };
    //获取参数
    this.container = $(element).attr('container');
    this.isYao = $(element).attr('isYao');
    //渲染html
    this.render_no_product = function (container) {
        if (this.isYao) {
            var html = `  <div class="no-data"></div>
                    <div class="no-data-text">
                    您暂时没有待激活的优惠券
                    </div>
                    <div class="invitation hide">
                    <a href="${window.MyCouponCard.InviteLinkUrl}" class="btn">去领券</a>
                    </div>` ;
        } else {
            var html = `  <div class="no-data"></div>
                    <div class="no-data-text">
                   您暂时没有待激活的优惠券
                    </div>
                    </div>` ;
        }

        $(element).html(html);
    }
    this.render_no_product();
});



