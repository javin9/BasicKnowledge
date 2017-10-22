import './index.scss';
import ko from 'knockout'
import Vue from 'vue';
import Share from 'libs/share/index'

var vm = new Vue({
    el: '#shareBox',
    ready() {
        this.domInit();
    },
    components: {
        Share
    },
    template: `<share :options="shareOptions" qrcode-title="扫描二维码" title="分享给朋友" v-bind:show.sync="showShareCtl" view="share"></share>`,
    data() {
        return {
            shareOptions:{
                title:`我在易鑫车贷上进行了身价测试，我的身价不可估量，为我推荐了一辆车，一起来测测，看看您适合什么车？`,
                url: window.location.href,
                desc: `我在易鑫车贷上进行了身价测试，我的身价不可估量，为我推荐了一辆车，一起来测测，看看您适合什么车？`,
                image:"http://img2.yixinfinance.com/jinrong/newmweb/images/pic300.jpg"
            }
        }
    },
    methods: {
        //dom渲染
        domInit() {
            var self = this;

            // 导航menu
            var $navMenu = $('#navTips');
            $('#tools-nav').on('click',function (e) {
                $navMenu.toggleClass('hide');
            });

            $navMenu.on('click', function(e) {
                $navMenu.addClass('hide');
            });
            $navMenu.on('touchmove', function(e) {
                $navMenu.bind('touchend', function() {
                    $navMenu.addClass('hide');
                    $navMenu.unbind('touchend');
                });
            });

            $navMenu.find('a').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(e.target).attr('id') !== 'shareNavTip') {
                    location.href = $(this).attr('href');
                } else {
                    $navMenu.addClass('hide');
                    self.$nextTick(() => self.$broadcast('showShare', 'share'));
                }
            });
        }
    }
});

