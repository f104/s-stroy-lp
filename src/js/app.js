import $ from 'jquery';
import page from 'page';
import forms from 'forms';
import quiz from 'quiz';
import Swiper from 'swiper';
var app = {

    breakpoints: {
        sm: 320,
        md: 768,
        lg: 1280,
        xl: 1440
    },
    media: 320,
    resizeEventName: 'app_resize',

    init: function () {

        // Init page
        this.page = page;
        this.page.init.call(this);

        // Init forms
        this.forms = forms;
        this.forms.init.call(this);
        
        // Init quiz
        this.quiz = quiz;
        this.quiz.init.call(this);
        
        app.checkMedia();
        app.window.on('resize', app.checkMedia);
        window.jQuery = $;

        app.document.ready(function () {
            app.initReviewsSlider();
            app.initManSlider();
            app.initWorkSlider();
            app.initPopup();
            app.initScrollbar();
            app.initTabs();
        });

        app.document.on(app.resizeEventName, function () {
            app.initManSlider();
            app.initReviewsSlider();
            app.initScrollbar();
        });
        
        // Antispam
        setTimeout(function () {
            $('input[name="email3"],input[name="email"],input[name="text"]').attr('value', '').val('');
        }, 5000);
    },

    initTabs: function () {
        require("libs/jquery.easytabs.min.js");
        $('.js-tabs').each(function (index, elem) {
            let tabsSelector = typeof $(elem).data('tabs') === 'undefined' ? '.js-tabs__list > li' : $(elem).data('tabs');
            $(elem).easytabs({
                tabs: tabsSelector,
                panelContext: $(elem).hasClass('js-tabs_disconnected') ? $('.js-tabs__content') : $(elem),
                updateHash: false,
                animate: false,
//                transitionCollapse: 'fadeOut',
//                transitionUncollapse: 'fadeIn',
//                collapsedByDefault: false
            }).bind('easytabs:after', function (event, $clicked, $targetPanel, settings) {
                $(elem).find('.js-tabs__select__item')
                        .removeClass('_active')
                        .filter(`[href="${$clicked.attr('href')}"]`).addClass('_active');
                $targetPanel.find('.swiper-container').each(function () {
                    var el = $(this)[0];
                    if (el.swiper) {
                        el.swiper.update();
                    }
                });
            });
        });
        // tabs select
        $('.js-tabs__select').each(function () {
            let height = $(this).outerHeight();
            $(this).css({height: height + 'px'});
        });
        $('.js-tabs__select__item').on('click', function () {
            if ($(this).hasClass('_active')) {
                $(this).parents('.js-tabs__select').addClass('_active');
                $('.js-tabs__select__item').removeClass('_active');
            } else {
                $(this).parents('.js-tabs__select').removeClass('_active');
                $(this).addClass('_active');
                $(this).parents('.js-tabs').easytabs('select', $(this).attr('href'));
            }
            return false;
        });
    },

    initScrollbar: function () {
        require("libs/jquery.scrollbar.min.js");
        if (app.media >= app.breakpoints.md) {
            $('.js-scrollbar-md_up').scrollbar();
        } else {
            $('.js-scrollbar-md_up').scrollbar('destroy');
        }
        if (app.media >= app.breakpoints.md && app.media < app.breakpoints.lg) {
            $('.js-scrollbar-md').scrollbar();
        } else {
            $('.js-scrollbar-md').scrollbar('destroy');
        }
    },

    initPopup: function () {
        require("@fancyapps/fancybox");
        $('.js-popup').fancybox({
            autoFocus: false,
            touch: false,
            baseClass: 'popup',
        });
    },

    initReviewsSlider: function () {
        let selector = ('.reviews .swiper-container');
        if (app.media == app.breakpoints.sm) {
            new Swiper(selector, {
                spaceBetween: 10,
                slidesPerView: 1,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    clickable: true
                },
            });
        } else {
//            console.log(1)
            let els = document.querySelectorAll(selector);
            els.forEach(function (el) {
                if (el.swiper) {
                    el.swiper.destroy();
                }
            });
        }

    },

    initWorkSlider: function () {
        let $nav = $('.js-work-nav__item');
        let $btn = $('.js-work-nav__btn');
        let slider = new Swiper('.work .swiper-container', {
            slidesPerView: 1,
            effect: 'fade',
            simulateTouch: false,
            autoHeight: true,
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
        });
        slider.on('slideChange', function () {
//            console.log(this.realIndex);
            $nav.removeClass('_active');
            $nav.eq(this.realIndex).addClass('_active');
            if (this.isEnd) {
                $btn.removeClass('_next').text($btn.data('order'));
            } else if (!$btn.hasClass('_next')) {
                $btn.addClass('_next').text($btn.data('next'));
            }
        });
        $nav.on('click', function () {
//            console.log($(this).index());
            slider.slideTo($(this).index());
        });
        $btn.on('click', function () {
            if (!slider.isEnd) {
                slider.slideNext();
            } else {
                $.fancybox.open($('#order'));
            }
        });
        let slideTo = function (index) {
            slider.slideTo(index);

        };
    },

    initManSlider: function () {
        let stretch = 535;
        if (app.media >= app.breakpoints.lg) {
            stretch = 725;
        }
        if (app.media >= app.breakpoints.xl) {
            stretch = 745;
        }
        let selector = ('.man .swiper-container');
        let el = document.querySelector(selector);
        if (el.swiper) {
            el.swiper.destroy();
        }
        let slider = new Swiper(selector, {
            effect: app.media >= app.breakpoints.md ? 'coverflow' : 'slide',
            slidesPerView: 'auto',
            normalizeSlideIndex: false,
//            centeredSlides: false,
            coverflowEffect: {
                rotate: 0,
                stretch: stretch,
                depth: 200,
                modifier: 1,
                slideShadows: false,
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    },

    /**
     * Проверяет размер окна и пишет его в app.media
     * @returns void
     */
    checkMedia: function () {
        let current = app.media;
        for (let key of Object.keys(app.breakpoints)) {
            if (app.window.outerWidth() >= app.breakpoints[key]) {
                app.media = app.breakpoints[key];
            }
//            console.log(app.media);
        }
        if (app.media != current) {
            app.document.trigger(app.resizeEventName);
        }
    }

};
app.init();