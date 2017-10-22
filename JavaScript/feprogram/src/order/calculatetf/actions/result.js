export const ADD_USER_TELNUMBER = 'ADD_USER_TELNUMBER'

export function addUserTelnumber(dispatch, data) {
  $.post(order_creating_url, data).success(res => {
    res.extendsData = data.extendsData;
    dispatch({type:ADD_USER_TELNUMBER, payload: res})
  })
}