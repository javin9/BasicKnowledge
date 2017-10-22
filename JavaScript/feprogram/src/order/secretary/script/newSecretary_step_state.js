
//提示文本
var $text_step_state = $(".text_step_state");

var stepTipTextArray = ["请选择您喜欢的车型", "请选择您的职业，信用状态", "请选择您的住房，社保公积金状态", "请选择您的收入状态", "请留下您的基本信息"];
var stepTipLeftArray = ["-55px", "107px", "232px", "422px", "570px"];

var stepIconArray = ["step_1_icon", "step_2_icon", "step_3_icon", "step_4_icon", "step_5_icon"];
var stepDashedArray = ["step_1_dashed", "step_2_dashed", "step_3_dashed", "step_4_dashed", "step_5_dashed"];

module.exports.nextStep = function (stepIndex) {
    var $currentIcon = $("#" + stepIconArray[stepIndex]);
    $currentIcon.attr("src", RESURL + "images/xinche/Secretary/" + stepIconArray[stepIndex] + "_select.png");
    $("#" + stepDashedArray[stepIndex]).attr("src", RESURL + "images/xinche/Secretary/" + "dashed_icon_select.png");

    $text_step_state.find(".text_step_state_border").html(stepTipTextArray[stepIndex]);
    $text_step_state.css("left", stepTipLeftArray[stepIndex]);
}

module.exports.hideTextTip = function () {
    $text_step_state.hide();
}
