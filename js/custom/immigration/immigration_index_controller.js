$(document).ready(function() {

	var ajaxDataRootPath = CustomHelper.getAjaxDataRootPath();
	CustomHelper.initializeSideMenu(["nav-immigration"]);

	//Setup breadcrumb
	CustomHelper.addBreadcrumb("#", "Immigration", true);

	//Prepare Promise
	$.when(
	  	
		//Request Require-JS Template
		$.ajax({
		  	url: ("/ajax/requirejs_templates/common/Template_Common_List_Index.html"),
		  	dataType: "html"
		}),

	  	//Request Data
		$.ajax({
		  	url: (ajaxDataRootPath + "/immigration/contents.json" ),
		  	dataType: "json"
		})

	).then(		
		//Both requests successful
		function(response1, response2){

			//Inject Template
			var compiledTemplate =_.template(response1[0]);
			$(".immigration-index-wrapper").html(compiledTemplate(response2[0]));

		},

		//One or more requests failed
		function(a,b,c){
			console.log("error")
		}
	);
	
});