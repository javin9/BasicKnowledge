require("./index.scss")
require('libs/selectControl');
import check from 'libs/check/m';
import citySelect from 'libs/citySelect';

    var source = source;
    /*APP判断*/
    var isApp = tools.getCookie("YiXinAppInfo");
    if(isApp){
        $(".header-bar").addClass('no-after');
    }else{
        $(".header-bar").removeClass('no-after');
    }


    var index = {
        init: function () {
            var self = this;
           
            self.login();
            self.qualification();
           // self.Deal();
        },
        //登录页面
        login: function () {
            
            var _data = Object();
            //验证姓名：
            function checkName() {
                if (!check.isName($('.name').val())) {
                    $('.rowName').attr('id-data', 'false');
                    $('.rowName .alert').show();
                } else {
                    $('.rowName').attr('id-data', 'true');
                    $('.rowName .alert').hide();
                }
            }
            $('.name').blur(function () {
                checkName();
            })
            $('.Phone').blur(function () {
                Phone();
            })
            $('.btn_code').click(function () {
                Phone();
                if ($('.Phone').val() != '') {
                    ToCode();
                }
                
            })
            //$('.code').tap(function () {
            //    code();
            //})
            //验证手机号
            function Phone() {
                if (!check.isPhoneNumber($('.Phone').val())) {
                    $('.rowPhone').attr('id-data', 'false');
                    $('.rowPhone .alert').show();
                } else {
                    $('.rowPhone').attr('id-data', 'true');
                    $('.rowPhone .alert').hide();
                }
            }
            //获取动态密码
            function ToCode(){
                //var CODE_GETTING_URL = '';
                if (!check.getCode({ seconds: 60, tel_id: 'Phone', gvc_id: 'btnCode', line: 551 }, successFunc)) {
                    //tools.showAlert('获取失败')
                    $('.btn_code').parents('li').attr('id-data', 'false');
                    return false;
                }else{
                    $('.btn_code').parents('li').attr('id-data', 'true');
                }
                function successFunc(res) {
                    console.log('fds')
                }
            }
            //验证动态密码
            function code(){
                //var CODE_GETTING_URL = '';
                var codeInitialize = $('.code').val();
                var codeVal = codeInitialize.replace(/[^\d.]/g, "");
                //var codeVal = CodeNum
                //console.log(codeVal.length, codeVal)
                $('.code').val(codeVal);
                if (codeVal.length < 6) {
                    $('.code').parents('li').find('.alert').hide();
                }
                //if (!check.checkCode({ number: $('.code').val(), tel_id: 'Phone', line: 500 })) {
                //    // tools.showAlert('获取失败')
                //    $('.code').parents('li').find('.alert').show()
                //    $('.code').parents('li').attr('is-data', 'false');
                //    return false;
                //}else{
                //    $('.code').parents('li').attr('is-data', 'true');
                //}
            }
            ///input start
            function AddAntiForgeryToken(data) {
                data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
                return data;
            };
            ////先判断浏览器是不是万恶的IE，没办法，写的东西也有IE使用者
            var bind_name = 'input';
            if (navigator.userAgent.indexOf("MSIE") != -1) {
                bind_name = 'propertychange';
            }
            $('#code').bind(bind_name, function (e) {
                code()
            })
            ///input end
            $('#submitLogin').on('click', function () {
                checkName(); Phone();
                if ($('.code').val() == '' || $('.rowPhone').attr('id-data') != 'true') {
                    $('.code').parents('li').find('.alert').show();
                } 
                if ($('.rowName').attr('id-data') == 'true' && $('.rowPhone').attr('id-data') == 'true') {
                    $.ajax({
                        url: loginUrl,
                        type: 'POST',
                        data: {name:$('.name').val(),mobile:$('.Phone').val(),code:$('.code').val()},
                        beforSend: function () { },
                        success: function (res) {
                            // var res = JSON.parse(res);
                            //console.log(res);
                            if (res.Result == true) {
                                //alert('后台给返回来成功')
                                $('input[name="UserName"]').val($('.name').val());
                                $('#submitLogin').addClass('btn_grey');
                                $('.c2b_from .alert').hide();
                                var Career = res.Data.Career
                                var Insurance = res.Data.Insurance
                                var Income = res.Data.Income
                                var Funds = res.Data.Funds
                                var Credit = res.Data.Credit
                                var HouseState = res.Data.HouseState
                                $('.selCareer .slider li').each(function (i, con) {
                                    if ($(this).attr('data-id') == Career) {
                                        $('.Career .choose').html($(this).text())
                                        $('.Career').attr('data-number', Career);
                                    }
                                })
                                $('.selInsurance .slider li').each(function (i, con) {
                                    if ($(this).attr('data-id') == Insurance) {
                                        $('.Insurance .choose').html($(this).text())
                                        $('.Insurance').attr('data-number', Insurance);
                                        //console.log($(this).text(), $('.Insurance .choose').html(), $('.Insurance').attr('data-number'))
                                    }
                                })
                                $('.selIncome .slider li').each(function (i, con) {
                                    if ($(this).attr('data-id') == Income) {
                                        $('.Income .choose').html($(this).text())
                                        $('.Income').attr('data-number', Income);
                                       // console.log($(this).text(), $('.Income .choose').html(), $('.Income').attr('data-number'))
                                    }
                                })
                                $('.selFunds .slider li').each(function (i, con) {
                                    if ($(this).attr('data-id') == Funds) {
                                        $('.Funds .choose').html($(this).text())
                                        $('.Funds').attr('data-number', Funds);
                                       // console.log($(this).text(), $('.Funds .choose').html(), $('.Funds').attr('data-number'))
                                    }
                                })
                                $('.selCredit .slider li').each(function (i, con) {
                                    if ($(this).attr('data-id') == Credit) {
                                        $('.Credit .choose').html($(this).text())
                                        $('.Credit').attr('data-number', Credit);
                                       // console.log($(this).text(), $('.Credit .choose').html(), $('.Credit').attr('data-number'))
                                    }
                                })
                                $('.selHouseState .slider li').each(function (i, con) {
                                    if ($(this).attr('data-id') == HouseState) {
                                        $('.HouseState .choose').html($(this).text())
                                        $('.HouseState').attr('data-number', HouseState);
                                       // console.log($(this).text(), $('.HouseState .choose').html(), $('.HouseState').attr('data-number'))
                                    }
                                })
                                /////////////////////////////////////////
                                $('.login_box').addClass('hide')
                                $('.qualification_box').removeClass('hide');
                                $('#submitInfo').html('获取额度')
                                $('#submitInfo').removeClass('btn_grey')
                                $('#submitLogin').removeClass('btn_grey');
                            } else if (res.Result == false && res.Data == 1) {
                               // alert('后台给返回来登录过的账号')
                                window.location.href=detailsUrl
                            } else {
                               // alert('后台给返回来的不成功')
                                //tools.showAlert(res.Message)
                                $('.code').parents('li').find('.alert').show()
                            }
                        },
                    })
                }
            })
            //backBtn 返回
            if(!isApp){
                $('#backBtn').on('click', function () {
                    //if ($('.login_box').hasClass('hide')) {
                    //    $('.login_box').removeClass('hide')
                    //    $('.qualification_box').addClass('hide')
                    //} else {
                        window.history.back(); return false;
                   // }
                })
            }
        },
        //资质信息页面
        qualification: function () {
            
            //DecimalTwo begin
            $.fn.DecimalTwo = function () {
                $(this).keyup(function (event) {
                    var $amountInput = $(this);
                    //响应鼠标事件，允许左右方向键移动 
                    event = window.event || event;
                    if (event.keyCode == 37 | event.keyCode == 39) {
                        return;
                    }

                    //先把非数字的都替换掉，除了数字和. 
                    $amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
                        //只允许一个小数点              
                        replace(/^\./g, "").replace(/\.{2,}/g, ".").
                        //只能输入小数点后两位
                        replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
                    if ($amountInput.val().indexOf('.') > -1) {
                        var inputAttar = $amountInput.val().split('.');
                        var fs = inputAttar[0]
                        var ls = inputAttar[1]

                        if (ls.length > 1) {
                            var templs = ls.substring(0, ls.length - 1);
                            $amountInput.val(fs + '.' + templs);
                            return;
                        }
                        //var lastNum = $amountInput.val()[1];

                        //if (lastNum > 2) {
                        //    var m = lastNum.substring(0, lastNum.length - 1);
                        //    var n = fs + '.' + m;
                        //    return;
                        //}
                    } else {
                        if ($amountInput.val().length > 2) {
                            $amountInput.val($amountInput.val().substring(0, $amountInput.val().length - 1));
                            return;
                        }
                    }

                    if ($amountInput.val().length > 4) {
                        $amountInput.val($amountInput.val().substring(0, $amountInput.val().length - 1));
                        return;
                    }
                });
                $(this).blur(function () {
                    var $amountInput = $(this);
                    //最后一位是小数点的话，移除
                    $amountInput.val(($amountInput.val().replace(/\.$/g, "")));

                    if ($amountInput.val() != "" && $amountInput.val() != 'NaN') {
                        $amountInput.val(parseFloat($amountInput.val()));
                    } else {
                        $amountInput.val("");
                    }

                });
            };
            ////////////DecimalTwo end
            //function AddAntiForgeryToken(data) {
            //    data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
            //    return data;
            //};
            ////先判断浏览器是不是万恶的IE，没办法，写的东西也有IE使用者
            //var bind_name = 'input';
            //if (navigator.userAgent.indexOf("MSIE") != -1) {
            //    bind_name = 'propertychange';
            //}
            //$('#txtMile').bind(bind_name, function (e) {
            //    testNmu()
            //})
            $('#txtMile').DecimalTwo(function () {
                if ($('#txtMile').val() > 0 && $('#txtMile').val() != '') {
                    $('.LoanMoney').find('.alert').hide();
                    $('.LoanMoney').attr('data-id', 'true')
                } else {
                    $('#txtMile').val('')
                    $('.LoanMoney').attr('data-id', 'false')
                    $('.LoanMoney').find('.alert').show();
                }
            });
            //下拉框架
            $('.selectBottom').selectControl({
                CallBacks: function (obj) {
                    $(obj.item).parents('li').attr('data-number', obj.id);
                    $(obj.item).parents('li').attr('data-id', 'true');
                    $(obj.item).find('.choose').html(obj.txt);
                    $(obj.item).parents('li').find('.alert').hide();
                    //////////////////////////////////
                    if (obj.txt == '5万以下') {
                        $('#txtMile').val('2.5');
                        $('.LoanMoney').attr('data-id', 'true');
                        $('.LoanMoney').find('.alert').hide();
                    } else if (obj.txt == '5-10万') {
                        $('#txtMile').val('5')
                        $('.LoanMoney').attr('data-id', 'true');
                        $('.LoanMoney').find('.alert').hide();
                    } else if (obj.txt == '10-15万') {
                        $('#txtMile').val('7')
                        $('.LoanMoney').attr('data-id', 'true');
                        $('.LoanMoney').find('.alert').hide();
                    } else if (obj.txt == '15-20万') {
                        $('#txtMile').val('10')
                        $('.LoanMoney').attr('data-id', 'true');
                        $('.LoanMoney').find('.alert').hide();
                    } else if (obj.txt == '20万以上') {
                        $('#txtMile').val('12')
                        $('.LoanMoney').attr('data-id', 'true');
                        $('.LoanMoney').find('.alert').hide();
                    }
                    //var par = $(obj.item).parents('li');
                    //if ($(obj.item).parents('li').hasClass('CarPriceScope')) {
                    //    alert('')
                    //    //var picre = $('.CarPriceScope').attr('data-number')
                    //    console.log(picre, $('.CarPriceScope').attr('data-number'))
                    //    if (obj.id != '') {
                    //        $('#txtMile').val(obj.id)
                    //    }
                    //}
                }
            });
            
            //城市定位
            $('.cityId .choose').html(city.CityName)
            $('.cityId').attr('data-number', city.CityId)
            $('.cityId').attr('data-id', 'true')
            $('input[name="CityId"]').val(city.CityId);//CityId

            $('.cityId .choose_box').on('click', function (e) {
                e.preventDefault();
                var self = this;
                citySelect.citySelect(city, function (result) {
                    $('.cityId .choose').html(result.CityName);
                    $('.cityId').attr('data-id', 'true')
                    $('.cityId').attr('data-number', result.CityId)
                    $('input[name="CityId"]').val(result.CityId);//CityId

                });
            });
            //按钮点击
            $('.btn_show_from').on('click', function () {
                $(this).hide();
                $('.from_qualification_box').show();
            })
            $('.from_qualification_box .btn_show_from').on('click', function () {
                $('.from_qualification_box').hide();
                $('.btn_show_from').show();
            })
            //ajax:
            var gurl = window.location.href;
            if (gurl.indexOf("?") > -1) {
                var arr = '', array = '';
                var href = gurl.split('?');
                var hrefArr = href[1].split('&');
                
                for (var i = 0; i < hrefArr.length; i++) {
                    arr = hrefArr[i].split('=');
                    if (arr[0] == 'From') {
                        $('input[name="From"]').val(arr[1])
                    } else if (arr[0] == 'Source') {
                        $('input[name="Source"]').val(arr[1])
                    } else if (arr[0] == 'Channel') {
                        $('input[name="Channel"]').val(arr[1])
                    } 
                   
                }
               

            }
            var from = from;	//String	来源	
            var Source = source;// Int	外部来源	有就传，没有就不传
            var Channel = '';
            var timerOUT = '';
            $('#submitInfo').on('click', function () {
                if ($('#submitInfo').hasClass('btn_grey')) {
                    tools.showAlert('点击次数太多了');
                } else {
                    if ($('.CarPriceScope').attr('data-id') != 'true') {
                        $('.CarPriceScope').find('.alert').show();
                    } else {
                        $('.CarPriceScope').find('.alert').hide();
                    }
                    if ($('#txtMile').val() > 0 && $('#txtMile').val() != '') {
                        $('.LoanMoney').find('.alert').hide();
                        $('.LoanMoney').attr('data-id', 'true')
                    } else {
                        $('#txtMile').val('')
                        $('.LoanMoney').attr('data-id', 'false')
                        $('.LoanMoney').find('.alert').show();
                    }

                    if ($('.cityId').attr('data-id') == 'true' && $('.CarPriceScope').attr('data-id') == 'true' && $('.LoanMoney').attr('data-id') == 'true') {
                        var CareerNum = '', IncomeNum = '', InsuranceNum = '', FundsNum = '', CreditNum = '', HouseStateNum = '';
                        $('#submitInfo').addClass('btn_grey');
                        //添加数据
                        $('.from_qualification_box .c2b_from li').each(function (i, con) {
                            if ($(this).hasClass('Career')) {
                                if ($(this).attr('data-number') == '') {
                                    CareerNum = ''
                                } else {
                                    CareerNum = parseFloat($('.Career').attr('data-number'))
                                    $('input[name="Career"]').val(CareerNum)
                                }
                            } else if ($(this).hasClass('Insurance')) {
                                if ($(this).attr('data-number') == '') {
                                    InsuranceNum = ''
                                } else {
                                    InsuranceNum = parseFloat($('.Insurance').attr('data-number'))
                                    $('input[name="Insurance"]').val(InsuranceNum)
                                }
                            } else if ($(this).hasClass('Income')) {
                                if ($(this).attr('data-number') == '') {
                                    IncomeNum = ''
                                } else {
                                    IncomeNum = parseFloat($('.Income').attr('data-number'))
                                    $('input[name="Income"]').val(IncomeNum)
                                }
                            } else if ($(this).hasClass('Funds')) {
                                if ($(this).attr('data-number') == '') {
                                    FundsNum = ''
                                } else {
                                    FundsNum = parseFloat($('.Funds').attr('data-number'))
                                    $('input[name="Funds"]').val(FundsNum)
                                }
                            } else if ($(this).hasClass('Credit')) {
                                if ($(this).attr('data-number') == '') {
                                    CreditNum = ''
                                } else {
                                    CreditNum = parseFloat($('.Credit').attr('data-number'))
                                    $('input[name="Credit"]').val(CreditNum)
                                }
                            } else if ($(this).hasClass('HouseState')) {
                                if ($(this).attr('data-number') == '') {
                                    HouseStateNum = ''
                                } else {
                                    HouseStateNum = parseFloat($('.HouseState').attr('data-number'))
                                    $('input[name="HouseState"]').val(HouseStateNum)
                                }
                            }

                        })
                        $('input[name="LoanMoney"]').val($('#txtMile').val() * 10000)
                        $('input[name="CarPriceScope"]').val($('.CarPriceScope').attr('data-number'))
                        // tools.showAlert('提交成功！<br/>正在计算额度...')
                        $('#submitInfo').html('提交成功！正在计算额度...');
                        setTimeout(function () {
                            document.getElementById("DetailsInfoForm").submit();
                        }, 1000)
                        
                    }
                    timerOUT =setTimeout(function () {
                        $('#submitInfo').removeClass('btn_grey');
                        $('#submitInfo').html('获取额度');
                        clearTimeout(timerOUT);
                    }, 2000)
                }
                
            })
            //////////初始化数值
            //alert('fd')
            $('#submitInfo').html('获取额度')
            $('#submitInfo').removeClass('btn_grey')
            
            /////////////
            
        },
        price: function (priceNum) {
            var newNum = '';
            if (priceNum > 1) {
                return newNum = (priceNum).toFixed(2) + '万'
            } else {
                return newNum = (priceNum * 10000).toFixed(0) + '元'
            }
        },
        test: function () {
            function doubleKeypress(val, event) {
                var e = event || window.event;
                var code = e.charCode || e.keyCode;
                //只能输入数字与小数点
                if ((code57) && code != 46) {
                    e.keyCode = 0;
                }
                //只能输入一个小数点
                if ((val.indexOf(".") != -1 && code == 46)) {
                    e.keyCode = 0;
                }
                //小数点后只能有两位数
                if (val.indexOf(".") != -1 && val.substring(val.indexOf("."), val.length).length > 2) {
                    e.keyCode = 0;
                }
            }
        },
    }
 index.init();