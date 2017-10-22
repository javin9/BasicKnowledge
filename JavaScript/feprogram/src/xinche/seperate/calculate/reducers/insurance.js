import {UPDATE_INSURANCE, OPEN_INSURANCE_MODAL, CLOSE_INSURANCE_MODAL} from '../actions/insurance'

const initialState = {
  // 保险总价
  total: 0,

  // 保险套餐类型
  type: 1,

  // 玻璃类型
  glassType:0,

  // 保险弹层显示控制
  open: false
}

const sources = (state = initialState, action={}) => {
  switch (action.type) {
    case UPDATE_INSURANCE:
    case OPEN_INSURANCE_MODAL:
    case CLOSE_INSURANCE_MODAL:
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}

export default sources