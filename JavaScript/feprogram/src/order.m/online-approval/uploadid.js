import Vue from 'vue'
import uploadid from './views/uploadid.vue'

(function() {
    var userName = showingUserName,
        idPhotos = [{id: '', src: '', ready: false}, {id: '', src: '', ready: false}],  // 包含身份证图片的id和src，0是正面，1是反面
        helpText = {},
        submitUrl = snap_uploading_url;
    var pageData = {
        userName: userName,
        idPhotos: idPhotos,
        helpText: helpText,
        submitUrl: submitUrl,
        fileReady: true,
        editable: docSnapInfos.IsEditingEnabled
    };

    // 提示信息
    helpText.require = docSnapInfos.DocTypeInfo.Requirement;
    helpText.replace = docSnapInfos.DocTypeInfo.Replacement;
    helpText.docType = docSnapInfos.DocTypeInfo.DocType;   // 文件类型
    helpText.loginUrl = to_login_url;   // 未登录跳转
    helpText.isOld = docSnapInfos.IsOldSnap;
    helpText.isUnconfirmed = docSnapInfos.IsUnconfirmed;

    // 获取图片
    if (docSnapInfos.SnapInfos.length > 0) {
        var i = 0,
            counter = 0,
            max = 0,    // 取前2张，身份证只能有2张或0张
            errorImage = 'error.png',
            maxObj={},    // 未加载成功的替代图片
            _arrSnapInfos2=[];
        for(let k=0;k<docSnapInfos.SnapInfos.length;k++){
            if(docSnapInfos.SnapInfos[k].Face ==1){
                maxObj['1']=1;
            }
            if(docSnapInfos.SnapInfos[k].Face ==2){
                maxObj['2']=2;
            }
            if(docSnapInfos.SnapInfos[k].Face !=1 && docSnapInfos.SnapInfos[k].Face !=2){
                _arrSnapInfos2.push(k);
            }
        }

        if(_arrSnapInfos2.length>0){
            maxObj['1'] = 1;
            _arrSnapInfos2.shift();
        }
        if(_arrSnapInfos2.length>0){
            maxObj['2'] = 2;
            _arrSnapInfos2.shift();
        }

        for(let n in maxObj){
            if(maxObj.hasOwnProperty(n)){
                max+=1;
            }
        }
        // console.log(max)
        // 初始化idPhotos
        for (i = 0; i < max; i++) {
            idPhotos.splice(i, 1, {id: '', src: 'blank.png', ready: false});
        }

        pageData.fileReady = false;

        // 请求图片
        var _arrSnapInfos = [];
        for(let n=0;n<docSnapInfos.SnapInfos.length;n++){
            if(docSnapInfos.SnapInfos[n].Face !=1 && docSnapInfos.SnapInfos[n].Face!=2){
                _arrSnapInfos.push(n);
            }
        }
        for (let i = 0; i < 2; i++) {

            let _idx=-1;
            for(let j=0;j<docSnapInfos.SnapInfos.length;j++){
               if(docSnapInfos.SnapInfos[j].Face == (i + 1)) {
                   _idx = j;
               }
            }

            if(_idx == -1 && _arrSnapInfos.length>0){
                _idx = _arrSnapInfos[0];
                _arrSnapInfos.shift();
            }


            // console.log(_idx);
            if(_idx != -1){
                (function (index, id) {
                    // console.log(id);
                    $.ajax({
                        url: snap_getting_url,
                        type: 'post',
                        data: {
                            snapId: id
                        },
                        success: function (respond) {
                            var newfile = {id: id, src: '', ready: true};

                            if (respond) {
                                newfile.src = respond;
                            } else {
                                newfile.src = errorImage;
                            }

                            // 当图片加载成功后，更新列表
                            var img = new Image();
                            img.onload = function () {
                                idPhotos.splice(index, 1, newfile);
                                counter++;
                                checkReady();
                            };
                            // 加载失败也显示错误图
                            img.onerror = function () {
                                newfile.src = errorImage;
                                idPhotos.splice(index, 1, newfile);
                                counter++;
                                checkReady();
                            };
                            img.src = newfile.src;

                        },
                        error: function (respond) {
                            var newfile = {id: id, src: errorImage, ready: true};
                            idPhotos.splice(index, 1, newfile);
                            counter++;
                            checkReady();
                        }
                    });
                })(i, docSnapInfos.SnapInfos[_idx].SnapId)
            }else{
                idPhotos.splice(i, 1, {id: '', src: '', ready: true});
            }
        }

        // 验证是否ajax是否全部返回
        function checkReady() {

            if (counter === max) {
                pageData.fileReady = true;
            }
        }
    }

    var vm = new Vue({
        el: '#main',
        data: pageData,
        computed: {
        },
        components: {
            'uploadid': uploadid
        },
        methods: {}
    });
})();
