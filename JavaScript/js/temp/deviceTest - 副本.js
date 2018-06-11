/*
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview  课前检测-迁移至工作台的临时方案页
 * @author cuiying | cuiying@zybang.com
 * @version 1.0 | 2017-12-19 | cuiying
 * @version 1.0 | 2018-05-02 | liujianwei     //触发检测的顺序转移到前段操作
 * */
var winBridge = require('airclass:widget/winBridge/winBridge.js');
__inline('deviceConfig.js');


//*******************常量******************
var TIMEOUT = 10000; //异常超时时间

//*******************弹层******************
var deviceFlex = $('.device-flex'), //遮罩层
    driveLayer = $('.device-drive'), //驱动弹层
    microTest = $('.micro-test'), //麦克风检测不到弹层
    microList = $('.micro-list'), //麦克风列表弹层
    wifiLayer = $('.device-wifi'), //wifi上网弹层
    networkLayer = $('.network'), //无法上网弹层
    microTesting = $('.micro-testing'), //检测麦克风加载层
    microReading = $(".micro-reading"), //朗读弹层
    readContent = $("#readContent"), //朗读内容选择器
    microGonextNet = $(".micro-gonext-net"),
    microGonextError = $(".micro-gonext-error"),
    contact = $('#contact'),
    recheck = $(".recheck"),
    netType = $("#netType"),
    netSpeed = $("#netSpeed"),
    showNetTip = $(".show-net-tip"),
    testFinish = $(".test-finish"),
    microPlay = $(".micro-play"),
    gonext = $(".gonext"),
    allErrTipLayer = $('.all-err-tip'),

    //*******************按钮******************
    downLoadDrive = $('.down-load-drive'), //下载驱动按钮
    ignoreTest = $('.ignore-test'), //驱动弹层忽略问题按钮
    wifiBtn = $('#wifi-btn'), //知道wifi上网按钮
    _microRetry = $('.micro-retry'), //重新检测麦克风按钮
    _startTestBtn = $('.micro-start-test'), //开始测试按钮
    _readAgain = $(".read-again"), //重读按钮
    _readFinish = $(".finish-read"), //读完了按钮
    _retryNetwork = $(".retry-network"), //网络检测重试
    _hideFlex = $('#closeFLexBtn'), //课前失败后隐藏弹层
    tipTimeout,
    nowTime = 0,
    _readTimeCount;


/*端调用的function如果tipTimeout=null,则调用超时不执行逻辑*/
function handleStatus(data) {
    if (!!tipTimeout && data && data.name) {
        clearTimeout(tipTimeout); //清除超时定时器
        var name = data.name,
            obj = JSON.parse(data.obj),
            status = obj.status;
        switch (name) {
            case 'jsDriveTest':
                deviceConfig.driveStatus = status;
                console.log('执行驱动检测，状态：' + status + '|||------->(0:正常，1:未安装，2:驱动异常)');
                showDriveLayer(status);
                break;
            case 'jsWlanTest':
                deviceConfig.netMethod = status;
                console.log('执行网络检测，状态：' + status + '|||------->(0:有线，1:无线)');
                showWifiLayer(status);
                break;
            case 'jsMicTest':
                deviceConfig.microphone = status;
                console.log('执行micphone检测，状态：' + status + '|||------->(0:异常，1:正常)');
                microTestFn(status);
                break;
            case 'jsMicList':
                deviceConfig.microphoneList = obj.microphoneList;
                console.log('micphone列表，结果如下：');
                console.log(obj.microphoneList);
                //渲染麦克风列表
                microPhoneList(obj.microphoneList);
                break;
            case 'jsStartTest':
                deviceConfig.jsStartTest = status;
                console.log('开始麦克风测试，状态：' + status + '|||------->(0:成功，1:没有检测到mac，2:网络链接失败，3:其他异常)');
                // startTestBtn();
                testStatus(status);
                break;
            case 'jsVolume':
                deviceConfig.readVoiceSize = obj.value;
                console.log('开始麦克风测试，音量值：' + obj.value);
                setVoiceSize(obj.value);
                break;
            case 'jsAudioFile':
                deviceConfig.readRecondSrc = obj.path;
                console.log('录音地址：' + obj.path);
                playRead(obj.path);
                break;
            case 'jsNetInfo':
                deviceConfig.netInfo = obj.type;
                deviceConfig.netTimeout = obj.delay;
                console.log('网络类型是:' + obj.type + '; 延时为：' + obj.delay + '|||------->(0:有线，1:无线，delay：延时毫秒)');
                theEnd(obj.type, obj.delay);
                break;
            default:
                console.log("啥也没有啊");
                showLoading(1);
        }
    }
}

