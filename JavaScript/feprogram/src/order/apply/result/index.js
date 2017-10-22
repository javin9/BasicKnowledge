import './index.scss'

const fixFooter = () => {
	if ($(document.body).height() < $(window).height()) {
		$('#Footer').css(
			'margin-top',
			$(window).height() - $(document.body).height() + 20
		)
	}
}

$(window).resize(fixFooter)
fixFooter()

// 帮助中心
if ($('.qa').length) {
	const $tabs = $('.qa h3 span')
	const $tabcons = $('.qa .qa-detail')
	let $defaultTab = $('.qa h3 span.active')

	if (!$defaultTab.length) {
		$defaultTab = $tabs.eq(0)
		$defaultTab.addClass('active')
	} else if ($defaultTab.length > 1) {
		$defaultTab = $defaultTab.eq(0)
		$tabs.removeClass('active')
		$defaultTab.addClass('active')
	}

	$tabcons.eq($tabs.index($defaultTab[0])).show().css('display', 'block')

	$tabs.click(function(e) {
		e.preventDefault()
		var index = $tabs.index(this)
		$tabs.removeClass('active')
		$(this).addClass('active')
		$tabcons.hide().eq(index).show()
	})
}
