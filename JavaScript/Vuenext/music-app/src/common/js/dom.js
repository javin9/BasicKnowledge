export function addClass(ele,classname){
 if (!hasClass(ele,classname)) {
 	let classArray=ele.classname.split(' ');
 	classArray.push(classname);
 	ele.classname=classArray.join(' ');
 }
}

export function hasClass(ele,classname){
	var reg=new new RegExp('(^|\\s)'+classname+'(\\s|$)');
	return reg.test(ele.classname);
}