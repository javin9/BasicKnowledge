import React, {PropTypes} from 'react'
import Banner from '../../components/banner'
import Recommend from '../../components/recommend'
import Rule from '../../components/rule'
import FormModal from '../../components/form-modal'

class ViewIndex extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showFormModal : false
    }
  }

  componentWillMount(){
  }

  /**
   * 打开表单弹层
   */
  openFormModal(){
    this.setState({
      showFormModal: true
    })
    $('#maskLayer').show()
  }

  /**
   * 关闭表单弹层
   */
  closeFormModal(){
    this.setState({
      showFormModal: false
    })
    $('#maskLayer').hide()
  }

  /**
   * 表单提交
   */
  submit(){
    this.context.router.pushState(null, '/success')
  }

  render () {
    return (
      <div>
        <Banner />
        <Recommend onClick={this.openFormModal.bind(this)}/>
        <Rule />
        <FormModal show={this.state.showFormModal} submit={this.submit.bind(this)} close={this.closeFormModal.bind(this)}/>
      </div>
    )
  }
}

ViewIndex.contextTypes = {
  router : PropTypes.object
}

export default ViewIndex