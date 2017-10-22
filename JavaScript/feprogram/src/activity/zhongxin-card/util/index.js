export function baseProps(attr){
	return document.getElementById('app').getAttribute(attr.replace(/([A-Z])/g, '-$1').toLowerCase())
}