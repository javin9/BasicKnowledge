require.config({
   //baseUrl:'../js/lib',
   paths:{
   	jquery:'../js/lib/jquery-1.7.2'
   }
})
require(['jquery'], function($) {
	console.log($().jquery);
});