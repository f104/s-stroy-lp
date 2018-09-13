import $ from 'jquery';
import Inputmask from "inputmask";

const forms = {
    init: function () {
        const app = this;

        app.document.ready(function () {
            app.forms.initMask();
        });

    },

    initMask: function () {
//        $('.js-mask').inputmask("99-9999999");
//        $('.js-mask').inputmask("99-9999999");
//        Inputmask().mask(document.querySelectorAll("input"));
        let selector = document.querySelectorAll('.js-mask');
        let im = new Inputmask("+7 (999)-999-9999", {
            clearMaskOnLostFocus: false,
            placeholder: '_'
        });
        im.mask(selector);
    },

};

export default forms;