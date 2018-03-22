import React, {
	Component
} from 'react';

class Clickcounter extends Component {
	constructor(props) {
		super(props);
		this.number = {
			count: 1
		};
		this.tapButton = this.tapButton.bind(this);
	}
	tapButton() {
		console.log(this.number)
		var count = this.number.count++;
		this.setState({
			count: count
		});
	}

	render() {
		return (
			<div>
               <div><button onClick={this.tapButton}>点击按钮</button></div>
               
               <div>{this.number.count}</div>
            </div>
		);
	}
}

export default Clickcounter;