var WorthViewModel = {
    TotalCount: ko.observable(),        // 申请总人数
    CurStep: ko.observable(0),          // 当前步骤
    WorthNum: ko.observable(),          // 身价值
    WorthArr: ko.observable(),          // 身价范围
    // 计算结果
    CarName: ko.observable(),           // 车名
    ListHref: ko.observable(),          // 列表页链接
    CarImg: ko.observable()             // 车图片的src
};
let sign,cents;
/* 备选车款 */
var worthCars = [
    {
        "priceRange": [0, 5],
        "rangeCars": [
            {
                "carName": "奔奔",
                "carSerialID": 1978,
                "spell":"benben",
                "carImg": "http://img2.bitautoimg.com/autoalbum/files/20140317/057/0540540579_2.jpg"
            },
            {
                "carName": "奥拓",
                "carSerialID": 2713,
                "spell":"xinaotuo",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20120910/212/1002272128_2.jpg"
            },
            {
                "carName": "比亚迪F0",
                "carSerialID": 2420,
                "spell":"biyadif0",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20120306/635/0502316356_2.jpg"
            },
            {
                "carName": "奇瑞QQ3",
                "carSerialID": 1785,
                "spell":"qiruiqq",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20120330/046/0501320460_2.jpg"
            },
            {
                "carName": "启辰R30",
                "carSerialID": 3774,
                "spell":"qichenr30",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20140718/393/0314023930_2.jpg"
            }
        ]
    },
    {
        "priceRange": [5, 8],
        "rangeCars": [
            {
                "carName": "瑞纳两厢",
                "carSerialID": 3308,
                "spell":"ruinaliangxiang",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20120328/135/0406141356_2.jpg"
            },
            {
                "carName": "长安CS35",
                "carSerialID": 3660,
                "spell":"changans101",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20121026/704/1130037041_2.jpg"
            },
            {
                "carName": "起亚K2",
                "carSerialID": 3398,
                "spell":"dongfengyuedaqiyak2",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20141114/092/1054210928_2.jpg"
            },
            {
                "carName": "五菱宏光S",
                "carSerialID": 3026,
                "spell":"wulinghongguangs",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20140828/241/1100322413_2.jpg"
            },
            {
                "carName": "飞度",
                "carSerialID": 2408,
                "spell":"xinfeidu",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20140530/195/0613521952_2.jpg"
            }
        ]
    },
    {
        "priceRange": [8, 18],
        "rangeCars": [
            {
                "carName": "科鲁兹三厢",
                "carSerialID": 2608,
                "spell":"keluzi",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20140826/634/1128186340_2.jpg"
            },
            {
                "carName": "哈弗H6",
                "carSerialID": 3152,
                "spell":"hafuh6",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20130922/180/0139291801_2.jpg"
            },
            {
                "carName": "捷达",
                "carSerialID": 1905,
                "spell":"jieda",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20141208/525/1132255259_2.jpg"
            },
            {
                "carName": "长安CS75",
                "carSerialID": 3987,
                "spell":"changancs75",
                "carImg": "http://img2.bitautoimg.com/autoalbum/files/20130916/923/0313429237_2.jpg"
            },
            {
                "carName": "朗逸",
                "carSerialID": 2370,
                "spell":"langyi",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20120815/713/0439057132_2.jpg"
            }
        ]
    },
    {
        "priceRange": [18, 25],
        "rangeCars": [
            {
                "carName": "速腾",
                "carSerialID": 1765,
                "spell":"suteng",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20120816/666/0407166663_2.jpg"
            },
            {
                "carName": "本田CR-V",
                "carSerialID": 1660,
                "spell":"dongfengbentiancrv",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20120816/947/0408119476_2.jpg"
            },
            {
                "carName": "北京现代ix35",
                "carSerialID": 2874,
                "spell":"xintusheng-2874",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20140911/235/1129242353_2.jpg"
            },
            {
                "carName": "起亚K5",
                "carSerialID": 3323,
                "spell":"k5",
                "carImg": "http://img2.bitautoimg.com/autoalbum/files/20131206/933/1020379338_2.jpg"
            },
            {
                "carName": "MISTRA名图",
                "carSerialID": 3913,
                "spell":"mistramingtu",
                "carImg": "http://img2.bitautoimg.com/autoalbum/files/20141027/732/1103247323_2.jpg"
            },
            {
                "carName": "思域",
                "carSerialID": 1661,
                "spell":"siyucivic",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20140627/646/1134266464_2.jpg"
            }
        ]
    },
    {
        "priceRange": [25, 40],
        "rangeCars": [
            {
                "carName": "途观",
                "carSerialID": 2871,
                "spell":"tiguan",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20130619/782/0954207826_2.jpg"
            },
            {
                "carName": "奥迪A4L",
                "carSerialID": 2593,
                "spell":"quanxinaodia4l",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20120809/713/0406027131_2.jpg"
            },
            {
                "carName": "帕萨特",
                "carSerialID": 1796,
                "spell":"pasate",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20120306/291/0501122918_2.jpg"
            },
            {
                "carName": "凯迪拉克ATS-L",
                "carSerialID": 4282,
                "spell":"kaidilakeatsl",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20140801/644/0225486445_2.jpg"
            },
            {
                "carName": "宝马3系",
                "carSerialID": 1729,
                "spell":"baoma3xi",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20120803/264/1007332648_2.jpg"
            }
        ]
    },
    {
        "priceRange": [40, 80],
        "rangeCars": [
            {
                "carName": "宝马5系",
                "carSerialID": 2034,
                "spell":"baoma5xichangzhoujuban",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20141029/456/0517154563_2.jpg"
            },
            {
                "carName": "奥迪Q5",
                "carSerialID": 2855,
                "spell":"aodiq5-2855",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20120306/010/0930530106_2.jpg"
            },
            {
                "carName": "奥迪A6L",
                "carSerialID": 2573,
                "spell":"xinaodia6l",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20120327/620/1000216200_2.jpg"
            },
            {
                "carName": "揽胜极光",
                "carSerialID": 3245,
                "spell":"lanshengjiguang",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20120326/932/0243119325_2.jpg"
            },
            {
                "carName": "奥德赛",
                "carSerialID": 2750,
                "spell":"xinaodesai",
                "carImg": "http://img4.bitautoimg.com/autoalbum/files/20141212/442/0348504425_2.jpg"
            }
        ]
    },
    {
        "priceRange": [80, 1000],
        "rangeCars": [
            {
                "carName": "宝马X5",
                "carSerialID": 2032,
                "spell":"baomax5",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20140219/019/0427430190_2.jpg"
            },
            {
                "carName": "保时捷Cayenne",
                "carSerialID": 2046,
                "spell":"baoshijiecayenne",
                "carImg": "http://img2.bitautoimg.com/autoalbum/files/20121217/909/0445149090_2.jpg"
            },
            {
                "carName": "奔驰S级",
                "carSerialID": 2259,
                "spell":"benchisji",
                "carImg": "http://img3.bitautoimg.com/autoalbum/files/20130809/291/0600502919_2.jpg"
            },
            {
                "carName": "奥迪A8L",
                "carSerialID": 2070,
                "spell":"aodia8l",
                "carImg": "http://img2.bitautoimg.com/autoalbum/files/20141027/180/0918151804_2.jpg"
            },
            {
                "carName": "路虎揽胜",
                "carSerialID": 2149,
                "spell":"luhulansheng",
                "carImg": "http://img2.bitautoimg.com/autoalbum/files/20131029/734/0205407340_2.jpg"
            },
            {
                "carName": "宝马6系",
                "carSerialID": 2040,
                "spell":"baoma6xi",
                "carImg": "http://img1.bitautoimg.com/autoalbum/files/20120305/213/0456262137_2.jpg"
            }
        ]
    }
];

