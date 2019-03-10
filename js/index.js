(function($, window) {
    // name, email, and address for every invitee
    // send that info as query params via the RSVP email

    var GALLERY_TIMING = 6000;
    var _index = -1;
    var galleryItems = [
        './img/spring_street.jpg',
        './img/passing_train_kiss.jpg',
        './img/walking_2.jpg',
        './img/out_front_onieals.jpg',
        './img/entering_train.jpg',
        './img/spring_street_2.jpg',
        './img/kissing_in_train_door.jpg',
        './img/walking.jpg',
        './img/train_blooper.jpg',
        './img/jetski.jpg',
    ];

    var $window;
    var $header;
    var $hero;
    var $bluredImage;
    var $featuredImage;
    var $bluredImagePrevious;
    var $featuredImagePrevious;
    var $nav;
    var galleryInterval;

    $(document).ready(function() {
        $hero = $('#hero');
        $window = $(window);
        $header = $('header');

        hookupAttendingInteraction();
        hookupFormSubmission();

        sizeHero();
        startGallery();
        $window.on('resize', sizeHero);
    })


    function sizeHero() {
        var headerHeight = $header.height();
        $hero.css({
            height: $window.height() - headerHeight,
            marginTop: headerHeight
        });
    }

    function startGallery() {
        $featuredImage = $('<div id="featured-image"></div>')
        $bluredImage = $('<div id="blurred-image"></div>')
        $featuredImagePrevious = $('<div id="featured-image-previous"></div>')
        $bluredImagePrevious = $('<div id="blurred-image-previous"></div>')
        $nav = $('<ul id="hero-nav"></ul>');

        for (var i=0; i<galleryItems.length; i++) {
            $nav.append($('<li></li>'))
        }

        $nav.find('li').click(function() {
            if (galleryInterval) {
                clearInterval(galleryInterval);
            }
            cycleImage($(this).prevAll().length)
            galleryInterval = setInterval(cycleImage, GALLERY_TIMING);
        })

        $hero.append($featuredImage);
        $hero.append($bluredImage);
        $hero.append($featuredImagePrevious);
        $hero.append($bluredImagePrevious);
        $hero.append($nav);
        cycleImage();
        galleryInterval = setInterval(cycleImage, GALLERY_TIMING);
    }

    function onImageLoaded(src) {
        _cached[src] = true
        $featuredImagePrevious.css({
            'background-image': $featuredImage.css('background-image'),
            'height': $featuredImage.height(),
            'width': $featuredImage.width(),
            'top': $featuredImage.position().top,
            'left': $featuredImage.position().left
        });
        $bluredImagePrevious.css('background-image', $bluredImage.css('background-image'));
        $featuredImagePrevious.show();
        $bluredImagePrevious.show();
        $featuredImagePrevious.fadeOut(fadeSettings);
        $bluredImagePrevious.fadeOut(fadeSettings);
        $featuredImage.css('background-image', "url("+src+")");
        $bluredImage.css('background-image', "url("+src+")");
    }

    var fadeSettings = {duration: 1000, easing: 'swing'}
    var _cached = {}
    function cycleImage(pos) {
        if (pos === undefined) {
            pos = ++_index % galleryItems.length;
        }

        $nav.find('li').removeClass('selected').eq(pos).addClass('selected')

        let src = galleryItems[pos];

        if (_cached[src]) {
            onImageLoaded(src)
        } else {
            var image = new Image()
            image.onload = function() {
                onImageLoaded(src)
            }
            image.src = src

        }

    }

    function hookupAttendingInteraction() {
        var $attendingInputContainer = $('#attending-input-container');
        var $yesAttendingInput = $('#statusYes');
        $attendingInputContainer.find('input').click(function() {
            setTimeout(function() {
                if ($yesAttendingInput.is(':checked')) {
                    $attendingInputContainer.addClass("is-attending")
                } else {
                    $attendingInputContainer.removeClass("is-attending")
                }
            },100);
        })
    }

    function hookupFormSubmission() {
        var $form = $('form#rsvp-form');
        var $button = $('#submit-form');
        var $errorMessage = $('#rsvp-message-error');
        var url = 'https://script.google.com/macros/s/AKfycbyRh1LZIDxPVyosrki7B8P3uREeLKlyYs0HhlDLLFKbqZILyYY/exec'

        $button.on('click', function(e) {
            e.preventDefault();

            $errorMessage.hide();
            $button.attr('disabled', "true")

            var data = $form.serializeObject()
            data.total = data.total || 0;

            if (!data || !data.name || !data.email || !data.attending || data.attending ==='yes' && !data.total) {
                $errorMessage.show();
                $button.removeAttr('disabled')
                return;
            }

            $.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                data: data
            }).then(function() {
                $button.hide();
                $('#rsvp-message-confirm').show()
            });
        })
    }







    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery, window)
