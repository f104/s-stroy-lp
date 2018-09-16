import $ from 'jquery';
import Inputmask from "inputmask";

const forms = {

    url: 'backend/sendmail.php',

    init: function () {
        const app = this;

        app.document.ready(function () {
            app.forms.initMask();

            require("jgrowl");
            $('form').submit(function (e) {
                let $form = $(this);
                let data = $form.serialize();
                $.ajax({
                    type: 'post',
                    url: forms.url,
                    dataType: 'json',
                    data: data,
                    beforeSend: function () {
                        $form.find('input, select, button').addClass('_disabled');
                    },
                    success: function (data) {
                        if (data['success']) {
                            forms.showMessage();
                            $.fancybox.close();
                        } else if (data['msg']) {
                            console.log(data['msg']);
                        }
                        if (data['msg']) {
                            $.jGrowl(data['msg'], {
                                life: 3000,
                                theme: data['success'] ? 'message-success' : 'message-error'
                            });
                        }
                    },
                    complete: function () {
                        $form.find('input, select, button').removeClass('_disabled');
                    }
                });
                return false;
            });



        });

    },

    showMessage: function () {
        $('.js-success_hide').fadeOut(function () {
            $('.js-content').addClass('_success');
            $('.js-success_show').fadeIn();
        });
    },

    initMask: function () {
//        $('.js-mask').inputmask("99-9999999");
//        $('.js-mask').inputmask("99-9999999");
//        Inputmask().mask(document.querySelectorAll("input"));
        let selector = document.querySelectorAll('.js-mask');
        let im = new Inputmask("+7 (999)-999-9999", {
            clearMaskOnLostFocus: false,
            removeMaskOnSubmit: true,
            placeholder: '_'
        });
        im.mask(selector);
    },

};

export default forms;