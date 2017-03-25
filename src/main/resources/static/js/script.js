$(function () {
    $('#setCurrency').jqTransform({imgPath: 'jqtransformplugin/img/'});
});
jQuery(document).ready(function () {
    jQuery("#back-top").hide();
    jQuery(function () {
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 100) {
                jQuery('#back-top').fadeIn();
            } else {
                jQuery('#back-top').fadeOut();
            }
        });
        jQuery('#back-top a').click(function () {
            jQuery('body,html').animate({scrollTop: 0}, 800);
            return false;
        });
    });
});

