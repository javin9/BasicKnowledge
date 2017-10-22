import {GET_SOURCES_INFO, RESET_SOURCES_INFO, UPDATE_SEAT, UPDATE_CC, UPDATE_PLATE, UPDATE_CAR, UPDATE_PRICE, UPDATE_CITY, /*UPDATE_FINAL_RATE, */UPDATE_PAYMENT, UPDATE_TERM, UPDATE_TAX} from '../actions/sources'
import {getCC, validatorFinalRate} from '../util'
import options from './options'

const initialState = {

  car: {
    id: initData.carId,
    name: '',
    spell:''
  },

  city: initData.city,

  // 贷款期限
  term:36,

  // 尾款比例
  // finalrate: 0,

  tax: {
    type: 1,
    value:12
  },

  // 首付比例
  payment: 30,

  // 车价
  price: 0,

  // 上牌费
  plate: 500

}

const sources = (state = initialState, action={}) => {
  switch (action.type) {
    case GET_SOURCES_INFO:
      if(action.payload.Result){
        const data = action.payload.Data
        const nextState = {
          price: +data.CarPrice.CarPriceText * 10000,
          car: {
            id:data.CarBaseInfo.CarId,
            name: `${data.CarBaseInfo.CarBrandName} -  ${data.CarBaseInfo.CarSerialName} - ${data.CarBaseInfo.CarName}`,
            spell: data.CarBaseInfo.CarSerialAllSpell
          },
          cc: options().cc[getCC(data.CarExtendInfo.EngineDisplacement)].value,
          seat: options().seat[data.CarExtendInfo.SeatNumber < 6 ? 0 : 1].value
        }
        return Object.assign({}, state, nextState)
      }else{
        return state
      }
    case RESET_SOURCES_INFO:
      return Object.assign({}, initialState, action.payload)
    case UPDATE_SEAT:
    case UPDATE_CC:
    case UPDATE_PLATE:
    case UPDATE_CAR:
    case UPDATE_PRICE:
    case UPDATE_CITY:
    // case UPDATE_FINAL_RATE:
    case UPDATE_TERM:
      return Object.assign({}, state, action.payload)
    case UPDATE_PAYMENT:
      const {valid, correct} = validatorFinalRate(action.payload.payment, state.finalrate)
      const nextState = {}
      if (!valid){
        nextState.finalrate = correct
      }
      return Object.assign({}, state, action.payload, nextState)
    case UPDATE_TAX:
      return Object.assign({}, state, {tax: {...state.tax, ...action.payload.tax}})
    default:
      return state
  }
}

export default sources