$(function() {
    showLoading(1);
    // start
    winBridge.addMethod("jsStartDeviceTest", flexShowStatus);
    //驱动
    winBridge.addMethod("jsDriveTest", handleStatus);
    //网络
    winBridge.addMethod("jsWlanTest", handleStatus);
    //麦克风
    winBridge.addMethod("jsMicTest", handleStatus);
    //麦克风列表
    winBridge.addMethod("jsMicList", handleStatus);
    //开始测试录音
    winBridge.addMethod("jsStartTest", handleStatus);
    //声音大小
    winBridge.addMethod("jsVolume", handleStatus);
    //声音路径
    winBridge.addMethod("jsAudioFile", handleStatus);
    //最后一步网络跟延迟
    winBridge.addMethod("jsNetInfo", handleStatus);

    //注册超时单击事件
    hideErrorLayer();
});

//保证js文件加载完，再通知win开始检测
window.onload = function() {
    winBridge.invokeMethod("onStartTest");
};

//弹层显示入口
function flexShowStatus() {
    // deviceConfig.flexShow = true;
    // showTest(deviceConfig.flexShow);
}

//显示检测弹层
// function showTest(bo) {
//   //显示整体测试提示层
//   console.log('是否是新检测：' + bo);
//   if (bo) {
//     //调用端 新测试接口
// winBridge.invokeMethod("onStartTest");
//     //显示遮罩层
//     deviceFlex.css('display', 'flex');
//     //显示等待弹框
//     showLoading(1);
//   }
// }

//显示检测设备加载层
function showLoading(bl) {
    if (bl) {
        microTesting.addClass('loading');
        $('.testing').addClass('loading');
        registerAllErrTip();
    }
    microTesting.show().siblings('div').hide();
}

//检测故障
function registerAllErrTip() {
    clearTimeout(tipTimeout);
    tipTimeout = setTimeout(function() {
        allErrTipLayer.show().siblings('div').hide();
    }, TIMEOUT);
}
//清除检测故障的定时器
function cleanAllErrTip() {
    clearTimeout(tipTimeout);
}

//驱动弹层
function showDriveLayer(arg) {
    if (arg != 0) {
        console.log("手写板驱动弹层显示");
        driveLayer.show().siblings('div').hide();
        hideDriveLayer();
    }
    // else {
    //   showWifiLayer();
    // }

}

function hideDriveLayer() {
    //下载驱动Btn
    downLoadDrive.off('click').on('click', function() {
        console.log('点击下载驱动');
        driveLayer.hide();
        //给端发送下载通知。
        winBridge.invokeMethod("onDriveDownLoad");
        driveLayer.hide();
        deviceFlex.hide();
        return;
    });

    //忽略此问题
    ignoreTest.off('click').on('click', function() {
        console.log("点击忽略驱动按钮！")
        //发送端消息
        winBridge.invokeMethod("onDriveIgnoreStep");
        driveLayer.hide();
        // showTesting();
        showLoading(1)
        //显示wifi提示层
        // setTimeout(function () {
        //   showWifiLayer();
        // }, 300);
    });
}

//显示wifi检测层
function showWifiLayer(arg) {
    if (arg == 1 || arg == 2) {
        controlWifi(arg);
        wifiLayer.show().siblings('div').hide();
        wifiBtn.off('click').on('click', function() {
            console.log("点击网络弹层【知道了】按钮")
            winBridge.invokeMethod('onWlanTestIgnore');
            wifiLayer.hide();
            showLoading(1);
        });
    }
}

