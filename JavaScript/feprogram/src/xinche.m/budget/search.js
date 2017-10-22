require('./budget.scss');
import Vue from 'vue';
import CarSelector from 'libs/vue-components/car-selector'

tools.appDown(true);
//隐藏所有超链接
$(".choice a").attr("href","javascript:void(0);");

// 按预算选车api
var BudgetAPI = {
    data: {
        carPrice: -1,
        downPayment: -1,
        monthlyPayment: -1,
        repaymentPeriod: -1,
        carMasterBrandId: -1,
        carSerialLevel: -1,
        cityId: -1,
        pageIndex: 1,
        pageSize: 10
    },
    getProductUrl: getBudgetInfoUrl,
    getProductCountUrl: getBudgetInfoCountUrl,
    upadteData: function(data) {
        this.data = $.extend(this.data, data);
        return this;
    },
    getProducts: function(callback) {
        var self = this;
        $.ajax({
            type: 'GET',
            url: self.getProductUrl,
            data: self.data,
            success: function (result) {
                var obj = {
                    html: result,
                    total: parseInt($(result).eq(0).attr('data-Total')) || 0
                }
                callback(obj);
            }
        });
        return this;
    },
    getProductsCount: function(callback) {
        var self = this,
            condition='';
        for (var i in self.data) {
            if (self.data[i] != -1 && i != 'cityId' && i != 'pageIndex' && i != 'pageSize') {
                if(i=='carMasterBrandId'){
                    condition += 'b'+ self.data[i];
                }else {
                    condition += self.data[i];
                }
            }
        }
        $.ajax({
            type: 'GET',
            url: self.getProductCountUrl,
            data: {
                condition:condition,
                source:Source,
                channel:Channel,
                cityId:self.data.cityId
            },
            success: function (result) {
                if (result.Result) {
                    callback(result.RowCount);
                }
            }
        });
        return this;
    },
    getUrl: function() {
        var url = BudgetUrl || '/home/budget/';
        var data = this.data,
            params = [],
            condition='';
        for (var i in data) {
            if (data[i] != -1 && i != 'cityId' && i != 'pageIndex' && i != 'pageSize') {
                if(i=='carMasterBrandId'){
                    condition += 'b'+ data[i];
                }else{
                    condition += data[i];
                }

            }
        }

        if (Source) {
            params.push('source=' + Source);
        }
        if (Channel) {
            params.push('channel=' + Channel);
        }
        if (params.length) {
            if($.trim(condition)){
                url += condition +'/?' + params.join('&') +'&cityId='+this.data.cityId;
            }else{
                url += '?' + params.join('&') +'&cityId='+this.data.cityId;
            }

        }
        return url;
    }
};

var BudgetSearch = {
    data: {},   // 缓存数据
    dom: {},   // 缓存dom
    init: function() {
        var self = this;
        var carSelectName = $('#car-select .select .text');
        var resetBtn = $('#reset-btn');
        var viewBtn = $('#view-btn');
        var originalData = {};

        $.extend(true, originalData, BudgetAPI.data);
        self.dom.viewBtn = viewBtn;

        if (city && city.cityId) {
            BudgetAPI.data.cityId = city.cityId;
        }

        // 推荐品牌
        $.ajax({
            url: APIURL + 'api/carrecommend/GetRecommendCarMasterBrands?callback=?',
            data: {
                onlyOnSale: true,
                type: 'xinche'
            },
            dataType: 'jsonp',
            success: function (data) {
                self.data.hotBrand = [];
                if (data.Result) {
                    // console.log(data);
                    var htmlstr = '',
                        i, max;
                    for (i = 0, max = data.Data.length; i < max && i < 8; i++) {
                        htmlstr +=  '<span data="' + data.Data[i].CarMasterBrandID + '" data-name="brand" class="choice">' +
                            '<span class="logo"><img src="' + data.Data[i].Logo + '" alt="" /></span>' +
                            '<span class="name">' + data.Data[i].CarMasterBrandName + '</span>' +
                            '</span>';
                        self.data.hotBrand.push(data.Data[i].CarMasterBrandID);
                    }
                    $('#brand').html(htmlstr);
                } else {
                    // console.log("请求失败");
                }
            },
            complete: function () {
                //console.log("完成！");
            }
        });

        // 选车控件
        $('#car-select').bind('click', function() {
            vm.$broadcast('showCarSelector')
        });

        // 选项
        $('.search-list').on('click', '.choice', function() {
            // 点击已选择选项：热门车型选中状态取消，其他直接返回
            if ($(this).hasClass('active')) {
                if ($(this).attr('data-name') === 'brand') {
                    $(this).removeClass('active');
                    carSelectName.text('请选择').removeClass('sel');
                    BudgetAPI.data.carMasterBrandId = -1;
                    self.updateLink();
                }
                return false;
            }

            // 新选择
            $(this).addClass('active').siblings('.active').removeClass('active');
            if ($(this).attr('data-name') === 'brand') {
                carSelectName.text($(this).find('.name').text()).addClass('sel');
            }

            var data={},
                itemData = $(this).attr('data');

            if (itemData) {
                var _id= $(this).parent('dd').attr('id');
                data[_id] = itemData;
                BudgetAPI.upadteData(data);
            }
            // console.log(BudgetAPI.data);
            self.updateLink();
        });

        // 重置
        resetBtn.bind('click', function(e) {
            e.preventDefault();
            $('.search-list dd').each(function() {
                if ($(this).is('#brand')) {
                    $(this).find('.choice').removeClass('active');
                } else {
                    $(this).find('.choice').removeClass('active').eq(0).addClass('active');
                }
            });
            carSelectName.text('请选择').removeClass('sel');
            $.extend(true, BudgetAPI.data, originalData);
            self.updateLink();
        });
        resetBtn.bind('click', function(e) {
            e.preventDefault();
        });

        // 跳转
        viewBtn.bind('click', function(e) {
            e.preventDefault();
            location.href = BudgetAPI.getUrl();
        });
    },

    updateLink: function() {
        var self = this;
        // todo 获取车型数量，并更新链接
        var viewBtn = self.dom.viewBtn;

        BudgetAPI.getProductsCount(function(result) {
            viewBtn.find('#count').html(result);
        });
    }
}

$(function() {
    if (typeof city !== undefined && (city.cityId || city.CityId)) {
        BudgetAPI.upadteData({cityId: city.cityId || city.CityId});
    }
    BudgetSearch.init();
    BudgetSearch.updateLink();
});

var vm = new Vue({
    el: 'body',
    data: {
    },

    methods:{
        selectCarCallback(data){
            const brandId = data.brand.id
            const brandName = data.brand.name
            const carSelectName = $('#car-select .select .text')
            const hotBrandOpts = $('#brand .choice')
            if(brandId === 0){
                BudgetAPI.data.carMasterBrandId = -1;
                carSelectName.text('全部品牌').addClass('sel')
            }else{
                BudgetAPI.data.carMasterBrandId = brandId
                carSelectName.text(brandName).addClass('sel')
            }
            hotBrandOpts.removeClass('active');
            if (brandId && BudgetSearch.data.hotBrand.indexOf(brandId) > -1) {
                hotBrandOpts.eq(BudgetSearch.data.hotBrand.indexOf(brandId)).addClass('active');
            }
            $('#carSelectComponent').removeClass('drawAni').addClass('hideAni');

            BudgetSearch.updateLink();
        }
    },

    components: {
        CarSelector
    }
});