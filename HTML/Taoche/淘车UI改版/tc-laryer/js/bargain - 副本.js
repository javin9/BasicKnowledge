    var htmlRender = (function($, _, window) {
        if (typeof $ == "undefined" || typeof _ == "undefined") {
            throw new Error('$,_,is undefined');
            return false;
        }
        /*默认值*/
        var extend = function(destination, source) {
            if (!destination) return source;
            for (var property in source) {
                if (!!property) {
                    destination[property] = source[property];
                }
            }
            return destination;
        };

        //获取模板 
        var getTemplate = function(templateId) {
            if (typeof templateId == 'undefined' || !templateId) {
                throw new Error('templateId is undefined');
                return false;
            }
            return _.template($(templateId).html());
        };
        var defaultOptions = {
            containerid: document,
            templateid: null,
            data:{},
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
            // if (!destination.data) {
            //     return false;
            // }
            var template = getTemplate(destination.templateid);
            var returnStr = template(destination.data);
            $(destination.containerid)[destination.type](returnStr);
        };

        return {
            render: render
        };

    })($, _, window);

    console.log(htmlRender);
    //sendCodeTemplate
    htmlRender.render({
        containerid:"#detail_flexible_wrapper",
        templateid: "#barginTemplate",
        type:"append"
    });