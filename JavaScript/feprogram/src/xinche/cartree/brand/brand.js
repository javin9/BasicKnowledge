import './brand.scss'


window.selCityCallback = function(obj) {
    var brandHref=obj.url,
        httpsubstr=brandHref.substr(0,brandHref.indexOf('.com')),
        brandsubstr=brandHref.substr(brandHref.indexOf('brand'));
    window.location.href = httpsubstr+'.com/'+ obj.citySpell+'/'+brandsubstr;

};
