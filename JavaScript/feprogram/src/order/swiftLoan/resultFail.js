require("./qualification.scss");

	var ordera = {

		init: function(){
			if($(document.body).height()<$(window).height()){
				$("#Footer").css("margin-top",$(window).height()-$(document.body).height()+20);
			}

			$(window).resize(function(){
				if($(document.body).height()<$(window).height()){
					$("#Footer").css("margin-top",$(window).height()-$(document.body).height()+20);
				}
			})

			
			
		}
	}
	
	ordera.init();
