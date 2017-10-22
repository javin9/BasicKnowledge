import './index.scss'
import React from 'react'

export default function Pagination(props){
	const pageTotal = Math.ceil(props.total/props.size)
	return (
		<div className="component-pagination">
			<div className="component-pagination-left">
				{
					props.current === 1 ? <a href="javascript:void(0)" className="component-pagination-prev disabled"></a> 
														 : <a href="javascript:void(0)" className="component-pagination-prev"  onClick={()=> props.onChange(props.current-1)}></a>
				}
				{
					props.current === pageTotal ? <a href="javascript:void(0)" className="component-pagination-next disabled"></a> 
														 					: <a href="javascript:void(0)" className="component-pagination-next"  onClick={()=> props.onChange(props.current+1)}></a>
				}
			</div>
			<div className="component-pagination-right"><strong>{props.current}</strong>{`/${pageTotal}`}</div>
		</div>
		)
}