import './css/topic.scss'
var CLASS_LIKE = 'icon-like'
var CLASS_LIKED = 'icon-liked'

var $like = $('#do-like')

var isLiked = $like.data('liked') === 'True'
var likeId = $like.data('id')

window.selCityCallback = function (obj) {
  window.location.href = obj.url
}


if(!isLiked){
  $like.on('click', likeHandler)
}else{
  $like.removeClass(CLASS_LIKE)

  // ie8 bug
  setTimeout(function(){
    $like.addClass(CLASS_LIKED)
  },0)
}

// 点赞句柄
function likeHandler(){
  $.post('/Topic/ClickPraise', {id:likeId}, likedCallback, 'json')
}

// 点赞成功回调
function likedCallback(res){
  if(res.ret){
    tools.showAlert('已点赞')
    $like.off('click', likeHandler).removeClass(CLASS_LIKE).addClass(CLASS_LIKED).text(+$like.text()+1)
  }
}
