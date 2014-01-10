$(document).ready(function() {
	var eng = true;
	var count = 0;

	$('.img_upload').sortable({cancel: '.img_delete, .img_description, .file'});

	$('.img_upload').mfupload({

		type		: 'jpg,png,tif,jpeg',
		maxsize		: 6,
		post_upload	: '/edit',
		folder		: '',
		ini_text	: 'Нажми или перетащи',
		over_text	: 'Отпускай!',
		over_col	: '',
		over_bkcol	: 'white',

		init		: function(){ },
		start		: function(result){ },
		loaded		: function(result) {
			var item = $('<div />', {'class':'img_item'});
			// var prev = $('<div />', {'class':'img_preview'}).css('background-image', 'url(' + result.path + ')');
			var prev = $('<img />', {'class':'img_preview', 'src':result.path});
			var desc = $('<div />', {'class':'img_description', 'contenteditable':true, 'text':'описание'});
			$('.img_upload').append(item.append(prev, desc));
		},
		progress	: function(result){ },
		error		: function(error){ },
		completed	: function(){ }

	});


	$(document).on('dblclick', '.img_preview', function() {
		var path = $(this).attr('src');
		var th_elem = $(this);

		$.post('/rm_prev', {path:path}).done(function(data) {
			th_elem.parent('.img_item').remove();
		});
	});


	$('.sub').click(function() {
		var title = $('.title').html();
		var description = $('.description').html();
		var tag = $("select option:selected").val();
		var images = [];

		$('.img_item').each(function(index, el) {
			var image = {
				path: $(this).children('.img_preview').attr('src'),
				description: $(this).children('.img_description').html()
			}
			images.push(image);
		});

		var data = {
			ru: {
				title: title,
				description: description
			},
			images: images,
			tag: tag
		};
		console.log(data.images)

		$.post('/auth/add/work', data).done(function(data) {
			// alert(title)
		});
	});












	function toggleEnglish () {
		if (eng = !eng) {
			eng = true;
			$('.en').prop('disabled', eng).hide();
			$('.ru').css('float','none');
		}
		else {
			eng = false;
			$('.en').prop('disabled', eng).show();
			$('.ru').css('float','left');
		}
	}

	function snakeForward () {
		count +=1;

		var elem = $('.snake');
		elem.first().clone().insertAfter(elem.last());

		var forms = $('.snake').eq(count).children('select, input');
		forms.each(function() {
			var value = $(this).attr('name');
			value = value.replace('0', count);
			$(this).attr('name', value);
		});
	}

	function snakeBack () {
		if ($('.snake').size() == 1) return null;
		$('.snake').last().remove();
	}

	$('.plus').on('click', snakeBack);
	$('.minus').on('click', snakeForward);
	$('.toggle_eng').on('click', toggleEnglish);
});