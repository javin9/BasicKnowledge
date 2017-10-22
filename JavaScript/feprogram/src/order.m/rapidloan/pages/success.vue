<template>
    <component-header title="提交成功"></component-header>
    <div id="success" class="rap-success">
        <div class="rap-success-box">
            <div class="ok_bg"></div>
            <div class="tit">订单提交成功！</div>
            <div class="txt">我们会尽快联系您，请保持电话畅通！</div>
        </div>
        <div class="bg_fff">
            <a class="upload-box" v-bind:href="onlineapprovalurl" v-if="isonlineapprovalshow">
                <div class="l">
                    <p class="tit">在线上传资料</p>
                    <p class="txt">加快审批速度、提高通过率</p>
                </div>
                <div class="btn"><span class="red_btn">去上传</span></div>
            </a>
            <a v-bind:href="orderdetailurl" class="view-order"><span>查看订单</span><i class="tip-r"></i></a>
        </div>

        <div class="prodcut-list" v-if="isprodcutlist">
            <div class="title-info">已为您申请了以下金融产品</div>
            <ul class="prodcut-list-ul">
                <li>
                    <div class="logo"><img v-bind:src="prodcut.CompanyLogoUrl"></div>
                    <div class="conter-info">
                        <div class="top">
                            <div class="tit"><div v-text="prodcut.PackageNameCompanyName">易鑫包商联合贷(有氧金易鑫包商联合贷有氧金易鑫包商联合贷)</div></div>
                            <a v-bind:href="prodcut.AdviserCN400ExTen" v-if="isshowadvisercn">
                                <div class="tel"></div>
                                <div class="name">电话咨询</div>
                            </a>
                        </div>
                        <div class="application" v-html="prodcut.CommonRequirementType">申请信息：<span class="red">宽松</span></div>
                        <div class="info-txt" v-html="prodcut.CommentScoreCount"><span class="red">5.0</span>分／36条评论  4833人申请</div>
                        <div class="tag" v-html="prodcut.icon">
                            <span class="blue">在线秒批</span>
                            <span class="gren">仅身份证</span>
                        </div>
                        <!--<div class="info-ul-dev" v-html="prodcut.TotalCostText"></div>-->
                    </div>
                </li>
            </ul>
        </div>

    </div>
    <component-footer></component-footer>
</template>


<script>
    import Header from 'libs/header'
    import Footer from 'libs/vue-components/footer'
    export default {
        props:['source','channel','from','isonlineapproval','onlineapprovalurl','onlineapprovalurl','orderdetailurl','getrecproductinfourl'],
        data () {
            return {
                isprodcutlist:false,
                isonlineapprovalshow:false,
                prodcut:{},
                isshowadvisercn:false,
            }
        },
        computed:{

            cityValid(){
                return this.cityid
            },

        },
        methods:{
            coupons(){

            },

        },

        ready(){
            if (this.isonlineapproval==='false'){
                this.isonlineapprovalshow=false;
            }else {
                this.isonlineapprovalshow=true;
            }
            if (!this.isshowbottom){
                $('.escdk13').hide();
            }
            const params={}
            this.$http.get(this.getrecproductinfourl, params, {emulateJSON:true}).then(response => response.json().then(res => {
                let _self=this
                if(dev){
                    res.Data = {
                        recProductInfo: {},
                        Adviser: {},
                        CommentCount:1
                    }
                }
                if (res.Result){
                    _self.isprodcutlist=true;
                    let data=res.Data.recProductInfo,Adviser=res.Data.Adviser
                    _self.prodcut.CompanyLogoUrl=data.CompanyLogoUrl
                    _self.prodcut.PackageNameCompanyName = data.PackageName+'('+data.CompanyName+')'//标题
                    if (data.CommonRequirementType===1){
                        _self.prodcut.CommonRequirementType='申请信息：<span class="red">严格</span>'
                    }else if (data.CommonRequirementType===2){
                        _self.prodcut.CommonRequirementType='申请信息：<span class="blue">一般</span>'
                    }else if (data.CommonRequirementType===3){
                        _self.prodcut.CommonRequirementType='申请信息：<span class="green">宽松</span>'
                    }
                    if (data.CommentScore===0){
                        _self.prodcut.CommentScore=''
                    }else {
                        _self.prodcut.CommentScore = '<span class="red">'+data.CommentScore+'</span>分'
                    }
                    if (data.CommentCount===0){
                        _self.prodcut.CommentCount='暂无评价'
                    }else {
                        _self.prodcut.CommentCount = '&nbsp;/&nbsp;'+data.CommentCount+'条评论&nbsp;&nbsp;'
                    }
                    _self.prodcut.CommentScoreCount = _self.prodcut.CommentScore +_self.prodcut.CommentCount
                    _self.prodcut.AdviserCN400ExTen=''
                    if (Adviser){
                        _self.prodcut.AdviserCN400ExTen='tel:'+Adviser.CN400+','+Adviser.ExTen;
                        _self.isshowadvisercn=true
                    }else {
                        _self.isshowadvisercn=false
                    }

                    if (data.PackageFeatureIcon1){
                        _self.prodcut.icon='<span class="blue">'+data.PackageFeatureIcon1+'</span>'
                    }
                    if (data.PackageFeatureIcon2){
                        _self.prodcut.icon=_self.prodcut.icon+'<span class="gren">'+data.PackageFeatureIcon2+'</span>'
                    }

                }else {
                    tools.showAlert(res.Message)
                }
            }))

        },

        components: {
            'component-header': Header,
            'component-footer': Footer,
        }
    }
</script>