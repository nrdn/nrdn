var offset = 0;

$(document).ready(function() {
	var cont = $('.maket').height();
	var position = cont;

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

		if (position - maket <= $('.maket').scrollTop() + 250) {
			offset+=4;

			$.post('/blog_load', {offset: offset}).done(function(posts) {
				position += cont;
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