$(document).ready(function() {
	$('.work_item').mouseover(function(event) {
		$(this).css('color', 'white');
		$(this).children('.work_inner').removeAttr('style');
	});
});