function getRandom (min, max) {
	var rand = min - 0.5 + Math.random()*(max-min+1)
	return Math.round(rand);
}

$(document).ready(function() {
	$('.work_item').on({
		mouseover: function() {
			$(this).children('a, .work_title').hide();
			$(this).children('.work_images').show();
		},
		mouseout: function() {
			$(this).children('a, .work_title').show();
			$(this).children('.work_images').hide();
		},
		mousemove: function() {
			var max = $(this).find('.work_image').length;
			var rand = getRandom(0, max);
			$(this).find('.work_image').hide();
			$(this).find('.work_image').eq(rand).show();
		}
	});
});