<template>
    <div class="page-body" :class="{'editable': editable}">
        <vue-header header-title="上传身份证件" :prevent-back="true"></vue-header>

        <h1 class="head1">请上传<em v-text="userName"></em>的身份证正反面照片</h1>
        <ul class="id-wrapper">
            <li class="front" @click.self="camera(0)">
                <div class="photo" v-if="idPhotos[0].src">
                    <div :style="{backgroundImage: 'url(' + idPhotos[0].src + ')'}" @click="uploadmenu(0)" v-show="idPhotos[0].ready"></div>
                    <div class="loading" v-show="!idPhotos[0].ready"></div>
                </div>
            </li>
            <li class="back" @click.self="camera(1)">
                <div class="photo" v-if="idPhotos[1].src">
                    <div :style="{backgroundImage: 'url(' + idPhotos[1].src + ')'}" @click="uploadmenu(1)" v-show="idPhotos[1].ready"></div>
                    <div class="loading" v-show="!idPhotos[1].ready"></div>
                </div>
            </li>
        </ul>
        <div id="uploader-wrapper">
            <input type="file" accept="image/*" capture="camera" name="uploader" id="uploader" @change="uploading($event)" />
        </div>

        <h2 class="head2">拍摄照片要求<span class="help-btn" @click="upoaldHelp"></span></h2>
        <ul class="id-illustration">
            <li>
                <div class="image"></div>
                <div class="text">
                    <span class="right">标准拍摄</span>
                </div>
            </li>
            <li>
                <div class="image"></div>
                <div class="text">
                    <span class="wrong">边框缺失</span>
                </div>
            </li>
            <li>
                <div class="image"></div>
                <div class="text">
                    <span class="wrong">照片模糊</span>
                </div>
            </li>
            <li>
                <div class="image"></div>
                <div class="text">
                    <span class="wrong">闪光强烈</span>
                </div>
            </li>
        </ul>

        <menu :items="menuParam.items" :show="menuParam.show"></menu>
        <vue-alert :content="alertParam.content" :btns="alertParam.btns" :after-close="alertParam.afterClose" :loading="alertParam.loading" :show="alertParam.show"></vue-alert>

        <div class="submit-btn" :class="{'active': submitReady}" @click="submit" v-if="editable">确认上传</div>
    </div>
</template>
<style>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    $red: map-get($colors, red);
    $gold: map-get($colors, gold);
    $green: #00CC99;
    $yellow: #FFC957;
    $gray: #DCDCDC;


    .head1 {
      margin: px2rem(30) 0;
      @include fsize(30);
      line-height: px2rem(46);
      text-align: center;
      color: #333333;;

      em {
        font-style: normal;
        color: $red;
        padding: 0 0.3em;
      }
    }

    .id-wrapper {
      width: px2rem(500);
      margin: 0 auto;

      li {
        position: relative;
        height: px2rem(320);
        margin-bottom: px2rem(30);
        border-radius: px2rem(6);
        overflow: hidden;

        &.front {
          background: url(images/front.png) no-repeat center center;
          background-size: cover;
        }

        &.back {
          background: url(images/back.png) no-repeat center center;
          background-size: cover;
        }

        .photo {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          text-align: center;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
          background-color: #e5e5e5;

          div {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              text-align: center;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;

              &.loading {
                background-image: url(images/loading80-grey.gif);
                background-size: px2rem(50) auto;
              }
          }
        }
      }
    }

    .head2 {
        position: relative;
        width: 6.4em;
        height: px2rem(46);
        padding-right: px2rem(40);
        margin: px2rem(20) auto px2rem(30);
        @include fsize(30);
        line-height: px2rem(46);
        text-align: center;
        color: #333333;

        &:before {
        content: '';
        position: absolute;
        left: px2rem(-160);
        top: 50%;
        width: px2rem(140);
        border-top: 1px solid #e5e5e5;
        }

        &:after {
        content: '';
        position: absolute;
        right: px2rem(-160);
        top: 50%;
        width: px2rem(140);
        border-top: 1px solid #e5e5e5;
        }

        .help-btn {
          position: absolute;
          top: px2rem(-3);
          right: px2rem(-10);
          width: px2rem(50);
          height: px2rem(50);
          background: url(images/help.png) no-repeat center center;
          background-size: px2rem(36) auto;
        }
    }

    .id-illustration {
      // margin-bottom: px2rem(50);
      // margin-bottom: px2rem(148);
      overflow: hidden;

      li {
        float: left;
        width: px2rem(150);
        margin-left: px2rem(30);
        text-align: center;

        .image {
          height: px2rem(100);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
        }

        &:nth-child(1) .image {
          background-image: url(images/id01.png);
        }
        &:nth-child(2) .image {
          background-image: url(images/id02.png);
        }
        &:nth-child(3) .image {
          background-image: url(images/id03.png);
        }
        &:nth-child(4) .image {
          background-image: url(images/id04.png);
        }

        .text {
          margin-top: px2rem(20);
          @include fsize(24);
          line-height: px2rem(36);
          color: #666666;

          span {
            display: inline-block;
            padding-left: px2rem(30);
            background-repeat: no-repeat;
            background-position: left center;
            background-size: px2rem(20) auto;

            &.right {
              background-image: url(images/right.png);
            }
            &.wrong {
              background-image: url(images/wrong.png);
            }
          }
        }
      }
    }

    html, body {
      height: 100%;
    }
    .page-body {
      box-sizing: border-box;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding-bottom: px2rem(50);
      min-height: 100%;
      background: #FFFFFF;

      &.editable {
        padding-bottom: px2rem(148);
      }
    }

    .submit-btn {
      position: fixed;
      z-index: 100;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      height: px2rem(98);
      text-align: center;
      @include fsize(32);
      line-height: px2rem(98);
      color: #FFFFFF;
      background: #d2d2d2;

      &.active {
        background: $red;
      }
    }

    #uploader {
      position: absolute;
      left: -100px;
      top: -100px;
      width: 0;
      height: 0;
      visibility: hidden;
    }

    .bottom-to-top {
      display: none !important;
    }

    .vue-alert .uploading {
        display: inline-block;
        padding-left: px2rem(50);
        background: url(images/loading80.gif) no-repeat left center;
        background-size: px2rem(40) auto;
    }

    /* always present */
    .fade-transition {
      transition: all .3s ease;
    }
    /* .expand-enter defines the starting state for entering */
    /* .expand-leave defines the ending state for leaving */
    .fade-enter, .fade-leave {
      opacity: 0;
    }
