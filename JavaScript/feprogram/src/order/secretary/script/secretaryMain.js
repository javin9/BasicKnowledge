import step_state from './newSecretary_step_state';
import select_info from './newSecretary_select_info';
import step_1 from './newSecretary_step_1';
import step_2 from './newSecretary_step_2';
import step_3 from './newSecretary_step_3';
import step_4 from './newSecretary_step_4';
import step_5 from './newSecretary_step_5';
import step_6 from './newSecretary_step_6';
var productIds = [];
var packageId = '';
var order_ID = '';
var actionDate = {};

let isfirstClickSubmit = true;

function getHtml(data) {
    var html = p_html(data);
    if (productIds.length > 0) {
        other();
    }
    qalist(); // 帮助中心 qianyuan 2017/3/29
    return html;
}

function other() {
    getServceData.get_similar_products_getting(function(res) {
        if (res.Result) {
            var html = '';
            for (var i = 0; i < res.Data.length; i++) {
                if (i < 2) {
                    html += other_html(res.Data[i], 2);
                }
            }
            $('.table_suc_info').append(html);

            $('.table_suc_info').on('click', '.tijiao', function() {
                var _this = $(this);
                if (_this.hasClass('ok_grey'))
                    return;
                var or = $(this).attr('data-orders');;
                order_ID = or;
                _this.html('<i></i>已申请');
                _this.attr('class', 'ok_grey');
                getServceData.post_creating(function(resa) {
                    if (resa.Result) {} else {
                        Tools.showAlert(resa.Message);
                        _this.html('<i></i>同时申请');
                        _this.attr('class', 'add tijiao');
                    }
                });
            })
        }
    });
}

function other_html(data) {

    var html = '';
    if (data.Product) {
        var p = data.Product;
        var score = 0;
        if (p.CommentScore != 0) {
            score = p.CommentScore.toFixed(1)
        } else {
            score = 0;
        }
        var commonRequirement = '';
        if (p.CommonRequirementType == 3) {
            commonRequirement = '宽松';
        }
        if (p.CommonRequirementType == 2) {
            commonRequirement = '一般';
        }
        if (p.CommonRequirementType == 1) {
            commonRequirement = '严格';
        }
        html = ` 
            <tr>
                <td class="tal"><div class="name_temp"><img src="${p.CompanyLogoUrl}">${p.PackageName}（${p.CompanyName}）</div>
                </td>
                <td>${score}</td>
                <td>${commonRequirement}</td>
                <td>${p.LoanCalculationInfo.MonthlyPaymentText}</td>
                <td>${p.LoanCalculationInfo.TotalCostText}</td>
                <td><span  data-orders="${data.Orders}" class="add tijiao"><i></i>同时申请</span></td>
            </tr>
       `;

    }
    return html;
}

function p_html(data) {
    if (data.Adviser && data.Adviser.UserInfo) {
        $('.tell').html(data.Adviser.UserInfo.CN400 + '转' + data.Adviser.UserInfo.ExTen);
    } else {
        $('.tell').hide();
    }
    $('.tit_r').click(function() {
        window.location.href = data.PageUrl;
    });

    var html = '';
    if (data.Product) {
        var p = data.Product;
        var score = 0;
        if (p.CommentScore != 0) {
            score = p.CommentScore.toFixed(1)
        } else {
            score = 0;
        }
        var commonRequirement = '';
        if (p.CommonRequirementType == 3) {
            commonRequirement = '宽松';
        }
        if (p.CommonRequirementType == 2) {
            commonRequirement = '一般';
        }
        if (p.CommonRequirementType == 1) {
            commonRequirement = '严格';
        }
        html = ` <tbody><tr>
                <th>贷款方案</th>
                <th>评分</th>
                <th>申请要求</th>
                <th>月供</th>
                <th>贷款成本</th>
            </tr>
            <tr>
                <td class="tal"><div class="name_temp"><img src="${p.CompanyLogoUrl}">${p.PackageName}（${p.CompanyName}）</div>
                </td>
                <td>${score}</td>
                <td>${commonRequirement}</td>
                <td><span class="col_red">${p.LoanCalculationInfo.MonthlyPaymentText}</span><span class="col_grey2a">（参考价）</span></td>
                <td><span>${p.LoanCalculationInfo.TotalCostText}</span><span class="col_grey2a">（参考价）</span></td>
            </tr>
        </tbody>`;

    }

    return html;
}

