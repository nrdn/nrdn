var old_position = 0;

function getRandom (min, max) {
	var rand = min - 0.5 + Math.random()*(max-min)
	return Math.round(rand);
}

function getUnique(arr) {
	var obj = {};

	for (var key in arr)
		obj[ arr[key] ] = true;

	return Object.keys(obj);
}

$(document).ready(function() {
	var old_items = $('.work_item');

	function bg_move() {
		var max = $(this).find('.work_image').length;
		if (max > 1) {
			var x_track = +event.pageX.toString().slice(1,-1)
			var y_track = +event.pageY.toString().slice(1,-1)
			var position = x_track + y_track;
			if (position != old_position) {
				var rand = getRandom(0, max);
				$(this).find('.work_image').hide();
				$(this).find('.work_image').eq(rand).show();
				old_position = position;
			}
		}
	}

	function bg_over() {
		$(this).children('.work_logo, .work_title').hide();
		$(this).children('.work_images').show();
	}

	function bg_out() {
		$(this).children('.work_logo, .work_title').show();
		$(this).children('.work_images').hide();
	}


	$(document).on('mouseover', '.work_item', bg_over);
	$(document).on('mouseout', '.work_item', bg_out);
	$(document).on('mousemove', '.work_item', bg_move);




	$('.sort_item.tags').click(function() {
		var items = $('.work_item');
		$('.work_tag').remove();
		var arr_items_tags = [];

		items.each(function(index, el) {
			arr_items_tags.push(el.className.split(' ')[1]);
		});

		var tags = getUnique(arr_items_tags);

		$.each(tags, function(index, tag) {
			var tags = {'urbanism':'Урбанизм', 'architecture':'Архитектура', 'urban_projects':'Городские проекты', 'exhibitions':'Выставки', 'industrial_design':'Промышленный дизайн', 'navigation':'Навигация', 'graphic_design':'Графический дизайн'}
			var tag_items = $(items).filter('.' + tag);
			var work_tag = $('<div />', {'class':'work_tag ' + tag});
			var work_tag_title = $('<div />', {'class':'work_tag_title', 'text':tags[tag]});
			$('.works_block').append(work_tag.append(work_tag_title).append(tag_items));
		});

	});


	$('.sort_item.year').click(function() {
		var items = $('.work_item');
		$('.work_tag').remove();
		var arr_items_years = [];

		items.each(function(index, el) {
			arr_items_years.push(el.className.split(' ')[2]);
		});

		var years = getUnique(arr_items_years);

		$.each(years, function(index, year) {
			var year_items = $(items).filter('.' + year);
			var work_tag = $('<div />', {'class':'work_tag ' + year});
			var work_tag_title = $('<div />', {'class':'work_tag_title', 'text':year});
			$('.works_block').append(work_tag.append(work_tag_title).append(year_items));
		});

	});


	$('.sort_item.clear').click(function() {
		$('.work_tag').remove();

		old_items.each(function(index, el) {
			$('.works_block').append(el);
		});
	});


});