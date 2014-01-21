function getRandom (min, max) {
	var rand = min - 0.5 + Math.random()*(max-min)
	return Math.round(rand);
}

$(document).ready(function() {
	$('.work_item').on({
		mouseover: function() {
			$(this).children('.work_logo, .work_title').hide();
			$(this).children('.work_images').show();
		},
		mouseout: function() {
			$(this).children('.work_logo, .work_title').show();
			$(this).children('.work_images').hide();
		},
		mousemove: function(event) {
			var msg = 0;
			var msg = event.pageX + event.pageY;

			var max = $(this).find('.work_image').length;
			if (max > 1) {
				var rand = getRandom(0, max);
				$(this).find('.work_image').hide();
				$(this).find('.work_image').eq(rand).show();
			}
		}
	});
});