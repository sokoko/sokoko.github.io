$(document).ready(function() {

	var ajaxDataRootPath = CustomHelper.getAjaxDataRootPath();
	var queryParameterValue = CustomHelper.getParameterByName("q");
	var barChartFlag = CustomHelper.getParameterByName("bar");
	var isBarChartTabInitialized = false;
	
	CustomHelper.initializeSideMenu(["nav-immigration"]);

	//Prepare Promise
	$.when(
	  	
		//Request Require-JS Template
		$.ajax({
		  	url: ("/ajax/requirejs_templates/immigration/Template_Immigration.html"),
		  	dataType: "html"
		}),

	  	//Request Data
		$.ajax({
		  	url: (ajaxDataRootPath + "/immigration/" + queryParameterValue + ".json" ),
		  	dataType: "json"
		})

	).then(		
		//Both requests successful
		function(response1, response2){

			//Setup breadcrumb
			CustomHelper.addBreadcrumb("/statistics/immigration/", "Immigration");
			CustomHelper.addBreadcrumb("#", response2[0].title, true);			

			//Set Up Header
			$("#page-wrapper h1 span").css("font-size", "24px").css("color","#357ebd").html(response2[0].title);

			//Inject Template
			var compiledTemplate =_.template(response1[0]);
			$(".immigration-wrapper").html(compiledTemplate(response2[0]))

			//Draw Table
		    $('#immigration_table').dataTable({
			  "data": response2[0].data,
			  "deferRender": true,
			  "iDisplayLength" : 10,
			  "columnDefs": [
			    { "width": "25%", "targets": 0 }
			  ]
			});

			//Draw Bar Chart
			if (barChartFlag.length > 0){
				$("#bar-graphs-tab").removeClass("hide");
				var chart = nv.models.multiBarChart();
				chart.yAxis.tickFormat(d3.format(',0f'));
				d3.select('#bar-graphs-tab-chart')
				  .datum(CustomHelper.prepareBarGraphData(response2[0], ["Total Top 10"], 5))
				  .transition()
				  .duration(50)
				  .call(chart);

				nv.utils.windowResize(chart.update);
			}
		},

		//One or more requests failed
		function(e){
			console.log(e)
		}
	);
	
});