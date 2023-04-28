$ = jQuery;

$(document).ready(function () {

    $('.feedback__slider').slick({
        dots: true,
        slidesPerRow: 3,
        rows: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesPerRow: 1,
                    rows: 3,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    arrows: true
                }
            },
        ]
    });

    $('#menu').click(function () {
        $('.topmenu__wrapper').addClass('opened');
        $('body').css({
            // 'overflow': 'hidden',
            // 'padding-right': '16px'
        });
    })

    $('#close').click(function () {
        $('.topmenu__wrapper').removeClass('opened')
        $('body').css({
            // 'overflow': 'auto',
            // 'padding-right': '0'
        });
    });

    $('.trp-ls-shortcode-disabled-language').click(function () {
        $('.trp-ls-shortcode-language').addClass('open');
        $('#closelang').addClass('visible');

    });

    $('#closelang').click(function () {
        $('.trp-ls-shortcode-language').removeClass('open');
        $(this).removeClass('visible');
    });

    function video_play() {
        var videoButton = $('#video-play');

        videoButton.click(function () {
            $('.video video').get(0).play();
            $(this).fadeOut();
        });


    }

    video_play()
});
