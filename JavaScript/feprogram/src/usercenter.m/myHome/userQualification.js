import './components/user/index.scss'
import './userQualification.scss'

function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

setupWebViewJavascriptBridge(function(bridge) {

    bridge.registerHandler('getInitialData', function(data, responseCallback) {
        alert(JSON.stringify(data))
        // var responseData = { 'Javascript Says':'Right back atcha!' }
        // responseCallback(responseData)
    })

    $('.qua-body a').on('click',function(){
        var $this = $(this)
        var $siblings = $this.siblings()
        $siblings.removeClass('cur')
        $this.addClass('cur')
    })

    $('#ensure').click(function(){
        var data = {}
        $('.qua-body a.cur').each(function(){
            var $this = $(this)
            var key = $this.attr('rel')
            data[key] = $this.data('id')
        })
    })

    bridge.callHandler('finish', {response:'success'}, function(response) {})
})
