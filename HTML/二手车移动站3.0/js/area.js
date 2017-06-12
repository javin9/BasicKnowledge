$(function () {
    var $body = $('body');
    $body.on('areainit', function (ev, options) {
        var settting = {
            $continer: null,
            notetop:0,
            ds: [],
            flatFn: function (ds) {
                return ds;
            },
            fnEnd: null
        };

        options = Object.extend(options, settting);
        if (!options.$continer) { console.log('缺少对象'); return };

        function callBack(arr) {
            this.html(arr[0]);
            $body.find('.fixed-nav').html(arr[1]);
            $body.trigger('note', { noteTouchStart: options.noteTouchStart, noteTouchEnd: options.noteTouchEnd,top:options.notetop });
                
            options.fnEnd && options.fnEnd.call(options.$continer);
        }

        if (typeof options.ds == 'string') {
            options.$continer.swipeApi({
                url: options.ds,
                flatFn: options.flatFn,
                analysis: function (data) {
                    //主品牌模板
                    var tp1 = $('#areaTemplate', $body).html();
                    var template = _.template(tp1);
                    //导航模板
                    var tp2 = $('#navTemplate', $body).html();
                    var template2 = _.template(tp2);

                    return [template(data), template2(data)];
                },
                callback: function (html) {
                    callBack.call(options.$continer, html);
                }
            })
        } else {
            options.$continer.swipeData({
                data: options.ds,
                flatFn: options.flatFn,
                analysis: function (data) {
                    //主品牌模板
                    var tp1 = $('#areaTemplate', $body).html();
                    var template = _.template(tp1);
                    //导航模板
                    var tp2 = $('#navTemplate', $body).html();
                    var template2 = _.template(tp2);

                    return [template(data), template2(data)];
                },
                callback: function (html) {
                    callBack.call(options.$continer, html);
                }
            })
        }
    })
});