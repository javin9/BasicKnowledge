import { combineReducers } from 'redux'
import sources from './sources'
import options from './options'
import insurance from './insurance'
import result from './result'
import tips from './tips'

const reducers = combineReducers({
  sources,
  options,
  insurance,
  result,
  tips
})

export default reducers