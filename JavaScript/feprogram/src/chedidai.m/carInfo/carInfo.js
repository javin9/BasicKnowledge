import '../list/list.scss';
import 'zepto/src/touch';
import car from 'libs/carSelect';
import city from 'libs/citySelect';

import DatePicker from 'libs/datePicker';

        var base = {
            validateApply: function (inputObj, tipTxt) {
                if (inputObj.text() == '' || inputObj.text() == tipTxt) {
                    inputObj.text(tipTxt).removeClass('f-gray').addClass('f-red');
                    return false;
                }
                return true;
            },
            checkMile: function (mile) {
                var regex = new RegExp(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/);
                return regex.test(mile);
            },
            tipMsg: { 'dateMsg': '请选择上牌时间', 'cityMsg': '请选择上牌地区', 'mileMsg': '请填写行驶里程', 'mileMsg1': '只限100以内(最多两位小数)' }
        };

        //初始化
        var init = function () {
            //select date
            var datePicker = new DatePicker({
                CallBacks: function (obj) {
                    $('#selDate input').val(obj.year + '年' + obj.month + '月').attr({ 'data-year': obj.year, 'data-month': obj.month });
                    $('#selDate span').eq(1).removeClass('f-red').text($('#selDate input').val());
                }
            });
            datePicker.init({
                trigger: '#selDate',
                type: 'ym',
                minDate: paras.carYear + '-1-1',
                maxDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
            });

            //行驶里程
            $('#mileage input').mouseover(function (e) {
                e.preventDefault();
                $(this).val('').removeClass('f-red');
                $(this).blur();
            });

            //select city
            $('#selCity').on('click', function (e) {
                e.preventDefault();
                localCity.isSaveCookie = false;
                city.citySelect(localCity, function (result) {
                    $('#selCity input').val(result.CityName).attr('data-cityId', result.CityId);
                    $('#selCity span').eq(1).removeClass('f-red').text($('#selCity input').val());
                });
            });

            //submit
            $('#btn_submit').on('click', function (e) {
                e.preventDefault();
                var dateObj = $('#selDate span').eq(1), mileageObj = $('#mileage input'), cityObj = $('#selCity span').eq(1), mileTag = true, dateTag1 = true;
                var dateTag = base.validateApply(dateObj, base.tipMsg.dateMsg);
                var cityTag = base.validateApply(cityObj, base.tipMsg.cityMsg);
                dateTag1 = base.validateApply(dateObj, base.tipMsg.dateMsg1);
                if (mileageObj.val() != '' && mileageObj.val() != base.tipMsg.mileMsg) {
                    if (base.checkMile(mileageObj.val())) {
                        var mile = parseFloat(mileageObj.val());
                        if (mile >= 100) {
                            mileageObj.val(base.tipMsg.mileMsg1).addClass('f-red');
                            mileTag = false;
                        }
                    } else {
                        mileageObj.val(base.tipMsg.mileMsg1).addClass('f-red');
                        mileTag = false;
                    }
                } else {
                    if (mileageObj.val() == '' || mileageObj.val() == base.tipMsg.mileMsg) {
                        mileageObj.val(base.tipMsg.mileMsg).removeClass('f-gray').addClass('f-red');
                        mileTag = false;
                    } else { mileTag = true; }
                }

                if (!mileTag || !dateTag || !cityTag || !dateTag1) {
                    return false;
                } else {
                    location.href = '/' + localCity.CitySpell + '/' + dateObj.next().attr('data-year') + '/' + dateObj.next().attr('data-month') + '/' + mileageObj.val() + '/' + cityObj.next().attr('data-cityId') + '/' + paras.source + '/' + paras.carId;
                }
            });

        }

init();

