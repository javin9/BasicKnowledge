/**
 * Created by liuhaiwei on 2017/3/23.
 */
import '../css/ershouche.scss'
import './list.scss'
import 'libs/swiper';
//声明变量
import app from '../script/app';
import Store from '../script/Store';
import loginStore from '../script/LoginStore'
import IScroll from 'iscroll';
import citych from 'libs/citySelect';
import carch from 'libs/carSelect/ershouche/index.js';
import carsearch from 'libs/carSelect/carSearch';
import carSecondLevel from 'libs/carSelect/ershouche/carSecondLevel';
import VueResource from 'vue-resource'
import CitySelect from 'libs/vue-components/city-select'
Vue.use(VueResource)

$(document).ready(function() {
    viewModel.init();
    if (totalCount == 0) {
        viewModel.getOtherList();
    }
});
Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
var ordernum = '0';
var viewModel = {};
var bl = true;
var isajax = true;
//本页面?后面的数据
let hrefquestion = '';
if (document.location.href.indexOf('?') != -1) {
    hrefquestion = '/?' + document.location.href.split('?')[1]
}
viewModel.loadCityTips = function() {
    var cityTipsCookie = tools.getCookie("cityTips")
    if (cityTipsCookie && cityTipsCookie == 1) {
        $('.tips_text').addClass('hide');
        //已经提示过
    } else {
        $('.tips_text').removeClass('hide');
        setTimeout(() => {
            $('.tips_text').addClass('hide');
        }, 3000)
        if (document.domain.search(".daikuan.com") != -1)
            tools.setCookie("cityTips", 1, "", ".daikuan.com");
        else
            tools.setCookie("cityTips", 1, "", document.domain);
    }
};
viewModel.init = function() {
    viewModel.loadCityTips();
    if (totalCount < 20) {
        $('#pullup').html('已经没有更多数据了');
    }
    if (totalCount == 0) {
        var che = '<div class="card_default font-ctn"><div class="sorry">当前城市没有更多好车了<br>请尝试减少条件或重置试试~</div><div class="qsreset" id="allreset"><a href="javascript:void(0);">重置全部</a></div></div>'
        $(".search-list ul").html(che);
        $('#allreset').click(() => { location.href = ershoucheUrl + cityInfo.spell + '/list' + hrefquestion })
    }


    $("#npage").val(1);
    if ($("#swiperTopBanner .swiper-slide").length > 1) {
        var mySwiper = new Swiper('#swiperTopBanner', {
            autoplay: 5000, //可选选项，自动滑动
            loop: true,
            pagination: '#swiperTopBanner .swiper-pagination',
            //new add
            autoplayDisableOnInteraction: false,
            observer: true,
            observeParents: true,
            onSlideChangeEnd: function(swiper) {
                swiper.update();
            },
            onInit: function(swiper) {
                if (swiper.slides.length - 2 < 2) {
                    swiper.stopAutoplay();
                    $('#swiperTopBanner .swiper-pagination').hide();
                } else {
                    $('#swiperTopBanner .swiper-pagination').show();
                }
            }
        })
        $('#swiperTopBanner .swiper-pagination').removeClass('hide')
    }
    var $morewrapper = $('#morewrapper');
    $morewrapper.width($(window).width());
    var dpr = $('html').attr('data-dpr');
    var height_dpr = 82;
    if (dpr == '1') {
        height_dpr = 82 * 1;
        if (!$('#swiperTopBanner').length > 0) {
            height_dpr = height_dpr - 100;
        }
    }
    if (dpr == '2') {
        height_dpr = 82 * 2;
        if (!$('#swiperTopBanner').length > 0) {
            height_dpr = height_dpr - 210;
        }
    }
    if (dpr == '3') {
        height_dpr = 82 * 3;
        if (!$('#swiperTopBanner').length > 0) {
            height_dpr = height_dpr - 330;
        } else {
            height_dpr = height_dpr + 45;
        }
    }
    //选择城市
    $('#selectCity').on('click', function(e) {
        e.preventDefault();
        listVue.$broadcast('showCitySelect');
    });
    //搜索
    $('#erssearch').on('click', function(e) {
        carsearch.search({ hide: true, type: "ershouche" }, function(result) {
            if (chooserUrl == '/') {
                chooserUrl = '';
            }
            if (result.hotCar) {
                setImmediate(function() {
                    location.href = '/' + cityInfo.spell + '/s' + result.hotCar.CarSerialID + chooserUrl + hrefquestion;
                });

            } else if (result.searchCar) {
                setImmediate(function() {
                    location.href = '/' + cityInfo.spell + '/s' + result.searchCar.id + chooserUrl + hrefquestion;
                });
            } else {
                setImmediate(function() {
                    location.href = '/' + cityInfo.spell + '/s' + result.brand.id + chooserUrl + hrefquestion;
                });

            }

        });
    })
};
//获取分页数据
viewModel.getList = function(p) {
        var params = {
            brandId: BrandId,
            serialId: SerialId,
            chooserStr: chooserUrl + 'p' + p,
            citySpell: cityInfo.spell,
            source: source,
        }
        Store.getCarList(params).then((res) => {
            $('.search-list ul').append(res);
            $("#npage").val(Number(p));
            isajax = true;
            Echo.init({
                offset: 100,
                throttle: 0
            });
        })
    }
    //当列表数据获取为空的时候，获取推荐数据
viewModel.getOtherList = function() {
    $('.l_bottom').hide();
}
let stpt = $('#sortpage').offset().top, //筛选距离上面有多高
    $sortpage = $('#sortpage')
$(window).on("scroll", function(e) {
        var st = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if (totalCount > 0) {
            var pg = Number($("#npage").val());
            var st = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            var kr = $(".search-list").offset().top;
            var t = $(".l_bottom").height();
            var j = $(".search-list ul").eq(0).height();
            var ccc = j;
            var ll = ccc + kr;
            var ppg = Math.ceil(totalCount / 20);
            var abc = $(window).height();
            var efg = ll - abc - st;
            var u = navigator.userAgent;
            var nheight;
            if (u.indexOf('Android') || u.indexOf('UCBrowser') > -1 || u.indexOf('MQQBrowser') > -1 || u.indexOf('MicroMessenger') > -1 || u.indexOf('UCWEB7.') > -1 || u.indexOf('rv:1.2.3.4') > -1) {
                nheight = 27;
            } else {
                nheight = 55;
            }
            if (j > 0 && -efg > nheight) {
                if (pg <= ppg) {
                    if (isajax == true) {
                        isajax = false;
                        var paget = Number($("#npage").val()) + 1;
                        viewModel.getList(paget);
                    }
                } else
                    $('#pullup').html('已经没有更多数据了');
            }
        }

        if ($('#carSelectComponent').length !== 0) {
            $('#carSelectComponent').css({ "top": "0", });
        }
        if (st > stpt) {
            $sortpage.addClass('fixed');
        } else {
            if (listVue.sorthih !== '' || listVue.sorthih === 0) {
                return false
            } else {
                $sortpage.removeClass('fixed');
            }
        }
        $('.sort').css({ 'box-shadow': '0' })
        $('#moreShow .header-bar').css({ 'box-shadow': '0' })
        setTimeout(function() {
            $('.sort').css({ 'box-shadow': '0' })
            $('#moreShow .header-bar').css({ 'box-shadow': '0' })
        }, 100)
    })
    /*************************************************************************************************************************************/
