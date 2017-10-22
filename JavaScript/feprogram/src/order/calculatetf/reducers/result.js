import {ADD_USER_TELNUMBER} from '../actions/result'

const initialState = {
  usertel:{initial:false}
}

const result = (state = initialState, action={}) => {
  switch (action.type) {
    case ADD_USER_TELNUMBER:
      if(action.payload.Result){
        return Object.assign({}, state, {usertel: {...action.payload, initial:true}})  
      }else {
        tools.showAlert(action.payload.Message)
        return state
      }
    default:
      return state
  }
}

export default result