import './index.scss'
import React from 'react'

export default function Recommend(props){

  return (
    <div className="component-recommend">
    <h6><span>推荐好友成功办理 “万元开走，月付低至666元”产品</span></h6>
    <ul>
    <li><i>&bull;</i>推荐人获得2张月付抵用奖励，每张价值<strong>666元 </strong></li>
    <li><i>&bull;</i>被推荐人获得1张月付抵用奖励，每张价值<strong>666元 </strong></li>
    </ul>
    <a href="javascript:void(0)" onClick={props.onClick}>我要推荐</a>
    </div>
    )
}