
var html1 = '<div class="step_6_container_content">' + '<div class="four_item">' + '<div class="back_info_all">';
//var html2 = '<img class="bank_img_icon">';
var html3 = '<div class="bank_info">';
//var html4 = '<p class="carStaging">汽车分期</p>'+'<p class="bankName">招商银行</p>';
var html5 = '</div>' + '</div>' + '</div>' + '<div class="itemBorder itemBorder_1"></div><div class="four_item">';
//var html6 = '<div class="pairs">'+'<div class="pairs_icon"></div>' +'<div class="pairs_icon_text">极速审批</div>'+'</div>';
var html7 = '</div>' + '<div class="itemBorder itemBorder_2"></div><div class="four_item">' + '<div class="accounts">';
//var html8 = '<p class="monthPayment">月　供：4117元</p>' + '<p class="totalCost">总成本：1.88万</p>' + '<p class="gainMoney">赚　取：3.56万</p>';
var html9 = '</div>' + '</div>' + '<div class="itemBorder itemBorder_3"></div><div class="four_item"><div class="no_credit">';
//var html10 = '<p>可少数逾期</p>';
var html11 = '</div>' + '</div>' + '<div class="clear"></div>' + '</div>';

module.exports.init = function () {
}

module.exports.showMessage = function (productArray) {
    var $process_title = $("#step_six .process_title");
    if (productArray == null || productArray.length == 0) {
        $process_title.html("非常抱歉，没有找到与您匹配的金融产品！");
        return;
    }
    $step_6_container = $(".step_6_container");
    var len = productArray.length > 1 ? 2 : productArray.length;
    //alert(len)
    for (var i = 0; i < len; i++) {
        var new_html = "";
        new_html += html1;

        var html2 = '<img class="bank_img_icon"' + ' src="' + productArray[i].ProductInfo.CompanyLogoImageUrl + '"' + '>';
        new_html += html2;
        new_html += html3;
        var html4 = '<p class="carStaging">' + productArray[i].ProductInfo.LoanPackage.ShortName + '</p>' + '<p class="bankName">' + productArray[i].ProductInfo.LoanPackage.PackageName + '</p>';
        new_html += html4;
        new_html += html5;
        var html6 = "";
        for (var m = 0; m < productArray[i].FeatureList.length; m++) {
            html6 += '<div class="pairs product-icons">';
            html6 += '<span class="pairs_icon icon-' + productArray[i].FeatureList[m].ID + '"></span>';
            html6 += '<div class="pairs_icon_text">' + productArray[i].FeatureList[m].Name + '</div>';
            html6 += '<div class="clear"></div>';
            html6 += '</div>';
        }
        new_html += html6;
        new_html += html7;
        var html8 = '<p class="monthPayment">' + "月　供：" + productArray[i].CalculationInfo.MonthlyPaymentText + '</p>';
        html8 += '<p class="totalCost">' + "总成本：" + productArray[i].CalculationInfo.TotalCostText + '</p>';
        //html8 += '<p class="gainMoney">' + "赚　取：" + (productArray[i].CalculationInfo.EarnMoneyText==null?0:productArray[i].CalculationInfo.EarnMoneyText) +'</p>';
        new_html += html8;
        new_html += html9;
        var html10 = "";
        for (var n = 0; n < productArray[i].RequirementList.length; n++) {
            html10 += '<p>' + productArray[i].RequirementList[n] + '</p>';
        }
        new_html += html10;
        new_html += html11;
        //alert(new_html)
        $step_6_container.append(new_html);
    }



}
