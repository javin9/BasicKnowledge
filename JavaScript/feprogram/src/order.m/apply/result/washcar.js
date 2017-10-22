import './index.scss'

$(function () {
    $(".weixin-box .font-title a").on("click", function(e) {
        tools.showAlert("长按复制！");
    });
        
    if(tools.getCookie("YiXinAppInfo")){
        var $goHome = $("#goHome"), $goOrder =  $("#goOrder");
        $goHome.attr("href","#");
        $goOrder.attr("href","#");

        $goHome.on("click",function(e){                    
            tools.jsNativeBridge("payResultAction","goHome");
            return false;
        })
        $goOrder.on("click",function(e){
            tools.jsNativeBridge("payResultAction","goOrder");
            return false;
        })
    } 
})