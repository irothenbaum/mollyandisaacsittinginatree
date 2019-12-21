(function($, window) {
    var baseUrl = "https://mollyandisaacsittinginatree.s3.us-east-1.amazonaws.com";
    var $container;
    var $select;
    var PICTURE_CLASS = 'picture'

    var galleryItems = window.__GALLERY_ITEMS || getAllPictures()

    $(document).ready(function() {
        $container = $("#picture-gallery");
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
        galleryItems.forEach(function(elem) {
            toAppend.push(createElement(elem))
        });
        $container.append(toAppend)
    })

    function createElement(elem) {
        var url = baseUrl + elem;
        var $elem = getPictureElement(url)
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

    function getPictureElement(url) {
        var thumbAndCategory = getThumb(url)
        var pictureInner = $('<div />')
            .addClass('picture-inner')
            .css('background-image', 'url(' + thumbAndCategory[0] + ')')
        return $('<div />')
            .addClass(PICTURE_CLASS)
            .attr('data-category', thumbAndCategory[1])
            .append(pictureInner)
    }

})(jQuery, window)
