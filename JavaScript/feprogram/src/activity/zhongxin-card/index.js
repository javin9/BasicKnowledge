import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import App from './views/app'
import Index from './views/index'
import Success from './views/success'

ReactDOM.render((
	  <Router>
	    <Route path="/" component={App}>
		    <IndexRoute component={Index} />
	      <Route path="success" component={Success} />
	    </Route>
	  </Router>
), document.getElementById('app'))
