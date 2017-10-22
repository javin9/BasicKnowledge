


module.exports.init = function () {

    var career = null;
    var career_text = null;
    var credit = null;
    var credit_text = null;

    //工作类型
    $('div[datatype="workType"]').click(function (e) {
        $(e.target).addClass("radioBorderBtn").siblings().removeClass("radioBorderBtn");
        career = $(e.target).attr("data-value");
        career_text = $(e.target).text();

        $(this).trigger("dataSelect", {
            career: career,
            career_text: career_text,
            credit: null,
            credit_text: null
        });

        $(".creditContainer").show(1000);
    });
    //信用记录
    var setIntervalID = 0;
    $('div[datatype="creditType"]').click(function (e) {
        $(e.target).addClass("radioBorderBtn").siblings().removeClass("radioBorderBtn");
        credit = $(e.target).attr("data-value");
        credit_text = $(e.target).text();

        $(this).trigger("dataSelect", {
            workUnit: null,
            workUnit_text: null,
            credit: credit,
            credit_text: credit_text
        });
        clearTimeout(setIntervalID);
        setIntervalID = setTimeout(nextStepTrigger, 1000);
    });
    function nextStepTrigger() {
        $(this).trigger("nextStep");
    }

    //信用提示块
    var overdueInfoArr = ["12个月内无逾期记录", "12个月内有不多于3次的逾期记录", "12个月内有超过3次的逾期记录", "未使用过信用卡或贷款产品"];
    var $overdue = $(".overdue_container .overdue_12_3");
    $('div[datatype="creditType"]').each(function (index, item) {
        $(item).hover(function (e) {
            if (e.type == "mouseenter") {
                $overdue.find(".overdueTip").text(overdueInfoArr[index]);
                $overdue.css("marginLeft", $(item).position().left - 20);
                $overdue.show();
            }
            else if (e.type == "mouseleave") {
                $overdue.hide();
            }
        });
    });
}
