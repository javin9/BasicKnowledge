import './index.scss'
import React from 'react'
import ResultFull from './full'
import ResultLoan from './loan'

export default class Result extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {

    let Result

    switch(this.props.type){
      case 'full' : 
        Result = <ResultFull data={this.props.data}/>
        break
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