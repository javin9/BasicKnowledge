import React from 'react'

export default function Mobile(props){

	const middleStyle = {
		display: 'inline-block',
		verticalAlign:'middle'
	}

	const warningStyle = Object.assign({}, middleStyle, {marginLeft: '40px', position: 'relative', 'top': '-1px'})

	const textStyle = {
		position: 'relative',
		top: '-1px'
	}

  return (
    <div className="form-item">
      <label>手机号</label>
      <div className="content" style={middleStyle}>
        <span style={middleStyle}>{props.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2')}</span>
        <i className="warning valid" style={warningStyle}><span style={textStyle}>已完成验证</span></i>
      </div>
    </div>
    )
}