import './index.scss'



var honePageAD = {
    //遮罩层
    maskLayer: $("#maskLayer"),
    isload: true,
    //广告层
    homePageAD: $("#homePageAD"),
    materialid: $('#homePageAD').attr('materialid'),
    headerAD: $('#headerAD'),
    bottomAD: $('#bottomAD'),
    homePageAD_colse: $('.homePageAD_colse'),
    headerAD_colse: $('.headerAD_colse'),
    bottomAD_colse: $('.bottomAD_colse'),
    bottomAD_s1: $('#bottomAD_s1'),
    bottomAD_s2: $('#bottomAD_s2'),
    nation: $('.nation'),
    materialids: [],
    //初始化
    init: function () {
        this.homePageADInit();
        this.headerADInit();
        this.bottomADInit();
        this.loadDomView();
    },


    loadDomView: function () {
        var self = this;
        self.maskLayer = $('#maskLayer');
        //广告层关闭
        self.homePageAD_colse.on("click", function () {
            self.maskLayer.hide();
            self.homePageAD.hide();
            if (document.domain.search(".daikuan.com") != -1) {
                tools.setCookie("homePageAD", self.materialids.join('|'), "", ".daikuan.com");
            } else {
                tools.setCookie("homePageAD", self.materialids.join('|'), "", document.domain);
            }
        })
        self.maskLayer.on("click", function () {
            self.maskLayer.hide();
            self.homePageAD.hide();
            if (document.domain.search(".daikuan.com") != -1) {
                tools.setCookie("homePageAD", self.materialids.join('|'), "", ".daikuan.com");
            } else {
                tools.setCookie("homePageAD", self.materialids.join('|'), "", document.domain);
            }
        })
        self.headerAD_colse.on("click", function () {
            self.headerAD.animate({ height: 0 }, 500, function () {
                self.headerAD.hide();
            });

        })
        self.bottomAD_colse.on("click", function () {
            self.bottomAD.animate({ width: 0 }, 500, function () {
                self.bottomAD.hide();
                self.showBottomAD();
                if (document.domain.search(".daikuan.com") != -1) {
                    tools.setCookie("bottomAD", "true", "", ".daikuan.com");
                } else {
                    tools.setCookie("bottomAD", "true", "", document.domain);
                }
            });

        })
    },
    //广告弹层 盖屏
    homePageADInit: function () {
        var self = this;
        if (!self.homePageAD || !self.homePageAD[0]) {
            return;
        }
        if ($('.nation') && $('.nation')[0]) {
            self.homePageAD.hide();
            return;
        }
        if ($('#localization') && $('#localization')[0] && !$('#localization').is(':hidden')) {
            self.homePageAD.hide();
            return;
        }
        var isShow = true;
        self.materialids = tools.getCookie("homePageAD");

        if (self.materialids && self.materialids != '' && self.materialids.length > 0) {
            self.materialids = self.materialids.split('|')
            for (var i = 0; i < self.materialids.length; i++) {
                if (self.materialids[i] == self.materialid) {
                    isShow = false;
                }
            }
        } else {
            self.materialids = [];
        }
        self.materialids.push(self.materialid);
        if (!isShow) {
            self.maskLayer.hide();
            self.homePageAD.hide();
        }
        else {
            this.isload = false;
            //var w = 0;//self.homePageAD.find('img')[0].width;
            // var h = 0;//self.homePageAD.find('img')[0].height;
            var obj_img = document.createElement('img');
            obj_img.src = self.homePageAD.find('img')[0].src;

            var w = obj_img.width;
            var h = obj_img.height;
            self.homePageAD.css({ 'width': w, 'height': h, 'margin-left': -(w / 2), 'margin-top': -(h / 2) });
            setImmediate(() => {
                self.homePageAD.show();
                self.maskLayer = $('#maskLayer');
                self.maskLayer.show();

            })

        }

    },
    //广告弹层 头部
    headerADInit: function () {
        var self = this;
        if (!self.headerAD || !self.headerAD[0]) {
            return;
        }
        // if (tools.getCookie("headerAD")) {
        //     self.headerAD.hide();
        // }
        // else {
        //  tools.setCookie("headerAD", "true")
        self.headerAD.show();
        //}
    },
    //广告弹层 底部
    bottomADInit: function () {
        var self = this;
        if (!self.bottomAD || !self.bottomAD[0]) {
            return;
        }
        function showAD() {
            self.bottomAD.css({ width: 0 })
            self.bottomAD.show();
            self.bottomAD.animate({ width: $(window).width() }, 500);
        }
        self.bottomAD_s1.on('click', function () {
            self.bottomAD_s1.hide();
            showAD();
        })
        self.bottomAD_s2.on('click', function () {
            self.bottomAD_s2.hide();
            showAD();
        })
        if (tools.getCookie("bottomAD")) {
            self.bottomAD.hide();
            self.showBottomAD();
        }
        else {
            if (this.isload) {
                showAD();
            } else {
                self.bottomAD.hide();
                self.showBottomAD();
            }
        }
    },
    showBottomAD: function () {
        var self = this;
        if ($(window).width() <= 1280) {
            self.bottomAD_s1.hide();
            self.bottomAD_s2.show();

        } else {
            self.bottomAD_s2.hide();
            self.bottomAD_s1.show();
        }
    },
};






$(function () {
    setTimeout(() => {
        honePageAD.init();
    }, 3000)
    window.onresize = function () {
        if (honePageAD.bottomAD.is(':hidden')) {
            honePageAD.showBottomAD();
        } else {
            honePageAD.bottomAD.css({ "width": "100%" })
        }
    }
})