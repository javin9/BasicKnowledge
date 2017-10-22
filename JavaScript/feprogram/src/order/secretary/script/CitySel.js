var CitySel = function (opts) {
    this.options = {
        ProvinceUlId: '',
        CityUlId: ''
    };
    this.options = $.extend(this.options, opts);

    this.ProvinceObj = $('#' + this.options.ProvinceUlId + '');
    this.CityObj = $('#' + this.options.CityUlId + '');

    this.provinceUrl = "http://bjapi.chedai.bitauto.com/Region/GetProvinces";
    this.cityUrl = "http://bjapi.chedai.bitauto.com/Region/GetCities";

};

CitySel.prototype.getAjax = function (_url, _data, _callback) {
    var $this = this;
    $.ajax({
        url: _url,
        type: 'GET',
        data: _data,
        cache: true,
        dataType: 'jsonp',
        success: function (data) {
            _callback(data);
        }
    })
};

CitySel.prototype.GetProvinces = function () {
    var $this = this;

    var ProvinceArr = function (data) {
        var _chongqing = data.pop();
        data.splice(2, 0, _chongqing);
        $.each(data, function (i, item) {
            MortgageView.ProvincesArray.push(item);
        });

        $this.ProvinceObj.on('click', function (e) {
            e = e || window.event;
            if ($(e.target).is('li')) {
                $this.CityObj.siblings('a').text('请选择');
                $this.GetCities($(e.target).attr('data-id'));
            }
        });
    };

    $this.getAjax($this.provinceUrl, {}, ProvinceArr);
};

CitySel.prototype.GetCities = function (_provinceId) {
    var $this = this;

    var _data = { "provinceid": _provinceId };

    var CityArr = function (data) {
        MortgageView.CitiesArray([]);
        $.each(data, function (i, item) {
            MortgageView.CitiesArray.push(item);
        });
    };

    $this.getAjax($this.cityUrl, _data, CityArr);
};