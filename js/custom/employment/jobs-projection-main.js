$(document).ready(function() {

	/*************************************************/
	//Helper Functions
	function populateCities(nocList){
        var nocListDropDown = $("#job-select");
        nocListDropDown.find('option').remove();
        $.each(nocList, function() {
            nocListDropDown.append($("<option />").val(this.c).text(this.n));
        });
        nocListDropDown.chosen();
	};

	function createChart(options){
		var chart = new Highcharts.Chart({

				chart: {
		            type: 'column',
		            renderTo: 'chart_container'
		        },
		        title: {
		            text: options.title + '. <strong>'+options.assessment+'</strong>'
		        },
		        subtitle: {
		            text: options.subtitle
		        },
		        xAxis: {
		        	type: 'category'
		        },
		        yAxis: {
		            title: {
		                text: 'Number'
		            }
		        },
		        series: options.series
		});

		return chart;
	};

	/********************************************************************/

    $("#job-select").on( 'change', function () {
		var fileName = $(this).val();

		$.ajax({
	      type: "GET",
	      url: "/ajax/data/jobs/allJobs/"+fileName+".json",
	      dataType: "json"
	    }).done(function(response,status,xhr) {

	    	try {
	    		theChart.destroy();
	    	} catch(err){
	    	}

	    	var options = {};
	    	options.series = response.series;
	    	options.series[0].name = options.series[0].name + '. Projected Job Openings/Job Seekers from 2013 to 2022 - Canada'
	    	options.title = response.name;
	    	options.subtitle = 'Transparent-Canada.ca / Projected Canadian Employment 2013-2022 / Source: open.canada.ca';
	    	options.assessment = response.assessment;

	        theChart = createChart(options);

	    }).fail(function() {
	        alert( "error" );
	    });
    });

	//Get the List of NOCs
	$.ajax({
      type: "GET",
      url: "/ajax/data/jobs/nocList.json",
      dataType: "json"
    }).done(function(response,status,xhr) {
        populateCities(response.NocCodes);
        $("#job-select").trigger('change');
    }).fail(function() {
        alert( "error" );
    });
	
});