$(document).ready(function() {
	var count = $('.background_item').length - 1;

	$('.work_description_block').click(function(event) {
		$(this).hide();
	});

	$('.menu_block, .content_block').click(function(event) {
		$('.work_item').hide();
		$('.work_item').eq(count).show();
		$('.background_item').eq(count).css('opacity', '0');
		count--;
		if (count < 0) {
			$('.background_item').css('opacity', '1')
			count = $('.background_item').length - 1;
		}
	});
});