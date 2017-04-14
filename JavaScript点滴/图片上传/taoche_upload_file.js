var TaocheFile = {
	//获得getBlobURL的兼容性写法
	getBlobURL: (window.URL && URL.createObjectURL.bind(URL)) || (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) || window.createObjectURL,
	revokeBlobURL: (window.URL && URL.revokeObjectURL.bind(URL)) || (window.webkitURL && webkitURL.revokeObjectURL.bind(webkitURL)) || window.revokeObjectURL,
	//返回文件类型class. 有：image|video|other
	getTypeClass: function(f) {
		var s = f.type;
		if(/image/.test(s)) {
			return 'image';
		} else if(/video/.test(s)) {
			return 'video';
		} else {
			return 'other';
		}
	},
	//返回文件名后辍。如：jpg|mp4
	getType: function(f) {
		return f.name.substr(f.name.lastIndexOf('.') + 1).toLowerCase()
	},
	//异步获得图片的宽高。第二个参数为回调，执行时传入两个参数：宽和高。
	getImgInfo: function(f, fn) {
		if(this.getTypeClass(f) !== 'image' || typeof(fn) !== 'function') {
			return false;
		}
		var img = new Image();
		img.src = this.getBlobURL(f);
		img.onload = function() {
			fn(this.width, this.height)
		};
		return true
	},
	//异步获得图片在页面中显示的宽高。。第二个参数为回调，执行时传入两个参数：宽和高。  注意：在iphone中由于手机拍照的角度，会导致图片旋转显示，宽高变成高宽。
	getImgDomInfo: function(d, fn) {
		if(typeof(d) != 'object' || typeof(fn) != 'function') {
			return false;
		}
		var d2 = d.cloneNode(true);
		d2.style.visibility = 'hidden';
		document.body.appendChild(d2);
		d2.onload = function() {
			fn(d2.offsetWidth, this.offsetHeight);
			document.body.removeChild(d2);
		};
		return true;
	}
};

// MsUp类
function TaocheUp(o) {
	if(!o.input) throw 'TaocheUp Error:input Element is Null!';
	this.files = [];
	this.error = []; //错误捕获容器
	this.insIndex = TaocheUp.prototype._insIndex++;
	this.fileFilter = o.fileFilter;
	this.maxSize = o.maxSize || Number.MAX_VALUE;
	this.postUrl = o.postUrl;
	this.input = o.input;
	this._index = 0;
	var self = this;
	EventUtils.on(this.input, "change", function(e) {
		var o = self._getFiles(e);
		if(!!self.onSelect) {
			self.onSelect(o.start, o.end, e);
		}
	});
}

