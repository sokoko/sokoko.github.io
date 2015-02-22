$(document).ready(function() {



	/*************************************************/
	//Helper Functions
	function populateCities(citiesList){
        var citiesListDropDown = $("#city-select");
        citiesListDropDown.find('option').remove();
        $.each(citiesList, function() {
            citiesListDropDown.append($("<option />").val(this.f).text(this.n));
        });
        citiesListDropDown.chosen();
	};

	function generateCategories(){
		var categories = [];
		for (var i=1987; i<=2014; i++){
			categories.push(i);
		}
		return categories;
	};

	function extractSeries(units, unitName, cityName, fileName){
		var result = {};

		$.each(units, function() {
			if (this.name === unitName){
				var unit = {};
	            unit.name=cityName;
	            unit.data=this.prices;
	            unit.fileName=fileName;
	            result = unit;
			}
        });

        return result;
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
		            text: options.subtitle + '. Transparent-Canada.ca / Source: open.canada.ca'
		        },
		        xAxis: {
		            categories: options.categories,
		            title: {
		                text: 'Year'
		            }
		        },
		        yAxis: {
		            title: {
		                text: 'Monthly Rent Price (CAD)'
		            }
		        },
		        plotOptions: {
		            spline: {
		                dataLabels: {
		                    enabled: true
		                },
		                enableMouseTracking: true
		            }
		        },
		        tooltip: {
		            shared: true,
		            valueSuffix: ' CAD'
		        },
		        series: options.series
		});

		return chart;
	};

	/********************************************************************/

	var theChart;
	var categories = generateCategories();
	var chosenCitiesFileNameList = [];
	var chartSeries = [];

	
    $("#city-select").on( 'change', function (event, params) {

    	if (params.selected){

			chosenCitiesFileNameList.push(params.selected);

			$.ajax({
		      type: "GET",
		      url: "/ajax/data/housing/rent/"+params.selected+".json",
		      dataType: "json"
		    }).done(function(response,status,xhr) {

		    	try {
		    		theChart.destroy();
		    	} catch(err){
		    	}

		    	var newSeries = extractSeries(
		    			response.structures[0].units,
		    			$("#unit-type-select").val(),
		    			response.name,
		    			params.selected
		    		);

		    	chartSeries.push(newSeries);

		    	var seriesToBePassed = jQuery.extend(true, [], chartSeries);

		    	var options = {};
		    	options.series = seriesToBePassed;
		    	options.title = 'Rent Prices Comaprison - ' + $("#unit-type-select").val();
		    	options.subtitle = 'Average Rent Prices from 1987 to 2014';
		    	options.categories = categories;

		        theChart = createChart(options);

		    }).fail(function() {
		        //alert( "error" );
		    });

    	} else if (params.deselected){
    		chartSeries = _.without(chartSeries, _.findWhere(chartSeries, {fileName: params.deselected}));
			chosenCitiesFileNameList = _.without(chosenCitiesFileNameList, params.deselected);

			var seriesToBePassed = jQuery.extend(true, [], chartSeries);

			var options = {};
	    	options.series = seriesToBePassed;
	    	options.title = 'Rent Prices Comaprison - ' + $("#unit-type-select").val();
	    	options.subtitle = 'Average Rent Prices from 1987 to 2014';
	    	options.categories = categories;

	    	try {
		    		theChart.destroy();
		    	} catch(err){
		    }

	        theChart = createChart(options);
    	}


    });

    $("#unit-type-select").on( 'change', function () {
    	$("#city-select").val('').trigger('chosen:updated');
    	chartSeries = [];
    	try {
    		theChart.destroy();
    	} catch(err){}
    });

    //Make th drop down chosen
    $("#unit-type-select").chosen();

	//Get the List of cities
	$.ajax({
      type: "GET",
      url: "/ajax/data/housing/rent/cityNames.json",
      dataType: "json"
    }).done(function(response,status,xhr) {
        populateCities(response.cities);
    }).fail(function() {
        alert( "error" );
    });
	
});