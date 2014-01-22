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
	$('.work_item').on({
		mouseover: function() {
			$(this).children('.work_logo, .work_title').hide();
			$(this).children('.work_images').show();
		},
		mouseout: function() {
			$(this).children('.work_logo, .work_title').show();
			$(this).children('.work_images').hide();
		},
		mousemove: function(event) {
			var msg = 0;
			var msg = event.pageX + event.pageY;

			var max = $(this).find('.work_image').length;
			if (max > 1) {
				var rand = getRandom(0, max);
				$(this).find('.work_image').hide();
				$(this).find('.work_image').eq(rand).show();
			}
		}
	});
	$('.sort_item.tags').click(function(event) {
		var items = $('.work_item');
		var arr_items_tags = [];
		var tags_name = {'urbanism':'Урбанизм', 'architecture':'Архитектура', 'urban_projects':'Городские проекты', 'exhibitions':'Выставки', 'industrial_design':'Промышленный дизайн', 'navigation':'Навигация', 'graphic_design':'Графический дизайн'}
		items.each(function(index, el) {
			arr_items_tags.push(el.className.slice(10));
		});

		var tags = getUnique(arr_items_tags);

		$.each(tags, function(index, tag) {
			var tag_items = $(items).filter('.' + tag);
			var work_tag = $('<div />', {'class':'work_tag ' + tag});
			$('.works_block').append(work_tag.append(tag_items));
		});

	});
});