//MsUp原型
TaocheUp.prototype = {
	//文件过滤器。如果正确则返回true,不正确返回false;
	_filterHandle: function(f) {
		if(!f.name) {
			return false;
		}
		var con = true, //是否包含该类型
			filesStr,
			type = TaocheFile.getType(f);
		if(!!this.fileFilter) {
			filesStr = "#" + this.fileFilter.join("#").toLowerCase() + "#";
			if(filesStr.indexOf('#' + type + '#') === -1) {
				con = false;
				this.error.push({
					errorType: '类型非法',
					fileName: f.name,
					fileType: type,
					fileSize: f.size
				});
			}
		};
		if(con && f.size > this.maxSize) {
			con = false;
			this.error.push({
				errorType: '大小超限',
				fileName: f.name,
				fileType: type,
				fileSize: f.size
			});
		}
		return con;
	},

	//获取input中的文件，并追加到this.files中。同时加上编号。
	_getFiles: function(e) {
		var fs = EventUtils.target(e).files,
			self = this,
			s = this._index,
			o = {},
			i, l;
		this.error = [];
		for(i = 0, l = fs.length; i < l; i++) {
			if(this._filterHandle(fs[i])) {
				o = {
					index: this._index,
					file: fs[i],
					sizeM: fs[i].size, //(fs[i].size / 1048576).toFixed(2),
					typeClass: TaocheFile.getTypeClass(fs[i]),
					type: TaocheFile.getType(fs[i]),

					imgInfo: {
						'w': 0,
						'h': 0
					},
					blobUrl: TaocheFile.getBlobURL(fs[i]),
					ajaxRes: '',
					ajaxObj: null,
					valid: true,
					dom: self._creatHtml(fs[i])
				};
				this.files.push(o);
				this._index++;
				(function(o) {
					TaocheFile.getImgInfo(o.file, function(w, h) {
						o.imgInfo = {
							'w': w,
							'h': h
						};
					})
				})(o);
			}
		}
		return {
			'start': s,
			'end': this._index - 1
		};
	},

	//通过AJAX上传
	upAjax: function() {
		var self = this;
		if(!this.postUrl) {
			throw '没有定义postUrl';
		}
		for(var i = 0, l = this.files.length; i < l; i++) {
			if(!!this.files[i].ajaxRes || !this.files[i].valid)
			{
				continue; //已上传，或已调用 removeOne方法删除，则不再上传
			}
			(function(i) {
				var xhr = new XMLHttpRequest(),
					fd = new FormData();
				fd.append('file' + i, self.files[i].file);
				if(!xhr.upload) return false; //兼容性
				xhr.upload.onprogress = function(e) {
					self._upOnProgress(i, e);
					if(!!self.onUpProgress) {
						self.onUpProgress(i, e)
					};
				};
				xhr.onreadystatechange = function() {
					if(xhr.readyState == 4) {
						if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
							var t = xhr.responseXML || xhr.responseText;
							console.log(t);
//							self._upOnRead(i, t);
//							if(!!self.onUpLoadend) {
//								self.onUpLoadend(i, t);
//							};
						}
					}
				};
				xhr.open("post", self.postUrl, true);
				xhr.send(fd);
				self.files[i].ajaxObj = xhr;
			})(i);
		}
	},

	//判断实例中的所有文件是否上传完毕。返回ture或false;
	isAllUpEnd: function() {
		for(var it in this.files) {
			if(this.files[it].ajaxRes == '' && this.files[it].valid) return false;
		};
		return true;
	},

	//删除一个文件。 删除后将：1.从页面中移走dom; 2.将this.files[i].valid 属性改为false; 3. 如果正在上传则取消上传,还没上传则不再上传
	removeOne: function(i) {
		var f = this.files[i];
		f.valid = false;
		if(isParents(f.dom, document.body)) {
			f.dom.parentNode.removeChild(f.dom);
		};
		if(!!f.ajaxObj) {
			f.ajaxObj.abort();
		};
	},

	_insIndex: 0,

	_creatHtml: function(f) {
		var t = TaocheFile.getTypeClass(f),
			url = TaocheFile.getBlobURL(f),
			d = document.createElement('div'), //CE('div'),
			dm, //IMG
			dzz, //遮罩
			jd,
			dm2,
			dStyle = "height:100px;width:100px;border:1px solid #eee;margin:2px;float:left;",
			dClass = (t == 'image' && 'TaocheUpFile TaocheUpFileImg') || (t == 'video' && 'TaocheUpFile TaocheFileUpVideo') || '',
			dmClass = (t == 'image' && 'TaocheUpImg') || (t == 'video' && 'TaocheUpVideo') || '',
			dmStr = (t == 'image') ?
			"<img style='height:100px;position:absolute;'>" :
			"<video style='height:100px;width:100px;position:absolute;' poster='p.jpg'></video>",
			dzzStr = "<div style='height:100px;width:100px;line-height:100px;position:relative;margin:0px;background-color:rgba(0,0,0,0.6);color:#fff;text-align:center;font-size:9px;'></div>",
			djdStr = "<div style='margin:0px;width:0;height:6px;position:relative;top:-6px;background-color:#C9F76F;'></div>";

		if(t == 'other') {
			return null; //如果不是图片及视频则返回null	
		}
		d.innerHTML = dmStr + dzzStr + djdStr;
		d.setAttribute('TaocheUpInsIndex', this.insIndex);
		d.setAttribute('TaocheUpIndex', this._index);
		dm = d.firstChild;
		dzz = d.childNodes[1];
		djd = d.childNodes[2]; //获得几个DIV		
		d.id = 'TaocheUpFile' + this.insIndex + "_" + this._index;
		addClass(dClass, d);
		d.setAttribute('style', dStyle); //处理外层DIV			
		dm.id = "TaocheUpIndex" + this.insIndex + "_" + this._index;
		addClass(dmClass, dm);
		if(t === 'image') {
			dm.setAttribute('src', url); //处理内容层
		}
		dzz.id = 'TaocheUp_zhezhao' + this.insIndex + "_" + this._index;
		dzz.innerHTML = '等待上传';
		djd.id = 'TaocheUp_jingdu' + this.insIndex + "_" + this._index; //处理遮罩及进度条层
		if(t == 'video') {
			return d;
		}
		TaocheFile.getImgDomInfo(dm, function(w, h) {
			w = w + 'px';
			h = h + 'px';
			d.style.height = h;
			d.style.width = w;
			dzz.style.height = h;
			dzz.style.lineHeight = h;
			dzz.style.width = w;
		});
		return d;
	},

	_upOnRead: function(i, t) {
		if(!!document.getElementById('TaocheUp_zhezhao' + this.insIndex + "_" + i)) {
			document.getElementById('TaocheUp_zhezhao' + this.insIndex + "_" + i).style.visibility = 'hidden';
			document.getElementById('TaocheUp_jingdu' + this.insIndex + "_" + i).style.visibility = 'hidden';
		} //去掉进度条
		this.files[i].ajaxRes = t; //为数组对象补写ajaxRes属性
		if(!!t && this.files[i].typeClass == 'video') { //为video赋上地址
			document.getElementById('TaocheUpIndex' + this.insIndex + "_" + i).setAttribute('src', t);
			document.getElementById('TaocheUpIndex' + this.insIndex + "_" + i).setAttribute('controls', 'controls');
		}
	},

	_upOnProgress: function(i, e) {
		if(!!document.getElementById('TaocheUp_zhezhao' + this.insIndex + "_" + i)) {
			document.getElementById('TaocheUp_zhezhao' + this.insIndex + "_" + i).innerHTML = '上传中';
			document.getElementById('TaocheUp_jingdu' + this.insIndex + "_" + i).style.width = (parseInt(D('TaocheUp_zhezhao' + this.insIndex + "_" + i).style.width) * e.loaded / e.total).toFixed(0) + 'px';
		}
	}

};