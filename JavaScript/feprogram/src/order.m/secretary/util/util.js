import store from '../store/store'

const classBtnDisabled = 'btn_disabled'
const textSubmiting = '正在提交...'

export function throwError(msg){
    window.location.href = xin_che_url + '/Home/Error?errMsg=' + encodeURIComponent(msg)
}

export function isDisabledSubmit(selector){
    return getElement(selector).hasClass(classBtnDisabled)
}

export function disabledSubmit(selector){
    const element = getElement(selector)
    const text = element.text()
    element.addClass(classBtnDisabled).text(textSubmiting)
    if(text !== textSubmiting){
        element.data('text', text)
    }
}

export function enabledSubmit(selector){
    const element = getElement(selector)
    const text = element.data('text')
    element.removeClass(classBtnDisabled)
    if(text !== textSubmiting){
        element.text(text)
    }
}

export function resetInput(selector){
    getElement(selector).val('')
}

export function getElement(selector){
    return $(selector)
}

export function getValue(selector){
    return getElement(selector).val()
}

export function getValidateElement(selector){
    return $(selector + 'Validata')
}

export function proxy(selector, cb, event='click'){
    $('body').on(event, selector, cb) 
}

export function page_scr_down() {

    // 判断页面滚动
    var _pageH = $(window).height(),
        _topH = $('.header-bar').height(),
        _botH = 0,
        _contH = 0,
        _dialogH = $('#chattingInner').height(),
        $dialogWrap = $('#chattingWrap'),
        $botItem = $('.choose_bot');

    // 循环计算.choose_bot高度
    _botH = $botItem.eq(0).height();
    for (var i = 0; i < $botItem.length; i++) {
        _botH = (_botH < $botItem.eq(i).height()) ? $botItem.eq(i).height() : _botH
    }
    // 对话框容器高度
    _contH = _pageH - _topH - _botH - 0.2 * store.rootFontSize;
    $dialogWrap.height(_contH + 'px');

    // 对话超出容器高度后，滚动至最底部对话
    if (_dialogH >= _contH) {
        myscrollTop(_dialogH, 500, 'chattingWrap')
    }

    function myscrollTop(scrollTo, time, domId) {
        var scrollFrom = parseInt(document.getElementById(domId).scrollTop),
            i = 0,
            runEvery = 5; // run every 5ms

        scrollTo = parseInt(scrollTo);
        time /= runEvery;

        var interval = setInterval(function () {
            i++;

            document.getElementById(domId).scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

            if (i >= time) {
                clearInterval(interval)
            }
        }, runEvery);
    }
}