<template>
    <!-- 列表页面 -->
    <div class="list-page">
        <vue-header :header-title="'上传'+fileName" :prevent-back="true"></vue-header>

        <div class="tip">
            <div class="con" v-text="helpText.description"></div>
            <div class="help-btn" @click="upoaldHelp">查看更多</div>
        </div>

        <ul class="file-wrapper">
            <li v-if="editable">
                <div class="camera-btn" @click="newFile">
                    <div class="icon"></div>
                    <div class="text">点击上传</div>
                </div>
            </li>
            <li class="file-thumbnail" v-for="(index, file) in files" @click="editFile(index)">
                <div class="photo">
                    <div :style="{backgroundImage: 'url(' + file.thumb + ')'}" v-show="file.ready"></div>
                    <div class="loading" v-show="!file.ready"></div>
                </div>
                <div class="text" v-text="file.name"></div>
            </li>
            <li v-if="editable && newBtnLast">
                <div class="camera-btn" @click="newFile">
                    <div class="icon"></div>
                    <div class="text">点击上传</div>
                </div>
            </li>
        </ul>
        <div id="uploader-wrapper">
            <input type="file" accept="image/*" capture="camera" name="uploader" id="uploader" @change="uploading($event)" />
        </div>

        <menu :items="menuParam.items" :show="menuParam.show"></menu>
        <vue-alert :content="alertParam.content" :btns="alertParam.btns" :after-close="alertParam.afterClose" :loading="alertParam.loading" :show="alertParam.show"></vue-alert>

        <div class="submit-btn" :class="{'active': submitReady}" v-if="editable" @click="submit">确认上传</div>
    </div>
    <!-- 列表页面结束 -->

    <!-- 编辑页面 -->
    <div class="edit-page" v-show="editShow" transition="slide">
        <div class="edit-page-body" :class="{'editable': editable}">
            <vue-header :header-title="files[editing].name" :prevent-back="true"></vue-header>
            <div class="filewrap" :class="{'loading': !files[editing].ready}">
                <img :src="files[editing].src" alt="" />
            </div>
            <div class="btnwrap" v-if="editable">
                <div class="replace-btn" @click="camera">重新上传</div>
            </div>
        </div>
    </div>
    <!-- 编辑页面结束 -->
