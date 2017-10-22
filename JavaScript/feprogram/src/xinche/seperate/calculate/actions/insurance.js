export const UPDATE_INSURANCE = 'UPDATE_INSURANCE'
export const OPEN_INSURANCE_MODAL = 'OPEN_INSURANCE_MODAL'
export const CLOSE_INSURANCE_MODAL = 'CLOSE_INSURANCE_MODAL'

export function updateInsurance(data) {
  return {
    type: UPDATE_INSURANCE,
    payload:data
  }
}

export function openInsuranceModal(){
	return {
    type: OPEN_INSURANCE_MODAL,
    payload: {
    	open: true
    }
  }
}

export function closeInsuranceModal(){
	return {
    type: CLOSE_INSURANCE_MODAL,
    payload: {
    	open: false
    }
  }
}