import $ from 'jquery';
import page from 'page';
import forms from 'forms';
import quiz from 'quiz';
import contacts from 'contacts';
import Swiper from 'swiper/dist/js/swiper.min.js';
import Cookies from 'js-cookie';
var app = {

    breakpoints: {
        sm: 320,
        md: 768,
        lg: 1280,
        xl: 1440
    },
    media: 320,
    resizeEventName: 'app_resize',
    submitEventName: 'app_submit',
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

        app.checkMedia();
        app.window.on('resize', app.checkMedia);
        window.jQuery = $;

        // Init forms
        this.forms = forms;
        this.forms.init.call(this);

        // Init quiz
        this.quiz = quiz;
        this.quiz.init.call(this);

        // Init contacts
        this.contacts = contacts;
        this.contacts.init.call(this);

        app.document.ready(function () {
            app.initScrollbar();
            app.initPayments();
            app.initTabs();
            app.initReviewsSlider();
            app.initStockSlider();
            app.initManSlider();
            app.initWorkSlider();
            app.initPopup();
            app.initStock();
            app.initLeft();
            app.initConfig();
            app.initATabs();
            app.initCounter();
        });

        app.document.on(app.resizeEventName, function () {
            app.initManSlider();
            app.initReviewsSlider();
            app.initScrollbar();
            app.initStock();
        });

        app.window.on('resize', function () {
            app.initPayments();
        });

        // Antispam
        setTimeout(function () {
            $('input[name="email3"],input[name="email"],input[name="text"]').attr('value', '').val('');
        }, 5000);

        /*fast fix anchor tab*/
        $(window).on('load', function () {
            if (location.hash.length > 0) {
                let header = $('header');
                let block = $('[data-anchor="' + location.hash.split((location.hash.indexOf('-') >= 0 ? '-' : '#')).pop() + '"]');

                if (block.length > 0 && header.length > 0) {
                    let top = Math.floor(block.offset().top - header.outerHeight());
//                    console.log(block.position().top,header.outerHeight(),top);
//                    console.log(top);
                    $(window).scrollTop(top);
//                    console.log(app.window.scrollTop());

                }
            }
        });

    },

    initTabs: function () {
        require("libs/jquery.easytabs.min.js");
        // tabs select
//        $('.js-tabs__select').each(function () {
//            let height = $(this).outerHeight();
//            $(this).find('.js-tabs__select__item').each(function () {
//                let itemHeight = $(this).outerHeight();
//                if (itemHeight > height) {
//                    height = itemHeight;
//                }
//            });
//            $(this).css({height: height + 'px'});
//        });
        $('.js-tabs__select__item').on('click', function () {
            let $parents = $(this).parents('.js-tabs__select');
            if ($(this).hasClass('_active')) {
                $parents.css({'height': $parents.outerHeight()});
                $parents.addClass('_active');
                $parents.find('.js-tabs__select__item').removeClass('_active');
            } else {
                $parents.removeClass('_active');
                $parents.css({'height': 'auto'});
                $(this).addClass('_active');
                $(this).parents('.js-tabs').easytabs('select', $(this).attr('href'));
            }
            return false;
        });
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
                app.initPayments();
            });
        });
    },

    initScrollbar: function () {
        require("libs/jquery.scrollbar.min.js");
        require('jquery-mousewheel');

        if (app.media >= app.breakpoints.md) {
            $('.js-scrollbar-md_up').scrollbar();

            $('.scroll-content').each(function (index) {
                let inAction = false,
                        k = 4; // множитель дельты
                let $scroll = $(this),
                        scrollMax = $scroll.get(0).scrollWidth - $scroll.outerWidth();
                $(this).on('mousewheel', function (event) {
                    event.preventDefault();
                    if (inAction) {
                        return;
                    }
                    inAction = true;
                    let wScroll = $(window).scrollTop();
                    if ($scroll.scrollLeft() == 0 && event.deltaY == 1) {
                        $("html, body").animate({scrollTop: wScroll - event.deltaFactor * k}, 200, 'linear', function () {
                            inAction = false;
                        });
                        return;
                    }
                    if ($scroll.scrollLeft() >= scrollMax && event.deltaY == -1) {
                        $("html, body").animate({scrollTop: wScroll + event.deltaFactor * k}, 200, 'linear', function () {
                            inAction = false;
                        });
                        return;
                    }
                    let delta = $scroll.scrollLeft() - event.deltaFactor * event.deltaY * k;
                    $scroll.animate({scrollLeft: delta}, 200, 'linear', function () {
                        inAction = false;
                    });
                });

            });
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
//            let els = document.querySelectorAll(selector);
            let els = Array.prototype.slice.call(document.querySelectorAll(selector)); // ie11
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
//            breakpointsInverse: true,
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
        let $next = $('.js-work-nav__next');
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
        $next.on('click', function () {
            slider.slideNext();
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
        for (let key in app.breakpoints) {
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
                        est = date - now;
//                console.log(est);
                if (est > 0) {
                    let days = Math.ceil(est / 1000 / 60 / 60 / 24);
                    $(this).text(days + ' ' + app.getNumEnding(days, ['день', 'дня', 'дней']));
                } else {
                    $(this).parent().text('Акция завершена');
                }
            }
        });
    },

    initATabs: function () {
        let $wrapper = $('.js-tab__wrapper'),
                $toggler = $('.js-tab__toggler'),
                $content = $('.js-tab__toggler__content');
        $toggler.on('click', function (e) {
            e.stopPropagation();
            $wrapper.slideToggle();
            $(this).toggleClass('_active');
        });
        $('.js-tab__link').on('click', function () {
            let tab = $(this).attr('href').substr(1),
                    $current = $('.js-tab._active'),
                    $target = $('#' + tab);

            $('.js-tab__link._active').removeClass('_active');
            $(this).addClass('_active');

            $current.addClass('_out').delay(400).queue(function () {
                $current.addClass('_only-img').dequeue();
                $target.addClass('_in _active').delay(200).queue(function () {
                    app.initPayments();
                    $target.removeClass('_in').delay(200).queue(function () {
                        $current.removeClass('_only-img _out _active').dequeue();
                    }).dequeue();
                });
            }).dequeue();

            $content.text($(this).text());
            if (app.media == app.breakpoints.sm) {
                $wrapper.slideUp();
                $toggler.removeClass('_active');
            }

            app.currentTab = tab;
            if (history.pushState) {
                history.pushState(null, null, '#' + tab);
            } else {
                location.hash = '#' + tab;
            }
//            console.log(app.currentTab);

            return false;
        });

        // fix scroll to #tab on direct link
        if (location.hash && $(location.hash).length) {
            $("html, body").animate({scrollTop: 0}, 200);
            $('.js-tab__link[href="' + location.hash + '"]:not(._active)').click();
            // fix on direct link
            app.currentTab = $('.js-tab._active').attr('id');
//            console.log(app.currentTab);
        }
        // handle click on footer menu
        $('.js-tab__footer').click(function () {
            $('.js-tab__link[href="' + $(this).attr('href') + '"]:not(._active)').click();
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

    initCounter: function () {
        let now = new Date(), left = 15;
        now = now.getHours();
        if (now >= 18) {
            left = 2;
        } else {
            switch (now) {
                case 10:
                case 11:
                    left = 13;
                    break;
                case 12:
                case 13:
                    left = 9;
                    break;
                case 14:
                    left = 7;
                    break;
                case 15:
                    left = 6;
                    break;
                case 16:
                    left = 5;
                    break;
                case 17:
                    left = 4;
                    break;
            }
        }
        if (Cookies.get('appDimensions') && left > 1) {
            left--;
        }
        writeCounter(left);
        app.document.on(app.submitEventName, function (e, data) {
            if (data.$form.hasClass('js-counter__form')) {
                if (left > 1) {
                    left--;
                    writeCounter(left);
                    Cookies.set('appDimensions', true);
                }
            }
        });
        function writeCounter(num) {
            $('.js-counter__number').text(num);
            $('.js-counter__text').text(app.getNumEnding(num, ['место', 'места', 'мест']));
        }
    },

    initPayments: function () {
        if (app.media >= app.breakpoints.md && app.media < app.breakpoints.lg) {
            $('.js-payment').each(function () {
                let col = $(this).parents('.balcony-list__item').find('.balcony-list__item__col').first();
                $(this).css({'top': col.outerHeight() + 74});
            });
        } else {
            $('.js-payment').attr('style', '');

        }
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