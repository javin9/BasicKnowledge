import '../css/date.scss';
Date.prototype.daysShift = function(count) {
    return new Date(this.getTime() + 3600 * 24 * 1000 * count);
}

Date.prototype.monthsAfter = function(count) {
    var year = this.getFullYear();
    var month = this.getMonth();
    var date = this.getDate();
    var a, b;
    b = (month + count) % 12;
    a = (month + count - b) / 12;
    return new Date(year + a, b, date);
}

Date.prototype.monthsBefore = function(count) {
    var year = this.getFullYear();
    var month = this.getMonth();
    var date = this.getDate();
    var a, b;
    a = 0;
    b = month;
    while (b < count) {
        b += 12;
        a++;
    }
    return new Date(year - a, b - count, date);
}

Date.prototype.yearsShift = function(count) {
    return new Date(this.getFullYear() + count, this.getMonth(), this.getDate());
}

Date.prototype.yyyyMMdd = function() {
    var year = ''+this.getFullYear();
    var month = '0'+(this.getMonth()+1);
    var date = '0'+this.getDate();
    return [year, month.slice(-2), date.slice(-2)].join('-');
}

Date.prototype.yyyyMMddHHmmss = function() {
    var hour = '0'+this.getHours();
    var minute = '0'+this.getMinutes();
    var second = '0'+this.getSeconds();
    return this.yyyyMMdd() + ' ' + [hour.slice(-2), minute.slice(-2), second.slice(-2)].join(':');
}

Date.wxbFromString = function(str) {
    var dpart;
    var tpart;
    if (/^\d+-\d{2}-\d{2}$/.test(str)) {
        dpart = (str.split(' ')[0]).split('-');
        return new Date(+dpart[0], +(dpart[1])-1, +dpart[2]);
    }
    else if (/^\d+-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
        dpart = (str.split(' ')[0]).split('-');
        tpart = (str.split(' ')[1]).split(':');
        return new Date(+dpart[0], +(dpart[1])-1, +dpart[2], +tpart[0], +tpart[1], +tpart[2]);
    }
    else {
        console.log('invalid format');
    }
}

/**
 * 时间对象的格式化;
 */
