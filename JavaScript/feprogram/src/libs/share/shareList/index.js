import './index.scss'
import {nativeDispatch, isNative} from '../util/native'

export default function shareList(params, qrcodeCB){
	return [
      {
        className : 'wechat',
        name : '微信',
        show : isNative,
        click:(options={}) => {
          nativeDispatch('wechat', Object.assign({},params,options))
        }
      },{
        className : 'timeline',
        name : '朋友圈',
        show : isNative,
        click:(options={}) => {
          nativeDispatch('timeline',  Object.assign({},params,options))
        }
      },{
        className : isNative?'qq':'qzone',
        name : isNative?'QQ':'QQ空间',
        show : true,
        click:(options={}) => {
          const newParams =  Object.assign({},params,options)
          if(isNative){
            nativeDispatch('qq', newParams)
          }else{
            var _imageUrl = newParams.image;
            if(newParams.image.indexOf('?v')>0){
                _imageUrl = _imageUrl.split('?v')[0];
            }
            window.location.href = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${escape(newParams.url)}&title=${newParams.title}&summary=${newParams.desc}&pics=${_imageUrl}`
          }
        }
      },
      {
        className : 'qrcode',
        name : '面对面扫码',
        show : true,
        click: qrcodeCB
      },{
        className : 'weibo',
        name : '微博',
        show : true,
        click:(options={}) => {
          const newParams = Object.assign({},params,options)
          if(isNative){
            nativeDispatch('weibo', newParams)
          }else{
            window.location.href = `http://service.weibo.com/share/share.php?url=${newParams.url}&title=${newParams.title}&pic=${newParams.image}&appkey=`
          }
        }
      }
    ]
}
