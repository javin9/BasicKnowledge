import React from 'react'
import Loading from './componentLoading'

class Vin extends React.Component {
  constructor (props) {
    super(props)

    this.api = '/MortgageApply/GetCarsInfoByVin'

    this.supportFileReader = !!window.FileReader

    this.state = {
      tip: false,
      loading:false,
      list: [],
      focused: false
    }
  }

  onChange(){
    if(this.props.value){
      $.post(this.api, {Vin: this.props.value, type: 1}, this.changeCallback.bind(this), 'json')
    }
  }

  onBlur(){
    this.onChange()
    this.setState({focused: false})
  }

  selectFileHandler(){
    const file = document.getElementById('file').files[0]
    const reader = new FileReader()


    reader.onload = e => {
      this.setState({loading:true})
      $.post(this.api, {'imgExtension': file.name.split('.').pop(), 'vin': e.target.result, type: 2}, this.changeCallback.bind(this), 'json')
    }

    reader.readAsDataURL(file)
  }

  changeCallback(res){
    this.setState({loading:false})
    this.props.onChange({
      valid: res.Result,
      vin: res.Result ? res.Data.VehicleLicense.VIN : this.props.value,
      list: res.Result ? res.Data.StyleList : []
    })
  }

  render () {
    const uploaderStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      width: '100px',
      whiteSpace:'nowrap'
    }

    const linkStyle = {
      color: this.props.disabled?'#c4c4c4':'#3385FF',
      cursor: this.props.disabled?'default':'pointer'
    }

    const spanStyle = {
      margin: '0 6px 0 10px'
    }

    const inputStyle = {
      width:0,
      height:0,
      overflow: 'hidden',
      padding: 0
    }

    const valid = this.props.valid || this.state.focused
    const clsName ='form-item' + (valid ?'': ' form-item-error') + (this.props.disabled?" disabled":"");
    return (
    	<div className={clsName}>
        <label><i>VIN(车架号)</i>
        {
          this.props.disabled?
          <em><div className="hover-tip" style={{display:'none'}}></div></em>:
          <em onMouseOver={()=>this.setState({tip:true})} onMouseOut={()=>this.setState({tip:false})}><div className="hover-tip" style={{display: this.state.tip ? 'block' : 'none'}}></div></em>
        }</label>
        <div className="content">
          <input type="text" placeholder="请输入VIN码" disabled={this.props.disabled} value={this.props.value} onChange={e=>this.props.onChange(e.target.value)} onBlur={this.onBlur.bind(this)} maxLength="17" onFocus={()=>this.setState({focused:true})}/>
          {
            this.supportFileReader ? (
            <div style={uploaderStyle}>
              <span style={spanStyle}>或</span><a href="javascript:void(0)" onClick={() =>{
                  if(!this.props.disabled){
                      $('#file').click()
                  }
                }
              }  style={linkStyle}>上传照片</a>
              <input type="file" accept="image/png, image/jpeg, image/tif, image/bmp" id="file" onChange={this.selectFileHandler.bind(this)} style={inputStyle}/>
              </div> ): <span></span>
          }
          {
            valid ? '' : <i className="warning" style={{marginLeft:'8px'}}>请输入正确的VIN码</i>
          }
        </div>
        {
          this.state.loading ? <Loading text="图像识别中..."></Loading> : ''
        }
      </div>
    )
  }
}

export default Vin