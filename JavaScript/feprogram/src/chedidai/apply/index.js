import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, IndexRedirect } from 'react-router'
import App from './views/app'
import Info from './views/info'
import Report from './views/report'

const pageOriginTitle = document.title

/**
 * header展示进度事件
 * @param  {String} type
 */
$(window).on('progress', (e, type) => {
	const $header = $('#Header')
	if(!$header.find('.progress').length){
		$header.find('.header-bottom').append('<div class="progress"></div>')
	}
	$header.attr('data-step', type)

	// 切换路由更改title
	if(type === 'report'){
		document.title = '生成评估报告'
	}else{
		document.title = pageOriginTitle
	}
})

ReactDOM.render((
	  <Router>
	    <Route path="/" component={App}>
		    <IndexRedirect to="info" />
	      <Route path="info" component={Info} />
	      <Route path="report/:id" component={Report} />
	    </Route>
	  </Router>
), document.getElementById('app'))
