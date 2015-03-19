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

	function generateSeries(units){
		var series = [];
		$.each(units, function() {
            var unit = {};
            unit.name=this.name;
            unit.data=this.prices;
            series.push(unit);
        });
		
		return series;
	};

	function updateCurrentRents(units){

		var bachelor ='',one = '',two = '',three = '';

		$.each(units, function() {
			var unitName = this.name;

			if (unitName === "Bachelor units"){
				bachelor = this.prices[this.prices.length -1]
			} else if (unitName === "One bedroom units"){
				one = this.prices[this.prices.length -1]
			} else if (unitName === "Two bedroom units"){
				two = this.prices[this.prices.length -1]
			} else if (unitName === "Three bedroom units"){
				three = this.prices[this.prices.length -1]
			}
        });

		if (bachelor === null){
			$("#bachelor-unit-price").html("N/A");
		} else {
			$("#bachelor-unit-price").html(bachelor + ' CAD');
		}

		if (one === null){
			$("#one-unit-price").html("N/A");
		} else {
			$("#one-unit-price").html(one + ' CAD');
		}

		if (two === null){
			$("#two-unit-price").html("N/A");
		} else {
			$("#two-unit-price").html(two + ' CAD');
		}

		if (three === null){
			$("#three-unit-price").html("N/A");
		} else {
			$("#three-unit-price").html(three + ' CAD');
		}

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

    $("#city-select").on( 'change', function () {
		var fileName = $(this).val();

		$.ajax({
	      type: "GET",
	      url: "/ajax/data/housing/rent/"+fileName+".json",
	      dataType: "json"
	    }).done(function(response,status,xhr) {

	    	try {
	    		theChart.destroy();
	    	} catch(err){
	    	}

	    	updateCurrentRents(response.structures[0].units);

	    	var options = {};
	    	options.series = generateSeries(response.structures[0].units);
	    	options.title = response.name;
	    	options.subtitle = 'Average Rent Prices from 1987 to 2014';
	    	options.categories = categories;

	        theChart = createChart(options);

	    }).fail(function() {
	        alert( "error" );
	    });
    });

	//Get the List of cities
	$.ajax({
      type: "GET",
      url: "/ajax/data/housing/rent/cityNames.json",
      dataType: "json"
    }).done(function(response,status,xhr) {
        populateCities(response.cities);
        $("#city-select").trigger('change');
    }).fail(function() {
        alert( "error" );
    });
	
});