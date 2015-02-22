$(document).ready(function() {

	var ajaxDataRootPath = CustomHelper.getAjaxDataRootPath();
	var queryParameterValue = CustomHelper.getParameterByName("q");
	var barChartFlag = CustomHelper.getParameterByName("bar");

	CustomHelper.initializeSideMenu(["nav-education"]);

	//Prepare Promise
	$.when(
	  	//Request Data
		$.ajax({
		  	url: (ajaxDataRootPath + "/education/EnrollementInMajors.json" ),
		  	dataType: "json"
		})

	).then(		
		//Both requests successful
		function(response2){

			//Setup breadcrumb
			CustomHelper.addBreadcrumb("/statistics/education/", "Education");
			CustomHelper.addBreadcrumb("#", response2[0].title, true);			

			//Set Up Header
			$("#page-wrapper h1 span").css("font-size", "24px").css("color","#357ebd").html(response2[0].description);

			$(".education-wrapper").html(compiledTemplate(response2[0]));

			//Populate Selection Dropdown
			var selectionDropDown = $("#selection-dropdown");
			_.each(response2[0].data, function(item, index){
				selectionDropDown.append( '<option value="'+index+'">'+item.entity_name+'</option>' )
			});
			selectionDropDown.chosen();

			/*****************************************************************************/
			/*****************************************************************************/
			var chart = nv.models.multiBarHorizontalChart()
		        .x(function(d) {
		        	if (d.property.length > 19){
		        		return d.property.substring(0, 19) + "...";
		        	} else {
		        		return d.property;
		        	}
		         	
		     	 })
		        .y(function(d) { return d.property_value })
		        .margin({top: 30, right: 20, bottom: 50, left: 150})
		        .showValues(true)           //Show bar value next to each bar.
		        .tooltips(true)             //Show tooltips on hover.
		        .transitionDuration(350)
		        .tooltipContent(function(key, y, e, graph) {  
		        	return CustomHelper.genarateGraphTooltipHtml(e,graph);
		        })
		        .showControls(false);        //Allow user to switch between "Grouped" and "Stacked" mode.

		    chart.yAxis
		         .tickFormat(d3.format('.0f'));

		    var barData = CustomHelper.prepareHorizantalBarGraphData((response2[0]).data[0])

		    $("#bar-graphs-tab-chart").height(barData[0].values.length*31);

		    d3.select('#bar-graphs-tab-chart')
		        .datum(barData)
		        .call(chart);

		    nv.utils.windowResize(chart.update);
		    /*****************************************************************************/
		    /*****************************************************************************/

			selectionDropDown.on( 'change', function () {
	            var val = $(this).val();

	            var barData = CustomHelper.prepareHorizantalBarGraphData((response2[0]).data[val])

			    $("#bar-graphs-tab-chart").height(barData[0].values.length*31);

			    d3.select('#bar-graphs-tab-chart')
			        .datum(barData)
			        .call(chart);

			    nv.utils.windowResize(chart.update);
		    });

		},

		//One or more requests failed
		function(e){
			console.log(e)
		}
	);

});