import './index.scss'
import React from 'react'

export default function reportHeader(props){

  return (
    <header className="component-report-header">
      <h2>{props.carName}</h2>
      <p>
        <label>新车价：</label>
        <span>{`¥${props.price || '--'}`}</span>
      </p>
      <aside>
        <span>{`${props.licenseYear || '--'}年${props.licenseMonth || '--'}月上牌`}</span>
        <span>{`${props.mileage || '--'}万公里`}</span>
        <span>{props.city || '--'}</span>
      </aside>
    </header>
    )
}