</style>
<script>
    import vueHeader from '../components/vueHeader/vueHeader.vue'
    import menu from '../components/menu/menu.vue'
    import vueAlert from '../components/vueAlert/vueAlert.vue'
    import lzy from '../components/localResizeIMG/lrz.all.bundle'

    export default{
        props: ['userName', 'idPhotos', 'helpText', 'submitUrl', 'fileReady', 'editable'],
        data() {
            var _this = this;
            return {
                // 深克隆idPhotos
                originIdPhotos: function() {
                    var copy = [], obj;
                    for (var i = 0; i < _this.idPhotos.length; i++) {
                        obj = {};
                        for (var j in _this.idPhotos[i]) {
                            obj[j] = _this.idPhotos[i][j];
                        }
                        copy.push(obj);
                    }
                    return copy;
                }(),
                menuParam: {
                    items: [],
                    show: false
                },
                alertParam: {
                    content: '',
                    btns: [],
                    afterClose: function() {},
                    show: false,
                    loading: false
                },
                // 在编辑的图片，front 或 back
                editing: null,
                // 是否可提交
                submitReady: false, //_this.fileReady && _this.helpText.isUnconfirmed,  // always false
                // 旧数据（当前订单该数据没有）
                isOld: _this.helpText.isOld,
                // 订单是否是未确认状态(仅提交src,不提交id src混合)
                isUnconfirmed: _this.helpText.isUnconfirmed,
                // 提交中状态
                submiting: false,
                // 是否编辑过（有变化可退有提示）
                edited: false,
                reallyFileReady: _this.fileReady
            }
        },
        computed: {
        },
        watch: {
            fileReady() {
                if (this.fileReady) {
                    var copy = [], obj;
                    for (var i = 0; i < this.idPhotos.length; i++) {
                        obj = {};
                        for (var j in this.idPhotos[i]) {
                            obj[j] = this.idPhotos[i][j];
                        }
                        copy.push(obj);
                    }

                    this.originIdPhotos = copy;
//                    console.log(this.originIdPhotos);
                    this.reallyFileReady = true; // todo: bad
                    this.checkEdit();
                }
            },
            idPhotos() {
                if (this.reallyFileReady) {
                    this.checkEdit();
                }
            }
        },
        components: {
            'vue-header': vueHeader,
            'menu': menu,
            'vue-alert': vueAlert
        },
        events:{
            'menu.close': function() {
                this.menuParam.show = false;
            },
            'menu.itemclick': function(index, event) {
                this.menuParam.show = false;
            },
            'header.back': function() {
                if (this.edited) {
                    // 显示弹层
                    this.showAlert({
                        content: '您有资料尚未提交，确认返回吗？',
                        btns: [{
                            text: '取消',
                            className: 'cancel',
                            todo: this.closeAlert
                        }, {
                            text: '返回',
                            className: 'active',
                            todo: this.prevPage
                        }]
                    });
                } else {
                    this.prevPage();
                }
            },
            'alert.close': function() {
                if (!this.submiting) {
                    this.alertParam.show = false;
                }
            }
        },
        methods: {
            uploadmenu(index) {
                if (!this.editable) { return false; }
                if (!this.reallyFileReady) { return false; }
                if (index === 0 || index === 1) {
                    this.editing = index;
                }
                this.menuParam.items = [{text:'重新拍摄', todo: this.camera, className: ['active']}];
                this.menuParam.show = true;
            },
            camera(index) {
                if (!this.editable) { return false; }
                if (!this.reallyFileReady) { return false; }
                if (index === 0 || index === 1) {
                    this.editing = index;
                }
                document.getElementById('uploader').click();
            },
            delete() {
                if (!this.editable) { return false; }
                if (!this.reallyFileReady) { return false; }
                var obj = {  id: '', src: '', ready: false };
                this.idPhotos.splice(this.editing, 1, obj);
            },
            uploading(event) {
                var _this = this,
                    input = event.target;

                // 上传中loading
                var img = new Image();
                var obj = {
                    id: '',
                    src: 'images/blank.png',
                    ready: false
                };
                _this.idPhotos.splice(_this.editing, 1, obj);
                lrz(input.files[0], {quality: 0.7})
                    .then(function (rst) {
                        // 处理成功会执行
                        img.onload = function () {
                            obj.src = rst.base64;
                            obj.ready = true;
                            _this.checkEdit();
                        };
                        img.src = rst.base64;
                    })
                    .catch(function (err) {
                        // 处理失败会执行
                    })
                    .always(function () {
                        // 不管是成功失败，都会执行
                    });

                // 解决某些浏览器 input[file] change不能触发第二次
                $('#uploader-wrapper').html($('#uploader-wrapper').html());
                $('#uploader').bind('change', function(e) {
                    _this.uploading(e);
                });
            },
            // 是否编辑过
            checkEdit: function() {
                var identical = true,
                    photoCount = 0;
//                console.log(this.idPhotos);
                for (let i = 0; i < this.originIdPhotos.length; i++) {
                    for (let j in this.originIdPhotos[i]) {
                        identical = identical && (this.originIdPhotos[i][j] == this.idPhotos[i][j]);
                    }
                    if (this.idPhotos[i].src) {
                        photoCount++;
                    }
                }
//                console.log(identical)
                // 有图片上传中不可submit
                var fileReady = true;
                for (var i = 0; i < this.idPhotos.length; i++) {
                    fileReady = fileReady && this.idPhotos[i].ready;
                }

                this.edited = !identical;
                // 未确认的非空即可提交，或其他状态编辑过可提交
//                console.log(!identical)

                this.submitReady = (this.isUnconfirmed && photoCount === 2) ||
                            (!this.isUnconfirmed && !identical && (photoCount === 0 || photoCount === 2));
                this.submitReady = this.submitReady && fileReady;
            },
            // 提交图片
            submit: function() {
//                console.log(this.idPhotos);
                if (this.submitReady) {
                    this.submiting = true;
                    this.submitReady = false;
                    this.showAlert({
                        content: '<div class="uploading">上传中，请稍候...</div>'
                    });

                    // do ajax
                    var fileIds = [],
                        _this = this;
//                    {OperationType:0,SnapId:100,Base64:"",Face:1},{OperationType:0,SnapId:100,Base64:"",Face:1}
                    var _arrSnapInfos = [];
                    for(let n=0;n<docSnapInfos.SnapInfos.length;n++){
                        if(docSnapInfos.SnapInfos[n].Face !=1 && docSnapInfos.SnapInfos[n].Face!=2){
                            _arrSnapInfos.push(n);
                        }
                    }
                    for (var i = 0; i < this.idPhotos.length; i++) {
                        var _idx=-1;
                        for(let j=0;j<docSnapInfos.SnapInfos.length;j++){
                            if(docSnapInfos.SnapInfos[j].Face == (i + 1)) {
                                _idx = j;
                            }
                        }
                        for(let m=0;m<_arrSnapInfos.length;m++ ){
                            if(_idx == -1){
                                _idx = _arrSnapInfos[0];
                                _arrSnapInfos.shift();
                            }
                        }
//                        console.log(_idx);
                        if (this.isUnconfirmed) {
                            // 未确认状态的，全部提交src，后台用于重新创建图
                            if(!this.idPhotos[i].id.toString()){
                                if(_idx!=-1){
                                    fileIds.push({
                                        OperationType:0,
                                        SnapId:docSnapInfos.SnapInfos[_idx].SnapId,
                                        Base64:'',
                                        Face:0
                                    });
                                }

                                fileIds.push({
                                    OperationType:1,
                                    SnapId:0,
                                    Base64:this.idPhotos[i].src,
                                    Face:i+1
                                });
                            }else{
                                fileIds.push({
                                    OperationType:1,
                                    SnapId:docSnapInfos.SnapInfos[_idx].SnapId,
                                    Base64:'',
                                    Face:docSnapInfos.SnapInfos[_idx].Face
                                });
                            }


                        } else {
//                            console.log(this.idPhotos[i].id.toString())
                            if(!this.idPhotos[i].id.toString()){
                                if(_idx != -1){
                                    fileIds.push({
                                        OperationType:0,
                                        SnapId:docSnapInfos.SnapInfos[_idx].SnapId,
                                        Base64:'',
                                        Face:0
                                    });
                                    fileIds.push({
                                        OperationType:1,
                                        SnapId:0,
                                        Base64:this.idPhotos[i].src,
                                        Face:i+1
                                    });
                                }else{
                                    fileIds.push({
                                        OperationType:1,
                                        SnapId:0,
                                        Base64:this.idPhotos[i].src,
                                        Face:i+1
                                    });
                                }
                            }

//                            fileIds.push(this.idPhotos[i].id.toString() || this.idPhotos[i].src);
                        }
                    }
                    // 正反都是空的时候，传递只有一个空串的数组
                    if (!fileIds[0] && !fileIds[1]) {
                        fileIds = [''];
                    }
//                    console.log(fileIds)
                    $.ajax({
                        url: this.submitUrl,
                        type: 'post',
                        contentType: 'application/x-www-form-urlencoded',
                        data: {
                            orderId: tools.getUrlParam('orderId'),
                            docType: this.helpText.docType,
                            childOrderId:tools.getUrlParam('childOrderId'),
                            snapInfos: fileIds
                        },
                        success: function(respond) {
                            if (respond.Result) {
                                _this.showAlert({
                                    content: '上传成功！',
                                    btns: [{
                                        text: '确认',
                                        todo: _this.prevPage2,
                                        className: ['active']
                                    }],
                                    afterClose: _this.prevPage
                                });
                            } else {

                                _this.showAlert({
                                    content: respond.Message,
                                    btns: [{
                                        text: '确认',
                                        todo: function() {
                                            // todo: bad
                                            _this.closeAlert();
                                            if (respond.Data === -1) {
                                                // 未登录跳转
                                                location.href = _this.helpText.loginUrl;
                                            } else if(respond.Data == 0){
                                                location.reload();
                                            }else{
                                                _this.submitReady = true;
                                            }
                                        },
                                        className: ['active']
                                    }],
                                    afterClose: function() {
                                        if (respond.Data === -1) {
                                            // 未登录跳转
                                            location.href = _this.helpText.loginUrl;
                                        } else {
                                            _this.submitReady = true;
                                        }
                                    }
                                });
                            }
                            _this.submiting = false;
                        },
                        error: function(respond) {
                            var msg = respond.Message || '图片大小超出上传限制，建议您分批上传！';
                            _this.showAlert({
                                content: msg,
                                btns: [{
                                    text: '确认',
                                    todo: function() {
                                        // todo: bad
                                        _this.closeAlert();
                                        _this.submitReady = true;
                                    },
                                    className: ['active']
                                }],
                                afterClose: function() {
                                    _this.submitReady = true;
                                }
                            });
                            _this.submiting = false;
                        }
                    });
                }
            },
            // 返回上一页
            prevPage: function() {
                window.location.href = '/snap?orderId='+tools.getUrlParam('orderId') +'&childOrderId='+ tools.getUrlParam('childOrderId');
            },
            prevPage2:function() {
                var cookieString = "uploadok=true;path=/;domain=" + tools.wildcardUrl();
                document.cookie = cookieString;

                window.location.href = '/snap?orderId='+tools.getUrlParam('orderId') +'&childOrderId='+ tools.getUrlParam('childOrderId')+'#uploaded';
            },
            // 显示提示弹层
            showAlert: function(options) {
                this.alertParam.content = options.content || '';
                this.alertParam.btns = options.btns || [];
                this.alertParam.afterClose = options.afterClose || function() {};
                this.alertParam.loading = false;
                this.alertParam.show = true;
            },
            // 关闭提示弹层
            closeAlert: function() {
                this.alertParam.show = false;
            },
            // 上传说明
            upoaldHelp: function() {
                var html = '<h3>【材料要求】</h3>' +
                        '<p>' + this.helpText.require + '</p>' +
                        '<h3>【可替代材料】</h3>' +
                        '<p>' + this.helpText.replace + '</p>';
                this.showAlert({
                    content: html,
                    btns: [{
                        text: '确定',
                        todo: this.closeAlert,
                        className: ['active']
                    }]
                });
            }
        }
    }
</script>
