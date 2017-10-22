/*
 * jQuery Nivo Slider v3.2
 * http://nivo.dev7studios.com
 *
 * Copyright 2012, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/*参数示例
$.fn.nivoSlider.defaults = { 
    effect: 'random', // 过渡效果 
    slices: 15, //effect为切片效果时的数量 
    boxCols: 8, //effect为格子效果时的列 
    boxRows: 4, //effect为格子效果时的行 
    animSpeed: 500, //动画速度 
    pauseTime: 3000, //图片切换速度 
    startSlide: 0, //从第几张开始 
    directionNav: true, //是否显示图片切换按钮(上/下页) 
    directionNavHide: true, //是否鼠标经过才显示 
    controlNav: true, // 显示序列导航 
    controlNavThumbs: false, // 显示图片导航 
    controlNavThumbsFromRel: false, // 使用img的rel属性作为缩略图地址 
    controlNavThumbsSearch: '.jpg', // 查找特定字符串(controlNavThumbs必须为true) 
    controlNavThumbsReplace: '_thumb.jpg', // 替换成这个字符(controlNavThumbs必须为true) 
    keyboardNav: true, // 键盘控制（左右箭头）PS:建议把代码中的keypress换成keydown,因为在Chrome下有兼容问题. 
    pauseOnHover: true, // 鼠标经过时暂停播放 
    manualAdvance: false, // 是否手动播放(false为自动播放幻灯片) 
    captionOpacity: 0.1, // 字幕透明度 
    prevText: 'Prev', 
    nextText: 'Next', 
    randomStart: false, //是否随机图片开始 
    beforeChange: function(){}, //动画开始前触发 
    afterChange: function(){}, //动画结束后触发 
    slideshowEnd: function(){}, // 本轮循环结束触发 
    lastSlide: function(){}, // 最后一张图片播放结束触发 
    afterLoad: function(){} // 加载完毕时触发 
}; 
上面的 $.fn.nivoSlider.defaults 是一个默认的设置对象,已经加上了相应的注释.

其中 effect 属性是用来设置动画效果的,分别有以下效果:

    random
    fold
    fade
    slideInLeft
    slideInRight
    sliceDown
    sliceDownRight
    sliceDownLeft
    sliceUp
    sliceUpRight
    sliceUpLeft
    sliceUpDown
    sliceUpDownLeft
    sliceUpDownRight
    boxRandom
    boxRain
    boxRainReverse
    boxRainGrow
    boxRainGrowReverse
*/
    (function($) {

    var NivoSlider = function(element, options){
        //Defaults are below
        var settings = $.extend({}, $.fn.nivoSlider.defaults, options);

        //Useful variables. Play carefully.
        var vars = {
            currentSlide: 0,
            currentImage: '',
            totalSlides: 0,
            running: false,
            paused: false,
            stop: false
        };
    
        //Get this slider
        var slider = $(element);
        slider.data('nivo:vars', vars);
        slider.css('position','relative');
        slider.addClass('nivoSlider');
        
        //Find our slider children
        var kids = slider.children().filter(function() {
          var child = $(this);
          return child.is('img') || child.find('img:first').length > 0;
        });
        kids.each(function() {
            var child = $(this);
            var link = '';
            if(!child.is('img')){
                if(child.is('a')){
                    child.addClass('nivo-imageLink');
                    link = child;
                }
                child = child.find('img:first');
            }
            //Get img width & height
            var childWidth = child.width();
            if(childWidth == 0) childWidth = child.attr('width');
            var childHeight = child.height();
            if(childHeight == 0) childHeight = child.attr('height');
            //Resize the slider
            if(childWidth > slider.width()){
                slider.width(childWidth);
            }
            if(childHeight > slider.height()){
                slider.height(childHeight);
            }
            if(link != ''){
                link.css('display','none');
            }
            child.css('display','none');
            vars.totalSlides++;
        });
        
        // Parse image source from an element.
        // Checks in data-src, then in src
        var parse_src = function(elem) {
          return elem.data('src') || elem.attr('src');
        }
        
        // Parse out the image URL string at the given child index.
        // Does no bounds checking!
        var parse_image = function(idx) {
          if($(kids[idx]).is('img')) {
            return $(kids[idx]);
          } else {
            return $(kids[idx]).find('img:first');
          }
        }
        
        // Preload the image in the kids collection at the given step from the current slide
        var preload_image = function(step) {
          var nxt = vars.currentSlide + step;
          if (nxt >= kids.length) nxt = 0
          else if (nxt < 0) nxt = 0;
          var img = parse_image(nxt);
          $('<img>').attr('src', img.data('src'));
          settings.onImageLoad.call(this, img);
        }
        
        //If randomStart
        if(settings.randomStart){
            settings.startSlide = Math.floor(Math.random() * vars.totalSlides);
        }
        
        //Set startSlide
        if(settings.startSlide > 0){
            if(settings.startSlide >= vars.totalSlides) settings.startSlide = vars.totalSlides - 1;
            vars.currentSlide = settings.startSlide;
        }
        
        //Get initial image
        if($(kids[vars.currentSlide]).is('img')){
            vars.currentImage = $(kids[vars.currentSlide]);
        } else {
            vars.currentImage = $(kids[vars.currentSlide]).find('img:first');
        }
        
        //Show initial link
        if($(kids[vars.currentSlide]).is('a')){
            $(kids[vars.currentSlide]).css('display','block');
        }
        
        //Set first background
        preload_image(0);
        slider.css('background','url("'+ parse_src(vars.currentImage) +'") no-repeat');
        settings.onImageLoad.call(this, vars.currentImage);
        settings.onImageChange.call(this, vars.currentImage);
        
        // Preload second image to transition into.
        // Given the first image some time to load!
        if (!settings.manualAdvance && kids.length > 1) {
          setTimeout(function() {
            preload_image(1);
          }, Math.max(1000, settings.pauseTime - 1000));
        }

        //Create caption
        slider.append(
            $('<div class="nivo-caption"><p></p></div>').css({ display:'none', opacity:settings.captionOpacity })
        );      
        
        // Cross browser default caption opacity
        $('.nivo-caption', slider).css('opacity', 0);
        
        // Process caption function
        var processCaption = function(settings){
            var nivoCaption = $('.nivo-caption', slider);
            if(vars.currentImage.attr('title') != '' && vars.currentImage.attr('title') != undefined){
                var title = vars.currentImage.attr('title');
                if(title.substr(0,1) == '#') title = $(title).html();   

                if(nivoCaption.css('opacity') != 0){
                    nivoCaption.find('p').stop().fadeTo(settings.animSpeed, 0, function(){
                        $(this).html(title);
                        $(this).stop().fadeTo(settings.animSpeed, 1);
                    });
                } else {
                    nivoCaption.find('p').html(title);
                }                   
                nivoCaption.stop().fadeTo(settings.animSpeed, settings.captionOpacity);
            } else {
                nivoCaption.stop().fadeTo(settings.animSpeed, 0);
            }
        }
        
        //Process initial  caption
        processCaption(settings);
        
        //In the words of Super Mario "let's a go!"
        var timer = 0;
        if(!settings.manualAdvance && kids.length > 1){
            timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
        }

        //Add Direction nav
        if(settings.directionNav){
            slider.append('<div class="nivo-directionNav"><a class="nivo-prevNav">'+ settings.prevText +'</a><a class="nivo-nextNav">'+ settings.nextText +'</a></div>');
            
            //Hide Direction nav
            if(settings.directionNavHide){
                $('.nivo-directionNav', slider).hide();
                slider.hover(function(){
                    $('.nivo-directionNav', slider).show();
                }, function(){
                    $('.nivo-directionNav', slider).hide();
                });
            }
            
            $('a.nivo-prevNav', slider).on('click', function(){
                if(vars.running) return false;
                clearInterval(timer);
                timer = '';
                vars.currentSlide -= 2;
                nivoRun(slider, kids, settings, 'prev');
            });
            
            $('a.nivo-nextNav', slider).on('click', function(){
                if(vars.running) return false;
                clearInterval(timer);
                timer = '';
                nivoRun(slider, kids, settings, 'next');
            });
        }
        
        //Add Control nav
        if(settings.controlNav && kids.length >1){
            var nivoControl = $('<div class="nivo-controlNav"></div>');
            slider.append(nivoControl);

            for(var i = 0; i < kids.length; i++){
                if(settings.controlNavThumbs){
                    var child = kids.eq(i);
                    if(!child.is('img')){
                        child = child.find('img:first');
                    }
                    if (settings.controlNavThumbsFromRel) {
                        nivoControl.append('<a class="nivo-control" rel="'+ i +'"><img src="'+ child.attr('rel') + '" alt="" /></a>');
                    } else {
                        nivoControl.append('<a class="nivo-control" rel="'+ i +'"><img src="'+ child.attr('src').replace(settings.controlNavThumbsSearch, settings.controlNavThumbsReplace) +'" alt="" /></a>');
                    }
                } else {
                    nivoControl.append('<a class="nivo-control" rel="'+ i +'">'+ (i + 1) +'</a>');
                }
                
            }
            //Set initial active link
            $('.nivo-controlNav a:eq('+ vars.currentSlide +')', slider).addClass('active');
            
            $('.nivo-controlNav a', slider).on('click', function(){
                if(vars.running) return false;
                if($(this).hasClass('active')) return false;
                clearInterval(timer);
                timer = '';
                slider.css('background','url("'+ parse_src(vars.currentImage) +'") no-repeat');
                vars.currentSlide = $(this).attr('rel') - 1;
                nivoRun(slider, kids, settings, 'control');
            });
        }
        
        //Keyboard Navigation
        if(settings.keyboardNav){
            $(window).keypress(function(event){
                //Left
                if(event.keyCode == '37'){
                    if(vars.running) return false;
                    clearInterval(timer);
                    timer = '';
                    vars.currentSlide-=2;
                    nivoRun(slider, kids, settings, 'prev');
                }
                //Right
                if(event.keyCode == '39'){
                    if(vars.running) return false;
                    clearInterval(timer);
                    timer = '';
                    nivoRun(slider, kids, settings, 'next');
                }
            });
        }
        
        //For pauseOnHover setting
        if(settings.pauseOnHover){
            slider.hover(function(){
                vars.paused = true;
                clearInterval(timer);
                timer = '';
            }, function(){
                vars.paused = false;
                //Restart the timer
                if(timer == '' && !settings.manualAdvance){
                    timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
                }
            });
        }
        
        //Event when Animation finishes
        slider.bind('nivo:animFinished', function(){ 
            vars.running = false; 
            //Hide child links
            $(kids).each(function(){
                if($(this).is('a')){
                    $(this).css('display','none');
                }
            });
            //Show current link
            if($(kids[vars.currentSlide]).is('a')){
                $(kids[vars.currentSlide]).css('display','block');
            }
            if(!vars.paused && !settings.manualAdvance){
                // Preload the next image (when found)
                preload_image(1);
                // Restart the timer
                if (timer == '' ) {
                  timer = setInterval(function(){ nivoRun(slider, kids, settings, false); }, settings.pauseTime);
                }
            }
            //Trigger the afterChange callback
            settings.afterChange.call(this);
        });
        
        // Add slices for slice animations
        var createSlices = function(slider, settings, vars){
            for(var i = 0; i < settings.slices; i++){
                var sliceWidth = Math.round(slider.width()/settings.slices);
                if(i == settings.slices-1){
                    slider.append(
                        $('<div class="nivo-slice"></div>').css({ 
                            left:(sliceWidth*i)+'px', width:(slider.width()-(sliceWidth*i))+'px',
                            height:'0px', 
                            opacity:'0', 
                            background: 'url("'+ parse_src(vars.currentImage) +'") no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%'
                        })
                    );
                } else {
                    slider.append(
                        $('<div class="nivo-slice"></div>').css({ 
                            left:(sliceWidth*i)+'px', width:sliceWidth+'px',
                            height:'0px', 
                            opacity:'0', 
                            background: 'url("'+ parse_src(vars.currentImage) +'") no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%'
                        })
                    );
                }
            }
        }
        
        // Add boxes for box animations
        var createBoxes = function(slider, settings, vars){
            var boxWidth = Math.round(slider.width()/settings.boxCols);
            var boxHeight = Math.round(slider.height()/settings.boxRows);
            
            for(var rows = 0; rows < settings.boxRows; rows++){
                for(var cols = 0; cols < settings.boxCols; cols++){
                    if(cols == settings.boxCols-1){
                        slider.append(
                            $('<div class="nivo-box"></div>').css({ 
                                opacity:0,
                                left:(boxWidth*cols)+'px', 
                                top:(boxHeight*rows)+'px',
                                width:(slider.width()-(boxWidth*cols))+'px',
                                height:boxHeight+'px',
                                background: 'url("'+ parse_src(vars.currentImage) +'") no-repeat -'+ ((boxWidth + (cols * boxWidth)) - boxWidth) +'px -'+ ((boxHeight + (rows * boxHeight)) - boxHeight) +'px'
                            })
                        );
                    } else {
                        slider.append(
                            $('<div class="nivo-box"></div>').css({ 
                                opacity:0,
                                left:(boxWidth*cols)+'px', 
                                top:(boxHeight*rows)+'px',
                                width:boxWidth+'px',
                                height:boxHeight+'px',
                                background: 'url("'+ parse_src(vars.currentImage) +'") no-repeat -'+ ((boxWidth + (cols * boxWidth)) - boxWidth) +'px -'+ ((boxHeight + (rows * boxHeight)) - boxHeight) +'px'
                            })
                        );
                    }
                }
            }
        }

        // Private run method
        var nivoRun = function(slider, kids, settings, nudge){
            //Get our vars
            var vars = slider.data('nivo:vars');
            
            //Trigger the lastSlide callback
            if(vars && (vars.currentSlide == vars.totalSlides - 1)){ 
                settings.lastSlide.call(this);
            }
            
            // Stop
            if((!vars || vars.stop) && !nudge) return false;
            
            //Trigger the beforeChange callback
            settings.beforeChange.call(this);
                    
            //Set current background before change
            if(!nudge){
                slider.css('background','url("'+ parse_src(vars.currentImage) +'") no-repeat');
            } else {
                if(nudge == 'prev'){
                    slider.css('background','url("'+ parse_src(vars.currentImage) +'") no-repeat');
                }
                if(nudge == 'next'){
                    slider.css('background','url("'+ parse_src(vars.currentImage) +'") no-repeat');
                }
            }
            vars.currentSlide++;
            //Trigger the slideshowEnd callback
            if(vars.currentSlide == vars.totalSlides){ 
                vars.currentSlide = 0;
                settings.slideshowEnd.call(this);
            }
            if(vars.currentSlide < 0) vars.currentSlide = (vars.totalSlides - 1);
            //Set vars.currentImage
                        vars.currentImage = parse_image(vars.currentSlide);
            //Set active links
            if(settings.controlNav){
                $('.nivo-controlNav a', slider).removeClass('active');
                $('.nivo-controlNav a:eq('+ vars.currentSlide +')', slider).addClass('active');
            }
                        // Trigger event that a new image has been selected
                        settings.onImageChange.call(this, vars.currentImage);
            
            //Process caption
            processCaption(settings);
            
            // Remove any slices from last transition
            $('.nivo-slice', slider).remove();
            
            // Remove any boxes from last transition
            $('.nivo-box', slider).remove();
            
            var currentEffect = settings.effect;
            //Generate random effect
            if(settings.effect == 'random'){
                var anims = new Array('sliceDownRight','sliceDownLeft','sliceUpRight','sliceUpLeft','sliceUpDown','sliceUpDownLeft','fold','fade',
                'boxRandom','boxRain','boxRainReverse','boxRainGrow','boxRainGrowReverse');
                currentEffect = anims[Math.floor(Math.random()*(anims.length + 1))];
                if(currentEffect == undefined) currentEffect = 'fade';
            }
            
            //Run random effect from specified set (eg: effect:'fold,fade')
            if(settings.effect.indexOf(',') != -1){
                var anims = settings.effect.split(',');
                currentEffect = anims[Math.floor(Math.random()*(anims.length))];
                if(currentEffect == undefined) currentEffect = 'fade';
            }
            
            //Custom transition as defined by "data-transition" attribute
            if(vars.currentImage.attr('data-transition')){
                currentEffect = vars.currentImage.attr('data-transition');
            }
        
            //Run effects
            vars.running = true;
            if(currentEffect == 'sliceDown' || currentEffect == 'sliceDownRight' || currentEffect == 'sliceDownLeft'){
                createSlices(slider, settings, vars);
                var timeBuff = 0;
                var i = 0;
                var slices = $('.nivo-slice', slider);
                if(currentEffect == 'sliceDownLeft') slices = $('.nivo-slice', slider)._reverse();
                
                slices.each(function(){
                    var slice = $(this);
                    slice.css({ 'top': '0px' });
                    if(i == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } 
            else if(currentEffect == 'sliceUp' || currentEffect == 'sliceUpRight' || currentEffect == 'sliceUpLeft'){
                createSlices(slider, settings, vars);
                var timeBuff = 0;
                var i = 0;
                var slices = $('.nivo-slice', slider);
                if(currentEffect == 'sliceUpLeft') slices = $('.nivo-slice', slider)._reverse();
                
                slices.each(function(){
                    var slice = $(this);
                    slice.css({ 'bottom': '0px' });
                    if(i == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } 
            else if(currentEffect == 'sliceUpDown' || currentEffect == 'sliceUpDownRight' || currentEffect == 'sliceUpDownLeft'){
                createSlices(slider, settings, vars);
                var timeBuff = 0;
                var i = 0;
                var v = 0;
                var slices = $('.nivo-slice', slider);
                if(currentEffect == 'sliceUpDownLeft') slices = $('.nivo-slice', slider)._reverse();
                
                slices.each(function(){
                    var slice = $(this);
                    if(i == 0){
                        slice.css('top','0px');
                        i++;
                    } else {
                        slice.css('bottom','0px');
                        i = 0;
                    }
                    
                    if(v == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ height:'100%', opacity:'1.0' }, settings.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    v++;
                });
            } 
            else if(currentEffect == 'fold'){
                createSlices(slider, settings, vars);
                var timeBuff = 0;
                var i = 0;
                
                $('.nivo-slice', slider).each(function(){
                    var slice = $(this);
                    var origWidth = slice.width();
                    slice.css({ top:'0px', height:'100%', width:'0px' });
                    if(i == settings.slices-1){
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            }  
            else if(currentEffect == 'fade'){
                createSlices(slider, settings, vars);
                
                var firstSlice = $('.nivo-slice:first', slider);
                firstSlice.css({
                    'height': '100%',
                    'width': slider.width() + 'px'
                });
    
                firstSlice.animate({ opacity:'1.0' }, (settings.animSpeed*2), '', function(){ slider.trigger('nivo:animFinished'); });
            }          
            else if(currentEffect == 'slideInRight'){
                createSlices(slider, settings, vars);
                
                var firstSlice = $('.nivo-slice:first', slider);
                firstSlice.css({
                    'height': '100%',
                    'width': '0px',
                    'opacity': '1'
                });

                firstSlice.animate({ width: slider.width() + 'px' }, (settings.animSpeed*2), '', function(){ slider.trigger('nivo:animFinished'); });
            }
            else if(currentEffect == 'slideInLeft'){
                createSlices(slider, settings, vars);
                
                var firstSlice = $('.nivo-slice:first', slider);
                firstSlice.css({
                    'height': '100%',
                    'width': '0px',
                    'opacity': '1',
                    'left': '',
                    'right': '0px'
                });

                firstSlice.animate({ width: slider.width() + 'px' }, (settings.animSpeed*2), '', function(){ 
                    // Reset positioning
                    firstSlice.css({
                        'left': '0px',
                        'right': ''
                    });
                    slider.trigger('nivo:animFinished'); 
                });
            }
            else if(currentEffect == 'boxRandom'){
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                var boxes = shuffle($('.nivo-box', slider));
                boxes.each(function(){
                    var box = $(this);
                    if(i == totalBoxes-1){
                        setTimeout(function(){
                            box.animate({ opacity:'1' }, settings.animSpeed, '', function(){ slider.trigger('nivo:animFinished'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            box.animate({ opacity:'1' }, settings.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 20;
                    i++;
                });
            }
            else if(currentEffect == 'boxRain' || currentEffect == 'boxRainReverse' || currentEffect == 'boxRainGrow' || currentEffect == 'boxRainGrowReverse'){
                createBoxes(slider, settings, vars);
                
                var totalBoxes = settings.boxCols * settings.boxRows;
                var i = 0;
                var timeBuff = 0;
                
                // Split boxes into 2D array
                var rowIndex = 0;
                var colIndex = 0;
                var box2Darr = new Array();
                box2Darr[rowIndex] = new Array();
                var boxes = $('.nivo-box', slider);
                if(currentEffect == 'boxRainReverse' || currentEffect == 'boxRainGrowReverse'){
                    boxes = $('.nivo-box', slider)._reverse();
                }
                boxes.each(function(){
                    box2Darr[rowIndex][colIndex] = $(this);
                    colIndex++;
                    if(colIndex == settings.boxCols){
                        rowIndex++;
                        colIndex = 0;
                        box2Darr[rowIndex] = new Array();
                    }
                });
                
                // Run animation
                for(var cols = 0; cols < (settings.boxCols * 2); cols++){
                    var prevCol = cols;
                    for(var rows = 0; rows < settings.boxRows; rows++){
                        if(prevCol >= 0 && prevCol < settings.boxCols){
                            /* Due to some weird JS bug with loop vars 
                            being used in setTimeout, this is wrapped
                            with an anonymous function call */
                            (function(row, col, time, i, totalBoxes) {
                                var box = $(box2Darr[row][col]);
                                var w = box.width();
                                var h = box.height();
                                if(currentEffect == 'boxRainGrow' || currentEffect == 'boxRainGrowReverse'){
                                    box.width(0).height(0);
                                }
                                if(i == totalBoxes-1){
                                    setTimeout(function(){
                                        box.animate({ opacity:'1', width:w, height:h }, settings.animSpeed/1.3, '', function(){ slider.trigger('nivo:animFinished'); });
                                    }, (100 + time));
                                } else {
                                    setTimeout(function(){
                                        box.animate({ opacity:'1', width:w, height:h }, settings.animSpeed/1.3);
                                    }, (100 + time));
                                }
                            })(rows, prevCol, timeBuff, i, totalBoxes);
                            i++;
                        }
                        prevCol--;
                    }
                    timeBuff += 100;
                }
            }
        }
        
        // Shuffle an array
        var shuffle = function(arr){
            for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
            return arr;
        }
        
        // For debugging
        var trace = function(msg){
            if (this.console && typeof console.log != "undefined")
                console.log(msg);
        }
        
        // Start / Stop
        this.stop = function(){
            if(!$(element).data('nivo:vars').stop){
                $(element).data('nivo:vars').stop = true;
                trace('Stop Slider');
            }
        }
        
        this.start = function(){
            if($(element).data('nivo:vars').stop){
                $(element).data('nivo:vars').stop = false;
                trace('Start Slider');
            }
        }
        
        //Trigger the afterLoad callback
        settings.afterLoad.call(this);
        
        return this;
    };
        
    $.fn.nivoSlider = function(options) {
    
        return this.each(function(key, value){
            var element = $(this);
            // Return early if this element already has a plugin instance
            if (element.data('nivoslider')) return element.data('nivoslider');
            // Pass options to plugin constructor
            var nivoslider = new NivoSlider(this, options);
            // Store plugin object in this element's data
            element.data('nivoslider', nivoslider);
        });

    };
    
    //Default settings
    $.fn.nivoSlider.defaults = {
        effect: 'random',
        slices: 15,
        boxCols: 8,
        boxRows: 4,
        animSpeed: 500,
        pauseTime: 3000,
        startSlide: 0,
        directionNav: true,
        directionNavHide: true,
        controlNav: true,
        controlNavThumbs: false,
        controlNavThumbsFromRel: false,
        controlNavThumbsSearch: '.jpg',
        controlNavThumbsReplace: '_thumb.jpg',
        keyboardNav: true,
        pauseOnHover: true,
        manualAdvance: false,
        captionOpacity: 0.8,
        prevText: 'Prev',
        nextText: 'Next',
        randomStart: false,
        beforeChange: function(){},
        afterChange: function(){},
        slideshowEnd: function(){},
        lastSlide: function(){},
        afterLoad: function(){},
        onImageLoad: function(img) {},
        onImageChange: function() {}
    };
    
    $.fn._reverse = [].reverse;
    
})(jQuery);