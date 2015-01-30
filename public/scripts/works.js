var old_position = 0;
var step = 10000;

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

	// function bg_move() {
	// 	var max = $(this).find('.work_image').length;
	// 	if (max > 1) {
	// 		if (step > 99999)
	// 			step = 10000;
	// 		else
	// 			step += event.pageX + event.pageY;

	// 		var position = +step.toString().charAt(0);
	// 		if (position != old_position) {
	// 			var rand = getRandom(0, max);
	// 			$(this).find('.work_image').hide();
	// 			$(this).find('.work_image').eq(rand).show();
	// 			old_position = position;
	// 		}
	// 	}
	// }

	function bg_over() {
		var max = $(this).find('.work_image').length;
		var rand = getRandom(0, max);
		$(this).find('.work_image').hide().eq(rand).show();

		$(this).children('.work_logo, .work_title').hide();
		$(this).children('.work_images').show();
	}

	function bg_out() {
		$(this).children('.work_logo, .work_title').show();
		$(this).children('.work_images').hide();
	}


	$(document).on('mouseover', '.work_item', bg_over);
	$(document).on('mouseout', '.work_item', bg_out);
	// $(document).on('mousemove', '.work_item', bg_move);




	$('.sort_item.tags').click(function() {
		$('.sort_item').removeAttr('style');
		$(this).css('border-bottom','black 1px dotted');

		var items = $('.work_item');
		$('.work_tag').remove();
		var arr_items_tags = [];

		items.each(function(index, el) {
			arr_items_tags.push(el.className.split(' ')[1]);
		});

		var tags = getUnique(arr_items_tags);
		var direction = ['urbanism', 'architecture', 'urban_projects', 'exhibitions', 'industrial_design', 'installation', 'navigation', 'graphic_design'];
		var result = [];

		for (var i = 0; i < direction.length; ++i){
			for (var j = 0; j < tags.length; ++j){
				if (direction[i] == tags[j])
						result.push(direction[i]);
			}
		}

		$.each(result, function(index, tag) {
			var tags = {'urbanism':'Урбанизм', 'architecture':'Архитектура', 'urban_projects':'Городские проекты', 'exhibitions':'Выставки', 'industrial_design':'Промышленный дизайн', 'installation': 'Инсталяции', 'navigation':'Навигация', 'graphic_design':'Графический дизайн'}
			var tag_items = $(items).filter('.' + tag);
			var work_tag = $('<div />', {'class':'work_tag ' + tag});
			var work_tag_title = $('<div />', {'class':'work_tag_title', 'text':tags[tag]});
			$('.works_block').append(work_tag.append(work_tag_title).append(tag_items));
		});

	});


	$('.sort_item.year').click(function() {
		$('.sort_item').removeAttr('style');
		$(this).css('border-bottom','black 1px dotted');

		var items = $('.work_item');
		$('.work_tag').remove();
		var arr_items_years = [];

		items.each(function(index, el) {
			arr_items_years.push(el.className.split(' ')[2]);
		});

		var years = getUnique(arr_items_years);

		$.each(years.reverse(), function(index, year) {
			var year_items = $(items).filter('.' + year);
			var work_tag = $('<div />', {'class':'work_tag ' + year});
			var work_tag_title = $('<div />', {'class':'work_tag_title', 'text':year});
			$('.works_block').append(work_tag.append(work_tag_title).append(year_items));
		});

	});


	$('.sort_item.clear').click(function() {
		$('.sort_item').removeAttr('style');
		$(this).css('border-bottom','black 1px dotted');

		$('.work_tag').remove();

		old_items.each(function(index, el) {
			$('.works_block').append(el);
		});
	});


});