/*  货币格式化  */
function formatCurrency(num, _bool) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    if (_bool) {
        return (((sign) ? '' : '-') + num + '.' + cents);
    } else {
        return (((sign) ? '' : '-') + num);
    }
};

var CalcObj = function () {
    this.GetTotalCountUrl = APIURL + 'api/Other/GetWorthMeasureTotalCount';
    this.UpdateCountUrl = APIURL + 'api/Other/UpdateWorthMeasureTotalCount';

    this.Datas = {
        CurStep: 1,          // 当前步骤
        StepTitle: ['职业', '收入', '信用', '社保', '公积金', '住房'],
        Step1_1: [25000, 16000, 10000, 6500, 2500],         // 第一步默认价格
        Step1: [0.8, 1.1, 0.75, 1, 0.7],                    // 身份系数
        Step2: [25000, 16000, 10000, 6500, 4000, 2500],     // 月收入
        Step3: [1.1, 0.95, 0.5, 0.9],                       // 信用情况
        Step4: [1, 0.8],                                    // 社保
        Step5: [1.1, 0.9],                                  // 公积金
        Step6: [1.1, 0.9, 0.7],                             // 住房
        StepRange: [0, 2, 3, 4, 5, 8, 13]                   // 身价范围区间值
    };

    this.StepsVal = [1, 1, 1, 1, 1, 1];  // 代表每一步选择的默认值

    this.Results = {
        Val: 0,
        Loan: 0,
        RangeMin: 0,
        RangeMax: 0,
        SerialId: 0,
        DownPayment: 0,
        MonthPay: 0
    };
    this.FormerDataArr = [];
    this.QualiArr = [];

};

