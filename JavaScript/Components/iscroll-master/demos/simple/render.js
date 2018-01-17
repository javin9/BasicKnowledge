(function(factory) {

    if (typeof module === 'object' && module.export) {
        module.export = factory($, _, window)
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory)
    } else if (typeof window !== 'undefined') {
        window.htmlRender = factory($, _, window)
    }

})(function($, _, window) {
    if (typeof $ == "undefined" || typeof _ == "undefined") {
        return false;
    }
    /*默认值*/
    var extend = function(destination, source) {
        if (!destination) return source;
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    };

    //获取模板 
    var getTemplate = function(templateId) {
        if (typeof templateId == 'undefined' || !templateId) {
            throw Error('模板为空');
            return false;
        }
        return _.template($(templateId).html());
    };
    var defaultOptions = {
        containerid: null,
        templateid: null,
        data: null,
        type: "html"
    };

    var render = function(options) {
        var renderWay = "html";
        /*模板配置*/
        _.templateSettings = {
            evaluate: /{([\s\S]+?)}/g,
            interpolate: /{=([\s\S]+?)}/g,
            escape: /{-([\s\S]+?)}/g
        };
        var destination = extend(defaultOptions, options || {});
        if (!destination.data.data) {
            return false;
        }
        var template = getTemplate(destination.templateid);
        var returnStr = template(destination.data);
        $(destination.containerid)[destination.type](returnStr);
    };

    return {
        render: render
    };

})

/*
 htmlRender.render({
                        containerid: "#cityCarlist ul",
                        templateid: "#cityCarListTemplate",
                        data: {
                            listtype: 1,
                            size: opt.size,
                            index: opt.index,
                            data: opt.data,
                            model: hidMode
                        },
                        type: opt.way
                    });
*/