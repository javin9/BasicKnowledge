import './index.scss'
import React from 'react'
import ResultLoan from './loan'

export default class Result extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {

    let Result

    switch(this.props.type){
      case 'loan':
        Result = <ResultLoan data={this.props.data}/>
        break
    }

    return (
      <div className="Result">
          {Result}
      </div>
    )
  }
}