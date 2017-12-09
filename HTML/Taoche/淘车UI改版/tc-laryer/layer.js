$(function () {
	createLi();

	// window.setTimeout(function () {
	// 	$("#barginWrapper").toggleClass('hide');
	// },2000)
	$(".header-section").click(function() {
		
	});
})

function createLi(){
	var frag=document.createDocumentFragment();
	for (var i = 0; i <100; i++) {
		var ele=document.createElement('li');
		ele.innerText='我是李'+i;
		frag.appendChild(ele);
	}
	$(".container-section ul").html(frag);
}