import moment from 'moment'

module.exports = text => {
    if(text){
      var date = new Date(text)
      text = moment(date).format('YYYY-MM-DD')
    }
    return text
  }