var offset = 0;

$(document).ready(function() {


	$('.maket').scroll(function() {
		var maket = $('.maket').height();
		var cont = $('.content_block').height();

		if (cont - maket <= $('.maket').scrollTop() + 250) {
			offset+=4;
			$.post('/blog_load', {offset: offset}).done(function(posts) {
				if (posts != 'end') {
					$.each(posts, function(index, post) {
						var post_item = $('<div />', {'class':'post_item_block'});
						var post_img = $('<img />', {'class':'post_img', 'src': post.image});
						var post_dscription = $('<div />', {'class':'post_dscription_block'});
						var post_title = $('<a />', {'class':'post_title', 'href': '/blog/' + post.b_id, 'text': post.ru.title});
						var post_body = $('<div />', {'class':'post_body', 'html': post.ru.body});

						$('.content_block').append(post_item.append(post_img, post_dscription.append(post_title), post_body));
					});
				}
				else {
					$('.maket').off('scroll');
				}
			});
		}
	});
});