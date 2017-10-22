import hideType from 'libs/hideType'

if(hideType.header){
  var headerDom = document.getElementById("indexHeader");
  if(headerDom) {
      headerDom.style.cssText = "display:none;";
  }
}

if(hideType.nav){
  var headerBarDom = document.getElementsByClassName("header-bar");
  if (headerBarDom.length) {
      headerBarDom[0].style.cssText = "display:none;";
  }
}

if(hideType.footer || hideType.about){
  document.onreadystatechange = function(){
		if(document.readyState == 'complete'){
      var footerDom = document.getElementsByClassName("escdk13");
      var aboutDom = document.getElementsByClassName("escdk132");
	    if(hideType.footer && footerDom.length){
	    	footerDom[0].style.cssText = "display:none;";
	    }else if(hideType.about && aboutDom.length){
	    	aboutDom[0].style.cssText = "display:none;";
	    }
		}
	} 
}