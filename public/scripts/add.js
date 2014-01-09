$(document).ready(function() {
	var eng = true;
	var count = 0;

	$('.img_upload').sortable({cancel: '.img_delete, .img_description'});

	$('.img_preview').mfupload({

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
			// $(this).css('background-color', 'red');
			$('.img_preview').eq(1).css('background-image', 'url(' + result.path + ')');
			// img_preview = result.path;
		},
		progress	: function(result){ },
		error		: function(error){ },
		completed	: function(){ }

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