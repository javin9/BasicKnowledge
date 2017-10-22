'use strict'

//css
import '../../common/css/common.scss'
import '../lib/wallet.scss'

import Vue from 'vue'
import CardDetail from '../components/card-detail'
import check from 'libs/check/m'
import app from '../../common/script/app'
import XTK from '../../common/script/XTK'
import Store from '../../common/script/Store'
import Share from 'libs/share'

let cacheData = []

Store.userAPI = api_url
//页面dom元素初始化
var $app = $('#app')
var $getCodeBtn = $('#getCodeBtn')
var $CheckCode = $('#CheckCode')
var $submitBtn = $('#submitBtn')
var $Telphone = $('#Telphone')
var $TelphoneText = $('#TelphoneText')
var $use = $('.use')
var $activation = $('.activation')
var $failure = $('.failure')
var $add_car = $('.add-car')
var $on = $('.on')
var $no_product = $('#no-product')
var $mian = $('#mian')
var $form_modu = $('#form_modu')
var $wallet_tip = $('.wallet-tip')
var $wallet_tab = $('.wallet-tab')
var times = 500
var __RequestVerificationToken = $(
    'input[name=__RequestVerificationToken]'
).data('id')
var isCheckd = false
var code = ''
var CLASS_LOADING = 'loading-gray'
var ViewModel = {
    loadDomView() {
        $('.on').removeClass('on')
        $use.find('span').html(MyCouponCard.CanUserCount)
        $activation.find('span').html(MyCouponCard.UnAvtiveCount)
        $failure.find('span').html(MyCouponCard.OverdueCount)
        $Telphone.val(MyCouponCard.Telphone)
        $TelphoneText.val(MyCouponCard.TelphoneFormat)
        $wallet_tip.addClass('hide')
        $form_modu.addClass('hide')
        setTimeout(() => {
            $('.add-car').css({ 'box-shadow': 'inset 0 0 0 0 #E5E5E5;' })
        })
        if (MyCouponCard.CanUserCount == 0) {
            ViewModel.loadActivationView()
        } else {
            if (MyCouponCard.CanUserCount != 0) {
                ViewModel.loadUseView()
            } else {
                $wallet_tip.removeClass('hide')
                $form_modu.removeClass('hide')
            }
        }
    },

    //初始页页面dom元素事件
    loadDomEvent() {
        $getCodeBtn.on('click', () => {
            const tel = $Telphone.val()
            if(check.isPhoneNumber(tel.replace(/\s/g,''))){
                $CheckCode.focus()
            }
            ViewModel.getCode()
        })
        $submitBtn.on('click', () => {
            ViewModel.checkCode()
        })

        $use.on('click', () => {
            ViewModel.loadUseView()
        })
        $activation.on('click', () => {
            ViewModel.loadActivationView()
        })
        $failure.on('click', () => {
            ViewModel.loadFailureView()
        })
        $add_car.on('click', () => {
            location.href = MyCouponCard.ExchangeCard
        })
    },
    SetStateDomIsHide() {
        $app.addClass(CLASS_LOADING)
        $mian.html('')
        $no_product.addClass('hide')
        $('.on').removeClass('on')
        $wallet_tip.addClass('hide')
        $form_modu.addClass('hide')
    },
    //获取验证码
    getCode() {
        Store.getCode(
            {
                seconds: 60,
                tel_id: 'Telphone',
                gvc_id: 'getCodeBtn',
                line: 550,
                __RequestVerificationToken: __RequestVerificationToken,
                url: CODE_GETTING_URL
            },
            function(res) {
                //发送完验证码要做的事情
            }
        )
    },
    //验证码
    checkCode() {
        code = $CheckCode.val()
        if (code == '') {
            Tools.showAlert('请输入验证码!')
            return
        }
        Store.checkCode(
            {
                number: code,
                tel_id: 'Telphone',
                gvc_id: 'getCodeBtn',
                line: 550,
                __RequestVerificationToken: __RequestVerificationToken,
                url: CODE_VALIDATING_URL
            },
            function(result) {
                if (result.Result) {
                    Tools.showAlert('验证成功!')
                    var params = {
                        stateid: '1',
                        validateCode: code
                    }
                    Store.GetMyCouponCard(params).then(res => {
                        isCheckd = true
                        $wallet_tip.addClass('hide')
                        $form_modu.addClass('hide')
                        ViewModel.getUseHtml(res)
                    })
                } else {
                    Tools.showAlert(result.Message)
                }
            }
        )
    },
    showNoProduct(text) {
        $mian.html('')
        $no_product.find('.no-data-text').html(text)
        $no_product.removeClass('hide')
        if (text.indexOf('待激活') != -1) {
            if (MyCouponCard.ShowInviteLink == '1') {
                $no_product.find('.invitation').removeClass('hide')
            } else {
                $no_product.find('.invitation').addClass('hide')
            }
        } else {
            $no_product.find('.invitation').addClass('hide')
        }
    },
    loadUseView() {
        setTimeout(() => {
            ViewModel.SetStateDomIsHide()
            $use.addClass('on')
            $add_car.addClass('hide')
            if (MyCouponCard.CanUserCount == 0) {
                $app.removeClass(CLASS_LOADING)
                $add_car.removeClass('hide')
                ViewModel.showNoProduct('您暂时没有可使用的优惠券')
                return
            }
            //如果不包含京东卡，就不需要等用登录验证
            if (MyCouponCard.HasCanUserdReceivesJDCard != 'true')
                isCheckd = true
            if (isCheckd && !dev) {
                var params = {
                    stateid: '1',
                    validateCode: code
                }
                Store.GetMyCouponCard(params).then(res => {
                    if($use.hasClass('on')){
                        ViewModel.getUseHtml(res)
                        $app.removeClass(CLASS_LOADING)
                    }
                }, () => {
                    tools.showAlert(res.Message)
                    $app.removeClass(CLASS_LOADING)
                })
            } else {
                $app.removeClass(CLASS_LOADING)
                $mian.html('')
                $wallet_tip.removeClass('hide')
                $form_modu.removeClass('hide')
            }
        }, times)
    },
    loadActivationView() {
        setTimeout(() => {
            ViewModel.SetStateDomIsHide()
            $activation.addClass('on')
            $add_car.removeClass('hide')
            if (MyCouponCard.UnAvtiveCount == 0) {
                $app.removeClass(CLASS_LOADING)
                ViewModel.showNoProduct('您暂时没有待激活的优惠券')
                return
            }
            var params = {
                stateid: '2',
                validateCode: code
            }
            Store.GetMyCouponCard(params).then(res => {
                if($activation.hasClass('on')){
                    ViewModel.getActivatedHtml(res)
                    $app.removeClass(CLASS_LOADING)
                }
            }, () => {
                    tools.showAlert(res.Message)
                    $app.removeClass(CLASS_LOADING)
                })
        }, times)
    },
    loadFailureView() {
        setTimeout(() => {
            ViewModel.SetStateDomIsHide()
            $failure.addClass('on')
            $add_car.addClass('hide')
            if (MyCouponCard.OverdueCount == 0) {
                $app.removeClass(CLASS_LOADING)
                ViewModel.showNoProduct('您暂时没有已失效的优惠券')
                return
            }
            var params = {
                stateid: '3',
                validateCode: code
            }
            Store.GetMyCouponCard(params).then(res => {
                if($failure.hasClass('on')){
                    ViewModel.getFailureHtml(res)
                    $app.removeClass(CLASS_LOADING)
                }
            }, () => {
                    tools.showAlert(res.Message)
                    $app.removeClass(CLASS_LOADING)
                })
        }, times)
    },
    renderCard(data = [], type) {
        const isUse = type === 'use'
        const isFailure = type === 'failure'
        const isActivated = type === 'activated'
        const isJD = item => item.CardInfoType === 1000
        const isSJ = item => item.CardInfoType === 1150
        const isMX = item => item.CardInfoType === 1065
        const getName = item => isJD(item) ? 'jd' : isSJ(item) ? 'sj' : isMX(item) ? 'mx' : ''

        return `<div class="${type}-card-list">${data
            .map(
                (item, key) => `
                <div class="card-item card-item-${getName(item)}">
                    <dl>
                        <dt>
                            <div>
                                <h3>${item.CardTitle}</h3>
                                ${isActivated ? `<p>有效期至${item.ExpiryDateText}</p>` : ''}
                                ${isFailure && isJD(item) ? `<p><span>卡号：</span><em>${item.CardNo}</em></p><p><span>密码：</span><em>${item.CardPassWord}</em></p>` : ''}
                                ${isUse && isJD(item) && item.StateId !== 1012 ? `<p><span>卡号：</span><em>${item.CardNo}</em></p><p><span>密码：</span><em>${item.CardPassWord}</em></p>` : ''}
                                ${isUse && isJD(item) && item.StateId === 1012 ? `<p>京东卡预计将在20个工作日内发放，请您留意</p>` : ''}
                                ${!isActivated && isMX(item) ? `<p><span>券号：</span><em>${item.CouponCardNo}</em></p>` : ''}
                                ${!isActivated && isSJ(item) ? `<p><span>券号：</span><em>${item.PartnerCardNo || item.CouponCardNo}</em></p>` : ''}
                            </div>
                            <div>
                            ${!!+item.CardInfoValue
                                ? `<h3>${item.CardInfoValue}元</h3><p>${item.CardInfoNameDes || item.CardInfoName}</p>`
                                : ''}
                            </div>
                        </dt>
                        <dd>
                            ${isActivated
                                ? `
                                ${item.ActivateChannel === 1010
                                    ? `<span><i class="${item.StateId === 1014 ? 'important' : ''}">好友贷款成功-></i>您下次还款 即可激活</span>`
                                    : `${item.ActivateChannelName}可激活`}
                                `
                                : `<span>有效期至${item.ExpiryDateText}</span>`}
                            ${item.IsShowDetail
                                ? `<a href="${item.ClickEffect === 1
                                      ? item.LinkUrl
                                      : 'javascript:void(0)'}" class="${item.ClickEffect ===
                                  1
                                      ? ''
                                      : 'open-modal'}" rel="${key}">${item.ButtonText}</a>`
                                : ''}
                            
                        </dd>
                    </dl>
                    <i></i>
                </div>
            `
            )
            .join('')}</div>`
    },
    //可使用
    getUseHtml(res) {
        if (res.Result) {
            cacheData = res.Data || []
            $mian.html(this.renderCard(res.Data, 'use'))
        } else {
            ViewModel.showNoProduct('您暂时没有可使用的优惠券')
        }
        $add_car.removeClass('hide')
    },
    //可激活
    getActivatedHtml(res) {
        if (res.Result) {
            cacheData = res.Data || []
            $mian.html(this.renderCard(res.Data, 'activated'))
        } else {
            ViewModel.showNoProduct('您暂时没有待激活的优惠券')
        }
    },
    //已失效
    getFailureHtml(res) {
        if (res.Result) {
            cacheData = res.Data || []
            $mian.html(this.renderCard(res.Data, 'failure'))
        } else {
            ViewModel.showNoProduct('您暂时没有已失效的优惠券')
        }
    }
}

$('body').append(
    '<card-detail :title="cardDetail.title" :content="cardDetail.content" :button="去下单"></card-detail>'
)
const vm = new Vue({
    el: 'body',
    data: {
        cardDetail: {}
    },
    components: {
        CardDetail
    }
})

//view
$(function() {
    ViewModel.loadDomEvent()
    ViewModel.loadDomView()
    XTK.Action.bind()

    $('body').on('click', '.open-modal', function() {
        const data = cacheData[this.rel]
        vm.$broadcast('showCardDetail', {
            title: data.DialogTitle,
            content: data.DialogDescription,
            button: data.IsRedirect ? data.RedirectText : '',
            link: data.RedirectUrl
        })
    })

    $(window).on('scroll', function() {
        setTimeout(() => {
            $('.add-car').css({ 'box-shadow': 'inset 0 0 0 0 #E5E5E5;' })
        })
    })
})
