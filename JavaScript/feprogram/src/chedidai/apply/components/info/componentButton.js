import React from 'react'

export default function Button(props){



	const buttonStyle = {
		'color':'#fff',
		'background': props.disabled ? '#C4C4C4': '#E9474D',
		'borderRadius':'3px',
		'border':'0',
		'lineHeight': '40px',
		'width': '320px',
		'textAlign': 'center',
		'marginBottom': '10px',
		'marginLeft': '130px',
		'outline':'none',
		'fontSize':'18px',
		'cursor': props.disabled ? 'default' : 'pointer'
	}

	const descStyle = {
		'fontSize': '14px',
		'color': '#666',
		'width': '320px',
		'textAlign': 'center',
		'whiteSpace': 'nowrap',
		'marginLeft': '130px'
	}

  return (
  	<div>
	    <button onClick={props.disabled ? () => {} : props.onClick} style={buttonStyle}>{props.text}</button>
	    <p style={descStyle}>{props.description}</p>
    </div>
    )
}