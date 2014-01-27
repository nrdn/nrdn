$(document).ready(function() {
	var count = $('.background_item').length - 1;
	var w_count = 0;

	$(document).click(function(event) {

		w_count++;
		$('.work_item').hide();
		$('.work_item').eq(w_count).show();
		$('.background_item').eq(count).css('opacity', '0');
		count--;

		if (count < 0) {
			$('.background_item').css('opacity', '1')
			count = $('.background_item').length - 1;
			w_count = 0;
			$('.work_item').eq(w_count).show();
		}
	});
});