import $ from 'jquery';
import page from 'page';
import forms from 'forms';
import quiz from 'quiz';
import contacts from 'contacts';
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
    fancyOptions: {
        autoFocus: false,
        touch: false,
        baseClass: 'popup',
        afterShow: function (instance, slide) {
            let action = instance.$trigger.data('action');
            if (action) {
                let $input = slide.$slide.find('[name="action"]');
                if ($input) {
                    $input.val(action);
                }
            }
        },
    },
    tabs: ['windows', 'balcony', 'cottage', 'accessories'],
    currentTab: 'windows',

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

        // Init contacts
        this.contacts = contacts;
        this.contacts.init.call(this);

        app.checkMedia();
        app.window.on('resize', app.checkMedia);
        window.jQuery = $;

        app.document.ready(function () {
            app.initTabs();
            app.initReviewsSlider();
            app.initStockSlider();
            app.initManSlider();
            app.initWorkSlider();
            app.initPopup();
            app.initScrollbar();
            app.initStock();
            app.initLeft();
            app.initConfig();
            app.initNav();
        });

        app.document.on(app.resizeEventName, function () {
            app.initManSlider();
            app.initReviewsSlider();
            app.initScrollbar();
            app.initStock();
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
//                $(elem).find('.js-tabs__select__item')
//                        .removeClass('_active')
//                        .filter(`[href="${$clicked.attr('href')}"]`).addClass('_active');
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
        $('.js-popup').fancybox(this.fancyOptions);
    },

    initReviewsSlider: function () {
        let selector = ('.reviews .swiper-container');
        if (app.media == app.breakpoints.sm) {
            new Swiper(selector, {
                spaceBetween: 10,
                slidesPerView: 1,
                pagination: {
                    el: '.reviews .swiper-container + .swiper-pagination',
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

    initStockSlider: function () {
        let selector = ('.stock .swiper-container');
        new Swiper(selector, {
            slidesPerView: 3,
            breakpointsInverse: true,
            watchOverflow: true,
            breakpoints: {
                1279: {
                    slidesPerView: 2
                },
                767: {
                    spaceBetween: 10,
                    slidesPerView: 1
                }
            },
            pagination: {
                el: '.stock .swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            navigation: {
                nextEl: '.stock .swiper-button-next',
                prevEl: '.stock .swiper-button-prev',
            },
        });

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
                el: '.work .swiper-pagination',
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
                $.fancybox.open($('#calc'), app.fancyOptions);
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
                el: '.man .swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            navigation: {
                nextEl: '.man .swiper-button-next',
                prevEl: '.man .swiper-button-prev',
            },
        });
    },

    initStock: function () {
        $('.js-stock__hover').unbind('mouseenter mouseleave');
        if (app.media >= app.breakpoints.lg) {
            $('.js-stock__hover').each(function () {
                let $popup = $(this).find('.js-stock__hover__content');
                if (!$popup) {
                    return;
                }
                let $this = $(this), timeout;
                $(this).hover(function () {
                    timeout = setTimeout(function () {
                        if ($this.hasClass('_hovered')) {
                            return;
                        }
                        $this.addClass('_hovered');
                        let offset = $this.offset(),
                                h = $this.outerHeight(),
                                w = $this.outerWidth();
                        $popup.css({
                            'width': w,
                            'top': offset.top - 20,
                            'left': offset.left,
                        });
                        $popup.appendTo(app.body).addClass('_active');
                    }, 200);
                }, function () {
                    clearTimeout(timeout);
                    $popup.removeClass('_active').appendTo($(this));
                    $this.removeClass('_hovered');
                });
            });
        }
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
            app.document.trigger(app.resizeEventName, {media: app.media});
        }
    },

    initLeft: function () {
        $('.js-left').each(function () {
            let date = $(this).data('left');
            if (date) {
                date = Date.parse(date);
                let now = Date.now(),
                        est = date - now,
                        days = Math.ceil(est / 1000 / 60 / 60 / 24);
                $(this).text(days + ' ' + app.getNumEnding(days, ['день', 'дня', 'дней']));
            }
        });
    },

    initNav: function () {
        require("libs/jquery.easytabs.min.js");
        let $wrapper = $('.js-nav__wrapper'),
                $toggler = $('.js-nav__toggler'),
                $content = $('.js-nav__toggler__content');
        $('.js-nav').easytabs({
            tabs: '.js-nav__list > li',
            updateHash: true,
            animate: false,
        }).bind('easytabs:after', function (event, $clicked, $targetPanel, settings) {
            $content.text($clicked.text());
            let tab = $clicked.attr('href').substr(1);
            if (app.tabs.indexOf(tab) !== -1) {
                app.currentTab = tab;
            }
            if (app.media == app.breakpoints.sm) {
                $wrapper.slideUp();
                $toggler.removeClass('active');
            }
//            console.log(app.currentTab)
        });
        let $active = $('.js-nav__list').find('a.active');
        if ($active.length) {
            $content.text($active.text());
            app.currentTab = $active.attr('href').substr(1);
        }
        $toggler.on('click', function (e) {
            e.stopPropagation();
            $wrapper.slideToggle();
            $(this).toggleClass('active');
        });
//        app.window.on('click', function() {
//            $wrapper.slideToggle();
//        });
        // fix scroll to #tab on direct link
        if (location.hash && $(location.hash).length) {
            $("html, body").animate({scrollTop: 0}, 200);
        }
        // handle click on footer menu
        $('.js-nav__footer').click(function () {
            $('.js-nav').easytabs('select', $(this).attr('href'));
            $("html, body").animate({scrollTop: 0}, 500);
            return false;
        });
    },

    initConfig: function () {
        // смена картинки при смене таба
        $('.js-config__toggler').on('click', function () {
            let data = $(this).data();
            if (data.appTogglerHide && data.appTogglerShow) {
                $(data.appTogglerHide).addClass('hidden');
                $(data.appTogglerShow).removeClass('hidden');
            }
        });
    },

    /**
     * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
     * param  iNumber Integer Число на основе которого нужно сформировать окончание
     * param  aEndings Array Массив слов или окончаний для чисел (1, 4, 5),
     *         например ['яблоко', 'яблока', 'яблок']
     * return String
     * 
     * https://habrahabr.ru/post/105428/
     */
    getNumEnding: function (iNumber, aEndings) {
        var sEnding, i;
        iNumber = iNumber % 100;
        if (iNumber >= 11 && iNumber <= 19) {
            sEnding = aEndings[2];
        } else {
            i = iNumber % 10;
            switch (i)
            {
                case (1):
                    sEnding = aEndings[0];
                    break;
                case (2):
                case (3):
                case (4):
                    sEnding = aEndings[1];
                    break;
                default:
                    sEnding = aEndings[2];
            }
        }
        return sEnding;
    },

};
app.init();