CalcObj.prototype = {
    // 初始化
    Init: function () {
        var $this = this;
        $this.InitData();
        // 返回按钮
        $this.BackFun();
    },
    // 初始化数据
    InitData: function () {
        var $this = this;

        $this.Datas.CurStep = 1;
        $this.StepsVal = [0, 1, 1, 1, 1, 1];
        $this.FormerDataArr = [];

        $('li').removeClass('current');

        $this.ChangeView();
        // $this.QualificationBtn();
    },
    // QualificationBtn: function() {
    //     var $this = this;
    //     $("#qualificationBtn").click(function(){
    //         SetCookie('W_Career', $this.QualiArr[0]);
    //         SetCookie('W_Income', $this.QualiArr[1]);
    //         SetCookie('W_Credit', $this.QualiArr[2]);
    //         SetCookie('W_Insurance', $this.QualiArr[3]);
    //         SetCookie('W_Funds', $this.QualiArr[4]);
    //         SetCookie('W_HouseState', $this.QualiArr[5]);
    //         window.location.href =  "/loanSecretary/EditPersonalQualification";
    //     });
    // },
    // 切换视图
    ChangeView: function () {
        var $this = this;

        $('.CurStep').text($this.Datas.CurStep);
        $('.step' + $this.Datas.CurStep).show().siblings().hide();
        // 头部步骤名
        if ($this.Datas.CurStep < 7) {
            $('.tt span').text($this.Datas.StepTitle[$this.Datas.CurStep - 1]);
        }
        // 第一步
        if ($this.Datas.CurStep == 1) {
            $(".switch_bg").addClass("first");
            $('#WorthSteps').show();
            $('#WorthResult').hide();
            $('#tools-nav').hide();
            $('#seize-seat').show();
            $('.ub-img-bg').hide();
            $('#WorthSteps .loan-celiangyi-bg-txt').show().siblings('.loan-celiangyi-bg-car').hide();
            // 获取总人数
            $.ajax({
                url: $this.GetTotalCountUrl,
                dataType: 'jsonp',
                cache: true,
                success: function (res) {
                    if (res.Result) {
                        $('.TotalNum').text(formatCurrency(res.Data, false));
                    }
                }
            });
        }
        // 结果步骤
        else if ($this.Datas.CurStep == 7) {
            $('#WorthSteps').hide();
            $('#WorthResult').show();
            $('#tools-nav').show();
            $('#seize-seat').css({
                'display':"none !important"
            });
            $('.ico-triangle-br').show();
            // 更新总人数
            $.ajax({
                url: $this.UpdateCountUrl,
                dataType: 'jsonp',
                cache: true,
                success: function (res) {
                    if (res.Result) {

                    }
                }
            });
            $this.Share();
        }
        // 结果步骤
        else {
            $(".switch_bg").removeClass("first");
            $('#WorthSteps .loan-celiangyi-bg-txt').hide().siblings('.loan-celiangyi-bg-car').show();
            $('#WorthResult .loan-celiangyi-bg-car').show();
            // 重测
            $('#CalcAgain').off('click').on('click', function () {
                document.title = "我竟然这么值钱！";
                $this.InitData();
                $("#WorthSteps").show();
                $('.b-news-share').removeClass('b-news-share-show').hide();
                $('.ico-triangle-br').hide();
                $('#tools-nav').hide();
                $('#seize-seat').show();
                $('.b-news-share-list').hide();
                $('.b-news-share-list').hide();
            });
        }
        // 选择选项
        $this.SelCondition();
    },
    // 选择选项
    SelCondition: function () {
        var $this = this;

        $('.step_con').off('click').on('click', 'li', function (e) {
            //$(this).addClass('current').siblings().removeClass('current');
            var $that = $(this);
            $(this).find(".step_img").css("opacity",0);
            $this.QualiArr[$(this).parents("ul").index()] = $(this).data("id");
            $this.CalcFunc($this.Datas.CurStep, $(this).attr("data-index"));
            $this.Datas.CurStep++;
            setTimeout(function(){
                $this.ChangeView();
                $that.find(".step_img").css("opacity",1);
            },300);
        });
    },
    // 计算
    CalcFunc: function (_step, _index) {
        var $this = this;

        $this.StepsVal[_step - 1] = $this.Datas['Step' + _step][_index];

        if (_step == 1) {
            $this.Results.Val = $this.Datas['Step' + _step + '_1'][_index] * 36 / 10000;
        } else {
            $this.Results.Val = $this.StepsVal[0] * $this.StepsVal[1] * $this.StepsVal[2] * $this.StepsVal[3] * $this.StepsVal[4] * $this.StepsVal[5] * 36 / 10000;
        }
        $this.Results.Val = parseFloat($this.Results.Val.toFixed(2));
        $this.Results.Loan = parseFloat(($this.Results.Val / 2).toFixed(2));

        $this.Results.DownPayment = parseFloat(($this.Results.Val * 0.3).toFixed(2));
        $this.Results.MonthPay = parseFloat(($this.Results.Loan * 10000 / 36).toFixed(2));
        var _downPaymentRange = '',_monthPayRange="";
        if($this.Results.DownPayment == 0){
            _downPaymentRange = 'd0';
        }else if($this.Results.DownPayment<=3 && $this.Results.DownPayment>0){
            _downPaymentRange = 'd1';
        }else if($this.Results.DownPayment<=5 && $this.Results.DownPayment>3){
            _downPaymentRange = 'd2';
        }else if($this.Results.DownPayment<=8 && $this.Results.DownPayment>5){
            _downPaymentRange = 'd3';
        }else if($this.Results.DownPayment<=10 && $this.Results.DownPayment>8){
            _downPaymentRange = 'd4';
        }else if($this.Results.DownPayment<=15 && $this.Results.DownPayment>10){
            _downPaymentRange = 'd5';
        }else if($this.Results.DownPayment<=20 && $this.Results.DownPayment>15){
            _downPaymentRange = 'd6';
        }else if($this.Results.DownPayment<=25 && $this.Results.DownPayment>20){
            _downPaymentRange = 'd7';
        }else if($this.Results.DownPayment<=30 && $this.Results.DownPayment>25){
            _downPaymentRange = 'd8';
        }else if($this.Results.DownPayment>30){
            _downPaymentRange = 'd9';
        }

        if($this.Results.MonthPay <= 1000){
            _monthPayRange= 'm0';
        }else if($this.Results.MonthPay<=3000 && $this.Results.MonthPay>1000){
            _monthPayRange = 'm1';
        }else if($this.Results.MonthPay<=5000 && $this.Results.MonthPay>3000){
            _monthPayRange = 'm2';
        }else if($this.Results.MonthPay<=8000 && $this.Results.MonthPay>5000){
            _monthPayRange = 'm3';
        }else if($this.Results.MonthPay<=10000 && $this.Results.MonthPay>8000){
            _monthPayRange = 'm4';
        }else if($this.Results.MonthPay>10000){
            _monthPayRange = 'm5';
        }
        // 跳转
        $('#ChkList').attr('href', '/'+localCity.CitySpell+'/budget/'+ _downPaymentRange +_monthPayRange+'/?source='+Source+'&channel='+Channel+'&cityId=' + localCity.CityId);

        $(".social_con").addClass("opa");
        setTimeout(function(){
            CalcRlt();
            setTimeout(function(){$(".social_con").removeClass("opa");},200);
        },500);
        // 存储上一步的值
        $this.FormerDataArr.push({
            ImgSrc: $('#WorthSteps .loan-celiangyi-bg-car img').attr('src'),
            CarName: $('#WorthSteps .loan-celiangyi-bg-car strong').text(),
            WorthTxt: $('#WorthSteps .loan-celiangyi-bg-car dd').text()
        });
        // 计算结果
        function CalcRlt() {

            $('.loan-celiangyi-bg-car p img').attr('src', '');
            $('.loan-celiangyi-bg-car strong').text('');
            $('.loan-celiangyi-car em').text('');
            for (var i = 0; i < worthCars.length; i++) {
                if ($this.Results.Val >= worthCars[i].priceRange[0] && $this.Results.Val < worthCars[i].priceRange[1]) {
                    var _random = Math.round(Math.random() * 10000) % worthCars[i].rangeCars.length
                    var $car = worthCars[i].rangeCars[_random];

                    $this.Results.RangeMin = ($this.Results.Val - $this.Datas.StepRange[i]).toFixed(2);
                    $this.Results.RangeMax = ($this.Results.Val + $this.Datas.StepRange[i]).toFixed(2);

                    $this.Results.SerialId = $car.carSerialID;

                    $('.loan-celiangyi-bg-car strong,.result_carname strong').text($car.carName);
                    if($this.Datas.CurStep ==7){
                        //$('.loan-celiangyi-bg-car dd,.mea_result_title i').text($this.Results.Loan + '万');
                        $('.mea_result_title i').text($this.Results.Loan + '万');
                    }else{
                        $('.loan-celiangyi-bg-car dd,.mea_result_title i').text($this.Results.Val + '万');
                        $('.loan-celiangyi-bg-car p img,.result_img img').attr('src', $car.carImg);
                    }
                    $('.result_img').click(function(){
                        window.location.href = "/"+localCity.CitySpell+"/"+$car.spell+"/?source=" +Source;
                    });
                    vm.shareOptions={
                        title:`我在易鑫车贷上进行了身价测试，我的身价为${$this.Results.Loan}万元，为我推荐了${$car.carName}，一起来测测，看看您适合什么车？`,
                        url: window.location.href,
                        desc: `我在易鑫车贷上进行了身价测试，我的身价为${$this.Results.Loan}万元，为我推荐了${$car.carName}，一起来测测，看看您适合什么车？`,
                        image:$car.carImg
                    }
                    vm.$nextTick(() => vm.$broadcast('updateShare',vm.shareOptions));
                    // vm.$set('carName',$car.carName);
                    // vm.$set('price',$this.Results.Loan + '万元');
                    // vm.$set('carImg',$car.carImg);
                    if ($this.Results.RangeMax <= 5) {
                        $('.loan-celiangyi-car em').text('少于5万');
                    } else {
                        //$('.loan-celiangyi-car em').text($this.Results.RangeMin + '-' + $this.Results.RangeMax + '万');
                        $('.loan-celiangyi-car em').text($this.Results.Val + '万');
                    }
                }
            }
        };

    },
    // 返回按钮
    BackFun: function () {
        var $this = this;
        $('.btn-return').off('click').on('click', function () {
            if ($this.Datas.CurStep == 1) {
                window.history.back();
            }
            else if ($this.Datas.CurStep == 7) {
                $('#WorthSteps').show();
                $('#WorthResult').hide();
                $this.Datas.CurStep--;
                $this.ChangeView();
            }
            else {
                var _length = $this.FormerDataArr.length;
                var $last = $this.FormerDataArr[_length - 1];
                $('.loan-celiangyi-bg-car img').attr('src', $last.ImgSrc);
                $('.loan-celiangyi-bg-car strong').text($last.CarName);
                $('.loan-celiangyi-bg-car dd').text($last.WorthTxt);


                $this.Datas.CurStep--;
                $this.ChangeView();
            }
        });
    },
    // 分享
    Share: function () {
        var $this = this;
        var sinaShareUrl = "http://s.share.baidu.com/?click=1&url=http://chedai.m.yiche.com/&uid=0&to=tsina&type=text&pic=http://image.bitautoimg.com/jinrong/chehaodai/2.0/common/share_pic.jpg&title=我在易车车贷上进行了身价测试，我的身价为" + $this.Results.Val +"万元，为我推荐了" + $('.result_carname strong').text() + "，一起来测测，看看您适合什么车？&key=&desc=#易车车贷#&comment=&relateUid=&searchPic=0&sign=on&l=1a629ff591a629fg4h1a629fjoa&linkid=ihy7e2j6hhj&firstime=1449627844777";
        var qqShareUrl = "http://s.share.baidu.com/?click=1&url=http://chedai.m.yiche.com/&uid=0&to=tqq&type=text&pic=http://image.bitautoimg.com/jinrong/chehaodai/2.0/common/share_pic.jpg&title=我在易车车贷上进行了身价测试，我的身价为"+ $this.Results.Val +"万元，为我推荐了" + $('.result_carname strong').text() + "，一起来测测，看看您适合什么车？&key=&desc=#易车车贷#&comment=&relateUid=&searchPic=0&sign=on&l=1a629ff591a629fg4h1a629qb81&linkid=ihy7llxl91q&firstime=1449627844777"
        var qzoneShareUrl = "http://s.share.baidu.com/?click=1&url=http://chedai.m.yiche.com/&uid=0&to=qzone&type=text&pic=http://image.bitautoimg.com/jinrong/chehaodai/2.0/common/share_pic.jpg&title=我在易车车贷上进行了身价测试，我的身价为"+ $this.Results.Val +"万元，为我推荐了" + $('.result_carname strong').text() + "，一起来测测，看看您适合什么车？&key=&desc=#易车车贷#&comment=&relateUid=&searchPic=0&sign=on&l=1a629ff591a629fg4h1a62afqr8&linkid=ihy80p80emg&firstime=1449627844777"
        $(".bdsharebuttonbox[data-tag = 'share_1'] li a[data-cmd='tsina']").attr("href",sinaShareUrl);
        $(".bdsharebuttonbox[data-tag = 'share_1'] li a[data-cmd='tqq']").attr("href",qqShareUrl);
        $(".bdsharebuttonbox[data-tag = 'share_1'] li a[data-cmd='qzone']").attr("href",qzoneShareUrl);
        // window._bd_share_config = {
        //     common: {
        //         bdUrl: 'http://chedai.m.yiche.com/',
        //         bdText: '我在易车车贷上进行了身价测试，我的身价为' + $this.Results.Val + '万元，为我推荐了' + $('.result_carname strong').text() + '，一起来测测，看看您适合什么车？',
        //         bdDesc: '#易车车贷#',
        //         bdPic: 'http://image.bitautoimg.com/jinrong/chehaodai/2.0/common/share_pic.jpg'
        //     },
        //     share: [{
        //         "tag": "share_1",
        //         "bdSize": 32,
        //         "bdCustomStyle": "http://image.bitautoimg.com/uimg/css/0016/myiche2014_cube_newsshare_style-20140808140022-802.css"

        //     }]
        // }
        // with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];

        //$(document).on('click', function (e) {
        // e = e || window.event;
        //var $target = $(e.target);

        //if ($target.is('.b-news-share') || $target('.b-news-share-list').length) {


        //})
    }
};
$(function(){
    //  	$(".banner6").bind("click",function(){
    // 	$("body").css({height:"100%"});
    // 	$("body").css({overflow:"hidden"});
    // 	$("#IndexMain").hide();
    // 	$(".header").hide();
    // 	$(".eject_bg").show();
    // 	$(".eject").show();
    // 	$("#movetop").hide();
    // 	return false
    // })
    $(".bounceInDown2").bind("click",function(){
        $(".section").hide();
        $(".ub-img-bg").show();
        return false
    })
    $(".close_img").bind("click",function(){
        $(".eject_bg").hide();
        $(".eject").hide();
        $("body").css({height:"auto"});
        $("body").css({overflow:"visible"});
        $(".header").show();
        $("#IndexMain").show();
        $(".m-r-top").css({"z-index":"150 !important"});
    })
    //alert("gaodu+"+$(window).height())
    //alert("kuandu"+$(window).width())
    $('.b-news-share').on('click',function(){
        if ($('.b-news-share').hasClass('b-news-share-show')) {
            $('.b-news-share').removeClass('b-news-share-show');
            $('.b-news-share-list').hide();
            //return false
            //alert('aa')
        } else {
            $('.b-news-share').addClass('b-news-share-show');
            $('.b-news-share-list').show();

        }
    })
})


new CalcObj().Init();
$(function () {
    $("#content").height($(window).height());
})
