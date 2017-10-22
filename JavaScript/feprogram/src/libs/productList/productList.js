import React from 'react';
import ReactDOM from 'react-dom';

/* var Adviser = React.createClass({
    getInitialState: function() {
        return {
            username: '',
            lastGistUrl: ''
        };
    },
    componentDidMount: function() {
        var adviserApi = this.props.adviserApi,
            cityId = this.props.cityId,
            companyId = this.props.companyId,
            productId = this.props.productId;

        if (adviserApi) {
            $.ajax({
                url: adviserApi + '/adviser/' + cityId + '/' + companyId + '/',
                type: 'get',
                dataType: 'jsonp',
                //async: true,
                //cache: true,
                success: function(result){

                }
            });
        } else {
            return '';
        }
    },
    render: function() {

        //贷款顾问获取
        self.listBox.children('li').each(function (index, elem) {
            var _index = index;
            // 贷款顾问
            var cId = $(elem).attr('data-companyid');
            var pId = $(elem).attr('data-productid');
            var _url = adviserApi + "/adviser/" + listViewModel.cityId() +"/"+ cId+"/";

            self.sendAjax({
                url: _url,
                dataType: 'jsonp',
            }, adviserList, sendAgain);

            //获取成功
            function adviserList(result) {
                var _adviserId = "";
                var _adviserIdHtml = "";
                var _downHtml = "";
                if (result.Advisers != null) {

                    var adviserNum = result.Advisers.length;
                    var randomNum = parseInt(Math.random()*adviserNum);
                    var adviserAdv = result.Advisers[randomNum];

                    _adviserId = result.Advisers[randomNum].Id;
                    _adviserIdHtmlMore = '';
                    if (adviserNum > 4) {
                        _adviserIdHtmlMore = '<div  class=""><a class="adviser-box_list-up-btn" id="up' + _adviserId + '_' + pId + '"></a><a class="adviser-box_list-down-btn" id="down' + _adviserId + '_' + pId + '"></a></div>'
                    }
                    if (adviserNum > 1) {
                        _downHtml = '<div  class="adviser-box_list_move ' + _adviserId + '_' + pId + '" style="height:'+ (adviserNum>3?153:51*(adviserNum-1)) +'px">';
                        _downHtml += '<ul class="adviser-box_list_ul" id="adviser-box_list' + _adviserId + '_' + pId + '" style="top:0">';
                        for (var i = 0; i < result.Advisers.length; i++) {
                            var model = result.Advisers[i];
                            if (model.Id != _adviserId) {
                                _downHtml += '<li class="adviser-box_list"><span class="img-box_list"><img src="' + model.Photo + '" class="image_list"></span><span class="name-box_list"><span class="adv-name">' + model.Name + '</span><i class="skillLevel_' + model.SkillLevelId + '"></i></span><span class="tel-box_list"><font class="tel">' + model.CN400 + '</font> 转 <font class="tel_list">' + model.ExTen + '</font></span></li>';
                            }
                        }
                        _downHtml += '</ul>';
                        _downHtml += '</div>';

                    }
                    _adviserIdHtml=
                        '<span class="img-box"><img src="' + adviserAdv.Photo + '" class="image" /></span><span class="name-box">' + adviserAdv.Name + '</span><span class="tel-box"><font class="col-red">' + adviserAdv.CN400 + '</font> 转 <font class="col-red">' + adviserAdv.ExTen + '</font></span>'
                        + '<div class="advBox clrfix"><div class="adviser_tip" id="adviser_tip' + _adviserId + '_' + pId + '">'
                        +'<div class="tit font-16 col-black">专业金融顾问，1对1免费服务</div>'
                        +'<div class="adviser-dl">'
                        + '<div class="adviser-dt"><img src="' + adviserAdv.Photo + '" /></div>'
                        +'<div class="adviser-dd">'
                        + '<span class="ad-dd-name col-black">' + adviserAdv.Name + '<i class="skillLevel_' + adviserAdv.SkillLevelId + '"></i></span>'
                        + '<span class="ad-dd-info col-grey9">已帮<font class="">' + adviserAdv.ServeNumber + '</font>人贷款  <font class="">' + adviserAdv.Rate + '</font>%好评</span>'
                        + '<span class="ad-dd-tel col-grey9"><font class="tel">' + adviserAdv.CN400 + '</font>转<font class="tel">' + adviserAdv.ExTen + '</font></span>'
                        + '</div>'
                        + '</div>'
                        + _downHtml
                        + _adviserIdHtmlMore
                        + '</div></div>'
                    $(".list-box>li.list-itme").eq(_index).find(".adviser-box").show().attr("data-id", _adviserId);
                    $(".list-box>li.list-itme").eq(_index).find(".adviser-box").html(_adviserIdHtml);

                    if (adviserNum > 1) {
                        $('#up' + _adviserId + '_' + pId).on('click', function (e) {
                            e.preventDefault();

                            var box_list = $('#adviser-box_list' + _adviserId + '_' + pId);

                            var y = box_list.css('top');
                            y = parseInt(y) + (51*3)
                            if (y <= 0) {
                                box_list.animate({ top: y + 'px' }, 500);
                            } else {
                                box_list.animate({ top: '0px' }, 500);
                            }
                        });
                        $('#down' + _adviserId + '_' + pId).on('click', function (e) {
                            e.preventDefault();
                            var box_list = $('#adviser-box_list' + _adviserId + '_' + pId);
                            var count = $('#adviser-box_list' + _adviserId + '_' + pId + '>li').length;
                            var s = (parseInt(count)-1)%3 !=0 ? Math.ceil((parseInt(count)-1)/3) : (parseInt(count)-1)/3;
                            var y = box_list.css('top');
                            y = parseInt(y) - (51*3)
                            var flag = parseInt(y) / (-51*3);
                            if (flag <= s) {
                                box_list.animate({ top: y + 'px' }, 500);
                            }else{
                                box_list.animate({ bottom: 0 + 'px' }, 500);
                            }
                        });
                    }
                    $(".adviser-box").on('mouseover', function () {
                        var _urlAdviser = $(this).prev('a').attr('href') + '&scroll=advisor';
                    }).on("mouseout",  function () {
                        var _urlAdviser = $(this).prev('a').attr('href') + '&scroll=advisor';
                    })
                }

            };
            // 出错后重新加载
            function sendAgain(info) {
                self.sendAjax({
                    url: _url,
                    dataType: 'jsonp'
                }, adviserList, sendAgain);
            };
        });
    }
}); */

