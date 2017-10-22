import Vue from 'vue'
import uploadfile from './uploadfile.vue'

(function() {
    var fileName = docSnapInfos.DocTypeInfo.DocTypeName,
        fileSrcs = [], // 包含身份证图片的id和src，提交时候，构造图片id+base64数组
        helpText = {},
        submitUrl = snap_uploading_url;
    var pageData = {
        fileName: fileName,
        fileSrcs: fileSrcs,
        helpText: helpText,
        submitUrl: submitUrl,
        fileReady: true,
        editable: docSnapInfos.IsEditingEnabled
    };

    // 提示信息
    helpText.description = docSnapInfos.DocTypeInfo.DocDescription;
    helpText.require = docSnapInfos.DocTypeInfo.Requirement;
    helpText.replace = docSnapInfos.DocTypeInfo.Replacement;
    helpText.docType = docSnapInfos.DocTypeInfo.DocType;    // 文件类型
    helpText.loginUrl = to_login_url;   // 未登录跳转
    helpText.isOld = docSnapInfos.IsOldSnap;
    helpText.isUnconfirmed = docSnapInfos.IsUnconfirmed;

    // 获取图片
    if (docSnapInfos.SnapInfos.length) {
        var i = 0,
            counter = 0,
            max = docSnapInfos.SnapInfos.length,
            errorImage = 'error.png';    // 未加载成功的替代图片

        // 初始化fileSrcs
        for (i = 0; i < max; i++) {
            fileSrcs.push({id: '', src: '', thumb: '', ready: false});
        }
        pageData.fileReady = false;

        // 请求图片
        for (i = 0; i < max; i++) {
            (function(index, id) {
                $.ajax({
                    url: snap_getting_url,
                    type: 'post',
                    data: {
                        snapId: id
                    },
                    success: function(respond) {
                        var newfile = {id: id, src: '', thumb: '', ready: true};

                        if (respond) {
                            newfile.src = respond;
                            newfile.thumb = respond;
                        } else {
                            newfile.src = errorImage;
                            newfile.thumb = errorImage;
                        }

                        // 当图片加载成功后，更新列表
                        var img = new Image();
                        img.onload = function() {
                            fileSrcs.splice(index, 1, newfile);
                            counter++;
                            checkReady();
                        };
                        // 加载失败也显示错误图
                        img.onerror = function() {
                            newfile.src = errorImage;
                            newfile.thumb = errorImage;
                            fileSrcs.splice(index, 1, newfile);
                            counter++;
                            checkReady();
                        };
                        img.src = newfile.src;
                    },
                    error: function(respond) {
                        var newfile = {id: id, src: errorImage, thumb: errorImage, ready: true};
                        fileSrcs.splice(index, 1, newfile);
                        counter++;
                        checkReady();
                    }
                });
            })(i, docSnapInfos.SnapInfos[i].SnapId);
        }

        // 验证是否ajax是否全部返回
        function checkReady() {
            if (counter === max) {
                pageData.fileReady = true;
            }
        }
    }

    // 初始化vue方法
    var vm = new Vue({
        el: '#main',
        data: pageData,
        computed: {},
        components: {
            'uploadfile': uploadfile
        },
        methods: {}
    });
})();