// 帮助中心 qianyuan 2017/3/29
function qalist() {
    getServceData.get_qa_list_getting(function(res) {
        if (res.Result) {
            var html_tab = '',
                html_tabcons = '',
                html = '';
            var qaType = ['常见问题', '关于资质', '下单流程', '审批流程'];
            var qaHash = ['common', 'about', 'order', 'approval'];

            for (var i = 0; i < res.Data.length; i++) {
                html_tab += `<span ${res.Data[i].IsActive ? 'class="active"' : ''}>${qaType[res.Data[i].QAType]}</span>`;
                switch (res.Data[i].QAType) {
                    case 2:
                        html_tabcons += `<div class="qa-detail" ${res.Data[i].IsActive ? 'style="display:block;"' : ''}>
                                             <div class="qa-process"></div>
                                             <a class="more-btn" href="${res.Data[i].MoreUrl + (res.Data[i].IsYx ? '#store-' : '#loan-') + qaHash[res.Data[i].QAType]}">查看更多 &gt;</a>
                                         </div>`;
                        break;
                    default:
                        html_tabcons += `<div class="qa-detail" ${res.Data[i].IsActive ? 'style="display:block;"' : ''}><dl>`;
                        for (var j = 0; j < res.Data[i].Qalist.length; j++) {
                            html_tabcons += `<dt>${res.Data[i].Qalist[j].Question}</dt>
                                        <dd>${res.Data[i].Qalist[j].Answer}</dd>`;
                        }
                        html_tabcons += `</dl>
                                         <a class="more-btn" href="${res.Data[i].MoreUrl + (res.Data[i].IsYx ? '#store-' : '#loan-') + qaHash[res.Data[i].QAType]}">查看更多 &gt;</a>
                                        </div>`;
                        break;
                }
            }

            html = `<div class="qa">
                        <div class="qa-con">
                            <h3>${html_tab}</h3>
                            ${html_tabcons}
                        </div>
                    </div>`;
            $('.container').after(html);

            /* 帮助中心 qianyuan，2017/3/29  标签切换 */
            var QA = {
                init: function() {
                    if (!$('.qa').length) { return; }

                    var $tabs = $('.qa h3 span');
                    var $tabcons = $('.qa .qa-detail');
                    var $defaultTab = $('.qa h3 span.active');

                    if (!$defaultTab.length) {
                        $defaultTab = $tabs.eq(0);
                        $defaultTab.addClass('active');
                    } else if ($defaultTab.length > 1) {
                        $defaultTab = $defaultTab.eq(0);
                        $tabs.removeClass('active');
                        $defaultTab.addClass('active');
                    }

                    $tabcons.eq($tabs.index($defaultTab[0])).show().css('display', 'block');

                    $tabs.click(function(e) {
                        e.preventDefault();
                        var index = $tabs.index(this);
                        $tabs.removeClass('active');
                        $(this).addClass('active');
                        $tabcons.hide().eq(index).show()
                    });
                }
            };
            QA.init();
        }
    });
}

