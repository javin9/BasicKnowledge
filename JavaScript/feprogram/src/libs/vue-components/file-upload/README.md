# 文件上传组件

### 使用
<file-upload name="vin" :action="api" accept="image/png, image/jpeg, image/tif, image/bmp" ext="imgExtension" json="true" :data="vinFileData"></file-upload>

### props
	* name : String, 上传字段名
	* action: String, 上传接口地址
	* accept: String, 可接受的文件MIME
	* ext: String, 扩展名字段，默认不单独传扩展名
	* json: String, 若不为空，上传文件通过payload base64
	* data: Object, 上传附件参数
	* header: Object, 覆写上传headers
	* method: String, 默认POST

### 父级可用events
	* fileInputClick： 上传组件点击后触发
	* beforeFileUpload : 文件开始上传时回调
	* onFileUpload： 文件上传完成后触发

### 更多参考
https://github.com/james2doyle/vue-file-upload-component