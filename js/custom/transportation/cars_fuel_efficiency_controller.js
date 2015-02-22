$(document).ready(function() {

	CustomHelper.initializeSideMenu(["nav-transportation-wrapper","nav-fuel-efficiency"]);
	CustomHelper.addBreadcrumb("#", "Vehicles Fuel Efficiency, 2000 - 2014", true);

	function fetchDataAndPopulateDatatable(year, callback){
		var carsTable = $('#testTable').DataTable();
		carsTable.ajax.url( '/ajax/data/vehicles_fuel/fuel_'+year+'.json' ).load(callback);
	};

	function clearColumnsFilters(){
		_.each($('.filter-dropdown'), function(item){
			$(item).val("").change();
		});
	}

   	function ajaxRequestCallback(){
   		// Update Selected Year Displayed Title
   		var year = $("#year-dropdown-fuel-consumption").val();
   		$("#fuel-year-choosen-span").html("Year: " + year);

   		// Go through each column of the table and filter the options
		var carsTable = $('#testTable').DataTable();
		$("#testTable tfoot th").each( function ( i ) {
	        //Only filter those columns
	        if($(this).data("include-filter") === true) {
	        	var select = $('<select class="filter-dropdown"><option  value="">All</option></select>')
		            .appendTo( $(this).empty() )
		            .on( 'change', function () {
		                var val = $(this).val();
		 
		                carsTable.column( i )
		                    .search( val ? '^'+$(this).val()+'$' : val, true, false )
		                    .draw();
		            });
		 
		        carsTable.column( i ).data().unique().sort().each( function ( d, j ) {
		            select.append( '<option value="'+d+'">'+d+'</option>' )
		        });
	        }
	    });

		$(".panel-heading .loading").addClass("hide");
	    $(".panel-heading .fade").addClass("in");
		window.setTimeout(function () {
		    $(".panel-heading .fade").removeClass("in");
		}, 3000);
   	};

   	/*Populate Dropdown Menu*/
   	function populateYearsDropDown(){
   		var yearDropDown = $("#year-dropdown-fuel-consumption");
   		for(var i=2014; i>=2000; i--){
   			yearDropDown.append( '<option value="'+i+'">'+i+'</option>' )
   		}
   	};

   	//Prepare Table
    var fuelTable = $('#testTable').dataTable({
	  "deferRender": true,
	  "iDisplayLength" : 10
	});

   	//Add Dropdown listener
   	$("#year-dropdown-fuel-consumption").on("change", function() {
 		//Clear Filters
 		clearColumnsFilters();
 		//Start Request
   		$(".panel-heading .loading").removeClass("hide");
		var dataTable = $('#testTable').DataTable();
		var year = $(this).val();
		fetchDataAndPopulateDatatable(year, ajaxRequestCallback);
	});

   	fetchDataAndPopulateDatatable("2014", ajaxRequestCallback);
   	populateYearsDropDown();

});

