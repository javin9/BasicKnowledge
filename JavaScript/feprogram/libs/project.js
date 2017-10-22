var path = require('path')
var config = require('./config')

module.exports = function(name){
	var project = {}
  var sep = name.split(path.posix.sep);//系统分隔符
  var originName = name
  var nameArr

  name = sep[0]
  nameArr = name.split(config.SEP)

	project.name = name
  project.path = path.join(config.srcDir, name)
  project.configFilePath = path.join(config.srcDir, name, config.configFileName)
  project.files = (require(project.configFilePath) || []).filter(function(item){
    return path.posix.join(name, item).indexOf(originName) === 0
  })

  project.info = {
    prune: nameArr[0],
    postfix: nameArr[1] || '',
    isCommon: config.COMMON_PROJECT === nameArr[0],
    relatedCommon:  (nameArr[0] = config.COMMON_PROJECT) && nameArr.join(config.SEP)
  }

  project.config = {
  	entry: {},
    html: []
  }

	project.files.map(function(filePath){
    var relPath = path.join(name, filePath)

    // fix for windows
    var key = relPath.replace(config.EXT.SCRIPT, '').replace(/\\/g, '/')

    // 处理entry
		project.config.entry[key] = path.join(project.path, filePath)

    // 处理html
    // common不作处理
    if(!project.info.isCommon){
      project.config.html.push({
        filename : filePath.replace(config.EXT.SCRIPT, config.EXT.HTML),
        template: path.join(config.SRC, name, path.dirname(filePath), config.HTML, path.basename(filePath, config.EXT.SCRIPT) + config.EXT.TEMPLATE),
        script : path.posix.join('/', key + config.EXT.SCRIPT),
        common: path.posix.join('/', project.info.relatedCommon,config.COMMON_PROJECT + config.EXT.SCRIPT)
      })
    }
	})
  
  return project
}