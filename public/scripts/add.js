$(document).ready(function() {
	var eng = true;
	var count = 0;


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

	$('.form_submit').click(function() {
		var areas = $('textarea');
		areas.each(function() {
			var newValue = $(this).val().replace(/\n/g, "<br />");
			$(this).val(newValue);
		});
		$('form').submit();
	});



	var $editor = $('.editor').wysiwyg({
			classes: 'editor',
			toolbar: 'top',
			buttons: {
					insertlink: {
							title: 'Insert link',
							image: '\uf08e',
					},
				 bold: {
							title: 'Bold (Ctrl+B)',
							image: '\uf032',
							hotkey: 'b'
					},
					italic: {
							title: 'Italic (Ctrl+I)',
							image: '\uf033',
							hotkey: 'i'
					},
					underline: {
							title: 'Underline (Ctrl+U)',
							image: '\uf0cd',
							hotkey: 'u'
					},
					removeformat: {
							title: 'Remove format',
							image: '\uf12d'
					},
			},
      submit: {
          title: 'Submit',
          image: '\uf00c'
      },
			// placeholder: 'Type your text here...',
			placeholderUrl: 'www.example.com',
	});


});