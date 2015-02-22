var CustomHelper = {

	getAjaxDataRootPath: function(){
		return "/ajax/data";
	},

	getParameterByName: function (name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	getChartColorList: function(index) {
		var colorList =['#3366CC','#DC3912','#FF9900','#109618','#990099',
						'#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E',
						'#316395','#994499','#22AA99','#AAAA11','#6633CC',
						'#E67300','#8B0707','#329262','#5574A6','#3B3EAC'];

		return colorList[index%colorList.length];
	},

	prepareBarGraphData: function(response, doNotInclude, lastIndexToConsider){

		var result = [];

		_.each(response.data, function(entryArray, index1){
			if (_.indexOf(doNotInclude, entryArray[0]) < 0){
				var entry = {
				  key: entryArray[0],
				  color: CustomHelper.getChartColorList(index1),
				  values: []
				};

				_.each(entryArray, function(item, index2){
					if (index2 !== 0 && index2 <= lastIndexToConsider){
						var temp = { 
						  x : response.headers[index2],
					      y : parseInt(item.replace(/,/g,''))
					    };
					    entry.values.push(temp);
					}
				});

				result.push(entry);
			}
		});

		return result;
	},

	addBreadcrumb: function(href, name, isActive){
		if (isActive) {
			$('<li class="active">' + name + '</li>').appendTo("#breadcrumb ol");
		} else {
			$('<li><a href="' + href + '">' + name + '</a></li>').appendTo("#breadcrumb ol");	
		}
	},

	prepareHorizantalBarGraphData: function(response){
		//var clone = _.map(response, _.clone);
		var result = [{
		    "key": "",
		    "color": "#1f77b4",
		    "values": []
		}];

		result[0].values = response.entity_value;
		result[0].key = response.entity_name;

		return result;
	},

	genarateGraphTooltipHtml: function(e,graph){
		return "<div class=\"panel panel-primary graph-tooltip-popover\"><div class=\"panel-heading\">"+graph.series.values[graph.pointIndex].property+"</div><div class=\"panel-body\"><p> Head Count: "+e+"</p></div></div>" ;
	}

}
