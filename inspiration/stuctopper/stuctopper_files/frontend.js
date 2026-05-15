(function ($) {
	$(function () {
		// Function for stretch width mega menu
		function handleStretchWidthMegaMenu($element) {
			let $body = $('body'),
				pleft = $element.offset().left,
				bodyleft = $body.offset().left;
			$('.mega-stretchwidth', $element).css({
				left: -pleft + bodyleft,
				width: $body.width()
			});
		}

		// Function for container width mega menu
		function handleContainerWidthMegaMenu($element) {
			let $parent = $element.closest('.container , .elementor-container, .col-full, .header-container, .elementor-element > .e-con-inner'),
				parentwidth = $parent.width() > 1730 ? 1730 : $parent.width(),
				windowwidht = $(window).width(),
				cleft = $element.offset().left,
				left = ((windowwidht/2) - cleft - (parentwidth/2)) > 0 ? 0 : ((windowwidht/2) - cleft - (parentwidth/2));

			$('.mega-containerwidth', $element).css({
				left: left,
				width: parentwidth
			});
		}

		// Function for custom subwidth mega menu
		function handleCustomSubwidthMegaMenu($element) {
			let pleft = parseFloat($element.children('a').css('padding-left')),
				$oleft = $element.offset().left + pleft,
				$itemwidth = parseInt($element.children('.custom-subwidth').css('width')),
				$bodywidth = $('body').width();

			let $offset = $oleft + $itemwidth - $bodywidth;

			if ($offset >= 0) {
				$('.mega-menu.custom-subwidth', $element).css({
					left: -$offset + pleft
				});
			} else {
				$('.mega-menu.custom-subwidth', $element).css({
					left: pleft
				});
			}
		}

		// Bind mouseenter events
		$('.main-navigation .has-mega-menu.has-stretchwidth').on('mouseenter', function (e) {
			handleStretchWidthMegaMenu($(this));
		});

		$('.main-navigation .has-mega-menu.has-containerwidth').on('mouseenter', function (e) {
			handleContainerWidthMegaMenu($(this));
		});

		$('.main-navigation .has-mega-menu').has('ul.custom-subwidth').on('mouseenter', function (e) {
			handleCustomSubwidthMegaMenu($(this));
		});

		// Run functions once on page load
		$('.main-navigation .has-mega-menu.has-stretchwidth').each(function () {
			handleStretchWidthMegaMenu($(this));
		});

		$('.main-navigation .has-mega-menu.has-containerwidth').each(function () {
			handleContainerWidthMegaMenu($(this));
		});

		$('.main-navigation .has-mega-menu').has('ul.custom-subwidth').each(function () {
			handleCustomSubwidthMegaMenu($(this));
		});
	});
})(jQuery);