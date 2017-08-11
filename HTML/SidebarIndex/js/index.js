window.onload=function () {
	console.log(app.data);
	/* body... */
	var ul=document.querySelector('.siderbar-container-ul');
	var frag=createLi(app.data);
	ul.appendChild(frag);
    taocheScroll.scroll("#wrap","#list");
}
function  createLi(data) {
	var frag=document.createDocumentFragment();
	for (var i = 0,len=data.length; i < len; i++) {
		var li=document.createElement('li');
		var a=document.createElement('a');
		a.innerText=data[i];
			 a.href="#";
		li.appendChild(a);
		frag.appendChild(li);
	}
	return frag;
}