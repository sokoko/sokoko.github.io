$(document).ready(function() {



	/*************************************************/
	//Helper Functions
	function populateNamesDropdown(namesList){
        var namesListDropDown = $("#name-select");
        namesListDropDown.find('option').remove();
        $.each(namesList, function() {
            namesListDropDown.append($("<option />").val(this).text(this));
        });
        namesListDropDown.trigger("chosen:updated");
	};

	function generateSeries(frequency){

		var series = [{
			"name": frequency.name,
			"data": [],
			"pointStart": Date.UTC(1917, 0, 1),
		}];

		for (var i=1917; i<=2010; i++){
			series[0].data.push([Date.UTC(i,  0,  1), frequency.data[i-1917]]);
			// series[0].data.push([Date.UTC(i,  0,  1), 5])
		}
		return series;
	};

	function createChart(options){
		var chart = new Highcharts.Chart({
				chart: {
		            type: 'spline',
		            renderTo: 'chart_container'
		        },
		        title: {
		            text: options.title
		        },
		        subtitle: {
		            text: options.subtitle
		        },
		        xAxis: {
		        	type: 'datetime',
		            title: {
		                text: 'Year'
		            }
		        },
		        yAxis: {
		            title: {
		                text: 'Monthly Rent Price (CAD)'
		            },
		            min: 0
		        },
		        plotOptions: {
		            spline: {
		                dataLabels: {
		                    enabled: false
		                },
		                enableMouseTracking: true
		            },
		            series: {
		                dataLabels: {
		                    enabled: false
		                },
					    marker: {
			                enabled: false
			            }
		            }
		        },
		        tooltip: {
		            shared: true,
		            valueSuffix: ' baby names'
		        },
		        series: options.series
		});

		return chart;
	};

	/********************************************************************/

	var theChart;
	
	$("#name-select").chosen();

    $("#alpha-type-select").on( 'change', function () {
		var fileName = $(this).val();

		$.ajax({
	      type: "GET",
	      url: "/ajax/data/demographics/on-female-name/femaleNames_"+fileName+".json",
	      dataType: "json"
	    }).done(function(response,status,xhr) {

			populateNamesDropdown(response.names);

	    }).fail(function() {
	        alert( "error" );
	    });
    });

    $("#name-select").on( 'change', function () {
		var selectedName = $(this).val();

		if (selectedName){		
			$.ajax({
		      type: "GET",
		      url: "/ajax/data/demographics/on-female-name/all-names/"+selectedName.replace(" ","_")+".json",
		      dataType: "json"
		    }).done(function(response,status,xhr) {

		    	try {
	    			theChart.destroy();
		    	} catch(err){}

		    	var options = {};
		    	options.series = generateSeries(response);
		    	options.title = response.name;
		    	options.subtitle = '1917 - 2010';

		        theChart = createChart(options);

		    }).fail(function() {
		        alert( "error" );
		    });
		}
    });

});