Date.prototype.Format = Date.prototype.format = function(format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" : this.getMonth() + 1, // month
        "d+" : this.getDate(), // day
        "h+" : this.getHours(), // hour
        "m+" : this.getMinutes(), // minute
        "s+" : this.getSeconds(), // second
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" : this.getMilliseconds()
        // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                        - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
//Date.Format = Date.format;
;jQuery.fn.DatePicker = function(options) {
    var _minDate = new Date(1970, 0, 1);
    var _maxDate = new Date(2100, 11, 31);
    var _date = new Date();
    var parts;
    if (/^\d+-\d\d-\d\d$/.test(this.val())) {
        parts = this.val().split('-');
        _date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    }
    
    if (options) {
        _minDate = options.minDate || _minDate;
        _maxDate = options.maxDate || _maxDate;
        _date = options.date || _date;
    }
    
    $.each([_date, _minDate, _maxDate], function(i, d) {
        if(!options.showHour){
            d.setHours(0);
        }
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
    })
    
    if (_date.getTime() > _maxDate.getTime()) {
        _date = _maxDate;
    }
    if (_date.getTime() < _minDate.getTime()) {
        _date = _minDate;
    }
    
    var _this = this;
    
    var years = [];
    var months = [];
    var dates = [];
    var hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    //var hours = hoursPool.filter(function(item){
    //        return item>=new Date().getHours();
    //    }
    //);


    var i;
    for (i = _minDate.getFullYear(); i <= _maxDate.getFullYear(); i++) {
        years.push(i);
    }
    
    for (i = 0; i < 12; i++) {
        months.push(i+1);
    }

    for (i = 1; i <= 31; i++) {
        dates.push(i);
    }
    
    var colNum = 4;
    var showYear = true;
    if (options && options.showYear === false) {
        showYear = false;
        colNum--;
    }
    var showMonth = true;
    if (options && options.showMonth === false) {
        showMonth = false;
        colNum--;
    }
    var showDate = true;
    if (options && options.showDate === false) {
        showDate = false;
        colNum--;
    }
    
    var showHour = true;
    if (!options.showHour) {
        showHour = false;
        colNum--;
    }
    var cellHeight_div = $("<div class='cellHeight_div' style='height:1.333333rem;'></div>").appendTo($("body"));
    $(".cellHeight_div").hide();
    var cellHeight = $(".cellHeight_div").height();

    function clamp(y, dy) {
        var idx = y / cellHeight + 0.5;
        if (dy < 0) {
            return Math.floor(idx + 0.3);
        }
        else if (dy > 0) {
            return Math.floor(idx - 0.3);
        }
        else {
            return Math.floor(idx);
        }
    }
    
    function duration(dy) {
        return Math.min(700, 200 * Math.sqrt(Math.abs(dy)/cellHeight));
    }
    
    var trackingCount = 0;
    
    function Column(values, unit, rotate) {
        this.values = values;
        this.unit = unit;
        this.columnDiv = $('<div>').addClass('wxb-date-picker-column');
        var _this = this;
        this.segWrapper = $('<div>').addClass('wxb-date-picker-seg-wrapper').appendTo(this.columnDiv);
        this.leadingSeg = $('<div>').addClass('wxb-date-picker-seg').appendTo(this.segWrapper);
        var valueCount = values.length;
        var repeat = 1;
        this.rotate = false
        if (rotate === true) {
            repeat = 3;
            this.rotate = true
        }
        while (repeat > 0) {
            $.each(values, function(i, value) {
                $('<div>').addClass('wxb-date-picker-seg').text(value).appendTo(_this.segWrapper);
            });
            repeat--;
        }
        
        this.trailingSeg = $('<div>').addClass('wxb-date-picker-seg').appendTo(this.segWrapper);
        $('<div>').addClass('wxb-date-picker-unit').text(unit).appendTo(this.columnDiv);
        
        var initY;
        var initOffsetY;
        
        var lastY = undefined;
        var dy = 0;
        
        var shouldHandle = false;
        
        function adjustScrollTop(top) {
            if (rotate) {
                if (top < valueCount * cellHeight) {
                    return top + valueCount * cellHeight;
                }
                if (top > valueCount * cellHeight * 2) {
                    return top - valueCount * cellHeight;
                }
            }
            return top
        }
        
        function handleMouseMove(event) {
            var y = event.pageY;
            if (shouldHandle) {
                _this.segWrapper.scrollTop(adjustScrollTop(initOffsetY + initY - y));
                if (lastY !== undefined) {
                    dy = y - lastY;
                }
                lastY = y;
            }
        }
        
        function handleMouseUp(event) {
            var index;
            if (shouldHandle) {
                index = clamp(_this.segWrapper.scrollTop(), dy);
                _this.segWrapper.animate({scrollTop:index * cellHeight}, duration(_this.segWrapper.scrollTop() - index * cellHeight));
            }
            lastY = undefined;
            dy = 0;
            shouldHandle = false;
        }
        
        this.columnDiv.on('mousedown', function(event) {
            initY = event.pageY;
            initOffsetY = _this.segWrapper.scrollTop();
            event.stopPropagation();
            event.preventDefault();
            shouldHandle = true;
            _this.columnDiv.stop();
        });
        $(window).on('mousemove', handleMouseMove);
        $(window).on('mouseup', handleMouseUp);
        
        var hasTouch = false;
        var columnDivElement = this.columnDiv.get(0);
        function handleTouchStart(event) {
            if (event.targetTouches.length && !hasTouch) {
                initY = event.targetTouches.item(0).pageY;
                initOffsetY = _this.segWrapper.scrollTop();
                hasTouch = true;
                columnDivElement.addEventListener('touchmove', handleTouchMove);
                columnDivElement.addEventListener('touchend', handleTouchEnd);
                columnDivElement.addEventListener('touchcancel', handleTouchEnd);
                _this.columnDiv.stop();
                trackingCount++;
            }
            event.stopPropagation();
            event.preventDefault();
        }
        
        function handleTouchMove(event) {
            var y;
            if (event.targetTouches.length && hasTouch) {
                y = event.targetTouches.item(0).pageY;
                _this.segWrapper.scrollTop(adjustScrollTop(initOffsetY + initY - y));
                if (lastY !== undefined) {
                    dy = y - lastY;
                }
                lastY = y;
            }
        }
        
        function handleTouchEnd(event) {
            var index;
            if (hasTouch) {
                index = clamp(_this.segWrapper.scrollTop(), dy);
                _this.segWrapper.animate({scrollTop:index * cellHeight}, duration(_this.segWrapper.scrollTop() - index * cellHeight));
                hasTouch = false;
                lastY = undefined;
                dy = 0;
                columnDivElement.removeEventListener('touchmove', handleMouseMove)
                columnDivElement.removeEventListener('touchend', handleTouchEnd);
                columnDivElement.removeEventListener('touchcancel', handleTouchEnd);
                trackingCount--;
            }
        }
        
        columnDivElement.addEventListener('touchstart', handleTouchStart);
    }
    
    Column.prototype.getValue = function() {
        return this.values[clamp(this.segWrapper.scrollTop()) % this.values.length];
    }
    
    Column.prototype.setValue = function(value, animated) {
        var index = this.values.indexOf(value);
        if (index != -1) {
            if (this.rotate) {
                index += this.values.length;
            }
            if (animated) {
                this.segWrapper.animate({scrollTop:index * cellHeight}, duration(this.segWrapper.scrollTop() - index * cellHeight));
            }
            else {
                this.segWrapper.scrollTop(index * cellHeight);
            }
        }
    }
    
    var datePickerDiv = $('<div>').addClass('wxb-date-picker').appendTo(document.body);
    var overlay = $('<div>').addClass('wxb-date-picker-overlay').appendTo(datePickerDiv);
    
    var dialog = $('<div>').addClass('wxb-date-picker-dialog').appendTo(datePickerDiv);
    
    var hint = $('<div>').addClass('wxb-date-picker-hint').appendTo(dialog);
    
    var columnDivs = $('<div>').addClass('wxb-date-picker-columns').addClass('wxb-date-picker-columns'+colNum).appendTo(dialog);
    
    $('<div>').addClass('wxb-date-picker-separator-h1').appendTo(columnDivs);
    $('<div>').addClass('wxb-date-picker-separator-h2').appendTo(columnDivs);
    
    var yearColumn = new Column(years, '年');
    var monthColumn = new Column(months, '月', true);
    var dateColumn = new Column(dates, '日', true);
    var hourColumn = new Column(hours, '时', true);

    if (showYear) {
        yearColumn.columnDiv.appendTo(columnDivs);
    }
    if (showMonth) {
        monthColumn.columnDiv.appendTo(columnDivs);
    }
    if (showDate) { 
        dateColumn.columnDiv.appendTo(columnDivs);
    }
    
    if (showHour) {
        hourColumn.columnDiv.appendTo(columnDivs);
    }
    if(options.minDateName==undefined)
        options.minDateName = "minDate";
    if (options.maxDateName == undefined)
        options.maxDateName = "maxDate";
    var footerDiv = $('<div class="date-footer"><hidden name="' + options.minDateName + '" value="' + _minDate + '" /><hidden name="' + options.maxDateName + '" value="' + _maxDate + '"/>').appendTo(dialog);
    var cancel = $('<div>').addClass('wxb-date-picker-cancel noborder x-thin-border-top').appendTo(footerDiv).text('取消');
    var confirm = $('<div>').addClass('wxb-date-picker-confirm noborder x-thin-border-top').appendTo(footerDiv).text('确定');
    function format(d) {
        var arr = [];
        if (showYear) {
            arr.push(d.getFullYear() + '');
        }
        if (showMonth) {
            arr.push(('0'+(d.getMonth() + 1)).slice(-2));
        }
        if (showDate) {
            arr.push(('0'+d.getDate()).slice(-2));
        }
        if (showHour) {
            arr.push(('0'+d.getHours()).slice(-2));
        }
        return arr.join('-');
    }
    
    function description(d) {
        var res = '';
        if (showYear) {
            res += d.getFullYear() + '年';
        }
        if (showMonth) {
            res += (d.getMonth() + 1) + '月';
        }
        if (showDate) {
            res += d.getDate() + '日';
        }
        if (showHour) {
            res += d.getHours() + '时';
        }
        return res;
    }
    
    function adjustToDate(animated) {
        yearColumn.setValue(_date.getFullYear(), animated);
        monthColumn.setValue(_date.getMonth() + 1, animated);
        dateColumn.setValue(_date.getDate(), animated);
        hourColumn.setValue(_date.getHours(), animated);
        $(".wxb-date-picker-seg").height(cellHeight);
        $(".wxb-date-picker-separator-h1").css("top",cellHeight);
    }
    
    confirm.on('click', function () {
        yearColumn.segWrapper.stop(false, true);
        monthColumn.segWrapper.stop(false, true);
        dateColumn.segWrapper.stop(false, true);
        hourColumn.segWrapper.stop(false, true);
        if (trackingCount > 0) {
            return;
        }
        var date = new Date(yearColumn.getValue(), monthColumn.getValue() - 1, dateColumn.getValue(), hourColumn.getValue());
        var temp = _date;
        if (date.getDate() != dateColumn.getValue()) {
            _date = date;
            adjustToDate(true);
            _date = temp;
            return;
        }
        _date = date;
        //设置min、maxdate
        if (options.minDateName != "minDate") {
            var minDate = $("hidden[name='" + options.minDateName + "']").attr('value');
            _minDate = new Date(minDate);
        }
        if (options.maxDateName != "maxDate") {
            var maxDate = $("hidden[name='" + options.maxDateName + "']").attr('value');
            _maxDate = new Date(maxDate);
        }
        var moduleTitle = options.moduleTitle || '';
        var titleFor = options.titleFor || '';
        var fullTitle = options.fullTitle || '';
        if (_date.getTime() > _maxDate.getTime()) {
            _date = _maxDate;
            if (fullTitle != '' && (titleFor == "MaxDate" || titleFor==''))
                hint.html('<span>' + fullTitle + '</span>');
            else
                hint.html('<span>' + moduleTitle + '最晚为</span><span class="hint-text">' + description(_maxDate) + '</span>');
            adjustToDate(true);
            return;
        }
        if (_date.getTime() < _minDate.getTime()) {
            _date = _minDate;
            if (fullTitle != '' && (titleFor == "MinDate" || titleFor == ''))
                hint.html('<span>' + fullTitle + '</span>');
            else
                hint.html('<span>' + moduleTitle + '最早为</span><span class="hint-text">' + description(_minDate) + '</span>');
            adjustToDate(true);
            return;
        }

        hint.html('');
        _this.val(format(_date));
        if (options && options.onSelectDate) {
            options.onSelectDate(_date);
        }
        datePickerDiv.remove();
        if (!window.sourceFlag) {
            //$('.page-header').show();
        }
    });
    
    cancel.on('click', function() {
        yearColumn.segWrapper.stop(false, true);
        monthColumn.segWrapper.stop(false, true);
        dateColumn.segWrapper.stop(false, true);
        datePickerDiv.remove();
        if (!window.sourceFlag) {
            //$('.page-header').show();
        }
    });
    $(document).delegate(this,'click', function(event) {
         //$('.page-header').hide();
        // _this.blur();
        datePickerDiv.show();
        adjustToDate(true);
    });
    
    return this;
};