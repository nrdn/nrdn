$(document).ready(function() {
	$('.work_item').on({
		mouseover: function() {
			$(this).css('color', 'white');
			$(this).children('.work_inner').css('background-image', 'url(/images/design/logo2.png)').css('background-size', '35%');
		},
		mouseout: function() {
			$(this).css('color', 'black');
			$(this).children('.work_inner').css('background-image', 'url(/images/design/logo4.png)').css('background-size', '150%');
		}
	})
});