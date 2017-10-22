<template>
    <div class="Loan-buy-cars">
        <h6 class="title">贷款购车</h6>
        <ul class="header-box">
            <li>
                <span name="select_sort_text" data="1" class="tit">综合排序</span>
                <i class="tip"></i>
            </li>
            <li>
                <span name="select_sf_text" data={{rate*100}} class="tit">首付{{rate*100}}%</span>
                <i class="tip"></i>
            </li>
            <li>
                <span name="select_qx_text" data={{repriod}} class="tit">还款{{repriod}}期</span>
                <i class="tip"></i>
            </li>
        </ul>
        <div v-show="select_sortIsShow" class="select-sel">
            <ul class="header-box">
                <li>
                    <span name="select_sort_text" data="1" class="tit">综合排序</span>
                    <i class="tip tip-down"></i>
                </li>
                <li>
                    <span name="select_sf_text" data={{rate*100}} class="tit">首付{{rate*100}}%</span>
                    <i class="tip"></i>
                </li>
                <li>
                    <span name="select_qx_text" data={{repriod}} class="tit">还款{{repriod}}期</span>
                    <i class="tip"></i>
                </li>
            </ul>
            <div name="select_sort">
                <div data="1" class="sort-tap">综合排序</div>
                <div data="2" class="sort-tap">月供最低</div>
                <div data="3" class="sort-tap">申请最多</div>
            </div>
        </div>
        <div v-show="select_sfIsShow" class="select-sel">
            <ul class="header-box">
                <li>
                    <span name="select_sort_text" data="1" class="tit">综合排序</span>
                    <i class="tip"></i>
                </li>
                <li>
                    <span name="select_sf_text" data={{rate*100}} class="tit">首付{{rate*100}}%</span>
                    <i class="tip tip-down"></i>
                </li>
                <li>
                    <span name="select_qx_text" data={{repriod}} class="tit">还款{{repriod}}期</span>
                    <i class="tip"></i>
                </li>
            </ul>
            <div name="select_sf">
                <div data="0.1" class="sort-tap">10%</div>
                <div data="0.15" class="sort-tap">15%</div>
                <div data="0.2" class="sort-tap">20%</div>
                <div data="0.3" class="sort-tap">30%</div>
                <div data="0.4" class="sort-tap">40%</div>
                <div data="0.5" class="sort-tap">50%</div>
                <div data="0.6" class="sort-tap">60%</div>
                <div data="0.7" class="sort-tap">70%</div>
            </div>
        </div>
        <div v-show="select_qxIsShow" class="select-sel">
            <ul class="header-box">
                <li>
                    <span name="select_sort_text" data="1" class="tit">综合排序</span>
                    <i class="tip"></i>
                </li>
                <li>
                    <span name="select_sf_text" data={{rate*100}} class="tit">首付{{rate*100}}%</span>
                    <i class="tip"></i>
                </li>
                <li>
                    <span name="select_qx_text" data={{repriod}} class="tit">还款{{repriod}}期</span>
                    <i class="tip tip-down"></i>
                </li>
            </ul>
            <div name="select_qx">
                <div data="12" class="sort-tap">12期</div>
                <div data="18" class="sort-tap">18期</div>
                <div data="24" class="sort-tap">24期</div>
                <div data="36" class="sort-tap">36期</div>
                <div data="48" class="sort-tap">48期</div>
                <div data="60" class="sort-tap">60期</div>
            </div>
        </div>
        <div class="conter-box">
            <ul class="conter-ul">
                <li class="times" v-for="info in package_list">
                    <div class="top">
                        <div class="tit">{{info.PackageName}}
                            <a v-if="info.Tel!=''" href="tel:{{info.Tel}}">顾问</a>
                        </div>
                        <!--<div class="more">{{info.AppNum}}人申请</div>-->
                    </div>
                    <div class="info">
                        <div class="l">
                            <div class="price-box">
                                首付
                                <span class="paydown">{{tomoney(info.DownPaymentText)}}</span>
                                月供
                                <span class="price">{{tomoney(info.MonthPaymentText)}}</span>
                            </div>
                            <div class="tag">{{info.PackageFeatureIcon1}} {{info.PackageFeatureIcon2}}</div>
                        </div>
                        <div class="r">
                            <span class="btn" v-on:click="submit(info)">立即申请</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';
