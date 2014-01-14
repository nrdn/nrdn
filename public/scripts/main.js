$(document).ready(function() {
	var count = $('.background_item').length - 1;

	$('.menu_block, .content_block').click(function(event) {
		$('.work_item').hide();
		$('.background_item').eq(count).css('opacity', '0');
		$('.work_item').eq(count).show();
		count--;
		if (count < 0) {
			$('.background_item').css('opacity', '1')
			count = $('.background_item').length - 1;
		}
	});
});