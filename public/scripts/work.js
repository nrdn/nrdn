$(document).ready(function() {
	var count = $('.background_item').length - 1;
	var w_count = 0;

	function toggleGlow () {
		$('.background_works').toggleClass('glow');
	}

	$('.work_description_block').on('mouseover mouseout', toggleGlow);

	$('.work_description_block').click(function(event) {
		$(this).data('clicked', !$(this).data('clicked'));
		$(this).toggleClass('hide');

		if ($(this).data('clicked')) {
			$(this).children().hide();
			$(this).off('mouseover mouseout')
			$('.background_works').addClass('glow');
		}
		else {
			$(this).children().show();
			$(this).on('mouseover mouseout', toggleGlow);
		}
	});

	$('.dot:first').text('●');

	$(document).click(function(event) {
		var target = $(event.target);

		if (target.is( ':not(.logo, .menu_items a, .work_description_block, .work_title, .work_description)' )) {
			w_count++;
			$('.work_item').hide();
			$('.work_item').eq(w_count).show();
			$('.dot').text('◦');
			$('.dot').eq(w_count).text('●');
			$('.background_item').eq(count).css('opacity', '0');
			$('.background_item').eq(count-1).css('opacity', '1');
			count--;

			if (count < 0) {
				$('.background_item').css('opacity', '1')
				count = $('.background_item').length - 1;
				w_count = 0;
				$('.work_item').eq(w_count).show();
				$('.dot').eq(w_count).text('●');
			}
		}
	});
});