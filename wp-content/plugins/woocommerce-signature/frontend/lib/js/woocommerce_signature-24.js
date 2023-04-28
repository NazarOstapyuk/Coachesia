( function( $ ) {
	"use strict";
	jQuery(document).ready(function($) {
		$( ".woocommerce_signature" ).each(function( index ) {
		
			var background = $(this).data("background");
			var color = $(this).data("color");
			var data = $('input[name ="woocommerce_signature_name_data"]').val();
			var name = $(this).data("name");
			if( name != "" ){
				name =true;
			}else{
				name =false;
			}
			$(this).signature(
				 	{
				 	color: color,
				 	background: background,
				 	guideline: name,
				 	syncFormat: "PNG",
				 	syncField: $('input[name ="woocommerce_signature_name_data"]'),
				 	name: name,
				 	change: function(){
				 		//alert(1);
				 	}
			 	});	
			if( data !="" ) {
				$(this).signature('draw', data);
			}
		});
		$("body").on("click",".woocommerce_signature_clear img",function(){
			$(this).closest(".woocommerce_signature-container").find(".woocommerce_signature").signature('clear');
		})
		$("body").on("change",".woocommerce_signature_name",function(){
			var name = $(this).val();
			$(this).closest(".woocommerce_signature-container").find(".woocommerce_signature").signature('setname');
		})
		$("body").on("mouseleave",".woocommerce_signature_name",function(){
			var name = $(this).val();
			if( name != ""){
				$(this).closest(".woocommerce_signature-container").find(".woocommerce_signature").signature('setname');
			}
		})
		$( document.body ).on( 'update_order_review', function() {
		    alert(1);
		});
	})
} )( jQuery );