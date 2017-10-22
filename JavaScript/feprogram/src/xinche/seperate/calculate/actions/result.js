export const UPDATE_RESULT_FULL = 'UPDATE_RESULT_FULL'
export const UPDATE_RESULT_LOAN = 'UPDATE_RESULT_LOAN'

export function updateResultFull(data) {
  return {
    type: UPDATE_RESULT_FULL,
    payload:data
  }
}

export function updateResultLoan(data) {
  return {
    type: UPDATE_RESULT_LOAN,
    payload:data
  }
}