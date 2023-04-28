jQuery(document).ready(function ($) {
    
/*======================================*/
// Glossary
    $('.js_question_but').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).parent().toggleClass('active');
        $(this).siblings('.js_toggle_block').stop().slideToggle();
    });


    //*-------------------- Search ----------------------*//
    //*-------------------- Search ----------------------*//
    if( $('.js_question_but').length > 0 ) {
        var search = new Search({

            onSearchDone: function(){
                var that = this;

                if (that.numberOfResults) {
                    $('.' + that.settings.defaultClass).closest('.js_toggle_block,.faq-item').slideDown(400);

                    var searchResults = $('.' + that.settings.defaultClass);

                    var firstResult = searchResults.eq(0);

                    var parentOfResult = firstResult.closest('.js_toggle_block,.js_question_but');

                    if (parentOfResult.length < 1) {
                        return false;
                    }
                    var offset = parentOfResult.offset();

                    var WH = $( window ).height() / 2;
                    $('html, body').stop().animate({scrollTop: offset.top - WH}, 500);
                }

                return true;
            },

            onNextStep: function(currentResultNumber, container){
                var offset = $(container.selector).parents('.js_toggle_block').offset();
                var WH = $( window ).height() / 2;
                if(offset) {
                    $('html, body').stop().animate({scrollTop: offset.top - WH}, 500);
                }

                return true;
            },

            containersSelectors: '.js_question_but,.js_toggle_block',
        });
    };



    /*======================================*/
// Glossary
$('.letter-link').on('click', function(event) {
    event.preventDefault();
    const getID = $(this).attr('href');
    const currentPosition = (parseInt($(getID).offset().top));

    if ( $(this).parent('.letter-element').hasClass('disabled') || $(this).hasClass('active') ) {
        return false;
    }

    $('.letter-link').removeClass('active');
    $(this).addClass('active');
    $('.glossary-table').removeClass('active');
    $(getID).addClass('active');

    $('html, body').stop().animate({
        'scrollTop': currentPosition-100
    }, 1200);
})

});
