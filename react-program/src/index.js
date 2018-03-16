import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Clickcounter from './Clickcounter.js'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Clickcounter />, document.getElementById("counterId"));
registerServiceWorker();