var Product = React.createClass({
    render: function() {
        var item = this.props.data;
        // console.log(item);

        // 详情页链接
        var detailUrl = this.props.cheDaiUrl + this.props.citySpell + '/m' + this.props.carId + '/p' + item.ProductId;
        if (this.props.dealerId && parseInt(this.props.dealerId)) {
            detailUrl += "/d" + this.props.dealerId;
        }
        detailUrl += "?source=" + this.props.source + '&channel=' + this.props.channel;
        if (this.props.shopcode) {
            detailUrl += "&shop=" + this.props.shopcode;
        }

        // 旗舰店链接
        var financeShopLink;
        if (item.FinanceShopUrl) {
            item.FinanceShopUrl = item.FinanceShopUrl.replace(/^(http:\/\/)(\S)+(\/)/, '/');
            if(item.FinanceShopUrl.indexOf(this.props.citySpell) < 0) {
                item.FinanceShopUrl += '/' + this.props.citySpell;
            }
            financeShopLink = <span><a target="_blank" className="package-name" href={item.FinanceShopUrl}>{item.FinanceShopName}旗舰店></a></span>;
        } else {
            financeShopLink = '';
        }

        // 申请按钮
        var _isShowApplyBtn = '';
        var checkboxClassName = 'checkbox';
        var _ShowApplyBtnKlass = '';
        var _ShowApplyBtnText = '';
        if (item.HasPromotion && !item.PromotionLeftTime) {
            _isShowApplyBtn = 'none';
            checkboxClassName += ' disabled';
            _ShowApplyBtnKlass = 'apply-btn disabled';
            _ShowApplyBtnText = '过期已下线';
        } else {
            _isShowApplyBtn = '';
            checkboxClassName += '';
            _ShowApplyBtnKlass = 'btn-org apply-btn';
            _ShowApplyBtnText = '立即申请';
        }

        // 副标题是否可见
        var subHeadingVisible;
        if (item.IsTop || item.CompanyId === 803 || item.OrderApplyUrl.indexOf('YxHxm') > -1) {
            subHeadingVisible = '';
        } else {
            subHeadingVisible = 'none';
        }

        // 申请信息
        var CommonRequirementTypeText;
        switch (item.CommonRequirementType) {
            case 1:
                CommonRequirementTypeText = <font className="level-one">严格</font>;
                break;
            case 3:
                CommonRequirementTypeText = <font className="level-three">宽松</font>;
                break;
            default:
                CommonRequirementTypeText = <font className="level-two">一般</font>;
                break;
        }

        // 申请条件
        var CommonRequirementList = '';
        var requirements = [];
        if (item.CommonRequirementList) {
            requirements = item.CommonRequirementList.split(',');
        } else if (item.ApplyCondition) {
            requirements = item.ApplyCondition.split(/\s+/gm);
        } else {
            requirements = ['1、身份证', '2、居住证明', '3、收入证明', '4、婚姻证明'];
        }
        var requireBtn = '';
        if (requirements.length > 6) {
            requireBtn = <a className="more fr"  target="_blank" href={detailUrl}>查看更多</a>;
        }
        CommonRequirementList = (
            <div>
                {
                    requirements.slice(0, 6).map(function (requirement) {
                        return (<p>{requirement}</p>);
                    })
                }
                {requireBtn}
            </div>
        );

        // 按钮类名
        var PackageFeatureIconClsName = 'PackageFeatureIcon1 PackageEvent';
        if (item.PackageFeatureIcon1 && ['在线审批', '1小时审批', '一小时审批', '一小时速批', '1小时速批'].indexOf(item.PackageFeatureIcon1) > -1) {
            if (!(item.HasPromotion && item.PromotionLeftTime === '')) {
                PackageFeatureIconClsName += ' apply-btn';
            }
        }
        if (item.OrderApplyUrl.indexOf('YxHxm') > -1) {
            PackageFeatureIconClsName += ' apply-btn yxHxm-btn';
        }

        // 评分
        var CommentCountScore = '';
        if (item.CommentCount) {
            var CommentScore = item.CommentScore / 5 * 100 + '%';
            CommentCountScore = (<div className="dl dl-Score">
                <div className="CommentScore">
                        <span className="stars">
                            <s style={{width: parseInt(item.CommentScore) / 5 * 100 + '%'}}></s>
                        </span>
                        <font className="font-18 col-red">{item.CommentScore}</font>分
                    </div>
                    <div className="CommentCount">
                        <a className="eventip2" target="_blank" href={detailUrl + '&CommentCount=true'}>{item.CommentCount}条评价</a>
                    </div>
            </div>);
        } else {
            CommentCountScore = (<div className="dl dl-Score">
                <div className="CommentCount">
                    <span className="eventip bor-bot6 curp">暂无评价</span>
                    <div className="CommentCount-tip">当前暂无评价。申请该产品后，登录即可评价成为首位点评者。</div>
                </div>
                <div className="tdus">
                    <span>申请即可评价</span>
                </div>
            </div>);
        }

        // 贷款成本
        var tipText = '分期成本 = ' + item.TotalCostText;
        if (item.ServiceFeeText && item.TotalInterestText) {
            tipText += '（手续费' + item.ServiceFeeText + ' + 利息' + item.TotalInterestText + '）';
        } else if (item.TotalInterestText) {
            tipText += item.TotalCostText + '（利息' + item.TotalInterestText + '）';
        } else if (item.ServiceFeeText) {
            tipText += item.TotalCostText + '（手续费' + item.ServiceFeeText + '）';
        }

        var packageText = '';
        if (this.props.depositPackageType && parseInt(this.props.depositPackageType) === item.PackageType) {
            packageText = (
                <div className="bond-box">*首次支付：
                    <span>{item.DownPaymentText}</span>(首付)
                    <span>{item.SecurityDepositAmountText}</span>(保证金,可抵月供）
                </div>
            )
        }

        // 标签
        var yingxiaoLength = 0;
        var MultiLabelRemark = <div className="li-hui" style={{display:'none', width: 0, height: 0,overflow:'hidden'}}></div>;
        if (item.MultiLabel) {
            var multiLabelText = item.MultiLabel.replace(/\|\|/g, '；');
            if (multiLabelText.length > 24) {
                multiLabelText = multiLabelText.slice(0, 24) + "...";
            }
            yingxiaoLength += multiLabelText.length;
            if (item.MultiLabelRemark) {
                var remarkList = item.MultiLabelRemark.split('||');
                MultiLabelRemark = (<div className="li-hui">
                    <i className="hui">惠</i>{multiLabelText}
                    <div className="Pack-Amount-tip">
                        <div className="info">
                            {
                                remarkList.map(function (remark) {
                                    return <p>{remark}</p>
                                })
                            }
                        </div>
                        <p className="tar col-red">
                            <a href="javascript:void(0);" className="apply-btn col-red" data-company-id={item.CompanyId} style={{display:_isShowApplyBtn}}>立即申请</a>
                        </p>
                    </div>
                </div>);
            } else {
                MultiLabelRemark = <div className="li-hui" style={{cursor: 'default'}}><i className="hui">惠</i>{multiLabelText}</div>;
            }
        }

        var PackageGiftValueAmount = '';
        if (item.PackageGiftValueAmount) {
            PackageGiftValueAmount = <div className="li-li" data-id={item.PackageId}>
                <i className="li">礼</i>送{item.PackageGiftValueAmount}元礼包
                <div className="Pack-Amount-tip">
                    <div className="info"></div>
                    <p className="tar col-red"></p>
                </div>
            </div>
            yingxiaoLength += 4 + item.PackageGiftValueAmount.toString().length;
        } else {
            PackageGiftValueAmount = <div className="li-li" style={{display:'none', width: 0, height: 0,overflow:'hidden'}}></div>;
        }

        var OffsetDownPaymentAmount = '';
        if (item.PaySimpleInfoList.length) {
            var paySimpleInfo = item.PaySimpleInfoList.join('；');
            if (paySimpleInfo.length > 24) {
                paySimpleInfo = paySimpleInfo.slice(0, 24) + '...';
            }
            yingxiaoLength += paySimpleInfo.length;
            OffsetDownPaymentAmount = <div className="li-fu">
                <i className="fu">付</i>{paySimpleInfo}
                <div className="Pack-Amount-tip">
                    <div className="info">
                        {
                            item.PayDetailInfoList.map(function (payDetailInfo) {
                                return (<p>{payDetailInfo}</p>);
                            })
                        }
                    </div>
                    <p className="tar col-red">
                        <a href="javascript:void(0);" data-company-id={item.CompanyId} style={{display: _isShowApplyBtn}} className="apply-btn col-red">立即申请</a>
                    </p>
                </div>
            </div>
        } else {
            OffsetDownPaymentAmount = <div className="li-fu" style={{display:'none', width: 0, height:0, overflow:'hidden'}}></div>
        }

        var monthlyPayment = '';
        if (item.MonthlyPaymentText.indexOf('万') > -1) {
            monthlyPayment = <span><font className="font-24 col-red">{parseInt(parseFloat(item.MonthlyPaymentText) * 10000)}</font>元</span>;
        } else {
            monthlyPayment = <span><font className="font-24 col-red">{parseInt(item.MonthlyPaymentText)}</font>元</span>;
        }

        var adviser = ''
        if (this.props.adviserApi) {
        //    adviser = <Adviser adviserApi={this.props.adviserApi} cityId={this.props.cityId} companyId={item.CompanyId} productId={item.ProductId} />
            // TODO adviser
        } else {

        }

        return (
            <li className="list-itme" data-href={detailUrl} data-companyid={item.CompanyId} data-productid={item.ProductId}>
                <header className="clrfix">
                    <div data-pa={item.PackageId} data-pd={item.ProductId} data-pp={item.ProductPromotionId} className={checkboxClassName}><i></i></div>
                    <div className="company-logo"><img alt={item.CompanyName} src={item.CompanyLogoUrl} /></div>
                    <div className="list-header-ctr">
                        <a target="_blank" href={detailUrl}>
                            <span className="company-name">{item.PackageName}</span>
                            {/* <span className="company-name">({item.CompanyName})</span>
                            */}
                        </a>
                        <div className="adviser-box">
                            {adviser}
                        </div>
                        <div className="downpayment-box">
                            {item.showDownPayment ?  '(首付'+ item.DownPaymentRate * 100 + '%：'+ item.DownPaymentText + ')' : ''}
                        </div>
                        <div className="sub-heading" style={{display: subHeadingVisible}}>{item.SubHeading}</div>
                    </div>
                    {/* <div className="apply-num clrfix">
                        {financeShopLink}
                    </div> */}
                </header>
                <footer className="clrfix footer-info" data-applyurl={item.OrderApplyUrl}>
                    <div className="dl dl-Common">
                        <div className="CommonRequirementType">
                            <em>申请信息：</em><span>{CommonRequirementTypeText}</span>
                            <div className="CommonRequirementType-tip">
                                <div className="info">
                                    <div>{CommonRequirementList}</div>
                                </div>
                            </div>
                        </div>
                        <div className="TotalCost">
                             <font className="bor-bot6">分期成本 <span>{item.TotalCostText}</span></font>
                            <div className="TotalCost-tip">{tipText}</div>
                            {packageText}
                        </div>
                    </div>
                    <div className="dl dl-Package">
                        <div className={PackageFeatureIconClsName} data-company-id={item.CompanyId}><font>{item.PackageFeatureIcon1}</font></div>
                        <div className="PackageFeatureIcon2">{item.PackageFeatureIcon2}</div>
                        <div className="CommonRequirementType-tip jisushenpi">
                            <div className="info">
                                30分钟内顾问致电，确认意向；<br />
                                1小时内完成审批，获得精确分期额度；<br />
                                24小时内签订合同，完成放款，提取爱车。
                            </div>
                        </div>
                        <div className="CommonRequirementType-tip shouxinma">
                            <div className="info">
                                <span className="col_red">短信授信码：易鑫集团发放的分期额度凭证</span><br />
                                在线提交资料，1小时审批，获取短信授信码<br />
                                持码到店，可直接办理分期，选车订车
                            </div>
                        </div>
                    </div>
                    {CommentCountScore}
                    <div className="dl dl-Payment">
                        <div className="MonthlyPayment">
                            {monthlyPayment}/月
                            <span>
                                {item.showRepaymentPeriod ? '('+ item.RepaymentPeriod + '期)' : ''}
                            </span>
                        </div>

                    </div>
                    <div className="dl dl-btn">
                        <div className="BtnBox"><a href="javascript:void(0);" data-company-id={item.CompanyId} data-applyurl={item.OrderApplyUrl} className="btn-org apply-btn {_ShowApplyBtnKlass}">{_ShowApplyBtnText}</a></div>
                        <div className="SeeInof"><a target="_blank" className="col-black" href={detailUrl}>查看详情</a></div>
                    </div>
                    <ul className="Pack-Amount">
                        <li>{MultiLabelRemark}</li>
                        <li>{PackageGiftValueAmount}</li>
                        <li style={{display: yingxiaoLength > 50 ? "none" : ""}}>{OffsetDownPaymentAmount}</li>
                        <li className="top-tag" style={{display: item.IsTop ? "" : "none"}}>置顶</li>
                    </ul>
                </footer>
            </li>
        );
    }
});

var ProductList = React.createClass({
    render: function() {
        var props = this.props;
        return (
            <ul className="list-box">
                {
                    props.data.map(function (product) {
                        return <Product data={product} cityId={props.cityId} citySpell={props.citySpell} carId={props.carId} dealerId={props.dealerId} source={props.source} channel={props.channel} shopcode={props.shopcode} depositPackageType={props.depositPackageType} cheDaiUrl={props.cheDaiUrl} adviserApi={props.adviserApi} />
                    })
                }
            </ul>
        );
    },
    componentDidMount: function() {
        this.props.renderReady();
    },
    componentDidUpdate: function() {
        this.props.renderReady();
    }
});

module.exports =  ProductList;