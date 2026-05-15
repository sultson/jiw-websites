(function ($, elementorFrontend, elementorModules) {
    'use strict';
    var _decor = elementorModules.frontend.handlers.Base.extend({
        onInit() {
            const elementSettings = this.getElementSettings();
            if (elementSettings.spaciaz_decor_top_left === 'yes') {
                this.$element.append(`<div class="spaciaz-border-shape top-left"></div>`);
            }
            if (elementSettings.spaciaz_decor_top_right === 'yes') {
                this.$element.append(`<div class="spaciaz-border-shape top-right"></div>`);
            }
            if (elementSettings.spaciaz_decor_bottom_right === 'yes') {
                this.$element.append(`<div class="spaciaz-border-shape bottom-right"></div>`);
            }
            if (elementSettings.spaciaz_decor_bottom_left === 'yes') {
                this.$element.append(`<div class="spaciaz-border-shape bottom-left"></div>`);
            }
        }
    });

    $(window).on('elementor/frontend/init', () => {
        const addHandler = ($element) => {
            elementorFrontend.elementsHandler.addHandler(_decor, {
                $element,
            });
        };

        elementorFrontend.hooks.addAction('frontend/element_ready/section', addHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/container', addHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/widget', addHandler);
    });

}(jQuery, window.elementorFrontend, window.elementorModules));
