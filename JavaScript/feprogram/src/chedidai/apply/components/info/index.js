import './index.scss'
import React from 'react'
import {Map} from 'immutable'
import CarReplaceModal from '../carReplaceModal'
import ComponentMobile from './componentMobile'
import ComponentName from './componentName'
import ComponentVin from './componentVin'
import ComponentCar from './componentCar'
import ComponentDate from './componentDate'
import ComponentCity from './componentCity'
import ComponentMileage from './componentMileage'
import ComponentMortgage from './componentMortgage'
import ComponentButton from './componentButton';
import check from 'libs/check';

class Info extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isComponentsDisabled:false,
      carName: this.props.car.name,
      replaceModal :false,
      params: Map({
        vin:'',
        HasMortgage: false,
        Name: props.realName,
        CarID: props.car.id,
        LicenseCityID: props.city.id,
        LicenseYear: '',
        LicenseMonth: '',
        TenThousandKilometres: '',
        ID: props.orderId
      }),
      showReplaceModal:false,
      datepickerMinYear: props.car.year,

      // 提交表单前需要校验的字段
      valid: Map({
        Name: !!props.realName,
        vin: false,
        CarID: !!props.car.id,
        LicenseYear: false,
        LicenseMonth: false,
        LicenseCityID: !!props.city.id,
        TenThousandKilometres: false
      }),

      dirty: Map({
        Name: false,
        vin: false,
        CarID: false,
        LicenseDate: false,
        LicenseCityID: false,
        TenThousandKilometres: false
      })
    }
  }

  componentWillMount(){
    $(window).trigger('progress', 'form')
  }

  changeNameHandler(value){
    // ie10/11触发change问题
    if(value !== this.state.params.get('Name')){
      this.setState({
          params: this.state.params.update('Name', () => value),
          valid: this.state.valid.update('Name',  () => check.isName(value)),
          dirty: this.state.dirty.update('Name',  () => true)
      })
    }
  }

  changeCarHandler(car){
    this.setState({
      carName: car.name,
      datepickerMinYear: car.year,
      params: this.state.params.merge({
        CarID: car.id
      }),
      valid: this.state.valid.merge({
        'CarID': !!car.id,
        'LicenseYear': this.state.params.get('LicenseYear') >= car.year
      }),
      dirty: this.state.dirty.update('CarID',  () => true)
    })
  }

  changeDateHandler(date){
    this.setState({
      params: this.state.params.merge({
        LicenseYear: date.year,
        LicenseMonth: date.month
      }),
      valid: this.state.valid.merge({LicenseYear:!!date.year, LicenseMonth:!!date.month}),
      dirty: this.state.dirty.update('LicenseDate',  () => true)
    })
  }

  changeMileageHandler(value){
    // ie10/11触发change问题
    if(value !== this.state.params.get('TenThousandKilometres')){
      this.setState({
        params: this.state.params.update('TenThousandKilometres', () => value),
        valid: this.state.valid.update('TenThousandKilometres', () => value > 0 && value <100),
        dirty: this.state.dirty.update('TenThousandKilometres',  () => true)
      })
    }
  }

  changeVinHandler(res){
    if(typeof res === 'object'){
      this.setState({
        valid: this.state.valid.update('vin', () => res.valid),
        dirty: this.state.dirty.update('vin',  () => true),
        params: this.state.params.update('vin', () => res.vin),
        carReplaceList: res.list,
        replaceModal: res.valid && res.list.length ? true : false
      })
    }else{
      this.setState({
        params: this.state.params.update('vin', () => res)
      })
    }
  }

  changeCityHandler(value){
    this.setState({
      params: this.state.params.update('LicenseCityID', () => value),
      valid: this.state.valid.update('LicenseCityID', () => !!value),
      dirty: this.state.dirty.update('LicenseCityID',  () => true)
    })
  }

  changeMortgageHandler(HasMortgage){
    if(HasMortgage && !(window.ApplyAmount === '0')) {
        this.setState({
            isComponentsDisabled:true
        })
    }else{
        this.setState({
            isComponentsDisabled:false
        })
    }
      // window.hasMortgage = HasMortgage
      this.setState({
      params: this.state.params.update('HasMortgage', () => HasMortgage)
    })
  }

  confirmReplaceCar(car){
    this.setState({
      replaceModal: false,
      carName: car.carName,
      datepickerMinYear: car.carYear,
      params: this.state.params.update('CarID', () => car.carId),
      valid: this.state.valid.merge({
        CarID: !!car.carId
      }),
      dirty: this.state.dirty.merge({
        CarID: true
      })
    })
  }

  submit(){
    $.post('/MortgageApply/UpdateOrder', this.state.params.toObject(), res =>{
      if(res.Result){
        this.context.router.replace(`report/${res.Data},${this.state.params.get('HasMortgage')}`)
      }else{
        tools.showAlert(res.Message)
      }
    }, 'json')
  }

  render () {

    const formValid = this.state.valid.reduce((res, value) => res && value)
    // const formValid = true

    return (
      <div className="component-info">
        <section>
          <h2>车主信息</h2>
          <ComponentMobile mobile={this.props.mobile} />
          <ComponentName 
            value={this.state.params.get('Name')} 
            onChange={this.changeNameHandler.bind(this)} 
            valid={!this.state.dirty.get('Name') || this.state.dirty.get('Name') && this.state.valid.get('Name')} />
        </section>
        <section>
          <h2>车辆信息</h2>
          <ComponentMortgage
              value={this.state.params.get('HasMortgage')}
              onClick={this.changeMortgageHandler.bind(this)} />

          <ComponentVin 
            value={this.state.params.get('vin')} 
            onChange={this.changeVinHandler.bind(this)} 
            valid={!this.state.dirty.get('vin') || this.state.dirty.get('vin') && this.state.valid.get('vin')}
            disabled={this.state.isComponentsDisabled} />

          <ComponentCar 
            value={this.state.params.get('CarID')} 
            text={this.state.carName} 
            onChange={this.changeCarHandler.bind(this)}  
            valid={!this.state.dirty.get('CarID') || this.state.dirty.get('CarID') && this.state.valid.get('CarID')} 
            readonly={!this.props.isProduct}
            disabled={this.state.isComponentsDisabled}/>

          <ComponentDate 
            year={this.state.params.get('LicenseYear')} 
            month={this.state.params.get('LicenseMonth')} 
            onChange={this.changeDateHandler.bind(this)}  
            valid={!this.state.dirty.get('LicenseDate') || this.state.dirty.get('LicenseDate') && this.state.valid.get('LicenseYear') && this.state.valid.get('LicenseMonth')} 
            minYear={this.state.datepickerMinYear}
            disabled={this.state.isComponentsDisabled}/>

          <ComponentCity 
            value={this.state.params.get('LicenseCityID')} 
            onChange={this.changeCityHandler.bind(this)} 
            valid={!this.state.dirty.get('LicenseCityID') || this.state.dirty.get('LicenseCityID') && this.state.valid.get('LicenseCityID')} 
            text={this.props.city.name}
            disabled={this.state.isComponentsDisabled}/>

          <ComponentMileage 
            value={this.state.params.get('TenThousandKilometres')} 
            onChange={this.changeMileageHandler.bind(this)}  
            valid={!this.state.dirty.get('TenThousandKilometres') || this.state.dirty.get('TenThousandKilometres') && this.state.valid.get('TenThousandKilometres')}
            disabled={this.state.isComponentsDisabled} />
        </section>

        <ComponentButton 
          disabled={!formValid || this.state.isComponentsDisabled}
          text={this.state.isComponentsDisabled?'已抵押车辆不可贷款':(this.props.isProduct ? '获取贷款额度' : '查看评估报告')}
          description="评估结果由精真估提供，我们会以短信形式发送给您" 
          onClick={this.submit.bind(this)} />

        {this.state.replaceModal ? 
          <CarReplaceModal 
            list={this.state.carReplaceList} 
            vin={this.state.params.get('vin')} 
            onClose={()=>this.setState({replaceModal: false})} 
            confirm={this.confirmReplaceCar.bind(this)} 
            carName={this.state.carName} />
          : <span></span>}
      </div>
    )
  }
}

Info.contextTypes = {
  router: React.PropTypes.object
}

export default Info