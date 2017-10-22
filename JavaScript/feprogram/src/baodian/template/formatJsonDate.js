import moment from 'moment'

module.exports = text => {
    if(text){
      var date = new Date(parseInt(text.replace("/Date(", "").replace(")/", ""), 10))
      text = moment(date).format('YYYY-MM-DD')
    }
    return text
  }