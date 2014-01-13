$(document).ready(function() {
	var count = 0;

	$('.menu_block, .content_block').click(function(event) {
		$('.background_item').eq(count+2).css('opacity', '0');
		count--;
		if (count == -3) {
			$('.background_item').css('opacity', '1')
			count = 0;
		}
	});
});