const initialState = {

  tax: [
    {value : 1, label: '年费率', values: [0, 4, 8, 12, 15, 18], tip:'已为您推荐市场平均车贷费率'},
    {value : 2, label: '年利率', values: [0, 7.3, 14.7, 22.0, 27.5, 33.0], tip:'已为您推荐市场平均车贷利率'}
  ],

  // 排量档位对应税费
  cc : [
    {value: 300, label: '¥ 300 (1.0L(含)以下)'},
    {value: 420, label: '¥ 420 (1.0-1.6L(含)以下)'},
    {value: 480, label: '¥ 480 (1.6-2.0L(含)以下)'},
    {value: 900, label: '¥ 900 (2.0-2.5L(含)以下)'},
    {value: 1920, label: '¥ 1,920 (2.5-3.0L(含)以下)'},
    {value: 3480, label: '¥ 3,480 (3.0-4.0L(含)以下)'},
    {value: 5280, label: '¥ 5,280 (4.0L)'}
  ],

  // 小于6座 => 950
  // 大于6座 => 1100
  seat : [
    {value: 950, label: '¥ 950 (家用6座以下)'},
    {value: 1100, label: '¥ 1,100 (家用6座及以上)'}
  ],

  // 首付选项
  payment: [
    {value: 0, label: '0%'},
    {value: 10, label: '10%'},
    {value: 20, label: '20%'},
    {value: 30, label: '30%'},
    {value: 40, label: '40%'},
    {value: 50, label: '50%'},
    {value: 60, label: '60%'},
    {value: 70, label: '70%'}
  ],

  // 期限选项
  terms: [
    {value: 12, label: '1年'},
    {value: 24, label: '2年'},
    {value: 36, label: '3年'},
    {value: 48, label: '4年'},
    {value: 60, label: '5年'}
  ]
}

const options = (state = initialState, action={}) => {
  switch (action.type) {
    default:
      return state
  }
}

export default options