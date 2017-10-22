
module.exports.init = function () {

    var income = null;
    var income_text = null;

    var $percentage = $("#percentage");
    var percent = 0;
    var setIntervalID = 0;
    var clickCount = 0;
    $('div[datatype="incomeType"]').click(function (e) {
        clickCount++;
        if(clickCount>1){
            return false;
        }
        //$('div[datatype="incomeType"]').addClass("disabled");
        $(e.target).addClass("radioBorderBtn").siblings().removeClass("radioBorderBtn");
        income = $(e.target).attr("data-value");
        income_text = $(e.target).text();

        $(this).trigger("dataSelect", {
            income: income,
            income_text: income_text
        });

        $(".incomeContainer").show(1000, function () {
            percent = 0;
            $percentage.html(percent + "%");
            clearInterval(setIntervalID);
            setIntervalID = setInterval(function () {
                percent += 7;
                percent = percent > 100 ? 100 : percent;
                $percentage.html(percent + "%");
                if (percent == 100) {
                    clearInterval(setIntervalID);
                    setIntervalID = setTimeout(function () {
                        $(this).trigger("nextStep");
                    }, 1000);
                }
            }, 100);
        });
    });
}

