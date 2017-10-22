import './index.scss'
import React from 'react'
import Header from '../../components/header'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount(){
  }

  render () {
    return (
      <div className="app-wrapper" style={{'minHeight' : $(window).height()-100}}>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

export default App