module.exports.init = function() {
    $('.order_nav_ul li').eq(0).attr('class', 'front');
    $('.order_nav_ul li').eq(1).attr('class', '');
    $('.order_nav_logo').click(() => {
        location.href = 'http://www.daikuan.com';
    });

    $('.tit_r').hover(function() {
        $('.tit_r').css("color", "#e9474d");
        $('.tit_r').find('.arrowBlank').addClass('arrowRad');
    }, function() {
        $('.tit_r').css("color", "#666");
        $('.tit_r').find('.arrowBlank').removeClass('arrowRad');
    });

    $('.tiaoguo').hover(function() {
        $('.tiaoguo').css("color", "#e9474d");
        $('.tiaoguo').find('.arrowBlank').addClass('arrowRad');
    }, function() {
        $('.tiaoguo').css("color", "#5A67AE");
        $('.tiaoguo').find('.arrowBlank').removeClass('arrowRad');
    });
    $('.reset_btn_text').hover(function() {
        $('.reset_btn_text').css("color", "#e9474d");
    }, function() {
        $('.reset_btn_text').css("color", "#666");
    });

    $('#step_5_name_validate').html('<i></i>请输入真实姓名');
    $('.radioBtn').hover(function() {
        $(this).addClass('radioBorderBtnHover')
    }, function() {
        $(this).removeClass('radioBorderBtnHover')
    })
    $('.header-bottom').hide();
    if (isLoggedIn) {
        $('.step_5_person_icon').css({ top: 30 });
    }
    if (isTF) {
        setTimeout(function() { $('.yanchi').show(300); }, 1000);
    }

    $('.process_goto_sf').click(function() {
        location.href = home_page_url;
    });
    $('.process_goto_jd').click(function() {
        location.href = usercenter_url;
    });
    var stepIndex = 0;
    var stepArray = ["#step_one", "#step_two", "#step_three", "#step_four", "#step_five", "#step_six"];

    var stepModuleArray = [step_1, step_2, step_3, step_4, step_5, step_6];

    //初始化第一步
    stepModuleArray[stepIndex].init();

    //监听数据选择事件
    $(window).on("dataSelect", function(e, data) {
        //用户选择的信息
        select_info.setStepInfo(stepIndex, data);
        //console.log(select_info.getJsonUserInfo());
        if (select_info.getJsonUserInfo().lc) {
            getServceData.get_feaures_getting(function(res) {
                $('#p_characteristic').html(res.Data.Features.join('、'));
                $('#p_percentage').html(res.Data.Percentage);
                setTimeout(function() {
                    //跳转下一步
                    $(stepArray[stepIndex]).hide();
                    stepModuleArray[++stepIndex].init();
                    $(stepArray[stepIndex]).show();
                    //进度状态导航
                    step_state.nextStep(stepIndex);
                    $('.topSpace').hide();
                    $('.guidance_process_right').hide();
                }, 3000);
            }, select_info.getJsonUserInfo().CityId, select_info.getJsonUserInfo().CarId, select_info.getJsonUserInfo().CarPrice, select_info.getJsonUserInfo().DownPaymentRate, select_info.getJsonUserInfo().RepaymentPeriod);

        }
    });

    //监听下一步事件
    $(window).on("nextStep", function(e, data) {
        if (stepIndex < 4) {
            if (!select_info.getJsonUserInfo().lc) {
                //跳转下一步
                $(stepArray[stepIndex]).hide();
                stepModuleArray[++stepIndex].init();
                $(stepArray[stepIndex]).show();
                //进度状态导航
                step_state.nextStep(stepIndex);
                $('.order_nav_ul li').eq(0).attr('class', 'after');
                $('.order_nav_ul li').eq(1).attr('class', 'front');
            }

        } else if (stepIndex == 3) {

        } else if (stepIndex == 4) {
            $('.order-process').css('height', '518px');
            $('.order_nav_ul li').eq(1).attr('class', 'after');
            $('.order_nav_ul li').eq(2).attr('class', 'front');

            actionDate.stepModuleArray = stepModuleArray;
            actionDate.stepArray = stepArray;
            actionDate.step_state = step_state;
            actionDate.stepIndex = stepIndex;
            if (select_info.getJsonUserInfo().isOK || dev) {
                $('.suerBtnp_step_5 .suerBtn').addClass("btnDisabled");
                getServceData.post_creating(function(res) {
                    if (res.Result) {
                        try {
                            //添加埋点
                            _agtjs('loadEvent', { atsev: 101, 'atsusr': res.Data.OrderId });
                            var phone = $("#step_5_phone").val().replace(/ /g, "");
                            bc.evt.send('mobile', 'sbtclk', phone, '1', '帮你贷款PC订单提交成功')
                        } catch (err) {}
                        if (res.Data != null) {
                            $('.order-process').css('height', '670px');
                            $('.table_success').html(getHtml(res.Data));
                            if (res.Data.IsAuthenticated || dev) {
                                gotoNext();
                            } else {
                                popVerification(res.Data);
                            }

                        }
                        $('.suerBtnp_step_5 .suerBtn').removeClass("btnDisabled");
                    } else {
                        try {
                            //添加埋点
                            _agtjs('loadEvent', { atsev: 101, 'atsusr': res.Data.OrderId });
                            var phone = $("#step_5_phone").val().replace(/ /g, "");
                            bc.evt.send('mobile', 'sbtclk', phone, '0', '帮你贷款PC订单提交失败 原因' + res.Message)
                        } catch (err) {}
                        Tools.showAlert(res.Message);
                        actionDate.stepModuleArray[actionDate.stepIndex].submitBack(null);
                        $('.suerBtnp_step_5 .suerBtn').removeClass("btnDisabled");
                    }
                })
            }
        }
    });
    //reset
    $("#resetBtn").click(function(e) {
        window.location.reload();
    });


    // 获取新的图片验证码
    $('#changeCode').click(function() {
        $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url + '?t=' + (new Date().getTime()));
    })

    // if (dev) {
    //     stepIndex =4
    //     $('#step_one').hide()
    //     $(window).trigger('nextStep')
    // }

};