</template>
<style>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    $red: map-get($colors, red);
    $gold: map-get($colors, gold);
    $green: #00CC99;
    $yellow: #FFC957;
    $gray: #DCDCDC;


    .file-wrapper {
      padding: px2rem(24) 0;
      overflow: hidden;

      li {
        float: left;
        width: px2rem(210);
        margin-left: px2rem(30);
        margin-top: px2rem(20);

        &.file-thumbnail {
          .photo {
            position: relative;
            box-sizing: border-box;
            width: px2rem(210);
            height: px2rem(280);
            border: 1px solid #dddddd;
            background: #ffffff;

            div {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;

              &.loading {
                background-image: url(images/loading80.gif);
                background-size: px2rem(50) auto;
              }
            }
          }

          .text {
            text-align: center;
            @include fsize(30);
            line-height: px2rem(46);
            padding: px2rem(20) 0;
            color: #666666;
          }
        }

        .camera-btn {
          box-sizing: border-box;
          position: relative;
          width: px2rem(210);
          height: px2rem(280);
          background: #FFFFFF;
          border: 1px solid #dddddd;

          .icon {
            margin-top: px2rem(60);
            margin-left: auto;
            margin-right: auto;
            width: px2rem(120);
            height: px2rem(120);
            background: url(images/camera.png) no-repeat center center;
            background-size: px2rem(94) auto;
          }

          .text {
            text-align: center;
            @include fsize(28);
            line-height: px2rem(40);
            color: #C8C8C8;
          }
        }
      }
    }

    html {
      height: 100%;
    }
    body {
      box-sizing: border-box;
      position: relative;
      padding-bottom: px2rem(148);
      min-height: 100%;
      background: #FFFFFF;
      overflow: hidden;
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

    .tip {
        display: -webkit-box;
        display: flex;
        position: relative;
        margin-top: px2rem(30);
        margin-bottom: px2rem(-14);
        margin-left: px2rem(30);
        margin-right: px2rem(30);
        @include fsize(28);
        line-height: px2rem(42);

        .con {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .help-btn {
          position: relative;
          color:$red;
          padding-left: px2rem(25);
          padding-right: px2rem(14);
          white-space: nowrap;

          &:after {
            content: '';
            box-sizing: border-box;
            position: absolute;
            top: 50%;
            right: 0;
            width: 0.6em;
            height: 0.6em;
            transform: translate(0, -50%) rotate(45deg);
            border-top: 1px solid $red;
            border-right: 1px solid $red;
          }
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

    /////
    .edit-page {
      position: fixed;
      z-index: 200;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      /* overflow: auto; */
      overflow: hidden;
      background: #FFFFFF;

      .edit-page-body {
        /* position: relative;
        min-height: 100%; */
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
        /* padding-bottom: px2rem(50); */

        &.editable {
            /* padding-bottom: px2rem(148); */

            .filewrap {
                padding-bottom: px2rem(148);
            }
        }

        header {
            position: absolute;
            width: 100%;
        }

        .filewrap {
          padding: px2rem(40) px2rem(30) 0;
          padding-top: px2rem(130);
          padding-bottom: px2rem(90);

          img {
            display: block;
            width: 100%;
          }

          &.loading {
            height: px2rem(700);
            background: url(images/loading80.gif) no-repeat center center;
            background-size: px2rem(60) auto;

            img {
                display: none;
            }
          }
        }

        .btnwrap {
          position: absolute;
          z-index: 100;
          left: 0;
          right: 0;
          bottom: 0;
          display: block;
          height: px2rem(98);
          text-align: center;
          @include fsize(32);
          line-height: px2rem(98);

          .delete-btn {
            display: block;
            float: left;
            width: px2rem(240);
            background: $red;
            color: #FFFFFF;

            &:link,
            &:visited,
            &:hover,
            &:active {
                color: #FFFFFF
            }
          }

          .replace-btn {
            display: block;
            background: $red;
            color: #FFFFFF;

            &:link,
            &:visited,
            &:hover,
            &:active {
                color: #FFFFFF
            }
          }
        }
      }
    }

    .vue-alert .uploading {
        display: inline-block;
        padding-left: px2rem(50);
        background: url(images/loading80.gif) no-repeat left center;
        background-size: px2rem(40) auto;
    }

    // transition
    /* always present */
    .slide-transition {
      transition: all .4s ease;
      box-shadow: rgba(0,0,0,0.5) 0 0 px2rem(10) 0;
    }
    /* .expand-enter defines the starting state for entering */
    /* .expand-leave defines the ending state for leaving */
    .slide-enter, .slide-leave {
      opacity: 0.8;
      transform: translate(100%, 0);
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
        props: ['fileName', 'fileSrcs', 'helpText', 'submitUrl', 'fileReady', 'editable'],
        data() {
            var _this = this;
            return {
                originFilesrcs: function() {
                    var copy = [], obj;
                    for (var i = 0; i < _this.fileSrcs.length; i++) {
                        obj = {};
                        for (var j in _this.fileSrcs[i]) {
                            obj[j] = _this.fileSrcs[i][j];
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
                submitReady: false, //_this.fileReady && _this.helpText.isUnconfirmed, // always false
                // 旧数据（当前订单该数据没有）
                isOld: _this.helpText.isOld,
                // 订单是否是未确认状态(仅提交src,不提交id src混合)
                isUnconfirmed: _this.helpText.isUnconfirmed,
                // 提交中状态
                submiting: false,
                // 是否编辑过（有变化可退有提示）
                edited: false,
                // 是否显示编辑页面
                editShow: false,
                reallyFileReady: _this.fileReady,
                fileNumMax: 20 // 图片最大数量20
            };
        },
        computed: {
            files() {
                var files = [];
                for (var i = 0; i < this.fileSrcs.length; i++) {
                    files.push({
                        name: this.fileName + '-' + (i+1),
                        src: this.fileSrcs[i].src,
                        thumb: this.fileSrcs[i].thumb,
                        ready: this.fileSrcs[i].ready
                    });
                }
                return files;
            },
            newBtnLast() {
                return (this.fileSrcs.length >= 8 && this.fileSrcs.length < this.fileNumMax);
            }
        },
        watch: {
            fileReady() {
               if (this.fileReady) {
                    var copy = [], obj;
                    for (var i = 0; i < this.fileSrcs.length; i++) {
                        obj = {};
                        for (var j in this.fileSrcs[i]) {
                            obj[j] = this.fileSrcs[i][j];
                        }
                        copy.push(obj);
                    }
                    this.originFilesrcs = copy;
                    this.reallyFileReady = true; // todo: bad
                    this.checkEdit();
               }
            },
            fileSrcs() {
                if (this.reallyFileReady) {
                    this.checkEdit();
                }
            },
            editShow() {
                if (this.editShow) {
                    $('html').css('overflow', 'hidden');
                } else {
                    $('html').css('overflow', 'auto');
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
                if (this.editShow) {
                    this.editShow = false;
                } else if (this.edited) {
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
            // 添加上传
            newFile() {
                if (!this.reallyFileReady) { return false; }
                if (this.fileSrcs.length >= this.fileNumMax) {
                    this.fileOutNumAlert();
                    return false;
                }
                this.editing = -1;
                document.getElementById('uploader').setAttribute('multiple', 'multiple'); // 添加可传多图
                this.camera();
            },
            // 编辑
            editFile(index) {
                if (!this.reallyFileReady) { return false; }
                this.editing = index;
                document.getElementById('uploader').removeAttribute('multiple'); // 修改单图
                this.editShow = true;
            },
            // 删除
            delete() {
                var _this = this;
                this.editShow = false;
                setTimeout(function() {
                    _this.fileSrcs.splice(_this.editing, 1);
                }, 250);
            },
            camera() {
                document.getElementById('uploader').click();
            },
            uploading(event) {
                var _this = this,
                    input = event.target,
                    imageCount = input.files.length;

                // 修改只可单张（保险措施，input控件上已修改multiple属性）
                if (this.editing > -1) {
                    imageCount = 1;
                }
                // 如果数量超过最大数量，弹出提示层，同时限制最大数量
                if (this.fileSrcs.length + imageCount >= this.fileNumMax) {
                    imageCount = this.fileNumMax - this.fileSrcs.length;
                    this.fileOutNumAlert();
                }

                for (var i = 0; i < imageCount; i++) {
                    (function() {
                        var img = new Image();
                        var obj = {
                            id: '',
                            src: 'images/blank.png',
                            thumb: 'images/blank.png',
                            ready: false
                        };
                        if (_this.editing > -1) {
                            _this.fileSrcs.splice(_this.editing, 1, obj);
                        } else {
                            _this.fileSrcs.push(obj);
                        }
                        lrz(input.files[i], {quality: 0.7})
                            .then(function (rst) {
                                // 处理成功会执行
                                img.onload = function () {
                                    obj.src = rst.base64;
                                    obj.thumb = rst.base64;
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
                                _this.editShow = false;
                            });
                    })();
                }

                // 解决某些浏览器 input[file] change不能触发第二次
                $('#uploader-wrapper').html($('#uploader-wrapper').html());
                $('#uploader').bind('change', function(e) {
                    _this.uploading(e);
                });
            },
            // 是否编辑过
            checkEdit: function() {
                var identical = true;
                if (this.originFilesrcs.length === this.fileSrcs.length) {
                    for (var i = 0; i < this.originFilesrcs.length; i++) {
                        for (var j in this.originFilesrcs[i]) {
                            identical = identical && (this.originFilesrcs[i][j] === this.fileSrcs[i][j]);
                        }
                    }
                } else {
                    identical = false;
                }

                // 有图片上传中不可submit
                var fileReady = true;
                for (var i = 0; i < this.fileSrcs.length; i++) {
                    fileReady = fileReady && this.fileSrcs[i].ready;
                }

                this.edited = !identical;
                // 未确认的数量非空且小于最大数量即可提交，或其他状态编辑过且小于最大数量可提交
                this.submitReady = (this.isUnconfirmed && this.fileSrcs.length && this.fileSrcs.length <= this.fileNumMax) ||
                            (!this.isUnconfirmed && !identical && this.fileSrcs.length <= this.fileNumMax);
                this.submitReady = this.submitReady && fileReady;
            },
            // 提交图片
            submit: function() {
                if (this.submitReady) {
                    this.submiting = true;
                    this.submitReady = false;
                    this.showAlert({
                        content: '<div class="uploading">上传中，请稍候...</div>'
                    });

                    // do ajax

                    var fileIds = [],
                        _this = this;
                    for (var i = 0; i < this.fileSrcs.length; i++) {
                        if (this.isUnconfirmed) {
                            // 未确认状态的，全部提交src，后台用于重新创建图
                            if(!this.fileSrcs[i].id.toString()){
                                if(docSnapInfos.SnapInfos[i]){
                                    fileIds.push({
                                        OperationType:0,
                                        SnapId:docSnapInfos.SnapInfos[i].SnapId,
                                        Base64:'',
                                        Face:0
                                    });
                                }

                                fileIds.push({
                                    OperationType:1,
                                    SnapId:0,
                                    Base64:this.fileSrcs[i].src,
                                    Face:i+1
                                });
                            }else{
                                fileIds.push({
                                    OperationType:1,
                                    SnapId:docSnapInfos.SnapInfos[i].SnapId,
                                    Base64:'',
                                    Face:docSnapInfos.SnapInfos[i].Face
                                });
                            }

                        } else {
                            if(!this.fileSrcs[i].id.toString()){
                                if(docSnapInfos.SnapInfos[i]){
                                    fileIds.push({
                                        OperationType:0,
                                        SnapId:docSnapInfos.SnapInfos[i].SnapId,
                                        Base64:'',
                                        Face:0
                                    });
                                    fileIds.push({
                                        OperationType:1,
                                        SnapId:0,
                                        Base64:this.fileSrcs[i].src,
                                        Face:i+1
                                    });
                                }else{
                                    fileIds.push({
                                        OperationType:1,
                                        SnapId:0,
                                        Base64:this.fileSrcs[i].src,
                                        Face:i+1
                                    });
                                }
                            }
                        }
                    }
                    // 全部删除后，传递只有一个空串的数组（空数组后台会接收不到参数）
                    if (!fileIds.length) {
                        fileIds = [''];
                    }
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
                                            _this.closeAlert();
                                            if (respond.Data === -1) {
                                                // 未登录跳转
                                                location.href = _this.helpText.loginUrl;
                                            } else {
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
                // history.go(-1);
                if(document.referrer.indexOf('#uploaded')>=0){
                    window.location.href = document.referrer.replace('#uploaded','');
                }else{
                    window.location.href = document.referrer;
                }
            },
            prevPage2:function() {
                // history.go(-1);
                var cookieString = "uploadok=true;path=/;domain=" + tools.wildcardUrl();
                document.cookie = cookieString;

                if(document.referrer.indexOf('#uploaded')<0){
                    window.location.href = document.referrer +'#uploaded'
                }else{
                    window.location.href = document.referrer;
                }

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
            fileOutNumAlert: function() {
                this.showAlert({
                    content: '最多上传' + this.fileNumMax + '张图片',
                    btns: [{
                        text: '确认',
                        todo: this.closeAlert,
                        className: ['active']
                    }]
                });
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
