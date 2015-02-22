$(document).ready(function() {

    //Bootstrap - Dropdown Hover
   	function allowDropdownHover() {
   		if($(window).width() > 767){
	    	$('.dropdown-toggle').dropdownHover();
	    }	
    }
    allowDropdownHover();
    window.onresize = allowDropdownHover; // Call the function on resize

    var screenRes = $(window).width(),
        screenHeight = $(window).height(),
        html = $('html');

    // IE<8 Warning
    if (html.hasClass("ie8")) {
        $("body").empty().html('Please, Update your Browser to at least IE9');
    }

    // Disable Empty Links
    $("[href=#]").click(function(event){
        event.preventDefault();
    });

    // Body Wrap
    $(".body-wrap").css("min-height", screenHeight);
    $(window).resize(function() {
        screenHeight = $(window).height();
        $(".body-wrap").css("min-height", screenHeight);
    });

    // styled Select, Radio, Checkbox
    if ($("select").hasClass("select_styled")) {
        cuSel({changedEl: ".select_styled", visRows: 8, scrollArrows: true});
    }

});