import './appDown.scss'
import fullpage from 'libs/fullPage';

$(function(){

	var winH = $(window).height(),
		headerH = $('#Header .header-top').height(),
		footerH = $('#Footer').height();
		
	$('.section8').height( winH-footerH + 'px' );

	$('#appdownPc').fullpage({
		anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8'],
		menu: '#sidemenu',
		onLeave: function(index, nextIndex, direction){

			var imgH = $('.section' + index + ' .section_img').height();
			$('.section' + index + ' .section_img').animate({
				'top': 0,
				'opacity': 0,
				'filter': 'alpha(opacity=0)'
			});

			if( nextIndex == 8 ){
				$('.section8 .fp-tableCell').css('display', 'block');
				$('.section8 .fp-tableCell, .section8 .section_cont').height( winH - footerH + 'px' );

				$('#Footer').addClass('fixed');
			} else {
				$('#Footer').removeClass('fixed');
			}
		},
		afterLoad: function(anchorLink, index){

			var imgH = $('.section' + index + ' .section_img').height();
			$('.section' + index + ' .section_img').animate({
				'top': (winH-imgH)/2+'px',
				'opacity': 1,
				'filter': 'alpha(opacity=100)'
			});

			if(index == 1){
				// $('.section1').height( winH - headerH + 'px' );

				$('.section8 .fp-tableCell').css('display', 'table-cell');
				
				$('#Header').animate({
					opacity: '1'
				}, 300);
				$('#sidemenu').animate({
					top: '50%'
				}, 500);
			}
			if(index != 1 && index != 8){
				$('.section8 .fp-tableCell').css('display', 'table-cell');

				$('#Header').animate({
					opacity: '0'
				}, 300);
				$('#sidemenu').animate({
					top: '50%'
				}, 500);
			}
			if(index == 8){
				$('.section8 .fp-tableCell').css('display', 'block');
				$('.section8 .fp-tableCell, .section8 .section_cont').height( winH - footerH + 'px' );

				$('#Header').animate({
					opacity: '0'
				}, 300);
				$('#sidemenu').animate({
					top: '30%'
				}, 500);
			}
		}
	});
})