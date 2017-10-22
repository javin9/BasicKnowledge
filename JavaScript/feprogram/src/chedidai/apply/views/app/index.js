import './index.scss'
import React from 'react'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount(){
  }

  render () {
    return (
      <div className="main">{this.props.children}</div>
    )
  }
}

export default App