import './index.scss';
import check from "libs/check";

  var fg=false;
  var fg2=false;
  var fg3=true;
  let fg4 = false;

  let isfirstClickSubmit = true;
  /*var opts = {
    angle: 0, 
    lineWidth: 0.02 
  };
  var target = document.getElementById('canvas-preview'); 
  var gauge = new Gauge(target).setOptions(opts); 
  gauge.maxValue = 130000; 
  gauge.animationSpeed = 55;*/
    //判断弹层
    if(window.isFromShopCGBBank){
        var _form = $("#cgbSendInfoForm");
        $("#maskLayer").css("display","block");
        tools.showAlert("接下来将由 广发银行 为您进行额度在线审批！",10000);
        if(typeof(orderId) != "undefined"){
            $.ajax({
                url:"/OrderApply/GetCgbSendInfo",
                data:{
                    orderID:orderId
                },
                type:'POST',
                success:function(res){
                    // res = JSON.parse(res);
                    var _data = res.Data;
                    if(res.Result){
                        _form.find('input[name="applyAmt"]').val(_data.applyAmt);
                        _form.find('input[name="custName"]').val(_data.custName);
                        _form.find('input[name="certNo"]').val(_data.certNo);
                        _form.find('input[name="carPrice"]').val(_data.carPrice);
                        _form.find('input[name="itemNo"]').val(_data.itemNo);
                        _form.find('input[name="mobilePhone"]').val(_data.mobilePhone);
                        _form.find('input[name="mergeProvince"]').val(_data.mergeProvince);
                        _form.find('input[name="mergeCity"]').val(_data.mergeCity);
                        _form.find('input[name="mergeArea"]').val(_data.mergeArea);
                        _form.find('input[name="orderNo"]').val(_data.orderNo);
                        _form.find('input[name="signature"]').val(_data.signature);
                        setTimeout(function(){
                            _form.submit();
                        },5000)
                    }else{
                        setTimeout(function(){
                            location.href=cgbFormActionUrl
                        },5000)
                    }
                },
                error:function(){
                    setTimeout(function(){
                        location.href=cgbFormActionUrl
                    },5000)
                }
            })
    }else{
      setTimeout(function(){
          location.href=cgbFormActionUrl
      },5000)
    }

    }

  var ordera = {
    init: function(){     
      if(typeof username !="undefined")
      {
        //易鑫流程，没有这个变量
        $(".layx22-left2-zsxm input").val(username);
      }     
      $(".layx22-left2-sfzh input").val('请输入18位证件号');
      var layx3p=$(".layx3").offset().top;
      if($(window).scrollTop()>layx3p+80-$(window).height()){
          $(".layx3-con").removeClass("layx3f");
        }else{
          $(".layx3-con").addClass("layx3f");
        }
      $(window).scroll(function(){
        if($(window).scrollTop()>layx3p+80-$(window).height()){
          $(".layx3-con").removeClass("layx3f");
        }else{
          $(".layx3-con").addClass("layx3f");
        }
      })

      $(".layx22-left2-zsxm input").focus(function(){
        if(this.value==this.defaultValue){
          this.value="";
          this.style.color="#333";
        }
      })

      $(".layx22-left2-zsxm input").blur(function(){
        if(this.value==''){
          this.style.color="#c4c4c4";
          this.value=this.defaultValue;
        }

        if($(".layx22-left2-zsxm input").val()=="请输入您的中文全名"){
          fg=false;
          $(".layx22-left2-zsxm input").parent().next().html('请输入您的中文全名');
          $(".layx22-left2-zsxm input").parent().next().css("display","");
          return;
        }

        if(!check.isName($(".layx22-left2-zsxm input").val())){
          fg=false;
          $(".layx22-left2-zsxm input").parent().next().html('姓名格式错误，请核实');
          $(".layx22-left2-zsxm input").parent().next().css("display","");
          return;
        }

        $(".layx22-left2-zsxm input").parent().next().css("display","none");
        fg=true;
      })

      $(".layx22-left2-sfzh input").focus(function(){
        if(this.value==this.defaultValue){
          this.value="";
          this.style.color="#333";
        }
      })

      $(".layx22-left2-sfzh input").blur(function(){
        if(this.value==''){
          this.style.color="#c4c4c4";
          this.value=this.defaultValue;
        }

        if($(this).val()=="请输入18位证件号"){
          fg2=false;
          $(this).parent().next().html('请输入18位证件号');
          $(this).parent().next().css("display","");
          return;
        }

        if(!check.isID($(this).val())){
          fg2=false;
          $(this).parent().next().html('身份证号码格式错误，请核实');
          $(this).parent().next().css("display","");
          return;
        }
        
        $(this).parent().next().css("display","none");
        fg2=true;
      })

      let tpjyInputDom = $(".layx22-left2-tpjy input");
        tpjyInputDom.focus(function(){
            if(this.value==this.defaultValue){
                this.value="";
                this.style.color="#333";
            }
        })

        tpjyInputDom.blur(function(){
            if(this.value==''){
                this.style.color="#c4c4c4";
                this.value=this.defaultValue;
            }

            if(tpjyInputDom.val()=="请输入图片验证码"){
                fg4=false;
                tpjyInputDom.parent().next().html('请输入图片验证码');
                tpjyInputDom.parent().next().css("display","");
                return;
            }

            if(tpjyInputDom.val().length !== 4){
                fg4=false;
                tpjyInputDom.parent().next().html('请输入正确的验证码');
                tpjyInputDom.parent().next().css("display","");
                return;
            }

            tpjyInputDom.parent().next().css("display","none");
            fg4=true;
        })

        $('#changeCode').click(function(){
            $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
        });

      //alert(1);

      $(".hqdk").click(function(){
        //$(".layx22-left2-zsxm input").blur();
        //$(".layx22-left2-sfzh input").blur();
        
        if(!$(this).hasClass('disable')){
          const ishasImgCode = !$('#imgValidateCodeBox').hasClass('hide');
          if($(".layx22-left2-zsxm input").val()=="请输入您的中文全名"){
            $(".layx22-left2-zsxm input").parent().next().html('请输入您的中文全名');
            $(".layx22-left2-zsxm input").parent().next().css("display","");
          }else if(!check.isName($(".layx22-left2-zsxm input").val())){
            $(".layx22-left2-zsxm input").parent().next().html('姓名格式错误，请核实');
            $(".layx22-left2-zsxm input").parent().next().css("display","");
          }

          if($(".layx22-left2-sfzh input").val()=="请输入18位证件号"){
            $(".layx22-left2-sfzh input").parent().next().html('请输入18位证件号');
            $(".layx22-left2-sfzh input").parent().next().css("display","");
          }else if(!check.isID($(".layx22-left2-sfzh input").val())){
            $(".layx22-left2-sfzh input").parent().next().html('身份证号码格式错误，请核实');
            $(".layx22-left2-sfzh input").parent().next().css("display","");
          }

          if(ishasImgCode){
              if(tpjyInputDom.val()=="请输入图片验证码"){
                  tpjyInputDom.parent().next().html('请输入图片验证码');
                  tpjyInputDom.parent().next().css("display","");
              }else if(tpjyInputDom.val().length !== 4){
                  tpjyInputDom.parent().next().html('请输入正确的验证码');
                  tpjyInputDom.parent().next().css("display","");
              }
          }

          if( ($(".layx3 input[type=checkbox]").length>0) && !$(".layx3 input[type=checkbox]")[0].checked){
            tools.showAlert("请阅读信息使用授权书，并勾选");
            fg3 = false;
          } else {
            fg3 = true;
          }

          // 赠险
          if( ($(".sec_insurance").length <= 0) || ($(".sec_insurance input[type=checkbox]")[0] && !$(".sec_insurance input[type=checkbox]")[0].checked)){
            $("input[name='IsSelectedInsurance']").val('false');
          } else {
            $("input[name='IsSelectedInsurance']").val('true');
          }

          if( (fg && fg2 && fg3 && $('#imgValidateCodeBox').hasClass('hide')) || (fg && fg2 && fg3 && !$('#imgValidateCodeBox').hasClass('hide')) && fg4){
            //$(".spedwin").css("left",($(window).width()-$(".spedwin").width())/2+$(window).scrollLeft());
              //$(".spedwin").css("top",($(window).height()-$(".spedwin").height())/2+$(window).scrollTop());

            //$("#maskLayer").css("display","block");
            //$(".spedwin").css("display","");
            //gauge.set(130000);
            $(".hqdk").addClass('disable');
            $.ajax({
              url:id_checking_url,
              type:"post",
              dataType:"json",
              data: {
                "name":$(".layx22-left2-zsxm input").val(),
                "idNumber":$(".layx22-left2-sfzh input").val(),
                "userId":uid,
                // "phone":mobile
                imageCode: $('#imgValidateCodeBox').hasClass('hide')?'':$('#imgValidateCode').val()
              },
              beforeSend: function () {
                  $("a.hqdk").html("提交中..");
              },
              success: function (res) {
                $(".hqdk").removeClass('disable');
                  $("a.hqdk").html("提交订单");
                if(res.Result){
                  document.getElementById("formQ").submit();
                }else{
                  if(res.Data === 0){
                    //验证码错误
                    $('#imgValidateCodeBox').removeClass('hide');

                    if(!isfirstClickSubmit){
                      tpjyInputDom.parents('.items').next('.layx22-left2-cwxx').html('请输入正确的验证码').css("display","");
                    }else {
                      $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                      tools.showAlert("请输入图片验证码");
                    }
                    // $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    
                  }else if(res.Data === -1){
                    //需要验证码
                    $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    $('#imgValidateCodeBox').removeClass('hide');
                    tools.showAlert("请输入图片验证码");
                  }else {
                    //$(".layx22-left2-cwxx2").css("display","");
                    $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    tools.showAlert("验证不通过，请核实姓名与身份证信息是否符合");
                  }
                }  
                isfirstClickSubmit = false; 
              }
            });

            //location='/loanapplyyx/Qualification';
          }else if(ishasImgCode  && fg4 && (!fg || !fg2)) {
            $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
            fg4 = false;
          }
        }
        
      })

      $(".layx22-left2-cwxx2 a").click(function(){
        $(".layx22-left2-cwxx2").css("display","none");
      })

      //$(".spedwin-jx").click(function(){
        //location='/loanapplyyx/Qualification';
      //})
      
      //如何贷款？
      $("#howgetgifts").hover(function(e){
        debugger;
        $(this).parent().prev(".tip").show();
      },function(e){
        $(this).parent().prev(".tip").hide();
      });
      
      // 赠险弹层
      $('#popInsuranceTrig').click(function(){
        var _insuranceCompanyName = $('input[name="InsuranceCompanyName"]').val();
        if( _insuranceCompanyName == 'syzx' ){
          $('#popInsuranceCont2').removeClass('hide');
        } else {
          $('#popInsuranceCont1').removeClass('hide');
        }
        $('#maskLayer').show();
        var pageH = document.documentElement.clientHeight;
        if( $('.popInsuranceCont').height() > pageH -100 ){
          $('.popInsuranceCont').css({'top': '50px'});
          $('.popInsuranceCont .popCont_bd').css({'height': pageH - 154 + 'px', 'overflow-y': 'auto', 'top': '50px'});
        }
      });
      $('.popCont_close').click(function(){
        $('#maskLayer').hide();
        $('.popInsuranceCont').addClass('hide');
      });
    }
  }
  
  $(function(){
    ordera.init();
  })
