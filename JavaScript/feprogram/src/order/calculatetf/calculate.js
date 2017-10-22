import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, IndexRedirect } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import App from './views/App'
import Loan from './views/Loan'

const routerTabs = ['loan']
const indexTab = `/${routerTabs[initData.tab]}`

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render((
	<Provider store={store}>
	  <Router>
	    <Route path="/" component={App}>
		    <IndexRedirect to={indexTab} />
	      <Route path={routerTabs[0]} component={Loan} />
	    </Route>
	  </Router>
  </Provider>
), document.getElementById('root'))


