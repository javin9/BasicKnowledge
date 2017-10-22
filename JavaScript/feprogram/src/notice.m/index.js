!function(){
    var $yxWrapper = $("#yxWrapper"),
        startTime = getDateTime(2017,1,26,20,0,0),//年月日时分秒（开始时间）
        endTime = getDateTime(2017,2,2,20,0,0),//年月日时分秒（结束时间）
        curTime = new Date().getTime(),
        _html = '<div id="notice" class="font-label" style="display:none;background:#fff;width:10rem;position:absolute;top:0;z-index:8999;left:50%;margin-left:-5rem;border:1px solid #e9474d;display:none;"><div style="width:1.15rem;text-align:center;display:table-cell;vertical-align: middle;padding:.3rem 0;"><img style="width:.48rem;height:.48rem" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABHdJREFUWAnNWN9rFFcUPufumjXRVCVq28X2udVnQWwtjSC4TbVGSB8q/gmlUMEXwQfBF8FC8U8Q+2Cgsf5aIaUpTRt8bumPZ5XYqkHbqHHT2Tme727O7OzszP4y4g7M3jv3nvt939577p1zhqnL69HYZ5uC6uOxUGgfsbxNxEUSKnoYpnkimSfhW45pOp9bf23jtW8edkPBnRo/2P/JeCjyuRLuEaJ8J+MUPFDBs4753OYb3011OKa12T+lg+9xSGeEZLe3ZF5WohkhvuyI/yDH87IurzOj1E+CIoVSDEm2M8lBFT5KIgO+j3hOHB1/vXz5F4+T8ZM5QzIxkbv/uHJWQvnCAzL9Lcyn8jR8YaR84b8MvIbmhdKR1wJaPMIiJ0XoDY/j+Ost6wvHeHKy2mC88pAq6OGhQxuXl8KLujzqJ1Rxwqc3b93wFZ8//yQNpF2bHD267sG9f78MWU6ovxV0LqcHBt2nmy5depQc2yQIYv5fqs7pdL/LOis5pvGR8pWbyYG9PC+UDuyqCk1htpT4zzWDud1JUS4OjGXCzEAMMf+a4zU7V0sMeIAFTMX+DRyeSznjGhoEwWewTJiZPOfHRsrf3okbr0YdmIr9ETjAVeOsI0dLht2kO+Rn+Eye6cPVnJk6Xb2G5QuEfvQ+5fh9233RDGFrwxwOnCZmsTSxBXcdsrPa4vj41rRx4AAXUIwbdS8Ihx7OGUwjdhM64hcAn0plBncaeNw2Xvfjlqo/ZI3zO1c5wQ0NGOsF1U5gXVE9Z1pubZEdWeBxIajbn9CDcUeyz57BBU48mwaHd5NK2aOev4xDz4zj5XB58v4QF0bV5ncQtBPVIEbHYCww4phW95zKDQ3Q4irB0491C6of00yrE7hTUd2IgShwghsaoMU5ru5DB95NKFtd7UR1K8a4jBtanCp7Cx3+RWkWLcosUb2KiXNDizq1xjO+lf0bu4WWqCsp6plUflrS2ztwG5+JQOIVjRhqj1x0FlxZCBG3a1U3URrr/KU75B3Rm7XeyoGz8CJuDfR0pVSSXlypRKd21sC0dj94paMngDi3asE5dNfjBbk3V3A7KsxnbGZsptodCangde67KkhjYFwa6aUapzSaGPOZQS58sFbvTs+pJsiIW+bVh/gWDBB2NhmmNCTFmM+YT/UiKuJGciDkvgcvYuAU/oamLDFm1Kso40am4gr5oavqjBoJ0ChiYANPlu3EmH23osAJbmhA2uRqeRPPqj8MICA34HjZqRgb040oz+kzE56FFuwyzWT4HEqfHWhAjnrq1cWh50UN5vZ6n0oF0+2kXOBEt2nwgpDEMfImDb6RHSTHG7g5cLI/63l4aurekIrKGgeuWsDPc5ZIRmdZ34WwiGlZkzjEuEhVFkqHt2X98xdtBzY4wAVOi6eB65fMCJBRqidNYxoDCa6/DFHABDY4wFXjNAU4fhLXq04UmwRBX1+l0jZhffWxwUSh7JvPMXFRqPfNB6ukMKQqPjvQgFzfQRqPN3/SU8e8HUpuGu/Jbj/pPQc2yTec8xcakgAAAABJRU5ErkJggg=="/></div><div style="width:8.53rem;color:#e9474d;display:table-cell;line-height:150%;vertical-align: middle;">春节期间（1月27日-2月2日）客服暂停服务，我们会在2月3日后陆续与您联系。</div></div>';
    $yxWrapper.append(_html);

    function getDateTime(year, month, date, hrs, min, sec){
        return new Date(year, (month-1), date, (hrs==24)?0:hrs, min, sec).getTime();
    }
    var $appDown = $("#appDown"),
        $notice = $("#notice"),
        isApp = tools.getCookie("YiXinAppInfo"),
        curPageFrom = tools.getUrlParam("from")?tools.getUrlParam("from"):tools.getCookie("from"),
        isCurFrom;
    if(typeof(noAppDown) != "undefined"){
        var noAppDownArr = noAppDown.split(",");
        if(noAppDownArr.indexOf(curPageFrom)>=0){
            isCurFrom = true;
        }
    }

    if(tools.getCookie("isNoticeHide") != "yes" && curTime >= startTime && curTime<=endTime){
        $notice.css({
            "display":"table-row"
        })
        $yxWrapper.css({
            "padding-top": $notice.height()
        });
        if(!(tools.getCookie("hideAppDown") == "1" || isCurFrom || isApp)){
            $notice.css({
                top:"1.44rem"
            });
        }
        $(window).on('click', '#app_colse', function(event) {
            event.preventDefault();
            $notice.css({
                top:0
            });
        });
        $notice.on('click', 'img', function(event) {
            event.preventDefault();
            $notice.hide();
            $yxWrapper.css({
                "padding-top":0
            });

            var cookieString = "isNoticeHide=yes;path=/;domain=" + tools.wildcardUrl();
            document.cookie = cookieString;
        });
    }
}();