function controlWifi(type) {
    var tipsArr = [{
        text: "请使用有线网络上课",
        tips: "您正在使用无线网络，稳定性较差，容易出现直播卡顿"
    }, {
        text: "请断开无线网络",
        tips: "您同时使用了有线和无线网络，请断开无线网络"
    }];

    wifiLayer.find('.text').text(tipsArr[type - 1].text)
        .parent()
        .find('.tips')
        .text(tipsArr[type - 1].tips);
}

//麦克风检测状态
function microTestFn(arg) {
    //麦克风正常
    if (deviceConfig.microphone != 1 || arg != 1) {

        //麦克风异常
        microTest.show().siblings('div').hide();

        //重新检测麦克风按钮
        _microRetry.on('click', function() {
            winBridge.invokeMethod('onMicTestRetry');
            microTest.hide();
            showLoading(1);
        });
    }
}

//渲染端提供的麦克风列表
function microPhoneList(obj) {
    if (obj.length) {
        var macList = '';
        for (var i = 0; i < obj.length; i++) {
            var id = obj[i].id,
                name = obj[i].name;
            macList += '<option value="' + id + '">' + name + '</option>';
        }
        $('#selectMicro').html(macList);
        microList.show().siblings('div').hide();
        microList.find('.step-two').removeClass('active');
        microList.find('.step-line').removeClass('active');
        changeMic();
        startTestBtn();
    } else {
        microTestFn();
        return;
    }
}

//切换micphone
function changeMic() {
    var sel = $('#selectMicro');
    sel.change(function() {
        var _sel = sel.val();
        winBridge.invokeMethod("onMicChange", { 0: _sel });
    });
}

//执行开始测试
function startTestBtn() {
    _startTestBtn.off('click');
    _startTestBtn.on('click', function() {
        console.log('点击开始测试按钮');
        winBridge.invokeMethod('onMicStartTest');
        showLoading(1);
    });
}

function networkTestFn() {
    networkLayer.show().siblings().hide();
    _retryNetwork.off('click');
    _retryNetwork.on('click', function() {
        winBridge.invokeMethod('onMicStartTest');
        showLoading(1);
    });
}

//等待端给各种状态
function testStatus(id) {
    switch (id) {
        case 0:
            readLayer();
            break;
        case 1:
            winBridge.invokeMethod('onMicStartTest');
            microTestFn();
            break;
        case 2:
            networkTestFn();
            break;
        case 3:
            showLoading(1);
            break;
        default:
            showLoading(1);
    }
}

//朗读弹层
function readLayer() {
    //调用端的录音功能
    readContent.html(deviceConfig.readContent);
    microReading.show().siblings('div').hide();
    readTimeCount();
    readAgain();
    readFinish();
}

//设置音量条波动
function setVoiceSize(size) {
    var single = Math.floor(32767 / 33),
        setSize = Math.floor(size / single),
        _html = '';
    for (var j = 0; j < 33; j++) {
        if (j < setSize) {
            _html += '<span class="active"></span>';
        } else {
            _html += '<span></span>';
        }
    }
    $('#voiceStyle').html(_html);
}

function readTimeCount() {
    _readTimeCount = setInterval(function() {
        nowTime++;
        nowTime = nowTime > 9 ? nowTime : '0' + nowTime;
        $('#readTimeCount').html('00:' + nowTime);

        if (parseInt(nowTime) >= 20) {
            // winBridge.invokeMethod('onMicReadFinish');
            clearInterval(_readTimeCount);
        }
        if ((20 - parseInt(nowTime)) < 6 && (20 - parseInt(nowTime)) > 0) {
            $(".check-tip").html('还可以读' + (20 - parseInt(nowTime)) + '秒');
        } else if (20 - parseInt(nowTime) <= 0) {
            $(".check-tip").html('最多朗读20秒');
        } else {
            $(".check-tip").html('');
        }
    }, 1000);
}

