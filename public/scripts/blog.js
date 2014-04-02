var offset = 0;

$(document).ready(function() {

	function arrowUp () {
		var e = $('.scroll_top');

		e.click(function(){
			$(".maket:not(:animated)").animate({ scrollTop: 0}, 500 );
			return false;
		});

		( $('.maket').scrollTop() > 300 ) ? e.show() : e.hide();
	}

	function scrollLoader () {
		var maket = $('.maket').height();
		var cont = $('.content_block').height();

		if (cont - maket <= $('.maket').scrollTop() + 2250) {
			offset+=4;
			$.post('/blog_load', {offset: offset}).done(function(posts) {
				if (posts != 'end') {
					$.each(posts, function(index, post) {
						var post_img = $('<img />', {'class':'post_img', 'src': post.image});
						$('.main').eq(offset + index + 1).append(post_img);
					});
				}
				else {
					$('.maket').off(scrollLoader);
				}
			});
		}
	}


	$('.maket').on('scroll', scrollLoader)
	$('.maket').on('scroll', arrowUp)
});