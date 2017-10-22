import React from 'react'

export default function mask(props){
	const style={
		'position':' fixed',
		'width':'100%',
		'height':'100%',
		'left':'0',
		'top':'0',
		'background':'#000',
		'opacity':'0.4',
		'zIndex': 999,
        'filter':'alpha(opacity=40)'
	}

  return <div style={style}></div>
}