function gotoNext() {
    $('.name-certification').hide();
    $('#maskLayer').hide();
    $(actionDate.stepArray[actionDate.stepIndex]).hide();
    actionDate.step_state.hideTextTip();
    $(actionDate.stepArray[++actionDate.stepIndex]).show();
    actionDate.stepModuleArray[actionDate.stepIndex].showMessage(null);
    $('.order_nav_ul li').eq(2).attr('class', 'after');
    $('.order_nav_ul li').eq(3).attr('class', 'front');
}

function popVerification(data, stepArray, step_state) {

    $('.name-certification').show();
    $('#maskLayer').show();
    // $('#maskLayer').click(function () {
    //     $('.name-certification').hide();
    //     $('#maskLayer').hide();
    // });
    // $('#close').click(function () {
    //     $('.name-certification').hide();
    //     $('#maskLayer').hide();
    // });
    $('#step_5_name_box').val($('#step_5_name').val());

    $('.suerBtn_pop').click(function() {
        const ishasImgCode = !$('.imgValidateCodeBox').hasClass('hide');
        if ($('#step_5_name_box').val() == '') {
            $('#step_5_name_box').addClass('red_border');
            $('#step_5_name_boxerror').show();
            if (ishasImgCode) {
                $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url + '?t=' + (new Date().getTime()));
            }
            return;
        } else {
            $('#step_5_name_box').removeClass('red_border');
            $('#step_5_name_boxerror').hide();
        }
        if ($('#step_5_id').val() == '') {
            $('#step_5_id').addClass('red_border');
            $('.info-desc').css('top', '-5px');
            $('#step_5_iderror').html('请输入有效身份证').show();
            if (ishasImgCode) {
                $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url + '?t=' + (new Date().getTime()));
            }
            return;
        } else {
            $('#step_5_id').removeClass('red_border');
            $('.info-desc').css('top', '-20px');
            $('#step_5_iderror').hide();
        }

        if (ishasImgCode) {
            if ($('#step_5_img').val() == '') {
                $('#step_5_img').addClass('red_border');
                $('#step_5_imgerror').show();
                return;
            } else {
                $('#step_5_img').removeClass('red_border');
                $('#step_5_imgerror').hide();
            }
        }

        //1实名认证
        $.ajax({
            type: 'post',
            url: id_checking_url,
            data: {
                name: $('#step_5_name_box').val(),
                idNumber: $('#step_5_id').val(),
                //userId: data.UserId,
                // phone: select_info.getJsonUserInfo().userMobile
                imageCode: $('.imgValidateCodeBox').hasClass('hide') ? '' : $('#step_5_img').val()
            },
            dataType: 'json',
            cache: true,
            beforeSend: function() {},
            success: function(res) {
                if (res.Result) {
                    gotoNext();
                    $.ajax({
                        url: order_updating_url,
                        data: { orderId: data.OrderId },
                        type: "POST",
                        success: function() {

                        }
                    });
                } else {
                    // Tools.showAlert(res.Message);
                    //  <span id="step_5_iderror" class="validateTexterror">请输入有效身份证</span>
                    if (res.Data === 0) {
                        //验证码错误
                        $('#imgValidateCodeBox').removeClass('hide');
                        if (!isfirstClickSubmit) {
                            $('#step_5_imgerror').html('请输入正确的验证码').show();
                        } else {
                            $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url + '?t=' + (new Date().getTime()));
                            // Tools.showAlert("请输入图片验证码");
                        }

                    } else if (res.Data === -1) {
                        //需要验证码
                        $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url + '?t=' + (new Date().getTime()));
                        $('#imgValidateCodeBox').removeClass('hide');
                        // Tools.showAlert("请输入图片验证码");
                    } else {
                        $('.info-desc').css('top', '-5px');
                        $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url + '?t=' + (new Date().getTime()));
                        $('#step_5_iderror').html('身份验证不通过，请重新输入。').show();
                    }
                    // return;
                }
                isfirstClickSubmit = false;
            }
        });



    });
    $('.tiaoguo').click(function() {
        //创建订单
        gotoNext();
    })

}


