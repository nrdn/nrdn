$(document).ready(function() {
	var count = 0;

	$('.menu_block, .content_block').click(function(event) {
		$('.work_item').hide();
		$('.background_item').eq(count+2).css('opacity', '0');
		$('.work_item').eq(count+2).show();
		count--;
		if (count == -3) {
			$('.background_item').css('opacity', '1')
			count = 0;
		}
	});
});