//重新朗读
function readAgain() {
    _readAgain.off('click').on('click', function() {
        winBridge.invokeMethod('onMicReadAgain');
        console.log('点击重新朗读按钮');
        clearInterval(_readTimeCount);
        nowTime = 0;
        $('#readTimeCount').html('00:00');
        $(".check-tip").html('');
        microReading.hide();
        // showLoading(1);
        microPhoneList(deviceConfig.microphoneList);
    });
}

//读完了Btn逻辑
function readFinish() {
    _readFinish.off('click');
    _readFinish.on('click', function() {
        if (parseInt(nowTime) < 5) {
            $(".check-tip").html('至少要读5秒');
            setTimeout(function() {
                $(".check-tip").html('');
            }, 2000);
        } else {
            clearInterval(_readTimeCount);
            winBridge.invokeMethod('onMicReadFinish');
            nowTime = 0;
            console.log("朗读完了");
            $('#readTimeCount').html("00:00");
            $(".check-tip").html('');
            //端朗读完了******************
            //winBridge.addMethod('onMicReadFinish',onMicReadFinish);
            microReading.hide();
            // showTesting();
            showLoading(1);
            //microTesting.show().siblings('div').hide();

            //获取端的声音源地址
            // setTimeout(function () {
            //     playRead();
            // },3000);
        }
    });
}

// 播放朗读录音弹层
function playRead(src) {
    var audio = document.createElement('audio');
    audio.controls = true;
    audio.src = src;
    audio.setAttribute("id", "controlAudio");
    $('#readAudio').html(audio);
    microPlay.show().siblings('div').hide();

    gonext.off('click');
    gonext.on('click', function() {
        var selectTypes = $('input[name="voice"]:checked').val();
        if (!selectTypes) {
            //后期可以优化下美感
            return alert("请选择收听效果！");
        }
        console.log("播放后选择是：" + selectTypes);
        microPlay.hide();
        $('input[name="voice"]').attr("checked", false);
        //暂停音频播放
        musicObj = document.getElementById("controlAudio");
        musicObj.pause();
        selectTypes == 1 ? netLayer() : goNext();
    });
}

//播放完下一步 --错误
function goNext() {
    contact.html(deviceConfig.contact);
    microGonextError.show();
    recheck.off('click').on('click', function() {
        microGonextError.hide();
        //跳转重新检测
        console.log("启动重新检测麦克风");
        winBridge.invokeMethod('onMicTestRetry');
        showLoading(1);
    });
}

//播放完下一步 --net
function netLayer() {
    //硬件通过测试
    winBridge.invokeMethod('onPassTest');
    showLoading(1);
}


function theEnd(id, bi) {
    //step-two style
    $('.step-line').css('background', '#4CC760');

    //设置显示信息
    netType.html(id != 0 ? "无线网络" : "有线网络");
    netSpeed.html(bi);

    if (id > deviceConfig.threshold) {
        //延时太大
        console.log("延时太大");
        $('.show-single').addClass('greey');
        showNetTip.html("网络较差，可能会出现直播卡顿");
    } else {
        //延时很小
        console.log("延时很小");
        $('.show-single em').hide();
        $('.show-single').addClass('green');
        showNetTip.html("网络流畅，满足上课需求");
    }

    microGonextNet.show().siblings('div').hide();

    testFinish.on('click', function() {
        //课前检测完成，成功后处理
        window.location.href = "/static/workbench/?deviceCheck=1";

        // $('.step-line').attr('style','');
        // hideFlex();
    });
}



// function hideFlex() {
//   microGonextNet.hide().siblings('div').hide();
//   deviceFlex.hide();
//   deviceConfig.flexShow = false;
// }

function hideErrorLayer() {
    _hideFlex.on('click', function() {
        //课前检测超时处理
        window.location.href = "/static/workbench/?deviceCheck=1";
        // deviceFlex.hide();
        allErrTipLayer.hide();
        // deviceConfig.flexShow = false;
    });
}