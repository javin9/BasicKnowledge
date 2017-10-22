import {UPDATE_RESULT_FULL, UPDATE_RESULT_LOAN} from '../actions/result'

const initialState = {
  full: {initial:false},
  loan:{initial:false}
}

const result = (state = initialState, action={}) => {
  switch (action.type) {
    case UPDATE_RESULT_FULL:
      return Object.assign({}, state, {full: {...action.payload, initial:true}})
    case UPDATE_RESULT_LOAN:
      return Object.assign({}, state, {loan: {...action.payload, initial:true}})
    default:
      return state
  }
}

export default result