import './index.scss'

import check from 'libs/check/index'
import 'libs/selCity/index'
import 'libs/carSelect/selCarThird.pc'

let APP = {
    ...window.PAGE_DATA,
    carId: '',
    carPrice: '',
    carName: '',
    packageId: '',
    mobile: '',
    validateCode: '',
    orders: '',
    businessLine: 550,
    supportCity: true,
    submiting: false,
    getCodeCounter: 0,
    backgroundColor: 'rgba(0,0,0,0)',

    getCodeDisabled() {
        if (!this.mobile || !check.isPhoneNumber(this.mobile) || this.getCodeCounter > 0) {
            $('#getCode').addClass('disabled');
        } else {
            $('#getCode').removeClass('disabled');
        }
    },

    submitDisabled(){
        if (this.submiting ||
                !this.carId ||
                !this.cityId || !this.supportCity ||
                !check.isPhoneNumber(this.mobile) ||
                this.validateCode.length !== 4) {
            $('#submitBtn').addClass('disabled');
        } else {
            $('#submitBtn').removeClass('disabled');
        }
    },

    mainBg() {
        $('#main').css({
            'background-image': `url(${this.background})`
        });
    },

    // 选车型后校验城市是否支持该车型，并取得packageId
    validateCity(){
        $.ajax({
            url: this.interfaceCityAvailable,
            method: 'get',
            data: {
                carId: this.carId,
                cityId: this.cityId
            },
            dataType: 'json',
            success: res => {
                if(res.Result){
                    this.packageId = res.Data.LoanPackageId;
                    this.carPrice = res.Data.CarPrice;
                    this.orders = `${res.Data.LoanPackageId}_${res.Data.ProductId}_0`;
                    $('#selCity').selCity({
                        data: {
                            carId: this.carId,
                            packageId: this.packageId
                        }
                    });
                }

                if (dev) {
                    this.supportCity = true;
                } else {
                    this.supportCity = res.Data.Matchable;
                }

                if (this.supportCity) {
                    $('#selCity').parents('.row').removeClass('error');
                } else {
                    $('#selCity').parents('.row').addClass('error');
                }

                this.submitDisabled();
            }
        })
    },

    validateTel(event) {
        if (!this.mobile || this.mobile && check.isPhoneNumber(this.mobile)) {
            $(event.target).parents('.row').removeClass('error');
            return true;
        } else {
            $(event.target).parents('.row').addClass('error');
            return false;
        }
    },

    validateVcode(event) {
        if (!this.validateCode || this.validateCode.length === 4) {
            $(event.target).parents('.row').removeClass('error');
            return true;
        } else {
            $(event.target).parents('.row').addClass('error');
            return false;
        }
    },

    // 限制输入数字，和长度
    inputNumber(maxlength, event) {
        let keycode = event.keyCode;
        if ($(event.target).val().length < maxlength && (keycode >= 48 && keycode <= 57 || keycode >= 96 && keycode <= 105)
                || keycode === 8  // backspace
                || keycode === 46 // del
                || keycode === 37 // <-
                || keycode === 39 // ->
                || keycode === 229) { // chinese
            $(event.target).parents('.row').removeClass('error');
        } else {
            event.preventDefault();
        }
    },

    checkLength(maxlength, event) {
        if ($(event.target).val().length > maxlength) {
            $(event.target).val($(event.target).val().slice(0, maxlength));
        }
    },

    getCode() {
        check.getAuthcode(60, 'mobile', 'getCode', this.businessLine);
    },

    submit() {
        this.submiting = true;
        this.submitDisabled();
        $('#submitBtn').text('提交中…');

        // 短信验证码验证
        this.checkValidateCode();
    },

    // 短信验证码验证（包含图片验证码）
    checkValidateCode() {
        check.checkCode(this.validateCode, 'mobile', this.businessLine, res => {
            if (res.Result) {
                this.signin();
            } else {
                $('#validateCode').parents('.row').addClass('error');
                this.submiting = false;
                this.submitDisabled();
                $('#submitBtn').text('立即申请');
            }
        });
    },

    // 提交数据
    signin() {
        /* let params = {
            CarId: this.carId,
            CityId: this.cityId,
            Telephone: this.mobile,
            code: this.validateCode,
            Orders: this.orders,
            Source: this.source,
            Channel: this.channel,
            From: this.from,
            line: this.businessLine
        };

        $.ajax({
            url: this.submitAction,
            method: 'post',
            data: params,
            dataType: 'json',
            success: res => {
                this.submiting = false;
                this.submitDisabled();
                $('#submitBtn').text('立即申请');
                if(res.Result){
                    if(dev){
                        console.log('提交表单')
                    }else{
                        window.location.href = res.Data.RedirectUrl
                    }
                }else{
                    tools.showAlert(res.Message)
                }
            }
        }); */

        $('#CarId').val(this.carId);
        $('#CityId').val(this.cityId);
        $('#Telephone').val(this.mobile);
        $('#code').val(this.validateCode);
        $('#Orders').val(this.orders);
        $('#Source').val(this.source);
        $('#Channel').val(this.channel);
        $('#From').val(this.from);
        $('#line').val(this.businessLine);
        $('#submitForm').attr('action', this.submitAction).submit();
    },

    getBackgroundColor() {
        let canvas = document.createElement('canvas');
        if (canvas.getContext) {
            let ctxt = canvas.getContext('2d');
            let img = new Image();
            let data;

            img.onload = () => {
                ctxt.drawImage(img, 0, 0);
                data = ctxt.getImageData(0, 0, 1, 1).data;
                //console.log(data, data.toString());
                this.backgroundColor = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`;
            };

            img.crossOrigin = "Anonymous";
            img.src = this.background;
        }
    },

    bindEvents() {
        if (this.cityId && this.cityName) {
            $('#selCity .select-elem').removeClass('placeholder').find('.text').html('<span>' + this.cityName+ '</span>');
        }

        $("#selCity").selCity({
            loadCityUrl: this.interfaceCity,
            dataType:'json',
            callBacks: (data) => {
                this.cityId = data.cityId;
                this.cityName = data.cityName;
                this.supportCity = true;
                $('#selCity').parents('.row').removeClass('error');
                this.submitDisabled();
                $('#selCity .select-elem').removeClass('placeholder').find('.text').html('<span>' + this.cityName + '</span>');
            }
        }).on('click', () => {
            $('#CarSelCon').hide();
        });

        $('#selCar').selCar2({
            OnlyOnSale: true,
            IsOutput: false,
            BrandUrl: this.interfaceBrand,
            SerailUrl: this.interfaceSeries,
            CarUrl: this.interfaceCar,
            Callback: (data) => {
                this.carId = data.data('id');
                this.carName = data.data('fullname').trim();
                this.validateCity();
                $('#selCar .select-elem').removeClass('placeholder').find('.text').html('<span>' + this.carName + '</span>');
            }
        }).on('click', () => {
            $('.sel-city-menu').hide();
        });

        $('#mobile').bind({
            'keydown': $event => {
                this.inputNumber(11, $event);
                this.checkLength(11, $event);
                setTimeout(() => {
                    this.mobile = $($event.target).val();
                    this.getCodeDisabled();
                    this.submitDisabled();
                })
            },
            'keyup': $event => {
                this.checkLength(11, $event);
                setTimeout(() => {
                    this.mobile = $($event.target).val();
                    this.getCodeDisabled();
                    this.submitDisabled();
                })
            },
            'input propertychange': $event => {
                this.mobile = $($event.target).val();
                this.getCodeDisabled();
                this.submitDisabled();
            },
            'blur': $event => {
                this.validateTel($event);
            }
        });

        $('#validateCode').bind({
            'keydown': $event => {
                this.inputNumber(4, $event);
                this.checkLength(4, $event);
                setTimeout(()=> {
                    this.validateCode = $($event.target).val();
                    this.submitDisabled();
                })
            },
            'keyup': $event => {
                this.checkLength(4, $event);
                setTimeout(()=> {
                    this.validateCode = $($event.target).val();
                    this.submitDisabled();
                })
            },
            'input propertychange': $event => {
                this.validateCode = $($event.target).val();
                this.submitDisabled();
            },
            'blur': $event => {
                this.validateCode = $($event.target).val();
                this.submitDisabled();
                this.validateVcode($event);
            }
        });

        $('#getCode').bind({
            'click': event => {
                if (!$(event.target).hasClass('disabled')) {
                    this.getCode();
                    $('#validateCode').focus();
                }
            }
        });

        $('#submitBtn').bind({
            'click': event => {
                if (!$(event.target).hasClass('disabled')) {
                    this.submit();
                }
            }
        });
    },

    iePlaceholder() {
        if ('placeholder' in document.createElement('input')) { return false; }

        let inputs = $('input[placeholder]');
        inputs.each(function() {
            let input = $(this);
            let text = $('<i>').addClass('placeholder-text').text(input.attr('placeholder'));
            text.click(function() {
                input.focus();
            });
            input.before(text);
        });
        inputs.bind({
            'keydown': function(e) {
                let input = $(this);
                setTimeout(function() {
                    if (input.val().trim()) {
                        input.prev('i').hide();
                    } else {
                        input.prev('i').show();
                    }
                });
            }
        });
    },

    init() {
        this.mainBg();
        this.bindEvents();
        // ie8
        this.iePlaceholder();

        if (typeof window.errMsg !== 'undefined' && window.errMsg) {
            tools.showAlert(window.errMsg, 10000);
        }
    }
};


APP.init();