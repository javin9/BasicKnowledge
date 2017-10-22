import '../css/searchCar.scss';
var searchCarFn = {
    init:function(){
        var searchCarHtml = '<div class="form_box search_car">'+
                '<header class="top_title">'+
                    '<a href="javascript:void(0);" name="search" class="return"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAr9JREFUOBGVlEtoU1EQhnvzgojgEwSji4AxuAgESgUVi6jx1TxIIVCq+FipS90JgoIoiAtBCnHlRkQwmnctVavtRkQi3WgWyaIuCl0VXWiUPP3m9t5wE5MmOXByzpnz///MnZkTZWjA0Wg0FL/fPwXtpKIod80D8odyudxjOFeYW5n7TIMIBAKBh+AvMxVmgwhmZNPXIOx7hH9DB0N+mslkLvQVAeSbRjIiMbvdfgmRRk8ByNch3zF4zjgcjrOxWKwmtnWTODY2dhXMIwP5jdPpHI9Go+WmTd+0ryTsYr1ef4JdzRPhLhD2aTz/MWI7JhHPExCeEbr6iew/QfZB/mUky/4/ATyH8PySO4sKUJRFi8VyNJlM/pRz+2jJQTAYPIXXOCCrAPH8zWq1CvlHO1E/N6tAto/gOY6ATbssEPbxRCKxqoM7reonhEKhg7VabRbyRgHheclms43G4/HlTiSjTeGbT+A5gXGDdrFsMplG6bIlI7Db3oTXBzoZz6t4PtYvWUQlB2pHyQExc7lc1nMgpp7DhNdroH5ryM2sb8Ph8N6eTA2gJpHGGeY8x9yk2Zcp32HK9107d13UMk5PT3+hWc6A0iPZVa1W31NaR1emdtHsg1Qq9dFsNgew/5U78uFkmaO5dsi522gKCCCdTn+ghOPkRX1tiLjpD8nJtr4EBEQJZ1gmmFU5MzxUZjYSiej5WbNqvy0R6DfZbDZBJOeJpK7Zhkul0mtE1E7VcbK2PCbjRaFQ+OpyuaSVg0yp1u5KpXLA6/W+yOfzenTdBUSsWCwuut1ueUxSIRlORIYRiSHS+y9NGETyGZESW5+cGXsosWdycvLV/Px8XW2kNfv6v/TELapy24B6PjIycq5rDgxAdUskC0QiL/aQdudZWVnZ2beAkBB5h8h2tvs1kS19f4JGkA5V6M4pVh9lvv8P2UT5ZwHVEw0AAAAASUVORK5CYII=" alt="Alternate Text" /></a>'+
                    // '<a href="javascript:void(0);" name="search" class="return"><i class="icon i1"></i></a>'+
                    '<a href="javascript:void(0);" class="center fontSize_17">车型选择</a>'+
                '</header>'+
                '<div class="search_brandModel">'+
                    '<div class="search_title clearfix">'+
                        '<div class="search_inp">'+
                            '<input type="text" name="searchInput" id="searchInput" class="input_text fontSize_15" value="" placeholder="请输入品牌型号"/>'+
                        '</div>'+
                        '<div class="search_btn">'+
                            '<i class="icon i28"></i>'+
                        '</div>'+
                    '</div>'+
                    '<div class="chooseBrand">'+
                        '<h3 class="chooseBrandTit fontSize_15">请选择品牌型号</h3>'+
                        '<ul class="chooseBrandList clearfix">'+
                            '<li class="fontSize_14"><a class="fontSize_14" href="javascript:void(0);">DC7160A</a></li>'+
                            '<li class="fontSize_14"><a class="fontSize_14" href="javascript:void(0);">DC7160B</a></li>'+
                            '<li class="fontSize_14"><a class="fontSize_14" href="javascript:void(0);">DC7160C</a></li>'+
                        '</ul>'+
                        '<h4 class="noBrand fontSize_12">无法确定，请在下方选择</h4>'+
                    '</div>'+
                    '<div class="search_main">'+
                        '<ul class="result_list">'+
                            '<li id="year_list" class="down_box">'+
                                '<a href="javascript:void(0);" class="fontSize_15">年款<em></em></a>'+
                                '<ol class="downmenu">'+
                                    '<li><a href="javascript:void(0);"></a></li>'+
                                '</ol>'+
                            '</li>'+
                            '<li id="pailing_list" class="down_box">'+
                                '<a href="javascript:void(0);" class="fontSize_15">排量<em></em></a>'+
                                '<ol class="downmenu" style="left: -100%;">'+
                                    '<li><a href="javascript:void(0);"></a></li>'+
                                '</ol>'+
                            '</li>'+
                            '<li id="gear_list" class="down_box">'+
                                '<a href="javascript:void(0);" class="fontSize_15">变速箱<em></em></a>'+
                                '<ol class="downmenu" style="left: -200%;">'+
                                    '<li><a href="javascript:void(0);"></a></li>'+
                                '</ol>'+
                            '</li>'+
                        '</ul>'+
                        '<ul class="list_main">'+
                            '<li><a href="javascript:void(0);">电视剧看很多事</a></li>'+
                        '</ul>'+
                        '<p class="main_search_empty fontSize_15">没有找到符合条件的型号，请您改变查询条件再次查询。</p>'+
                        // '@*<div class="remove_main">清空搜索信息</div>*@'+
                    '</div>'+
                    '<div class="empty_search clearfix">'+
                        '<span class="left fontSize_14"><i class="icon i29"></i></span><em class="fontSize_14"><b class="fontSize_14">找不到匹配车型？</b>请检查大写的i是否写成数字1，G是否写成C，是否写错空格。</em>'+
                    '</div>'+
                    '<div class="PatternSample_img">'+
                        '<p class="fontSize_14">温馨提示：</p>'+
                        '<p class="fontSize_14">如果您行驶证上的品牌型号为“雅阁HG7205AAC5轿车”，可直接输入“HG7205AAC5”进行车型查找</p>'+
                    '</div>'+
                '</div>'+
            '</div>';
        // if($('.search_car').lenghth != 0){ return false;}
        $(searchCarHtml).remove();
        $(searchCarHtml).appendTo($('body'));
    },
    searchCar: function (CarOpt,vueObj) {
        var $that = this;
        var scroll_top = $(window).scrollTop();
        this.ShortEName = CarOpt?(CarOpt.obj?(CarOpt.obj.ShortEName?CarOpt.obj.ShortEName:''):''):'';
        vueObj.scroll_t = scroll_top;
        $(".form_box.info_box").hide();
        $(".form_box.search_car").show();
        $(".search_inp input").on("inputchange",function(){
            var pos = getCursortPosition($(this)[0]);//获取焦点
            if($(this).val().length > 0){
                // $(this).val($(this).val().Trim());
                $(".search_btn").addClass("active");
            }else{
                $(".search_btn").removeClass("active");
            }
            setCaretPosition($(this)[0], pos);//设置焦点
        });
        $(".search_btn").unbind("click").click(function(e){ //点击搜索
            e.stopPropagation();//阻止事件冒泡
            e.preventDefault();//取消默认事件
            if($(this).hasClass("active")){
                $('#loadingdiv').show();
                $that.codeArr ="";
                var searchCode = $(".search_inp input").val().toUpperCase();
                $(".PatternSample_img").hide();//隐藏提示
                if(searchCode == vueObj.searchCode){
                    searchCarFn.search_empty(false,vueObj);
                }else{
                    searchCarFn.search_empty(true,vueObj);
                }
                vueObj.searchCode = searchCode;
                $that.searchCarFun(CarOpt,vueObj);
                $(".chooseBrand").hide();
            }else{
                showAlert("请输入关键字进行搜索！")
            }
        });
        $(".form_box.search_car .top_title .return").click(function(){ //点击选择车型的返回按钮
            $(window).scrollTop(vueObj.scroll_t);
            $(".form_box.info_box").show();
            $(".form_box.search_car").hide();
            mqq.ui.setTitleButtons({
                left:{
                    title:'返回',
                    callback:function(){
                        mqq.ui.popBack();
                    }
                },
                right: { title: " " }
            });
        });
    },
    searchCarFun:function(CarOpt,vueObj){
        console.log(vueObj)
        var $that = this;
        var postdata = {
            SessionId: vueObj.SessionId,
            SellerId: "",
            VIN: CarOpt?(CarOpt.VIN?CarOpt.VIN:vueObj.FrameNum):vueObj.FrameNum,
            OrderId:vueObj.orderId,
            ComCode: vueObj.CityId,
            SearchCode: vueObj.searchCode,//输入的搜索字符
            ShortEName: vueObj.ShortEName,//保险公司简码
            page: 1,//第几页
            pageSize: 1000,//行数
            callback: "jsonp"
        };
        var val = $(".search_inp input").val();
        var len = val.length;
        var url = '/InsureApi/SelectCarModels';
        $(".chooseBrand").hide();
        var callFun = function(res){
            $("#loadingdiv").hide();
            $(".PatternSample_img").hide();
            if(res.Result){
                $that.result_arr = res.Data.rows;
                var arr = res.Data.rows;
                var html="";
                $(".search_brandModel").removeClass('empty_box');
                $(".main_search_empty").hide();
                if(arr.length>0){
                    if(url == '/InsuranceParity/VehicleModelQuery2' || url == '/InsuranceApi/SelectCarModels2'){
                        $that.codeArr = res.Data.SearchCodes;
                        if(arr.length > 5 && $that.codeArr && $that.codeArr.length>1){
                            var branList='';
                            var commCode = res.Data.SearchCodeSamepart;
                            $(".search_brandModel .chooseBrand").show();
                            for (var m=0;m<$that.codeArr.length;m++) {
                                var codeStr = $that.codeArr[m];
                                var benginCodeIndex = codeStr.indexOf(commCode);
                                if( benginCodeIndex >= 0){
                                    var f_codeStr = codeStr.substring(0, benginCodeIndex);
                                    var e_codeStr = codeStr.substring(benginCodeIndex + commCode.length);
                                    if(f_codeStr !="" ){
                                        if(e_codeStr != ""){
                                            codeStr = '<span class="red">'+ f_codeStr +'</span>'+commCode+'<span class="red">'+ e_codeStr +'</span>';
                                        }else{
                                            codeStr = '<span class="red">'+ f_codeStr +'</span>'+commCode+e_codeStr;
                                        }
                                    }else{
                                        if(e_codeStr != ""){
                                            codeStr = f_codeStr + commCode+'<span class="red">'+ e_codeStr +'</span>';
                                        }else{
                                            codeStr = f_codeStr + commCode+e_codeStr;
                                        }
                                    }
                                }
                                branList+= '<li class="fontSize_14"><a class="fontSize_14" href="javascript:void(0);">'+codeStr+'</a></li>';
                            }
                            $(".search_brandModel .chooseBrand .chooseBrandList").html(branList);
                            $("#searchInput").val('');
                            vueObj.searchCode = commCode;
                            var chooseBranObj = {url:'/InsuranceParity/VehicleModelQuery',obj:postdata,codeArr:$that.codeArr};
                            if(CarOpt && CarOpt.chooseBranObj){
                                chooseBranObj.url = CarOpt.chooseBranObj.url;
                                chooseBranObj.obj = CarOpt.chooseBranObj.obj;
                            };
                            $that.chooseBrand(chooseBranObj);
                        }else{
                            if($that.codeArr){
                                if(res.Data.SearchCodeSamepart){
                                    if($that.codeArr && $that.codeArr.length>=2){
                                        $("#searchInput").val('');
                                        vueObj.searchCode = res.Data.SearchCodeSamepart;
                                    }else{
                                        $("#searchInput").val(res.Data.SearchCodeSamepart);
                                        vueObj.searchCode = res.Data.SearchCodeSamepart;
                                    }
                                }else{
                                    $("#searchInput").val($that.codeArr[0]);
                                    vueObj.searchCode = $that.codeArr[0];
                                }
                            }
                        }
                    }
                    for(var i = 0;i<arr.length;i++){
                        var str = arr[i].value;
                        var beginIndex = str.indexOf(vueObj.searchCode);
                        if(vueObj.searchCode!='null'&&vueObj.searchCode){
                            beginIndex = str.indexOf(vueObj.searchCode.toUpperCase());
                        }
                        if(beginIndex >= 0 ){
                            var first = str.substring(0, beginIndex);
                            var second = str.substring(beginIndex + vueObj.searchCode.length);
                            str = first + "<span style='color:#ff0000'>" + vueObj.searchCode + "</span>" + second;
                        }
                        if(postdata.ShortEName == 'CIC'){
                            html+='<li class="fontSize_15"><a class="fontSize_15" href="javascript:void(0);" key='+arr[i].key+' ExhaustCapacity='+arr[i].ExhaustCapacity+'   ModelYear='+arr[i].ModelYear+'  VehicleFamily='+arr[i].VehicleFamily+'  VehicleBrand='+arr[i].VehicleBrand+'  VehiclePrice='+arr[i].VehiclePrice+'  seatsNum = '+arr[i].VehiclePassengerCap+'>'+str+'</a></li>';
                        }else{
                            html+='<li class="fontSize_15"><a class="fontSize_15" href="javascript:void(0);" key='+arr[i].key+' seatsNum = '+arr[i].VehiclePassengerCap+'>'+str+'</a></li>';
                        }
                    }
                    $(".search_brandModel .search_main").show().find(".list_main").html(html);
                    var ModelYear = res.Data.ModelYear.reverse();
                    if(res.Data.ModelYear.length > 0){
                        if(res.Data.ModelYear.length == 2){
                            if(res.Data.ModelYear[0] != '年款'){
                                $("#year_list>a").html(res.Data.ModelYear[0]+'<em></em>');
                            }else{
                                $("#year_list>a").html(res.Data.ModelYear[1]+'<em></em>');
                            }
                            $("#year_list").addClass("active");
                        }
                        comm.yearScroll = new scroll_select({
                            Trigger: $("#year_list"),
                            objLen: 1,
                            obj: { val: ModelYear },
                            defaultValue:{val:'年款'},
                            chooseCar:true,
                            CallBack: function (obj, dom) {
                                dom.addClass("active");
                                searchCarFn.searchResult(obj.val,dom,vueObj);
                            }
                        });
                    };
                    if(res.Data.Displacement.length > 0){
                        if(res.Data.Displacement.length == 2){
                            if(res.Data.Displacement[0] != '排量'){
                                $("#pailing_list>a").html(res.Data.Displacement[0]+'<em></em>');
                            }else{
                                $("#pailing_list>a").html(res.Data.Displacement[1]+'<em></em>');
                            }
                            $("#pailing_list").addClass("active");
                        }
                        comm.pailingScroll = new scroll_select({
                            Trigger: $("#pailing_list"),
                            objLen: 1,
                            defaultValue:{val:'排量'},
                            chooseCar:true,
                            obj: { val: res.Data.Displacement.reverse() },
                            CallBack: function (obj, dom) {
                                dom.addClass("active");
                                searchCarFn.searchResult(obj.val,dom,vueObj);
                            }
                        });
                    };
                    if(res.Data.Stalls.length > 0){
                        if(res.Data.Stalls.length == 2){
                            if(res.Data.Stalls[0] != '变速箱'){
                                $("#gear_list>a").html(res.Data.Stalls[0]+'<em></em>');
                            }else{
                                $("#gear_list>a").html(res.Data.Stalls[1]+'<em></em>');
                            }
                            $("#gear_list").addClass("active");
                        }
                        comm.gearScroll = new scroll_select({
                            Trigger: $("#gear_list"),
                            objLen: 1,
                            defaultValue:{val:'变速箱'},
                            chooseCar:true,
                            obj: { val: res.Data.Stalls.reverse() },
                            CallBack: function (obj, dom) {
                                dom.addClass("active");
                                searchCarFn.searchResult(obj.val,dom,vueObj);
                            }
                        });
                    };
                    if(arr.length == 1){
                        var dom = $(".search_main .list_main li").first();
                        searchCarFn.showsearchCarMain(dom,vueObj);
                    }
                }else{
                    if($that.codeArr && $("#searchInput").val().indexOf(",")>=0){
                        $("#searchInput").val('');
                    }
                    if(url == '/InsuranceParity/VehicleModelQuery2'  || url == '/InsuranceApi/SelectCarModels2'){
                        if(res.Data.SearchCodes.length == 1){
                            $("#searchInput").val(res.Data.SearchCodes[0]);
                        }else{
                            $("#searchInput").val(res.Data.SearchCodeSamepart);
                        }
                    }
                    $(".search_brandModel").addClass('empty_box');
                }
            }else{
                if(CarOpt){
                    if(!CarOpt.hideError){
                        showAlert(res.Message);
                    }
                }else{
                    showAlert(res.Message);
                }
            }
        };
        if(len == 0){
            searchCarFn.search_empty(false,vueObj);
        }else{
            searchCarFn.search_empty(true,vueObj);
        }
        if(CarOpt){
            if(CarOpt.url) url = CarOpt.url;
            if(CarOpt.obj) postdata = CarOpt.obj;
            if(CarOpt.loadding){showLoadingDiv();}
            if(CarOpt.codeArr){$that.codeArr = CarOpt.codeArr;}
        }else{
            showLoadingDiv();
        }
        if(jQuery.isArray(postdata.searchCodes)){
            postdata.searchCodes = postdata.searchCodes.join(',')
        }
        if(jQuery.isArray(postdata.SearchCode)){
            postdata.SearchCode = postdata.SearchCode.join(',')
        }
        if(url=='/InsureApi/SelectCarModels'){
            postdata.SearchCode = vueObj.searchCode;
            Store.SelectCarModels(postdata).then(function (data) {
                callFun(data);
            });
        }else if(url='/InsuranceParity/VehicleModelQueryLy'){
            Store.VehicleModelQueryLy(postdata).then(function (data) {
                callFun(data);
            });
        }else if(url='/InsuranceApi/SelectCarModels2'){
            Store.SelectCarModels2(postdata).then(function (data) {
                callFun(data);
            });
        }
        // searchCarFn.searchResult();
        // 退出搜索
        $(".search_title .return,.search_title").delegate('.cancel','click',function(){
            $(".parity_box").removeClass('search_box');
            $("input[name=searchInput]").val("");
            searchCarFn.search_empty(true,vueObj);
            $(window).scrollTop(s_top);
        });
        // 清空内容
        $(".remove_main").click(function(){
            $(".search_main .list_main").html("");
            $("input[name=searchInput]").val("");
            searchCarFn.search_empty(true,vueObj);
            vueObj.searchCode = '';
        });
        // 选择型号
        $(".search_main .list_main").delegate("li","click",function(){
            searchCarFn.showsearchCarMain($(this),vueObj);
        });
    },
    showsearchCarMain:function(dom,vueObj){
        var $that = dom;
        dom.addClass('active').siblings('li').removeClass('active');
        $(".form_list li.configModel span").css("height","auto").addClass("active");
        $(".fromList li.configModel span").css("height","auto").addClass("active");
        $(".form_box.info_box").show();
        $(".form_box.search_car").hide();
        $(window).scrollTop(vueObj.scroll_t);
        // objViewModel.BrandModel($that.find("a").text().split(" ")[0]);
        vueObj.BrandModel = $that.find("a").text().split(" ")[0].replace(/,/ig,'');
        vueObj.ConfigModel = $that.find("a").text();
        vueObj.vehicleModel = $that.find("a").attr("key");
        vueObj.ExhaustCapacity = $that.find("a").attr("ExhaustCapacity");
        vueObj.ModelYear = $that.find("a").attr("ModelYear");
        vueObj.VehicleFamily = $that.find("a").attr("VehicleFamily");
        vueObj.VehicleBrand = $that.find("a").attr("VehicleBrand");
        vueObj.VehiclePrice = $that.find("a").attr("VehiclePrice");

        comm.setCookie("seatsNum","");
        if($that.find("a").attr("seatsNum") && $that.find("a").attr("seatsNum") != "undefined"  && $that.find("a").attr("seatsNum") != "null" ){
            vueObj.Seats = $that.find("a").attr("seatsNum");
            comm.setCookie("seatsNum",$that.find("a").attr("seatsNum"));
        }else{
            vueObj.Seats = '';
            comm.setCookie("seatsNum",'');
        }
        if ($("li[name='brandModel']").get(0)!=undefined)
            $("li[name='brandModel']").get(0).style.display = "none";
        // if (vueObj.BrandModel != "") {
        //     if ($(".configModel")!=undefined) $(".configModel").show();
        // }
        // if(vueObj.ConfigModel != "请选择配置型号"){
        //     $("li.configModel").next().hide();
        // }
        mqq.ui.setTitleButtons({
            left:{
                title:'返回',
                callback:function(){
                    mqq.ui.popBack();
                }
            },
            right: { title: " " }
        });
    },
    searchResult:function(text,dom,vueObj){
        var $that = this;
        // 点击条件查询
        var val = text;
        var new_arr = [];
        var arr = searchCarFn.result_arr;
        if(dom.attr("id") == 'year_list'){
            dom.find("a").html(val+'<em></em>');
        }else{
            dom.find("a").html(val+'<em></em>');
        }
        $(".search_brandModel .search_main .list_main").html("");
        var year_text = $("#year_list>a").text();
        var pailing_text = $("#pailing_list>a").text();
        var gear_text = $("#gear_list>a").text();
        if(arr.length > 0){
            for(var i = 0;i<arr.length;i++){
                var BrandModel = [];
                if(year_text != "年款"){
                    if(year_text == "全部"){
                        if(pailing_text != "排量"){
                            if(pailing_text == "全部"){
                                if(gear_text != "变速箱"){
                                    if(gear_text == "全部"){
                                        new_arr.push(arr[i]);
                                    }else{
                                        if( arr[i].value.indexOf(gear_text) >0 ){
                                            new_arr.push(arr[i])
                                        }
                                    }
                                }else{
                                    new_arr.push(arr[i]);
                                }
                            }else{
                                if(gear_text != "变速箱"){
                                    if(gear_text == "全部"){
                                        if(arr[i].value.indexOf(pailing_text) > 0 ){
                                            new_arr.push(arr[i]);
                                        }
                                    }else{
                                        if(arr[i].value.indexOf(pailing_text) > 0 && arr[i].value.indexOf(gear_text) >0 ){
                                            new_arr.push(arr[i]);
                                        }
                                    }

                                }else{
                                    if(arr[i].value.indexOf(pailing_text) > 0 ){
                                        new_arr.push(arr[i]);
                                    }
                                }
                            }

                        }else{
                            if(gear_text != "变速箱"){
                                if(gear_text == "全部"){
                                    new_arr.push(arr[i]);
                                }else{
                                    if(arr[i].value.indexOf(pailing_text) > 0 && arr[i].value.indexOf(gear_text) >0 ){
                                        new_arr.push(arr[i])
                                    }
                                }

                            }else{
                                new_arr.push(arr[i])
                            }
                        }
                    }else{
                        if(pailing_text != "排量"){
                            if(pailing_text == "全部"){
                                if(gear_text!="变速箱"){
                                    if(gear_text=="全部"){
                                        if(arr[i].value.indexOf(year_text) >0 ){
                                            new_arr.push(arr[i]);
                                        }
                                    }else{
                                        if(arr[i].value.indexOf(year_text) >0 && arr[i].value.indexOf(gear_text) >0 ){
                                            new_arr.push(arr[i])
                                        }
                                    }
                                }else{
                                    if(arr[i].value.indexOf(year_text) >0){
                                        new_arr.push(arr[i]);
                                    }
                                }
                            }else{
                                if(gear_text != "变速箱"){
                                    if(gear_text=="全部"){
                                        if(arr[i].value.indexOf(year_text) >0 && arr[i].value.indexOf(pailing_text) > 0 ){
                                            new_arr.push(arr[i]);
                                        }
                                    }else{
                                        if(arr[i].value.indexOf(year_text) >0 && arr[i].value.indexOf(pailing_text) > 0 && arr[i].value.indexOf(gear_text) >0 ){
                                            new_arr.push(arr[i])
                                        }
                                    }

                                }else{
                                    if(arr[i].value.indexOf(year_text) >0 && arr[i].value.indexOf(pailing_text) > 0 ){
                                        new_arr.push(arr[i]);
                                    }
                                }
                            }

                        }else{
                            if(gear_text != "变速箱"){
                                if(gear_text=="全部"){
                                    if(arr[i].value.indexOf(year_text) >0){
                                        new_arr.push(arr[i]);
                                    }
                                }else{
                                    if(arr[i].value.indexOf(year_text) >0 && arr[i].value.indexOf(gear_text) >0 ){
                                        new_arr.push(arr[i])
                                    }
                                }
                            }else{
                                if(arr[i].value.indexOf(year_text) >0){
                                    new_arr.push(arr[i]);
                                }
                            }

                        }
                    }

                }else{
                    if(pailing_text != "排量"){
                        if(pailing_text == "全部"){
                            if(gear_text != "变速箱"){
                                if(gear_text == "全部"){
                                    new_arr.push(arr[i])
                                }else{
                                    if(arr[i].value.indexOf(gear_text) >0 ){
                                        new_arr.push(arr[i])
                                    }
                                }

                            }else{
                                new_arr.push(arr[i]);
                            }
                        }else{
                            if(gear_text != "变速箱"){
                                if(gear_text == "全部"){
                                    if(arr[i].value.indexOf(pailing_text) > 0 ){
                                        new_arr.push(arr[i])
                                    }
                                }else{
                                    if(arr[i].value.indexOf(pailing_text) > 0 && arr[i].value.indexOf(gear_text) >0 ){
                                        new_arr.push(arr[i])
                                    }
                                }
                            }else{
                                if(arr[i].value.indexOf(pailing_text) > 0){
                                    new_arr.push(arr[i]);
                                }
                            }
                        }
                    }else{
                        if(gear_text != "变速箱"){
                            if(gear_text == "全部"){
                                new_arr.push(arr[i])
                            }else{
                                if( arr[i].value.indexOf(gear_text) >0 ){
                                    new_arr.push(arr[i])
                                }
                            }
                        }else{
                            new_arr.push(arr[i]);
                        }
                    }
                }
            }
        }
        if(new_arr.length > 0){
            var search_html = searchCarFn.search_brandModel(new_arr,vueObj);
            $(".main_search_empty").hide();
            $(".search_brandModel .search_main .list_main").html(search_html);
        }else{
            $(".main_search_empty").show();
        }
    },
    // 根据条件查询型号
    search_brandModel:function (arr,vueObj){
        var search_html = "";
        for(var i = 0;i<arr.length;i++){
            var str = arr[i].value;
            var beginIndex = str.indexOf(vueObj.searchCode);
            if(beginIndex >= 0 ){
                var first = str.substring(0, beginIndex);
                var second = str.substring(beginIndex + vueObj.searchCode.length);
                str = first + "<span style='color:#ff0000'>" + vueObj.searchCode + "</span>" + second;
            }
            if(searchCarFn.ShortEName == 'CIC'){
                search_html+='<li class="fontSize_15"><a class="fontSize_15" href="javascript:void(0);" key='+arr[i].key+' ExhaustCapacity='+arr[i].ExhaustCapacity+'   ModelYear='+arr[i].ModelYear+'  VehicleFamily='+arr[i].VehicleFamily+'  VehicleBrand='+arr[i].VehicleBrand+'  VehiclePrice='+arr[i].VehiclePrice+'  seatsNum = '+arr[i].VehiclePassengerCap+'>'+str+'</a></li>';
            }else {
                search_html+='<li class="fontSize_15"><a class="fontSize_15" href="javascript:void(0);" key='+arr[i].key+'>'+str+'</a></li>';
            }
        }
        return search_html;
    },
    chooseBrand:function(data,vueObj){//选择品牌
        $(".chooseBrandList li").unbind('click');
        $(".search_brandModel .chooseBrand .chooseBrandList").unbind('click').delegate("li","click",function(e){
            e.stopPropagation();
            var code = $(this).text();
            vueObj.searchCode = code;
            $("#searchInput").val(code);
            delete data.obj.searchCodes;
            data.obj.searchCode = code;
            data.loadding = true;
            data.hideChooseModel = true;
            data.url = data.url;
            data.codeArr = data.codeArr;
            $(".chooseBrand").hide();
            searchCarFn.searchCarFun(data,vueObj);
        });
    },
    // 生成搜索条件
    add_html:function (arr,vueObj){
        var arr = arr;
        var html = "";
        for(var i = arr.length-1; i>=0; i--){
            html+='<li><a href="javascript:void(0);">'+arr[i]+'</a></li>';
        }
        return html;
    },
    search_empty:function(main,vueObj){
        var $that = this;
        var html = '<li id="year_list" class="down_box">'+
                    '<a href="javascript:void(0);" class="fontSize_15">年款<em></em></a>'+
                    '<ol class="downmenu">'+
                        '<li><a href="javascript:void(0);"></a></li>'+
                    '</ol>'+
                '</li>'+
                '<li id="pailing_list" class="down_box">'+
                    '<a href="javascript:void(0);" class="fontSize_15">排量<em></em></a>'+
                    '<ol class="downmenu" style="left:-100%;">'+
                        '<li><a href="javascript:void(0);"></a></li>'+
                    '</ol>'+
                '</li>'+
                '<li id="gear_list" class="down_box">'+
                    '<a href="javascript:void(0);" class="fontSize_15">变速箱<em></em></a>'+
                    '<ol class="downmenu" style="left:-200%;">'+
                        '<li><a href="javascript:void(0);"></a></li>'+
                    '</ol>'+
                '</li>';
        if(main){
            $(".search_main").hide()
        }
        $(".search_main").find(".list_main").html("");
        $(".search_main .result_list").html(html);
        $that.result_arr = [];
    }
};
$(function(){
    searchCarFn.init();
});
function getCursortPosition(ctrl) {
    var CaretPos = 0;   // IE Support
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }
        // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        CaretPos = ctrl.selectionStart;
    return (CaretPos);
}
function setCaretPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}
window.searchCarFn = searchCarFn;