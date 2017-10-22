
module.exports.init = function () {

    var houseState = null;
    var houseState_text = null;
    var insurance = null;
    var insurance_text = null;
    var funds = null;
    var funds_text = null;

    $('div[datatype="houseType"]').click(function (e) {
        $(e.target).addClass("radioBorderBtn").siblings().removeClass("radioBorderBtn");
        houseState = $(e.target).attr("data-value");
        houseState_text = $(e.target).text();

        $(this).trigger("dataSelect", {
            houseState: houseState,
            houseState_text: houseState_text,
            insurance: null,
            insurance_text: null,
            funds: null,
            funds_text: null
        });

        $(".insurance").show(1000);
    });


    var setIntervalID = 0;
    $('div[datatype="insuranceType"]').click(function (e) {
        $(e.target).addClass("radioBorderBtn").siblings().removeClass("radioBorderBtn");
        insurance = $(e.target).attr("data-value");
        insurance_text = $(e.target).text();

        var _founsContainerCur = $(e.target).parents(".insurance").next(".founsContainer").find(".radioBtn.radioBorderBtn");
        funds = _founsContainerCur.attr("data-value");
        funds_text = _founsContainerCur.text();

        if (insurance != null) {
            $(this).trigger("dataSelect", {
                houseState: null,
                houseState_text: null,
                insurance: insurance,
                insurance_text: insurance_text,
                funds: funds,
                funds_text: funds_text
            });
            // clearTimeout(setIntervalID);
            // setIntervalID = setTimeout(nextStepTrigger,1500);
            $(".founsContainer").show(1000);
        }
    });

    $('div[datatype="fundsType"]').click(function (e) {
        $(e.target).addClass("radioBorderBtn").siblings().removeClass("radioBorderBtn");
        funds = $(e.target).attr("data-value");
        funds_text = $(e.target).text();
        var _insuranceCur = $(e.target).parents(".founsContainer").prev(".insurance").find(".radioBtn.radioBorderBtn");
        insurance = _insuranceCur.attr("data-value");
        insurance_text = _insuranceCur.text();

        if (funds != null) {
            $(this).trigger("dataSelect", {
                houseState: null,
                houseState_text: null,
                insurance: insurance,
                insurance_text: insurance_text,
                funds: funds,
                funds_text: funds_text
            });
            clearTimeout(setIntervalID);
            setIntervalID = setTimeout(nextStepTrigger, 1000);
        }
    })

    function nextStepTrigger() {
        $(this).trigger("nextStep");
    }
}

