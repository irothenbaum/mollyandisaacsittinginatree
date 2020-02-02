(function($, window) {
    var baseUrl = "https://mollyandisaacsittinginatree.s3.us-east-1.amazonaws.com";
    var $container;
    var $videoContainer;
    var $select;
    var PICTURE_CLASS = 'picture'

    var galleryItems = window.__GALLERY_ITEMS || getAllPictures()
    var galleryVideos = [
        "/videos/Best man speech.mp4",
        "/videos/Ceremony.mp4",
        "/videos/Father of the bride speech.mp4",
        "/videos/Father of the groom speech.mp4",
        "/videos/Maid of honor speech.mp4",
        "/videos/Matron of honor speech.mp4",
        "/videos/Pics and dances.mp4",
        "/videos/Reception unedited.mp4",
    ]

    $(document).ready(function() {
        $container = $("#picture-gallery");
        $videoContainer = $('#video-gallery');
        $select = $('#category-select');
        $select.on('change', function() {
            var filter = $select.val()
            var pics = $container.find('.' + PICTURE_CLASS)
            if (filter) {
                pics.hide().filter('[data-category=' + filter + ']').show();
            } else {
                pics.show();
            }
        })

        var toAppend = []
        galleryItems.forEach(function(fileName) {
            toAppend.push(createElement(fileName))
        });
        $container.append(toAppend)

        if ($videoContainer) {
            toAppend = []
            galleryVideos.forEach(function(fileName) {
                toAppend.push(createVideoElement(fileName))
            });
            $videoContainer.append(toAppend)
        }
    })

    function createElement(fileName) {
        var url = baseUrl + fileName;
        var $elem = getPictureElement(url)
        $elem.click(function() {
            window.open(url, '_blank');
        });
        return $elem;
    }

    function createVideoElement(fileName) {
        // 8 is the number of characters in the directory path ("/videos/")
        var title = fileName.substr(8, fileName.indexOf('.mp4') - 8)
        var url = baseUrl + fileName.replace(/ /g, '+');
        var $elem = getPictureElement(url.replace('.mp4', '.png'), title)
        $elem.click(function() {
            window.open(url, '_blank');
        });
        return $elem;
    }


    function getAllPictures() {
        var dirToRange = {
            favorites: [1, 106],
            preparations: [107, 242],
            ceremony: [243, 404],
            church_portraits: [405, 499],
            wedding_party: [500, 773],
            details: [774, 803],
            reception: [804, 1158],
        }

        var retVal = [];
        Object.entries(dirToRange).map(function(tuple) {
            for (var i = tuple[1][0]; i <= tuple[1][1]; i++) {
                retVal.push('/' + tuple[0] + '/622_' + padNumber(i) + '.jpg');
            }
        });
        return retVal;
    }
    
    function padNumber(num) {
        var buffer = ''
        var copy = num
        while (copy < 1000) {
            buffer += '0'
            copy = copy * 10
        }
        return buffer + num
    }

    var reg = /\/([a-z_]+)\/([0-9_]+.jpg)$/
    function getThumb(url) {
        var match = url.match(reg)
        return [url.slice(0, match.index) + '/' + match[1] + '/thumb_' + match[2], match[1]]
    }

    function getPictureElement(url, title) {
        var isVideo = !!title
        var thumbAndCategory = isVideo ? [url, 'videos'] : getThumb(url)
        var pictureInner = $('<div />')
            .addClass('picture-inner')
            .css('background-image', 'url(' + thumbAndCategory[0] + ')')

        var container = $('<div />')
            .addClass(PICTURE_CLASS)
            .attr('data-category', thumbAndCategory[1])
            .append(pictureInner)

        if (isVideo) {
            container.append($('<h5 />').text(title))
        }

        return container
    }

})(jQuery, window)
