require('./about.scss')
var $nav = $('.layout-left a')

var CURRENT = 'current'
var PAGE = 'page'

var pagesize = 8

var dispatcher = {
    'who' : whoHandler,
    'what' : whatHandler,
    'advantage' : advantageHandler,
    'media' : mediaHandler,
    'contact' : contactHandler
}

init()

function init(){
    bindEvent()
    bindPagination()
    loadPage()

    // 缓存问题
    window.selCityCallback = function(obj) {
        window.location.href= window.location.pathname + '?cityid=' + (obj.cityId) + window.location.hash
    }
}

function bindEvent(){
    $nav.on('click', function(){
        // 是否页内路由判断
        var isHash = $(this).attr('href').substring(0,1) === '#'
        var page = $(this).attr('href').substring(1)
        $nav.removeClass(CURRENT)
        $(this).addClass(CURRENT)
        if(isHash){
            $('.' + PAGE).hide().filter('.page-' + page).show()
            dispatcher[page]()
        }
    })
}

function bindPagination(){
    tools.listPagination('pagination', 7, 1, function(){})
}

function loadPage(){
    var page = window.location.hash.substring(1) || 'who'
    $nav.filter('[href="#'+page+'"]').trigger('click')
}

function buildList(data){
    var html = ''
    $(data).each(function(index, item){
        // format
        // item.PublishDateTime = item.PublishDateTime.replace(/[\u4e00-\u9fa5]/g, '.').replace(/\.\d+\.$/,'').replace(/\.(\d{1})$/, '.0$1')
        html += '<a href='+item.NewsUrl+' target="_blank"><dl>\
                    <dd>\
                        <h6>'+item.Title+'</h6>\
                        <p>媒体: '+item.MediaName+'</p>\
                    </dd>\
                </dl></a>'
    })
    return html
}

function loadMedia(page, $page){
    tools.$ajax({
        url: '/home/news',
        type: 'get',
        dataType: "json",
        data: {pageSize:pagesize, pageIndex:page},
        success: function (res) {
            if (res.Result) {
               var html = buildList(res.Data)
               var total = Math.ceil(res.RowCount/pagesize)
               var count = res.Data.length || 0
               $page.html(html).data('inited', true)
               $('#pagination').show()
               if(count < pagesize){
                   $('.img-bar').css('height', count*77.5 - 63)
               }
               tools.listPagination('pagination', total, page, function(page){
                loadMedia(page,$page)
               })
            } else {}                                      
        }
    })
}

function buildMap(){
    $('.map-element').each(function(){
        var id = this.id
        var location = $(this).data('location').split(',')
        var map = new BMap.Map(id)
        var point = new BMap.Point(location[0],location[1])
        var marker = new BMap.Marker(point)
        map.centerAndZoom(point, 16)
        map.addOverlay(marker)
        map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_ZOOM} ))
    })
}

// handlers
function whoHandler(){}
function whatHandler(){}
function advantageHandler(){}
function contactHandler(){
    buildMap()
}
function mediaHandler(){
    var $page = $('#page-media-list')
    var inited = $page.data('inited')
    if(!inited){
        loadMedia(1, $page)
    }
}