export default {
    props: ['select_sortIsShow', 'select_sfIsShow', 'select_qxIsShow', 'viewPackageInfo', 'applyNow']
    ,
    data() {
        return {
            package_list: [],
            rate: 0,
            repriod: 0,
            order: 1,
        }
    },
    watch: {
    },
    events: {

    },
    created() {
        this.rate = this.viewPackageInfo.downPaymentRate;
        this.repriod = this.viewPackageInfo.repaymentPeriod;
        this.order = this.viewPackageInfo.orderNumber;
    }
    ,
    methods: {
        tomoney(qian) {
            qian = (parseFloat(qian) / 10000);
            return (qian >= 1 ? qian.toFixed(2) + "万" : parseInt(qian * 10000) + '元')
        },
        loadDomEvent() {
            let _this = this;
            function closeAll(info) {
                _this.select_sortIsShow = false;
                _this.select_sfIsShow = false;
                _this.select_qxIsShow = false;

            }

            $('[name="select_sort_text"]').on('click', function () {
                if (_this.select_sortIsShow == true) {
                    $('#maskLayer').hide();
                    closeAll();
                    return;
                }
                closeAll();
                window.scrollTo(0, document.getElementById('daikuan').offsetTop);
                let data = $(this).attr('data');
                $('[name="select_sort"]').find('div').each(function () {
                    if ($(this).attr('data') == data)
                        $(this).addClass('cur')
                    else
                        $(this).removeClass('cur');
                });
                _this.select_sortIsShow = true;
                $('#maskLayer').show();
                $('[name="select_sort"]').find('div').off('click').click(function () {
                    _this.order = $(this).attr('data');
                    _this.getPackageList(_this.rate, _this.repriod, _this.order);
                    setData($('[name="select_sort_text"]'), _this.order, $(this).html())
                    _this.select_sortIsShow = false;
                })
            });
            $('[name="select_sf_text"]').on('click', function () {
                if (_this.select_sfIsShow == true) {
                    $('#maskLayer').hide();
                    closeAll();
                    return;
                }
                closeAll();
                window.scrollTo(0, document.getElementById('daikuan').offsetTop);
                let data = parseInt($(this).attr('data')) / 100;
                $('[name="select_sf"]').find('div').each(function () {
                    if ($(this).attr('data') == data)
                        $(this).addClass('cur')
                    else
                        $(this).removeClass('cur');
                });
                _this.select_sfIsShow = true;
                $('#maskLayer').show();
                $('[name="select_sf"]').find('div').off('click').click(function () {
                    _this.rate = $(this).attr('data');
                    _this.getPackageList(_this.rate, _this.repriod, _this.order);
                    setData($('[name="select_sf_text"]'), _this.rate, $(this).html())
                    _this.select_sfIsShow = false;
                })
            });
            $('[name="select_qx_text"]').on('click', function () {
                if (_this.select_qxIsShow == true) {
                    $('#maskLayer').hide();
                    closeAll();
                    return;
                }
                closeAll();
                window.scrollTo(0, document.getElementById('daikuan').offsetTop);
                let data = $(this).attr('data');
                $('[name="select_qx"]').find('div').each(function () {
                    if ($(this).attr('data') == data)
                        $(this).addClass('cur')
                    else
                        $(this).removeClass('cur');
                });
                _this.select_qxIsShow = true;
                $('#maskLayer').show();
                $('[name="select_qx"]').find('div').off('click').click(function () {
                    _this.repriod = $(this).attr('data');
                    _this.getPackageList(_this.rate, _this.repriod, _this.order);
                    setData($('[name="select_qx_text"]'), _this.repriod, $(this).html())
                    _this.select_qxIsShow = false;
                })
            });
            function setData(dom, data, text) {
                dom.attr('data', data);
                dom.html(text);
                $('#maskLayer').hide();
            }
            $('#maskLayer').on('click', () => {
                closeAll();
            })
        },
        getPackageList(downPaymentRate, repaymentPeriod, orderNumber) {
            const params = {
                carid: car.carId,
                carPrice: ershoucheCar.price,
                cityid: cityInfo.localCityId,
                down: downPaymentRate,
                repriod: repaymentPeriod,
                orderNumber: orderNumber
            }
            Store.GetPackageListWithDownRepriod(params).then((res) => {
                if (res.Result) {
                    let list = res.Data;
                    this.package_list = list;
                } else {
                    this.package_list = [];
                }
            })
        },
        submit(info) {
            this.applyNow();
            $("#orderInfoForm").find('input[name="Orders"]').val(info.ID + "_" + info.ProductId + "_0");
            document.getElementById("orderInfoForm").submit();
        }
    },
    ready() {
        this.loadDomEvent();
        this.getPackageList(this.rate, this.repriod, this.order);

    }
    ,
    components: {

    }
}
</script>
