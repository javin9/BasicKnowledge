import './adviseList.scss'
    var index = {
        init: function () {
            var self = this;
            self.share();
        },
        share: function () {
            var data = {
                pageIndex:1,
                pageSize:10,
            };
			var scroolF = '';
            /*初始化数据*/
			$('.loading').show();
			page(data);
            /////////////////////////////////////////数据结构化
			function page(_data) {
                $.ajax({
                    url: '/MyComment/GetLoanUserServedAdviser',
                    type: 'GET',
                    data: _data,
                    beforeSend: function () {},
                    success: function (res) {
                        $('.loading').hide();
                        var res = typeof res === 'string' ? JSON.parse(res) : res, rseData = res.Data;
						if(data.pageIndex==1){
							if (rseData.length == 0 || rseData.length == null){
								$('.AdviserList_box').hide();
								$('.noData').show();
							}else{
								
							$('.AdviserList_box').show();
							$('.noData').hide();
							var TotalNum = parseFloat(res.Total / 10);
							if(parseInt(TotalNum)==TotalNum){
								TotalNum=TotalNum
							}else{
								TotalNum=parseFloat(TotalNum.toFixed(0))+1
							}
							if(data.pageIndex==TotalNum||data.pageIndex<TotalNum){
							for (var i = 0; i < rseData.length; i++) {
								var newData = new Date(), nowYear = newData.getFullYear(), AdviserTagsNameArr = '', ContentText = '', ContentTextBtn = '';CallBeginTime = '';
								if (rseData[i].EvaluateInfo.TagsName != '' && rseData[i].EvaluateInfo.TagsName != null) {
									var TagsName = rseData[i].EvaluateInfo.TagsName.split('|');
									for (var k = 0; k < TagsName.length; ++k) {
										if (TagsName[k] != '') {
											AdviserTagsNameArr += '<span class="tag  font_24">' + TagsName[k] + '</span>';
										}
									}
								}
								if (rseData[i].Pid > 0) {
								    ContentTextBtn = '<span class="col_grey9">已评价</span>'
								} else {
								    ContentTextBtn = '<a href="AdviserComment?callLogId=' + rseData[i].CallLogID + '&adviserId=' + rseData[i].UserInfo.Id + '" class="btn_org">去评价</a>'
								}
								if (rseData[i].EvaluateInfo.ContentText != '' && rseData[i].EvaluateInfo.ContentText != null) {
								    ContentText = '<div class="info_text">' + rseData[i].EvaluateInfo.ContentText + '<p class="time_col">' + rseData[i].EvaluateInfo.CreateTime + '</p></div>'
								} 
								//console.log(rseData[i].CallBeginTime,rseData[i].CallBeginTime.length)
								CallBeginTime=(rseData[i].CallBeginTime).substring(0,rseData[i].CallBeginTime.length-3)
								$('.AdviserList').append('<li class="itme">'
									+ '<div class="top">'
										+ '<div class="time">服务时间<span class="time_span">' + CallBeginTime + '</span></div>'
										+ '<div class="btn_box">' + ContentTextBtn + '</div>'
									+ '</div>'
									+ '<a class="adviser_box" href="javascript:void(0);">'
										+ '<div class="adviser_l"><img src="' + rseData[i].UserInfo.Photo + '" class="pohto"></div>'
										+ '<div class="adviser_r"' + rseData[i].UserInfo.Id + '>'
											+ '<div class="Personal"><span class="name font_28">' + rseData[i].UserInfo.Name + '</span><i class="skillLevel_' + rseData[i].UserInfo.SkillLevelId + '"></i><span class="star_level"><s class="" style="width:' + (rseData[i].EvaluateInfo.Score) * 20 + '%"></s></span></div>'
											+ '<div class="info font_24"><span class="">从业<font class="">' + (nowYear - rseData[i].UserInfo.WorkingYears) + '</font>年</span><span class="">已帮<font class="">' + rseData[i].UserInfo.ServeNumber + '</font>人贷款</span><span class=""><font class="">' + rseData[i].UserInfo.Rate + '</font>%好评</span></div>'
											+ '<div class="tag_box">' + AdviserTagsNameArr + '</div>' + ContentText
										+ '</div>'
								   + '</a>'
								+ '</li>')
							}
							//判断数据是否全部加载完，显示底部DIV
							if(data.pageIndex==TotalNum){
								$('.page_top').html('亲，没有了哦~')
							}else if(data.pageIndex<TotalNum){
								$('.page_top').html('上拉  加载更多')
								scroolF = true
								data.pageIndex++;
							}
						}else{
							$('.page_top').html('亲，没有了哦~')
							 return ''
						}
							}
						}else{
							$('.AdviserList_box').show();
							$('.noData').hide();
							var TotalNum = parseFloat(res.Total / 10);
							if(parseInt(TotalNum)==TotalNum){
								TotalNum=TotalNum
							}else{
								TotalNum=parseFloat(TotalNum.toFixed(0))+1
							}
							if(data.pageIndex==TotalNum||data.pageIndex<TotalNum){
							for (var i = 0; i < rseData.length; i++) {
								var newData = new Date(), nowYear = newData.getFullYear(), AdviserTagsNameArr = '', ContentText = '', ContentTextBtn = '',CallBeginTime = '';
								if (rseData[i].EvaluateInfo.TagsName != '' && rseData[i].EvaluateInfo.TagsName != null) {
									var TagsName = rseData[i].EvaluateInfo.TagsName.split('|');
									for (var k = 0; k < TagsName.length; ++k) {
										if (TagsName[k] != '') {
											AdviserTagsNameArr += '<span class="tag  font_24">' + TagsName[k] + '</span>';
										}
									}
								}
								if (rseData[i].EvaluateInfo.ContentText != '' && rseData[i].EvaluateInfo.ContentText != null) {
									ContentText = '<div class="info_text">' + rseData[i].EvaluateInfo.ContentText + '<p class="time_col">' + rseData[i].EvaluateInfo.CreateTime + '</p></div>'
									ContentTextBtn = '<span class="col_grey9">已评价</span>'
								} else {
									ContentTextBtn = '<a href="AdviserComment?callLogId=' + rseData[i].CallLogID + '&adviserId=' + rseData[i].UserInfo.Id + '" class="btn_org">去评价</a>'
								}
								//console.log(rseData[i].CallBeginTime,rseData[i].CallBeginTime.length)
								CallBeginTime=(rseData[i].CallBeginTime).substring(0,rseData[i].CallBeginTime.length-3)
								$('.AdviserList').append('<li class="itme">'
									+ '<div class="top">'
										+ '<div class="time">服务时间<span class="time_span">' + CallBeginTime + '</span></div>'
										+ '<div class="btn_box">' + ContentTextBtn + '</div>'
									+ '</div>'
									+ '<a class="adviser_box" href="' + xinche + '/adviser/detail/' + rseData[i].UserInfo.Id + '" target="_blank">'
										+ '<div class="adviser_l"><img src="' + rseData[i].UserInfo.Photo + '" class="pohto"></div>'
										+ '<div class="adviser_r"' + rseData[i].UserInfo.Id + '>'
											+ '<div class="Personal"><span class="name font_28">' + rseData[i].UserInfo.Name + '</span><i class="skillLevel_' + rseData[i].UserInfo.SkillLevelId + '"></i><span class="star_level"><s class="" style="width:' + (rseData[i].EvaluateInfo.Score) * 20 + '%"></s></span></div>'
											+ '<div class="info font_24"><span class="">从业<font class="">' + (nowYear - rseData[i].UserInfo.WorkingYears) + '</font>年</span><span class="">已帮<font class="">' + rseData[i].UserInfo.ServeNumber + '</font>人贷款</span><span class=""><font class="">' + rseData[i].UserInfo.Rate + '</font>%好评</span></div>'
											+ '<div class="tag_box">' + AdviserTagsNameArr + '</div>' + ContentText
										+ '</div>'
								   + '</a>'
								+ '</li>')
							}
							//判断数据是否全部加载完，显示底部DIV
							if(data.pageIndex==TotalNum){
								$('.page_top').html('亲，没有了哦~')
							}else if(data.pageIndex<TotalNum){
								$('.page_top').html('上拉  加载更多')
								scroolF = true
								data.pageIndex++;
							}
						}else{
							$('.page_top').html('亲，没有了哦~')
							 return ''
						}
						}
						
                    //////////
					},
                    complete: function (XMLHttpRequest, textStatus) { }
                })
            }
            /////////////////////////////////////////数据结构化
			/*滚动加载数据*/
            $(window).scroll(function () {
                var docBodyScrTop = document.body.scrollTop;//滚动高度
                var documentHeight = $(document.body).height();//文档高度
                var windowHeight = $(window).height();//窗口高度
                //console.log(docBodyScrTop + windowHeight + 1, documentHeight, scroolF)
                if (docBodyScrTop + windowHeight+1 > documentHeight && scroolF) {
                    scroolF = false
					setTimeout(function(){
						page(data);
					},1000)
                }
            });
        },
    }
    index.init()