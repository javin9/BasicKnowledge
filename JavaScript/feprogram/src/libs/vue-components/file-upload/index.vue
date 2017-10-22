<template>
  <label for="{{ name }}">
  	<input type="file" name="{{ name }}" id="{{ id || name }}" accept="{{ accept }}" v-on:click="fileInputClick" v-on:change="fileInputChange" multiple="{{ multiple }}" @change="fileUpload" v-el:file>
  	<slot></slot>
  </label>
</template>

<style scoped>
	input{
		 width: 0px;
		 height: 0px;
		 overflow: hidden;
	}
</style>

<script>
  export default {
	  props: {
	    class: String,
	    name: {
	      type: String,
	      required: true
	    },
	    id: String,
	    action: {
	      type: String,
	      required: true
	    },
	    accept: String,
	    multiple: String,
	    headers: Object,
	    method: String,
	    data:Object,
	    json:String,
	    ext:String,
	    buttonText: {
	      type: String,
	      default: 'Upload'
	    }
	  },
    data () {
      return {
      	myFiles: []
      }
    },
    events:{
    	openFileSelector(){
    		$(this.$els.file).click()
    	}
    },
		methods: {
	    fileInputClick: function() {
	      // click actually triggers after the file dialog opens
	      this.$dispatch('onFileClick', this.myFiles);
	    },
	    fileInputChange: function() {
	    	if(!this.$els.file.value){
	    		return false
	    	}
	      // get the group of files assigned to this field
	      var ident = this.id || this.name
	      this.myFiles = document.getElementById(ident).files;
	      this.$dispatch('onFileChange', this.myFiles);
	    },
	    _onProgress: function(e) {
	      // this is an internal call in XHR to update the progress
	      e.percent = (e.loaded / e.total) * 100;
	      this.$dispatch('onFileProgress', e);
	    },
	    _handleUpload: function(file) {
	      this.$dispatch('beforeFileUpload', file);
	      var form = new FormData();
	      var xhr = new XMLHttpRequest();

	      try {
	      	if(this.json){
	      		this.headers = this.headers || {}
	      		form = new FormData()
	      		if(this.ext){
		      		form.append(this.ext, file.name.split('.').pop())
	      		}

	      		if(this.data){
	      			for(let i in this.data){
	      				form.append(i, this.data[i])
	      			}
	      		}
	      	}else{
		        form.append('Content-Type', file.type || 'application/octet-stream');
		        // our request will have the file in the ['file'] key
		        form.append(this.name, file);
	      	}
	      } catch (err) {
	        this.$dispatch('onFileError', file, err);
	        return;
	      }

	      return new Promise(function(resolve, reject) {

	        xhr.upload.addEventListener('progress', this._onProgress, false);

	        xhr.onreadystatechange = function() {
	          if (xhr.readyState < 4) {
	            return;
	          }
	          if (xhr.status < 400) {
	            var res = JSON.parse(xhr.responseText);
	            this.$dispatch('onFileUpload', file, res);
	            this.$els.file.value = ''
	            resolve(file);
	          } else {
	            var err = JSON.parse(xhr.responseText);
	            err.status = xhr.status;
	            err.statusText = xhr.statusText;
	            this.$dispatch('onFileError', file, err);
	            reject(err);
	          }
	        }.bind(this);

	        xhr.onerror = function() {
	          var err = JSON.parse(xhr.responseText);
	          err.status = xhr.status;
	          err.statusText = xhr.statusText;
	          this.$dispatch('onFileError', file, err);
	          reject(err);
	        }.bind(this);

	        xhr.open(this.method || "POST", this.action, true);
	        if (this.headers) {
	          for(var header in this.headers) {
	            xhr.setRequestHeader(header, this.headers[header]);
	          }
	        }

	        if(this.json){
			      var reader = new FileReader(); 
			      var name = this.name

	      		reader.onload = function(e){
	      			form.append(name, e.target.result)
		      		xhr.send(form)
	      		}

	      		reader.readAsDataURL(file)
	        }else{
		        xhr.send(form);
		        this.$dispatch('afterFileUpload', file);
	        }
	      }.bind(this));
	    },
	    fileUpload: function() {
	    	if(!this.$els.file.value){
	    		return false
	    	}
	      if(this.myFiles.length > 0) {
	        // a hack to push all the Promises into a new array
	        var arrayOfPromises = Array.prototype.slice.call(this.myFiles, 0).map(function(file) {
	          return this._handleUpload(file);
	        }.bind(this));
	        // wait for everything to finish
	        Promise.all(arrayOfPromises).then(function(allFiles) {
	          this.$dispatch('onAllFilesUploaded', allFiles);
	        }.bind(this)).catch(function(err) {
	          this.$dispatch('onFileError', this.myFiles, err);
	        }.bind(this));
	      } else {
	        // someone tried to upload without adding files
	        var err = new Error("No files to upload for this field");
	        this.$dispatch('onFileError', this.myFiles, err);
	      }
	    }
	  }
  }
</script>