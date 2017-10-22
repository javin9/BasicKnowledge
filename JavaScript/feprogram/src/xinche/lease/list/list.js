/**
 * Created by qianyuan on 2017/3/20.
 */
import './list.scss';
import check from 'libs/check';

var Lease = {
    init: function() {
        // 切换城市
        window.selCityCallback = function(obj) {
            $(".sel-city-box .city-con").attr("data-id",obj.cityId).text(obj.cityName);
            var loc = window.location.href.replace(new RegExp(city.CitySpell,"g"), obj.CitySpell);
            window.location.href = loc;
        };

        // 没产品电话
        /* check.telChannel('noProTelChannel', 'listMobile', BusinessLine, {
            'CityId': city.CityId,
            'CityText': city.CityName,
            'PageType': 4,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
            'statisticalMarker': 'pc-xinche-budget-list-btn-tel-channel'
        }); */

        // 分页
        if ($('#listPagination').length) {
            var pageCount = Math.ceil(total / pagesize);
            var pageIndex = 1;
            var carlist = $('#ki-list');
            tools.listPagination('listPagination', pageCount, pageIndex, function (pageindex) {
                carlist.empty();
                $('#list-loading').show();
                $('html, body').animate({
                    scrollTop: $('#sort-wrap').offset().top - 5
                }, 500);
                $.ajax({
                    url: getLeaseInfoUrl,
                    type: 'get',
                    data: {
                        condition: condition,
                        cityId: city.CityId,
                        pageIndex: pageindex,
                        pageSize: pagesize,
                        source: 'undefined' !== typeof Source ? Source : '',
                        channel: 'undefined' !== typeof Channel ? Channel : ''
                    },
                    success: function (result) {
                        carlist.html(result);
                        $('#list-loading').hide();
                    }
                });
            });
        }
    }
};

$(function() {
    Lease.init();
});