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
    var POST_URL = 'https://script.google.com/macros/s/AKfycbyRh1LZIDxPVyosrki7B8P3uREeLKlyYs0HhlDLLFKbqZILyYY/exec'
    var PLUS_ONE = 'PLUS ONE'

    var $window;
    var $header;
    var $hero;
    var $bluredImage;
    var $featuredImage;
    var $bluredImagePrevious;
    var $featuredImagePrevious;
    var $nav;
    var galleryInterval;
    var G_DATA;

    $(document).ready(function() {
        $hero = $('#hero');
        $window = $(window);
        $header = $('header');

        d();
        hookupAttendingInteraction();

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
        $('#lookup-email-button').click(function() {
            var email = $('#email-input').val().toLowerCase()
            if (!G_DATA[email]) {
                $('#lookup-error').show()
            } else {
                initFormFromEmail(email);
            }
        })
    }

    function initFormFromEmail(email) {
        $('#enter-email-form').hide()
        var $form = $('#rsvp-form');
        $form.show()
        var $button = $('#submit-form');
        var $errorMessage = $('#rsvp-message-error');

        var guests = G_DATA[email]

        var tree = $('.invitee-list')
        var containerText = $('#guest-template').html()
        tree.empty()

        for (var i=0; i<guests.length; i++) {
            var newGuest = $(containerText)
            newGuest.find('input[type=text]').val(guests[i] === PLUS_ONE ? (guests[0] + ' Guest') : guests[i])
            newGuest.find('input.yes, input.no').attr('name', guests[i].toLowerCase().replace(' ', '_') + '_attending')
            tree.append(newGuest)
        }

        $button.on('click', function(e) {
            e.preventDefault();

            $errorMessage.hide();
            $button.attr('disabled', "true")

            var data = []

            // TODO load the data object from the input fields
            tree.children().each(function(index, elem) {
                var $elem = $(elem)
                var guestData = {}
                guestData.email = email
                guestData.name = $elem.find("input[type=text]").val()
                guestData.attending = parseInt($elem.find("input[type=radio]:checked").val())
                guestData.address = $('#address-input').val()
                guestData.comments = $('#comments-input').val()
                guestData.timestamp = new Date()

                data.push(guestData)
            })

            if (!isDataComplete(data)) {
                $errorMessage.show();
                $button.removeAttr('disabled');
                return;
            }

            var promises = []
            for(var j=0; j<data.length; j++) {
                promises.push($.ajax({
                    url: POST_URL,
                    method: "GET",
                    dataType: "json",
                    data: data[j]
                }));
            }

            Promise.all(promises).then(function() {
                $button.removeAttr('disabled').hide();
                $('#rsvp-message-confirm').show()
                $form.hide();
            }).catch(function(err) {
                console.error(err)
                alert("We might not have gotten your RSVP. To be safe, please try again!")
            });
        })
    }

    function isDataComplete(data) {
        if (!data.length) {
            return false;
        }
        for (var i=0; i<data.length; i++) {
            var d = data[i]

            if (!(
                d && d.name && d.email && d.address && !isNaN(d.attending)
            )){
                return false
            }
        }
        return true
    }

    function d() {
        $.get("./encoded.txt", function(data) {
            var characterset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.'{}[],()"
            var decoded = atob(data)
            var output = ''
            for(var i=0; i<decoded.length; i+=2) {
                var substr = decoded.substr(i, 2)
                var index = parseInt(substr)
                var char
                if (isNaN(index)) {
                    char = substr[1]
                } else {
                    char= characterset[index]
                }
                output += char
            }
            G_DATA = JSON.parse(output + '\n')
        })
    }
})(jQuery, window)