import Vue from 'vue';
import selcettemplate from '../components/selcettemplate.vue';
import Supplement from './supplement.vue';
let $mask = $('.leftmask'), //
    $body = $('body'), //
    $app = $('#app'), //
    $sort = $('#sortpage'),
    $tabul = $('.tabul'), //
    $comprehensive = $('.sort_comprehensive'), //综合排序
    $carprice = $('.sort_carprice'), //车价
    $brand = $('.aaaaa'), //品牌
    $level = $('.sort_level'), //级别
    $selleft = $('.sel_Left'), //筛选
    stest = '';
let listVue = new Vue({
    el: '#yxWrapper',
    ready() {
        let _self = this
            //判断城市用城市id 还是省份id cityInfo.id level=0全国cid=pid=0  level=1省份pid level=2城市cid
        switch (cityInfo.level) {
            case '0':
                _self.ajaxdata.cid = 0
                _self.ajaxdata.pid = 0
                break
            case '1':
                _self.ajaxdata.cid = 0
                _self.ajaxdata.pid = cityInfo.id
                break
            case '2':
                _self.ajaxdata.cid = cityInfo.id
                _self.ajaxdata.pid = 0
                break
            default:
                break;
        }

        this.breakupurl(chooserUrl);
        this.clickFun();
        this.custom();
        this.seldata();
    },
    data() {
        return {
            isShowMask: false, //蒙层级
            sorthih: '',
            loactionurl: '',
            brandname: '不限',
            url: {
                downpay: '', //首付 d--自定义v5-r10
                brand: '', //品牌s/m
                carprice: '', //车价c--自定义a1-z100
                year: '', //车龄y--自定义 j1n3
                lmili: '', //里程g--自定义 x1w3
                level: '', //等级l--多选
                atatus: '', //车辆来源l--多选
                transmission: '', // 变速箱e
                displacement: '', // 排量f--多选
                emissionstandards: '', //排放标准i
                sortnew: '', //排序o
            },
            ajaxdata: {
                cid: '', //cid=le=2//
                pid: '', //pid=le=1
                downpay: '', //首付 3|4
                Mbid: '', //品牌 9
                Brandid: '', //字品牌2573 Brandid
                carPrice: '', //车价20|30
                Year: '', //车龄-8|-5 --自定义
                Lmili: '', //里程50000|80000 --自定义
                Carlevelid: '', //等级1467 --多选
                Status: '', //车辆来源12--多选
                GearBoxType: '', //变速箱2
                Exhaust: '', // 排量1245--多选
                EnvirStandard: '', //排放标准9

            },
            txt: {
                atatus: bastCarName || '不限', //车辆来源l--多选
                transmission: gearBoxTypeName || '不限', // 变速箱e
                displacement: exhaustName || '不限', // 排量f--多选
                emissionstandards: envirStandardName || '不限', //排放标准i
            },
            sorthrefarr:[],//智能排序-连接数据
            levelhrefarr:[],//级别 -连接数据
        }
    },
    components: {
        'selcettemplate': selcettemplate,
        CitySelect,
        Supplement
    },
    methods: {
        selectedHanlder(obj) {
            if (chooserUrl == '/') {
                chooserUrl = '';
            }
            if (BrandId == '0' && SerialId == '0' && chooserUrl == '')
                location.href = '/' + obj.spell + '/list' + hrefquestion
            else if (BrandId == '0' && SerialId == '0')
                location.href = '/' + obj.spell + chooserUrl + hrefquestion;
            else if (SerialId == '0')
                location.href = '/' + obj.spell + '/m' + BrandId + chooserUrl + hrefquestion;
            else
                location.href = '/' + obj.spell + '/s' + SerialId + chooserUrl + hrefquestion;

        },
        //正则获取所有数字
        getNum(text) {
            if (text) {
                var value = text.replace(/[^0-9]/ig, "");
                return value
            }
            return
        },
        //正则获取数组
        getArr(str) {
            /*var str = 'a123b3cde333';*/
            var reg = /[a-z]{1}[0-9]*/g;
            var arr = [],
                prase = reg.exec(str);
            while (prase) {
                arr.push(prase[0]);
                prase = reg.exec(str);
            }
            return arr
        },
        //把字符串分割成数组
        checkboxGetArr(srting) {
            let _self = this;
            if (srting != '') {
                let s = _self.getNum(srting).split('')
                return s
            }
        },
        //拆分(Break up)chooser的URL把多选和单选拆分出来/*  bb=aa.replace(/\//g, '') */
        breakupurl(url) {
            let _self = this
            let arr = _self.getArr(url)
                //console.log('breakupurl.chooserUrl',url,'--arr',arr)
            for (var i = 0; i < arr.length; i++) { //["l147", "k13", "f124", "d4", "c4", "y4", "g4", "e1", "i4", "o3"]
                if (arr[i].indexOf('d') != -1 || arr[i].indexOf('v') != -1 || arr[i].indexOf('r') != -1) {
                    if (CustomDown == '') {
                        $('.downpay dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (url2 == ('d' + selectDown)) {
                                _self.ajaxdata.downpay = id2
                                _self.url.downpay = url2
                            }
                        })
                    } else {
                        if (_self.url.downpay.indexOf(arr[i]) != -1) {
                            _self.url.downpay = _self.url.downpay.replace('arr[i]', arr[i])
                        } else {
                            _self.url.downpay = _self.url.downpay + arr[i]
                        }
                        _self.ajaxdata.downpay = CustomDown
                    }
                } else if (arr[i].indexOf('brand') != -1) {
                    /*v-bind:url="url.brand" v-bind:data="ajaxdata.Mbid!=''?ajaxdata.Mbid:ajaxdata.Brandid"*/

                } else if (arr[i].indexOf('c') != -1 || arr[i].indexOf('a') != -1 || arr[i].indexOf('z') != -1) {

                    if (CustomPrice == '') {
                        $('.carprice dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (url2 === ('c' + selectCarPrice)) {
                                _self.ajaxdata.carPrice = id2
                                _self.url.carprice = url2
                            }
                        })
                    } else {
                        if (_self.url.carprice.indexOf(arr[i]) != -1) {
                            _self.url.carprice = _self.url.carprice.replace('arr[i]', arr[i])
                        } else {
                            _self.url.carprice = _self.url.carprice + arr[i]
                        }
                        _self.ajaxdata.carPrice = CustomPrice

                    }
                    /*_self.ajaxdata.carPrice = selectCarPrice==''? CustomPrice : selectCarPrice*/
                } else if (arr[i].indexOf('y') != -1 || arr[i].indexOf('j') != -1 || arr[i].indexOf('n') != -1) {
                    if (CustomYear == '') {
                        $('.year dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (url2 == ('y' + selectYear)) {
                                _self.ajaxdata.Year = id2
                                _self.url.year = url2
                            }
                        })
                    } else {
                        if (_self.url.year.indexOf(arr[i]) != -1) {
                            _self.url.year = _self.url.year.replace('arr[i]', arr[i])
                        } else {
                            _self.url.year = _self.url.year + arr[i]
                        }
                        let arryear = CustomYear.split('|')
                        _self.ajaxdata.Year = '-' + arryear[1] + '|-' + arryear[0]
                            //console.log(arryear,_self.ajaxdata.Year);
                    }
                    /*_self.ajaxdata.Year = selectYear==''? CustomYear : selectYear*/
                } else if (arr[i].indexOf('g') != -1 || arr[i].indexOf('x') != -1 || arr[i].indexOf('w') != -1) {
                    if (CustomLicheng == '') {
                        $('.lmili dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (url2 == ('g' + selectLicheng)) {
                                _self.ajaxdata.Lmili = id2
                                _self.url.lmili = url2
                            }
                        })
                    } else {
                        if (_self.url.lmili.indexOf(arr[i]) != -1) {
                            _self.url.lmili = _self.url.lmili.replace('arr[i]', arr[i])
                        } else {
                            _self.url.lmili = _self.url.lmili + arr[i]
                        }
                        _self.ajaxdata.Lmili = CustomLicheng.replace('|', '0000|') + '0000'
                            //console.log('_self.ajaxdata.Lmili',_self.ajaxdata.Lmili)
                    }
                    /*_self.ajaxdata.Lmili = selectLicheng==''? CustomLicheng : selectLicheng*/
                } else if (arr[i].indexOf('l') != -1) {
                    _self.url.level = arr[i]
                    _self.ajaxdata.Carlevelid = _self.getNum(arr[i]) /*数据和连接一样,所以用同一样数据*/
                        /*$('.level dd').each(function (i,val) {
                            let _this=$(this),url2=_this.find('a').attr('data-url'),id2=_this.find('a').attr('data-id')
                            if (selectLevel.indexOf(url2)!=-1){
                                _self.ajaxdata.Carlevelid =_self.ajaxdata.Carlevelid+id2
                            }
                        })*/

                } else if (arr[i].indexOf('k') != -1) {
                    _self.url.atatus = arr[i]
                    $('.atatus dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (selectIsBastCar.indexOf(url2) != -1) {
                                _self.ajaxdata.Status = _self.ajaxdata.Status + id2
                            }
                        })
                        /*_self.ajaxdata.Status = selectIsBastCar*/
                } else if (arr[i].indexOf('e') != -1) {
                    _self.url.transmission = arr[i]
                    $('.transmission dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (url2 == ('e' + selectGearBoxType)) {
                                _self.ajaxdata.GearBoxType = id2
                            }
                        })
                        /*_self.ajaxdata.GearBoxType =selectGearBoxType*/
                } else if (arr[i].indexOf('f') != -1) {
                    _self.url.displacement = arr[i]
                    $('.displacement dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (selectExhaust.indexOf(url2) != -1) {
                                _self.ajaxdata.Exhaust = _self.ajaxdata.Exhaust + id2
                            }
                        })
                        /*_self.ajaxdata.Exhaust =selectExhaust*/
                } else if (arr[i].indexOf('i') != -1) {
                    _self.url.emissionstandards = arr[i]
                    $('.emissionstandards dd').each(function(i, val) {
                            let _this = $(this),
                                url2 = _this.find('a').attr('data-url'),
                                id2 = _this.find('a').attr('data-id')
                            if (url2 == ('i' + selectEnvirStandard)) {
                                _self.ajaxdata.EnvirStandard = id2
                            }
                        })
                        /*_self.ajaxdata.EnvirStandard =selectEnvirStandard*/
                } else if (arr[i].indexOf('o') != -1) {
                    _self.url.sortnew = arr[i]
                }
            }
        },
        //填充数据展示 select
        seldata() {
            let _self = this
            $('.ul_box .item').each(function(i, con) {
                let _this = $(this),
                    data = _this.attr('url'),
                    id = _this.attr('data')
                if (((data.indexOf('d') != -1 || data.indexOf('v') != -1 || data.indexOf('r') != -1) ||
                        (data.indexOf('c') != -1 || data.indexOf('a') != -1 || data.indexOf('z') != -1) ||
                        (data.indexOf('y') != -1 || data.indexOf('m') != -1 || data.indexOf('n') != -1) ||
                        (data.indexOf('g') != -1 || data.indexOf('x') != -1 || data.indexOf('w') != -1) ||
                        data.indexOf('e') != -1 || data.indexOf('i') != -1) &&
                    (data.length >= 2)) {
                    if (data.length == 2) {
                        _this.find('dd').removeClass('cur')
                        _this.find('input').val('')
                        _this.find('dd').each(function(di, dcon) {
                            if ($(this).find('a').attr('data-url') == data) {
                                $(this).addClass('cur')
                            }
                        })
                    } else if (data.length > 2) {
                        _this.find('dd').removeClass('cur')
                        if (data.indexOf('a') != -1 || data.indexOf('z') != -1) {
                            $('.sort_carprice').find('dd').removeClass('cur')
                        }
                        let min = id.split('|')[0]
                        let max = id.split('|')[1]
                        if (_this.hasClass('year')) {
                            let minyear = min.replace('-', ''),
                                maxyear = max.replace('-', '')
                            min = maxyear
                            max = minyear
                        }
                        if (_this.hasClass('lmili')) {
                            min = min.replace('0000', '')
                            max = max.replace('0000', '')
                        }
                        _this.find('input[name="min"]').val(min)
                        _this.find('input[name="max"]').val(max)
                        _this.find('.custom').addClass('ready')
                        if ((data.indexOf('a') != -1 && data.indexOf('z') != -1)) {
                            $carprice.find('input[name="min"]').val(min)
                            $carprice.find('input[name="max"]').val(max)
                            $carprice.find('.custom').addClass('ready')
                        }
                    }
                } else if (data.indexOf('l') != -1 || data.indexOf('k') != -1 || data.indexOf('f') != -1) {
                    let arr = _self.checkboxGetArr(data)
                    _this.find('dd').removeClass('cur')
                    arr.forEach(function(arrcon, index, socon) {
                        _this.find('dd').each(function(di, dcon) {
                            if ($(this).find('a').attr('data-url') == arrcon) {
                                $(this).addClass('cur')
                            }
                        })
                    })
                    if (data.indexOf('l') != -1) {
                        $('.sort_level').find('dd').removeClass('cur')
                        arr.forEach(function(arrcon, index, socon) {
                            //console.log(arrcon)
                            $level.find('dd').each(function(di, dcon) {
                                if ($(this).find('a').attr('data-url') == arrcon) {
                                    $(this).addClass('cur')
                                }
                            })
                        })
                    }
                }
            })
            if (serialName) {
                _self.url.brand = 's' + SerialId
                _self.ajaxdata.Brandid = SerialId
                _self.brandname = brandName + ' ' + serialName
                    /*console.log('ddddd',_self.url.brand)*/
            } else if (brandName) {
                _self.url.brand = 'm' + BrandId
                _self.ajaxdata.Mbid = BrandId
                _self.brandname = brandName
                    /*console.log('eeeeee',_self.url.brand)*/
            }
        },
        //是否阻页面滚动
        wintouchmove(isShow) {
            if (isShow) {
                $(window).off('touchmove');
            } else {
                $(window).on('touchmove', function(e) {
                    e.preventDefault();
                })
            }
        },
        // 是否限制遮罩层
        showMasklayer(isShow) {
            if (isShow) {
                $mask.fadeIn()
                this.isShowMask = false;
            } else {
                $mask.hide()
                this.isShowMask = true;
            }
        },
        //是否添加hide
        classhide(dom, hide) {
            if (hide) {
                dom.addClass('hide')
            } else {
                dom.removeClass('hide')
            }
        },
        //事件:
        clickFun() {
            let _self = this
                //tab li
            $tabul.on('click', 'li', function(e) {
                    let _this = $(this),
                        top = stpt + 30
                    $selleft = $('.sel_Left')
                    $body.removeClass('bodyfixed')
                    _self.showMasklayer(true)
                    _self.classhide($comprehensive, true)
                    _self.classhide($carprice, true)
                    _self.classhide($level, true)
                    _self.classhide($selleft, true)
                    _self.wintouchmove(false)

                    /**/
                    if (_this.hasClass('comprehensiveLi')) { //综合排序
                        if (_this.hasClass('cur')) {
                            _this.removeClass('cur')
                            _self.classhide($comprehensive, true)
                            _self.showMasklayer(false)
                            _self.wintouchmove(true)
                            $(window).scrollTop(_self.sorthih);
                            _self.sorthih = ''
                        } else {
                            _self.sorthih = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                            $tabul.find('li').removeClass('cur');
                            _this.addClass('cur')
                            _self.classhide($comprehensive, false)
                            _self.wintouchmove(false)
                            if ((document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) < top || (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) == top) {
                                $(window).scrollTop(top);
                            }
                        }

                    } else if (_this.hasClass('selectCar')) { //选择品牌
                        let st = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                        $tabul.find('li').removeClass('cur');
                        _self.wintouchmove(true)
                        carch.carSelect({
                            showSerialImg: false,
                            onlyOnSale: false,
                            showLevel: 2,
                            showAllBrand: true,
                            showSearch: true,
                            hide: false,
                            type: "ershouche"
                        }, function(result) {
                            $('.leftmask').hide();
                            setTimeout(() => { $('#carSelectComponent').remove();
                                $('#carSelectSecondLevel').remove(); }, 200)
                            _self.wintouchmove(true)
                            if (result.allBrand) {
                                _self.url.brand = ''
                                _self.ajaxdata.Mbid = ''
                                _self.ajaxdata.Brandid = ''
                                _self.loactionHref()
                            } else {
                                if (result.hotCar) {
                                    _self.url.brand = 's' + result.hotCar.CarSerialID
                                    _self.ajaxdata.Mbid = ''
                                    _self.ajaxdata.Brandid = result.hotCar.CarSerialID
                                    _self.loactionHref()
                                } else if (result.searchCar) {
                                    if (result.searchCar.type == "主品牌") {
                                        _self.url.brand = 'm' + result.masterBrand.id
                                        _self.ajaxdata.Mbid = result.masterBrand.id
                                        _self.ajaxdata.Brandid = ''
                                        _self.loactionHref()
                                    } else if (result.searchCar.type == "子品牌" || result.searchCar.type == "品牌") {
                                        _self.url.brand = 's' + result.searchCar.id
                                        _self.ajaxdata.Mbid = ''
                                        _self.ajaxdata.Brandid = result.searchCar.id
                                        _self.loactionHref()
                                    }
                                } else if (result.masterBrand) {
                                    if (result.brand) {
                                        _self.url.brand = 's' + result.brand.id
                                        _self.ajaxdata.Mbid = ''
                                        _self.ajaxdata.Brandid = result.brand.id
                                        _self.loactionHref()
                                    } else {
                                        _self.url.brand = 'm' + result.masterBrand.id
                                        _self.ajaxdata.Mbid = result.masterBrand.id
                                        _self.ajaxdata.Brandid = ''
                                        _self.loactionHref()
                                    }
                                } else {
                                    _self.url.brand = 'm' + result.brand.id
                                    _self.ajaxdata.Mbid = result.brand.id
                                    _self.ajaxdata.Brandid = ''
                                    _self.loactionHref()
                                }
                            }
                            location.href = _self.loactionurl
                        });
                        //选择品牌--关闭未关闭黑背景
                        $('.carSelect-close').on('click', function(e) {
                            _self.showMasklayer(false)
                            _self.wintouchmove(true);

                            $('#carSelectComponent').remove();
                            if (_self.sorthih === '' || _self.sorthih === 0) {
                                $(window).scrollTop(stpt + 30)
                                _self.sorthih = ''
                            } else {
                                $(window).scrollTop(_self.sorthih)
                                _self.sorthih = ''
                            }
                        })
                    } else if (_this.hasClass('carprice')) { //车价
                        if (_this.hasClass('cur')) {
                            _this.removeClass('cur')
                            _self.classhide($carprice, true)
                            _self.showMasklayer(false)
                            _self.wintouchmove(true)
                            $body.removeClass('bodyfixed')
                            $(window).scrollTop(_self.sorthih);
                            _self.sorthih = ''
                        } else {
                            _self.sorthih = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                            $tabul.find('li').removeClass('cur');
                            _this.addClass('cur')
                            _self.classhide($carprice, false)
                            _self.wintouchmove(false)
                            if (_self.sorthih == 0) {
                                $(window).scrollTop(top);
                                _self.sorthih = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                            }

                            if ((document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) < top || (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) == top) {
                                $(window).scrollTop(top);
                            }
                            $sort.addClass('fixed')
                            $body.addClass('bodyfixed')
                            _self.seldata()
                        }
                    } else if (_this.hasClass('level')) { //级别
                        if (_this.hasClass('cur')) {
                            _this.removeClass('cur')
                            _self.classhide($level, true)
                            _self.showMasklayer(false)
                            _self.wintouchmove(true)
                            $(window).scrollTop(_self.sorthih);
                            _self.sorthih = ''
                        } else {
                            _self.sorthih = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                            $tabul.find('li').removeClass('cur');
                            _this.addClass('cur')
                            _self.classhide($level, false)
                            _self.wintouchmove(false)
                            _self.seldata()
                            if ((document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) < top || (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) == top) {
                                $(window).scrollTop(top);
                            }
                        }

                        /*if ((document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)<top||(document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)==top){
                            $(window).scrollTop(top);
                        }*/
                    } else if (_this.hasClass('moreShow')) { //筛选
                        $tabul.find('li').removeClass('cur');
                        _self.sorthih = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                        _self.classhide($app, true)
                        _self.classhide($selleft, false)
                        _self.showMasklayer(true)
                        _self.wintouchmove(true)
                        $(window).scrollTop(0);
                        _self.seldata()
                        _self.GetUcarSum();
                        /*$('.blksortpage').css({'height':'0'})*/
                    }
                    setTimeout(function() {
                            $('.sort').css({ 'box-shadow': '0' })
                            $('#moreShow .header-bar').css({ 'box-shadow': '0' })
                        }, 500)
                        //console.log(_self.ajaxdata)
                        //console.log(_self.url)
                })
                //carmore_close
            $('#carmore_close').on('click', function(e) {
                    _self.classhide($app, false)
                    _self.classhide($selleft, true)
                        //console.log(_self.sorthih)
                    if (_self.sorthih === '' || _self.sorthih === 0) {
                        $(window).scrollTop(stpt + 30)
                    } else {
                        $(window).scrollTop(_self.sorthih)
                    }
                    _self.sorthih = '';
                    _self.breakupurl(chooserUrl);
                    _self.seldata();
                    /*$('.blksortpage').attr('style','')*/
                    _self.wintouchmove(true)
                    _self.showMasklayer(false)
                    var st = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    //console.log(st,_self.sorthih)
                    /*scrollfun(st)*/
                    setTimeout(function() {
                        $('.sort').css({ 'box-shadow': '0' })
                        $('#moreShow .sort').css({ 'box-shadow': '0' })
                    }, 300)
                })
                //leftmask
            $('.leftmask').on('click', function(e) {
                    _self.showMasklayer(false)
                    _self.classhide($comprehensive, true)
                    _self.classhide($carprice, true)
                    _self.classhide($level, true)
                    _self.classhide($selleft, true)
                    _self.wintouchmove(true)
                    $tabul.find('li').removeClass('cur');
                    $body.removeClass('bodyfixed')
                    $(window).scrollTop(_self.sorthih || stpt);
                    _self.sorthih = ''
                })
                //是否 被选中的效果l12345kfd1h1undefinedc1y1g1e1i1
            $('.radio').on('click', 'dd', function() {
                    let _this = $(this),
                        $dl = _this.parents('dl'),
                        $ddlen = _this.parents('dl').find('dd').length,
                        $customitme = _this.parents('.item'),
                        url = _this.find('a').attr('data-url'),
                        id = _this.find('a').attr('data-id'),
                        txt = _this.find('a').text()
                    if ($customitme.hasClass('transmission') || $customitme.hasClass('emissionstandards')) {
                        $customitme.find('dd.cur').removeClass('cur')
                        _this.addClass('cur')
                        if ($customitme.hasClass('transmission')) {
                            _self.url.transmission = url
                            _self.ajaxdata.GearBoxType = id
                        }
                        if ($customitme.hasClass('emissionstandards')) {
                            _self.url.emissionstandards = url
                            _self.ajaxdata.EnvirStandard = id
                            _self.txt.emissionstandards = txt
                        }

                    } else if ($customitme.hasClass('brand')) {

                    } else if ($customitme.hasClass('downpay') || $customitme.hasClass('carprice') || $customitme.hasClass('year') || $customitme.hasClass('lmili')) {
                        $customitme.find('dd.cur').removeClass('cur')
                        _this.addClass('cur')
                        $customitme.find('input').val('')
                        $customitme.find('.custom').removeClass('ready')
                        if ($customitme.hasClass('downpay')) {
                            _self.url.downpay = url
                            _self.ajaxdata.downpay = id
                        }
                        if ($customitme.hasClass('carprice')) {
                            _self.url.carprice = url
                            _self.ajaxdata.carPrice = id
                        }
                        if ($customitme.hasClass('year')) {
                            _self.url.year = url
                            _self.ajaxdata.Year = id
                        }
                        if ($customitme.hasClass('lmili')) {
                            _self.url.lmili = url
                            _self.ajaxdata.Lmili = id
                        }
                    } else if ($customitme.hasClass('level')) {
                        if (_this.text().indexOf('不限') != -1) {
                            $dl.find('dd').removeClass('cur')
                            $dl.find('dd').eq(0).addClass('cur')
                            _self.url.level = ''
                            _self.ajaxdata.Carlevelid = ''
                        } else {
                            if (_this.hasClass('cur')) {
                                _this.removeClass('cur');
                                _self.url.level = _self.url.level.replace(url, '')
                                _self.ajaxdata.Carlevelid = _self.ajaxdata.Carlevelid.replace(id, '')
                            } else {
                                $dl.find('dd').eq(0).removeClass('cur')
                                _this.addClass('cur');
                                _self.url.level = _self.url.level == '' ? 'l' + url : _self.url.level + url
                                _self.ajaxdata.Carlevelid = _self.ajaxdata.Carlevelid + id
                            }
                            if ($dl.find('.cur').length >= $ddlen - 1) {
                                $dl.find('dd').removeClass('cur')
                                $dl.find('dd').eq(0).addClass('cur')
                                _self.url.level = ''
                                _self.ajaxdata.Carlevelid = ''
                            }
                            if ($dl.find('.cur').length == 0) {
                                $dl.find('dd').eq(0).addClass('cur')
                                _self.url.level = ''
                                _self.ajaxdata.Carlevelid = ''
                            }
                        }
                    } else if ($customitme.hasClass('atatus')) {
                        if (_this.text().indexOf('不限') != -1) {
                            $dl.find('dd').removeClass('cur')
                            _this.addClass('cur');
                            _self.url.atatus = ''
                            _self.ajaxdata.Status = ''
                            _self.txt.Status = _self.txt.atatus = '不限'
                                //console.log(_self.txt)
                        } else {
                            if (_this.hasClass('cur')) {
                                _this.removeClass('cur');
                                _self.url.atatus = _self.url.atatus.replace(url, '')
                                _self.ajaxdata.Status = _self.ajaxdata.Status.replace(id, '')
                                _self.txt.atatus = _self.txt.atatus.replace(txt, '')
                                if (_self.txt.atatus.substring(_self.txt.atatus.length - 1, _self.txt.atatus.length) == '/') {
                                    _self.txt.atatus = _self.txt.atatus.substring(0, _self.txt.atatus.length - 1)
                                } else if (_self.txt.atatus.substring(0, 1) == '/') {
                                    _self.txt.atatus = _self.txt.atatus.substring(1, _self.txt.atatus.length)
                                } else if (_self.txt.atatus.indexOf('//') != -1) {
                                    _self.txt.atatus = _self.txt.atatus.replace('//', '/')
                                }

                                if ($dl.find('.cur').length == 0) {
                                    $dl.find('dd').eq(0).addClass('cur')
                                    _self.url.atatus = ''
                                    _self.ajaxdata.Status = ''
                                    _self.txt.atatus = '不限'
                                }

                            } else {
                                $dl.find('dd').eq(0).removeClass('cur')
                                _this.addClass('cur');
                                _self.url.atatus = _self.url.atatus == '' ? 'k' + url : _self.url.atatus + url
                                _self.ajaxdata.Status = _self.ajaxdata.Status + id
                                _self.txt.atatus = _self.txt.atatus == '不限' ? txt : _self.txt.atatus + '/' + txt
                            }
                        }

                    } else if ($customitme.hasClass('displacement')) {
                        if (_this.text().indexOf('不限') != -1) {
                            $dl.find('dd').removeClass('cur')
                            $dl.find('dd').eq(0).addClass('cur')
                            _self.url.displacement = ''
                            _self.ajaxdata.Exhaust = ''
                            _self.txt.displacement = '不限'
                        } else {
                            if (_this.hasClass('cur')) {
                                _this.removeClass('cur');
                                _self.url.displacement = _self.url.displacement.replace(url, '')
                                _self.ajaxdata.Exhaust = _self.ajaxdata.Exhaust.replace(id, '')
                                _self.txt.displacement = _self.txt.displacement.replace(txt, '')
                                if (_self.txt.displacement.substring(_self.txt.displacement.length - 1, _self.txt.displacement.length) == '/') {
                                    _self.txt.displacement = _self.txt.displacement.substring(0, _self.txt.displacement.length - 1)
                                } else if (_self.txt.displacement.substring(0, 1) == '/') {
                                    _self.txt.displacement = _self.txt.displacement.substring(1, _self.txt.displacement.length)
                                } else if (_self.txt.displacement.indexOf('//') != -1) {
                                    _self.txt.displacement = _self.txt.displacement.replace('//', '/')
                                }
                            } else {
                                $dl.find('dd').eq(0).removeClass('cur')
                                _this.addClass('cur');
                                _self.url.displacement = _self.url.displacement == '' ? 'f' + url : _self.url.displacement + url
                                _self.ajaxdata.Exhaust = _self.ajaxdata.Exhaust + id
                                _self.txt.displacement = _self.txt.displacement == '不限' ? txt : _self.txt.displacement + '/' + txt
                            }
                            if ($dl.find('.cur').length >= $ddlen - 1) {
                                $dl.find('dd').removeClass('cur')
                                $dl.find('dd').eq(0).addClass('cur')
                                _self.url.displacement = ''
                                _self.ajaxdata.Exhaust = ''
                                _self.txt.displacement = '不限'
                            }
                            if ($dl.find('.cur').length == 0) {
                                $dl.find('dd').eq(0).addClass('cur')
                                _self.url.displacement = ''
                                _self.ajaxdata.Exhaust = ''
                                _self.txt.displacement = '不限'
                            }
                        }
                    }
                    _self.GetUcarSum()
                })
                //重置全部
            $('.multi_reset').on('click', function() {
                    //max min
                    $('#morewrappage .item').find('input').val('')
                    $('.wrap_page .item').each(function(i, con) {
                        let _this = $(this)
                        _this.find('.tit_info').text('不限')
                        _this.find('.custom').removeClass('ready')
                        _this.find('dd.cur').removeClass('cur')
                        _this.find('dd').eq(0).addClass('cur')
                    })
                    _self.url = { downpay: '', brand: '', carprice: '', year: '', lmili: '', level: '', atatus: '', transmission: '', displacement: '', emissionstandards: '', sortnew: '', }
                    _self.ajaxdata = { cid: '', pid: '', downpay: '', Mbid: '', Brandid: '', carPrice: '', Year: '', Lmili: '', Carlevelid: '', Status: '', GearBoxType: '', Exhaust: '', EnvirStandard: '', }

                    switch (cityInfo.level) {
                        case '0':
                            _self.ajaxdata.cid = 0
                            _self.ajaxdata.pid = 0
                            break
                        case '1':
                            _self.ajaxdata.cid = 0
                            _self.ajaxdata.pid = cityInfo.id
                            break
                        case '2':
                            _self.ajaxdata.cid = cityInfo.id
                            _self.ajaxdata.pid = 0
                            break
                        default:
                            break;
                    }

                    _self.txt = { atatus: '不限', transmission: '不限', displacement: '不限', emissionstandards: '不限' }
                    _self.GetUcarSum()
                })
                //确认 - 查看XXX辆车源
            $("#carview").on("click", function(e) {
                    e.preventDefault();
                    if (!$(this).hasClass('disabled')) {
                        _self.classhide($comprehensive, true)//关闭 智能筛选
                        _self.classhide($carprice, true)//关闭 车价
                        _self.classhide($level, true)//关闭 级别
                        _self.classhide($selleft, true)//关闭 筛选
                        _self.showMasklayer(false)//关闭 黑色背景
                        _self.wintouchmove(true)//打开可点击事件
                        _self.classhide($app, false)
                        _self.classhide($selleft, true)
                        $('#sortpage .tabul li').removeClass('cur')
                        _self.loactionHref();
                        location.href = _self.loactionurl
                    } else {
                        return false
                    }
                })
                //dom加载完毕时是否显示；
            if ($('.sort_conter_box').find('span').length == 0) {
                $('.sort_conter_box').hide();
            } else {
                $('.sort_conter_box').show();
            }
            //筛选 选择品牌
            $('#morewrappage .brand').on('click', function(e) {
                    e.preventDefault();
                    var _this = $(this),
                        $titCarName = _this.find('.tit_info')
                    carch.carSelect({
                        showSerialImg: false,
                        onlyOnSale: false,
                        showLevel: 2,
                        showAllBrand: true,
                        showSearch: true,
                        hide: false,
                        type: "ershouche"
                    }, function(result) {
                        $('.leftmask').hide();
                        $('#carSelectSecondLevel').remove();
                        $('#carSearch-container').remove();
                        $('#carSelectComponent').remove();
                        if (result.allBrand) {
                            _self.brandname = '全部品牌'
                            _self.url.brand = 's' + 0
                            _self.ajaxdata.Brandid = 0
                        } else {
                            if (result.hotCar) {
                                _self.brandname = result.hotCar.CarSerialName
                                _self.url.brand = 's' + result.hotCar.CarSerialID
                                _self.ajaxdata.Brandid = result.hotCar.CarSerialID
                            } else if (result.searchCar) {
                                if (result.searchCar.type == "主品牌") {
                                    /*$titCarName.text(result.masterBrand.name).attr('data-url', 'm' + result.masterBrand.id);*/
                                    _self.brandname = result.masterBrand.name
                                    _self.url.brand = 'm' + result.masterBrand.id
                                    _self.ajaxdata.Mbid = result.masterBrand.id
                                    _self.ajaxdata.Brandid = ''
                                } else if (result.searchCar.type == "子品牌" || result.searchCar.type == "品牌") {
                                    _self.brandname = result.searchCar.name
                                    _self.url.brand = 's' + result.searchCar.id
                                    _self.ajaxdata.Mbid = ''
                                    _self.ajaxdata.Brandid = result.searchCar.id
                                        /*$titCarName.text(result.searchCar.name).attr('data-url', 's' + result.searchCar.id);*/
                                }
                            } else if (result.masterBrand) {
                                if (result.brand) {
                                    _self.brandname = result.masterBrand.name + ' ' + result.brand.name
                                    _self.url.brand = 's' + result.brand.id
                                    _self.ajaxdata.Mbid = ''
                                    _self.ajaxdata.Brandid = result.brand.id
                                        /*$titCarName.text(result.masterBrand.name + ' ' + result.brand.name).attr('data-url', 's' + result.brand.id);*/
                                } else {
                                    _self.brandname = result.masterBrand.name
                                    _self.url.brand = 'm' + result.masterBrand.id
                                    _self.ajaxdata.Mbid = result.masterBrand.id
                                    _self.ajaxdata.Brandid = ''
                                        /*$titCarName.text(result.masterBrand.name).attr('data-url', 'm' + result.masterBrand.id);*/
                                }
                            } else {
                                _self.brandname = result.brand.name
                                _self.url.brand = 'm' + result.brand.id
                                _self.ajaxdata.Mbid = result.brand.id
                                _self.ajaxdata.Brandid = ''
                                    /*$titCarName.text(result.brand.name).attr('data-url', 'm' + result.brand.id);*/
                            }
                        }
                        _self.loactionHref()
                        _self.GetUcarSum()
                    });
                })
                //选中车系
            $('#selectCarTwo').on('click', function() {
                    let _this = $(this),
                        masterBrandId = '',
                        masterBrandname = '';
                    $('.sort_conter_box .sel').each(function(index, dom) {
                        if ($(this).attr('data-url').indexOf('q') != -1) {
                            masterBrandId = $(this).attr('data-url')
                            masterBrandname = $(this).text();
                        }
                    })
                    carSecondLevel.carSecondLevel({
                        showSerialImg: false,
                        onlyOnSale: false,
                        showLevel: 2,
                        showAllBrand: true,
                        showSearch: true,
                        hide: false,
                        type: "ershouche"
                    }, {
                        masterBrand: {
                            id: _self.getNum(masterBrandId),
                            name: masterBrandname,
                            logo: ''
                        }
                    }, function(result) {
                        if (result.brand) {
                            _self.url.brand = '/s' + result.brand.id
                            _self.loactionHref()
                            location.href = _self.loactionurl
                        } else if (result.masterBrand) {
                            _self.url.brand = '/m' + result.masterBrand.id
                            _self.loactionHref()
                            location.href = _self.loactionurl
                        }


                    })
                })
                //sort_conter_box  多选标签
            $('.sort_conter_box .sel').on('click', function() {
                    let _this = $(this),
                        dataUrl = _this.attr('data-url'),
                        urlNum = _self.getNum(dataUrl),
                        masterBrandId = '',
                        masterBrandname = '';

                    if ((dataUrl.indexOf('v') != -1 && dataUrl.indexOf('r') != -1) || dataUrl.indexOf('d') != -1) {
                        _self.url.downpay = ''
                    }
                    if (dataUrl.indexOf('m') != -1) { //品牌
                        _self.url.brand = dataUrl
                    }
                    if (dataUrl.indexOf('q') != -1) { //品牌
                        _self.url.brand = ''
                    }
                    if ((dataUrl.indexOf('a') != -1 && dataUrl.indexOf('z') != -1) || dataUrl.indexOf('c') != -1) {
                        _self.url.carprice = ''
                    }
                    if ((dataUrl.indexOf('j') != -1 && dataUrl.indexOf('n') != -1) || dataUrl.indexOf('y') != -1) {
                        _self.url.year = '';
                    }
                    if ((dataUrl.indexOf('x') != -1 && dataUrl.indexOf('w') != -1) || dataUrl.indexOf('g') != -1) {
                        _self.url.lmili = ''
                    }
                    if (dataUrl.indexOf('l') != -1) {
                        _self.url.level = _self.url.level.replace(urlNum, '')
                        _self.url.level = _self.url.level === 'l' ? '' : _self.url.level
                    }
                    if (dataUrl.indexOf('k') != -1) {
                        _self.url.atatus = _self.url.atatus.replace(urlNum, '')
                        _self.url.atatus = _self.url.atatus == 'k' ? '' : _self.url.atatus
                    }
                    if (dataUrl.indexOf('e') != -1) {
                        _self.url.transmission = ''
                    }
                    if (dataUrl.indexOf('f') != -1) {
                        _self.url.displacement = _self.url.displacement.replace(urlNum, '')
                        _self.url.displacement = _self.url.displacement == 'f' ? '' : _self.url.displacement
                    }
                    if (dataUrl.indexOf('i') != -1) {
                        _self.url.emissionstandards = ''
                    }
                    /*if (dataUrl.indexOf('q') != -1) {
                        _self.url.brand=dataUrl
                    }*/
                    _self.loactionHref()
                    location.href = _self.loactionurl
                })
                //垃圾桶
            $('.sort_conter_box .del_sort').on('click', function() {
                    location.href = ershoucheUrl + cityInfo.spell + '/list' + hrefquestion
                })
                //筛选 更多选着 展开
            $('.tit_box').on('click', function(e) {
                e.preventDefault();
                let _this = $(this),
                    _item = _this.parents('.item')
                if (_item.hasClass('selcet')) {
                    _item.removeClass('selcet');
                } else {
                    let _radio = _item.find('.radio');
                    if (_radio.length != 0) {
                        _item.addClass('selcet')
                    }
                }
            })
            $('#scrollBotm>div').on('click', function() {
                    $(window).scrollTop(100000);
                })
                //top 栏目 级别 btnLevelSure
            $('.btnLevelSure').on('click', function(e) {
                e.preventDefault();
                _self.classhide($comprehensive, true)//关闭 智能筛选
                _self.classhide($carprice, true)//关闭 车价
                _self.classhide($level, true)//关闭 级别
                _self.classhide($selleft, true)//关闭 筛选
                _self.showMasklayer(false)//关闭 黑色背景
                _self.wintouchmove(true)//打开可点击事件
                $('#sortpage .tabul li').removeClass('cur')
                _self.loactionHref();
                location.href = _self.loactionurl
            })
            //new app 添加  车价最低、车价、级别、筛选 点击里面内容关闭 弹窗


            var _isWebView = tools.isWebView(),
                isApp = Boolean(_isWebView == 'yixinapp' || _isWebView == 'yixinbjapp')
            if (isApp){
                $('#sortpage .tabul li').removeClass('cur')
                $('.sort_comprehensive li').each(function (i,index) {
                    let arr = $(this).find('a').attr('href')
                    $(this).attr('data-href',arr)
                    $(this).find('a').attr('href','javascript:;')

                })
                $('.sort_carprice dl dd').each(function (i,index) {
                    let arr = $(this).find('a').attr('href')
                    $(this).attr('data-href',arr)
                    $(this).find('a').attr('href','javascript:;')

                })
                $('.sort_comprehensive li').on('click',function () {
                    let test=tools.getCookie('yixinbjapp')
                    $('#sortpage .tabul li').removeClass('cur')
                    _self.classhide($comprehensive, true)//关闭 智能筛选
                    _self.classhide($carprice, true)//关闭 车价
                    _self.classhide($level, true)//关闭 级别
                    _self.classhide($selleft, true)//关闭 筛选
                    _self.showMasklayer(false)//关闭 黑色背景
                    _self.wintouchmove(true)//打开可点击事件
                    let h=$(this).attr('data-href')
                    location.href =ershoucheUrl+h
                })
                $('.sort_carprice dd').on('click',function () {
                    $('#sortpage .tabul li').removeClass('cur')
                    _self.classhide($comprehensive, true)//关闭 智能筛选
                    _self.classhide($carprice, true)//关闭 车价
                    _self.classhide($level, true)//关闭 级别
                    _self.classhide($selleft, true)//关闭 筛选
                    _self.showMasklayer(false)//关闭 黑色背景
                    _self.wintouchmove(true)//打开可点击事件
                    let h=$(this).attr('data-href')
                    location.href =ershoucheUrl+h
                })
            }
        },
        //自定义价格
        custom() {
            let _self = this;
            //v3.0之改版--车价 自定义条件
            var carprice = {
                init: function() {
                    var _this = this
                    _this.hoverFun();
                    _this.customNum();
                },
                //效果
                hoverFun: function() {
                    $('.custom').bind('mouseenter', function() {
                        $(this).addClass('hover');
                    });
                    $('.custom').bind('mouseleave', function() {
                        $(this).removeClass('hover');
                    });
                },
                customNum: function() {
                    // 自定义参数
                    $('.custom').each(function() {
                        var custom = $(this);
                        var inputs = custom.find('input');
                        var inputMin = custom.find('input[name=min]');
                        var inputMax = custom.find('input[name=max]');
                        var submintBtn = custom.find('.btn');

                        inputs.bind({
                            'focus': function() {
                                custom.addClass('active');
                                let len = $(this).parents('#moreShow').length;
                                if (len !== 0) {
                                    $('.multi_button').addClass('hide')
                                }
                                checkready();
                            },
                            'blur': function() {
                                custom.removeClass('active');
                                let len = $(this).parents('#moreShow').length;
                                if (len !== 0) {
                                    $('.multi_button').removeClass('hide')
                                }
                            },
                            'input': function() {
                                var value = $(this).val();
                                var maxlength = parseInt($(this).attr('maxlength'));
                                var min = 0;
                                var max = Math.pow(10, maxlength) - 1;
                                if (value) {
                                    if (value == 0) {
                                        value = 0
                                    } else {
                                        value = parseInt(value) || '';
                                    }
                                    if (typeof value === 'number') {
                                        if (value <= min) {
                                            value = min;
                                        } else if (value > max) {
                                            value = max;
                                        }
                                    }
                                }
                                $(this).val(value);
                                checkready();
                            }
                        });
                        // todo 数字大小错误提示
                        submintBtn.bind('click', function(e) {
                            e.preventDefault();
                            let len = $(this).parents('#moreShow').length;
                            if ($(this).parents('.custom').hasClass('ready')) {
                                subdata();
                            }

                            if (len !== 0) {
                                $('.multi_button').removeClass('hide')
                            }
                            let _this = $(this),
                                $item = _this.parents('#morewrappage'),
                                $sortCarprice = _this.parents('.sort_carprice').length;

                            if ($item) {
                                _self.GetUcarSum();
                                _self.loactionHref();
                            }
                            if ($sortCarprice) {
                                _self.loactionHref();
                                location.href = _self.loactionurl
                            }
                        });

                        function checkready(elem) {
                            var valueMin = parseInt(inputMin.val());
                            var valueMax = parseInt(inputMax.val());
                            var valueMinTrue = false;
                            if (valueMin == 0 || valueMin > 0) {
                                valueMinTrue = true
                            }
                            if (valueMinTrue && valueMax && valueMin < valueMax) {
                                custom.addClass('ready');
                                custom.parents('.item').find('dd').removeClass('cur');
                                custom.parents('.item').find('dd').eq(0).addClass('cur');
                                let $item = custom.parents('.item');
                                return true;
                            } else {
                                custom.removeClass('ready');
                                if (valueMin >= valueMax) {
                                    //showError(elem, '最小值和最大值输入错误');
                                }
                                return false;
                            }
                        }

                        function subdata() {
                            var valueMin = parseInt(inputMin.val());
                            var valueMax = parseInt(inputMax.val());
                            var valueMinTrue = false;
                            if (valueMin === 0 || valueMin > 0) {
                                valueMinTrue = true
                            }
                            if (valueMinTrue && valueMax && valueMin < valueMax) {
                                custom.addClass('ready');
                                custom.parents('.item').find('dd').removeClass('cur');
                                custom.parents('.item').find('dd').eq(0).addClass('cur');
                                let $item = custom.parents('.item');
                                if ($item.hasClass('downpay')) {
                                    _self.url.downpay = 'v' + inputMin.val().trim() + 'r' + inputMax.val().trim()
                                    _self.ajaxdata.downpay = inputMin.val().trim() + '|' + inputMax.val().trim()
                                }
                                if ($item.hasClass('carprice')) {
                                    _self.url.carprice = 'a' + inputMin.val().trim() + 'z' + inputMax.val().trim()
                                    _self.ajaxdata.carPrice = inputMin.val().trim() + '|' + inputMax.val().trim()
                                }
                                if ($item.hasClass('year')) {
                                    _self.url.year = 'j' + inputMin.val().trim() + 'n' + inputMax.val().trim()
                                    _self.ajaxdata.Year = '-' + inputMax.val().trim() + '|-' + inputMin.val().trim()
                                }
                                if ($item.hasClass('lmili')) {
                                    _self.url.lmili = 'x' + inputMin.val().trim() + 'w' + inputMax.val().trim()
                                    _self.ajaxdata.Lmili = inputMin.val().trim() * 10000 + '|' + inputMax.val().trim() * 10000
                                }
                                return true;
                            } else {
                                custom.removeClass('ready');
                                if (valueMin >= valueMax) {
                                    //showError(elem, '最小值和最大值输入错误');
                                }
                                let $item = custom.parents('.item');
                                if ($item.hasClass('downpay')) {
                                    _self.url.downpay = ''
                                    _self.ajaxdata.downpay = ''
                                }
                                if ($item.hasClass('carprice')) {
                                    _self.url.carprice = ''
                                    _self.ajaxdata.carPrice = ''
                                }
                                if ($item.hasClass('year')) {
                                    _self.url.year = ''
                                    _self.ajaxdata.Year = ''
                                }
                                if ($item.hasClass('lmili')) {
                                    _self.url.lmili = ''
                                    _self.ajaxdata.Lmili = ''
                                }
                                return false;
                            }
                        }
                    });
                }
            }
            carprice.init()
        },
        //最终URL 跳转 url
        loactionHref() {
            let _self = this,
                url = '',
                brandurl = ''
                //_self.url.brand
            if (_self.url.brand == '') {
                brandurl = ''
            } else {
                brandurl = '/' + _self.url.brand
            }
            //displacement
            url = '/' + _self.url.downpay + _self.url.carprice + _self.url.year + _self.url.lmili + _self.url.level + _self.url.atatus +
                _self.url.transmission + _self.url.displacement + _self.url.emissionstandards + _self.url.sortnew

            if ((url === '' || url === '/') && brandurl === '') {
                /*let url2=(brandurl+url+ '/?source=' + source).replace('//','/')*/
                _self.loactionurl = ershoucheUrl + cityInfo.spell + '/list' + hrefquestion
            } else {
                let url2 = (brandurl + url + hrefquestion).replace('//', '/')
                _self.loactionurl = ershoucheUrl + cityInfo.spell + url2
            }
        },
        //请求接口 获取产品数量
        GetUcarSum() {
            let _self = this;
            Store.GetUcarSum(_self.ajaxdata).then(function(result) {
                if (result.Data == 0) {
                    $('#carview').html('本地暂无车源').addClass('disabled');
                } else {
                    $('#carview').html('查看<span id="count">' + result.Data + '</span>辆车源').removeClass('disabled');
                }
            });
        },
    }
})
Echo.init({
    offset: 500, //离可视区域多少像素的图片可以被加载
    throttle: 0 //图片延迟多少毫秒加载
});