var getServceData = {
    get_feaures_getting: function(callback, CityId, CarId, CarPrice, DownPaymentRate, RepaymentPeriod) {
        $.ajax({
            url: feaures_getting_url,
            data: { CityId: CityId, CarId: CarId, CarPrice: CarPrice, DownPaymentRate: DownPaymentRate, RepaymentPeriod: RepaymentPeriod, Career: select_info.getJsonUserInfo().Career, Credit: select_info.getJsonUserInfo().Credit, HouseState: select_info.getJsonUserInfo().HouseState, Insurance: select_info.getJsonUserInfo().Insurance, Funds: select_info.getJsonUserInfo().Funds, Income: select_info.getJsonUserInfo().Income },
            dataType: "json",
            type: "POST",
            success: function(res) {
                if (res.Data != null) {

                    productIds = [];
                    var orders = res.Data.Orders.split(',');
                    order_ID = orders[0];
                    if (orders.length > 1) {
                        for (var i = 1; i < orders.length; i++) {
                            productIds.push(orders[i].split('_')[1]);
                        }
                    }
                    packageId = order_ID.split('_')[0];
                    callback(res);
                } else {
                    Tools.showAlert("哎呀，根据您的资质没有找到相应产品。");
                    return;
                }

            }
        });
    },
    post_creating: function(callback) {
        var data = select_info.getJsonUserInfo();
        data.Name = select_info.getJsonUserInfo().Name;
        if (!data.Name)
            data.Name = userName;
        data.CertificateType = '105';
        data.CertificateNumber = select_info.getJsonUserInfo().CertificateNumber;
        if (!data.CertificateNumber)
            data.CertificateNumber = identityNumber;
        data.Telephone = select_info.getJsonUserInfo().Telephone;
        if (!data.Telephone)
            data.Telephone = mobile;
        data.IntentTimeOfPhone = select_info.getJsonUserInfo().IntentTimeOfPhone;
        if (!data.IntentTimeOfPhone)
            data.IntentTimeOfPhone = '';
        data.DownPaymentRate = select_info.getJsonUserInfo().DownPaymentRate;
        data.RepaymentPeriod = select_info.getJsonUserInfo().RepaymentPeriod;
        data.Channel = channal;
        data.Source = source;
        data.From = from;
        data.orders = order_ID;
        data.IsLoggedIn = isLoggedIn;

        data.CarId = select_info.getJsonUserInfo().CarId;
        data.CarPrice = select_info.getJsonUserInfo().CarPrice;
        data.BuyCarCityID = select_info.getJsonUserInfo().BuyCarCityID;
        data.CityId = select_info.getJsonUserInfo().CityId;

        data.validatecode = $('#step_5_verification').val();
        if (!data.validatecode) {
            data.validatecode = '';
        }
        data.line = 550;
        $.ajax({
            url: order_creating_url,
            data: data,
            dataType: 'json',
            type: "POST",
            success: function(res) {
                callback(res);
            }
        });
    },
    get_similar_products_getting: function(callback) {
        $.ajax({
            url: similar_products_getting_url,
            data: { productIds: productIds.join(','), carId: select_info.getJsonUserInfo().CarId },
            dataType: 'json',
            type: "POST",
            success: function(res) {
                callback(res);
            }
        });
    },
    get_qa_list_getting: function(callback) {
        $.ajax({
            url: qa_list_getting_url,
            data: { packageId: packageId },
            dataType: 'json',
            type: "POST",
            success: function(res) {
                callback(res);
            }
        });
    }
}