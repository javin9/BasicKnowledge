export const GET_SOURCES_INFO = 'GET_SOURCES_INFO'
export const RESET_SOURCES_INFO = 'RESET_SOURCES_INFO'
export const UPDATE_SEAT = 'UPDATE_SEAT'
export const UPDATE_CC = 'UPDATE_CC'
export const UPDATE_CAR = 'UPDATE_CAR'
export const UPDATE_PRICE = 'UPDATE_PRICE'
export const UPDATE_CITY = 'UPDATE_CITY'
export const UPDATE_PLATE = 'UPDATE_PLATE'
// export const UPDATE_FINAL_RATE = 'UPDATE_FINAL_RATE'
export const UPDATE_PAYMENT = 'UPDATE_PAYMENT'
export const UPDATE_TERM = 'UPDATE_TERM'
export const UPDATE_TAX = 'UPDATE_TAX'

export function getSourcesInfo(dispatch, carId, cityId) {
  $.getJSON('/BuycarCalculator/GetCarInfo', {cityId, carId}).success(res => dispatch({type:GET_SOURCES_INFO, payload: res}))
}

export function resetSourcesInfo() {
  return {
    type: RESET_SOURCES_INFO,
    payload:{
      car: {
        id: '',
        name: ''
      }
    }
  }
}

export function updateSeat(value) {
  return {
    type: UPDATE_SEAT,
    payload:{
      seat: value
    }
  }
}

export function updateCC(value) {
  return {
    type: UPDATE_CC,
    payload:{
      cc: value
    }
  }
}

export function updateCar(car) {
  return {
    type: UPDATE_CAR,
    payload:{
      car: car
    }
  }
}

export function updatePrice(value) {
  return {
    type: UPDATE_PRICE,
    payload:{
      price: +value
    }
  }
}

export function updateCity(city) {
  return {
    type: UPDATE_CITY,
    payload:{
      city: city
    }
  }
}

export function updatePlate(value) {
  return {
    type: UPDATE_PLATE,
    payload:{
      plate: +value
    }
  }
}

// export function updateFinalRate(value) {
//   return {
//     type: UPDATE_FINAL_RATE,
//     payload:{
//       finalrate: +value
//     }
//   }
// }

export function updatePayment(value) {
  return {
    type: UPDATE_PAYMENT,
    payload:{
      payment: value
    }
  }
}

export function updateTerm(value) {
  return {
    type: UPDATE_TERM,
    payload:{
      term: value
    }
  }
}

export function updateTax(value) {
  return {
    type: UPDATE_TAX,
    payload:{
      tax: value
    }
  }
}