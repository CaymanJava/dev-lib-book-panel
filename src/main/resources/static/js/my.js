
function activateDatePicker(){
    $('.date-picker').datepicker({
        changeMonth: false,
        changeYear: true,
        showButtonPanel: true,
        yearRange: '1950:2100',
        dateFormat: ' yy',
        onClose: function (dateText, inst) {
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, 0, 1));
        }
    });
}

String.prototype.replaceAll = function (search, replace) {
    return this.split(search).join(replace);
};

var category = function (id, name) {
    return '<li><a href="category?id=' + id + '">' + name + '</a></li>'
};

var categorySelected = function (id, name) {
    return '<li><a href="category?id=' + id + '" class="selected">' + name + '</a></li>'
};

var emptyResult = function (message, keyword) {
    return '<p class="warning">' + message + ' ' + keyword + '</p>';
};

var mainPageBook = function (id, name, image, description, fileLink, downloadMessage) {
    return '<li class="ajax_block_product">' +
        '<a class="product_image"' +
        'href="book?id=' + id + '"' +
        'title="' + name + '"><img width="100%" height="100%" src="' + image + '" alt="' + name + '"/></a>' +
        '<div class="prod-info"><h5><a class="product_link"' +
        'href="book?id=' + id + '"title="' + name + '">' + name +
        '</a></h5>' +
        '<p class="product_desc"><a class="product_descr" href="' + name +
        'title="More">' + description + '</a></p>' +
        '<a class="exclusive ajax_add_to_cart_button" href="' + fileLink + '"' +
        'title="' + downloadMessage + '">' + downloadMessage + '</a></div></li>'
};

var book = function (additionalClass, id, name, image, description, authors, publisherId, publisherName, lang, year,
                     publisherMessage, languageMessage, yearMessage) {
    return '<li class="ajax_block_product bordercolor' + additionalClass + '">' +
        '<a href="book?id=' + id + '"class="product_img_link">' +
        '<img width="241" height="356" src="' + image + '" alt="' + name + '"/></a>' +
        '<div class="center_block">' +
        '<div class="product_flags">' +
        '<h3><a class="product_link" href="book?id=' + id + '" title="' + name + '">' + name + '</a></h3>' +
        '<p class="product_desc"><a class="product_descr" href="book?id=' + id + '">' + description + '</a>' +
        '</p>' +
        '</div>' +
        '</div>' +
        '<div class="right_block bordercolor">' +
        '<div class="publisher_block"><br/>'+ publisherMessage + '<br/><a href=publisher?id=' + publisherId + '>' + publisherName + '</a><br/></div>' +
        '<div>' + languageMessage + ' ' + lang + '</div><br/>' +
        '<div>' + yearMessage + ' ' + year + '</div><br/>' +
        '<div class="author_block">' + authors + '</div>' +
        '</div></li>'
};


var author = function (id, name) {
    return '<a href=author?id=' + id + '>' + name + '</a>'
};

var prepareLastBook = function (id, name, image, description, fileLink, downloadMessage) {
    return '<li class="bordercolor ajax_block_product first_item product_accessories_description">' +
        '<div class="accessories_desc">' +
        '<a class="accessory_image product_img_link bordercolor" href="book?id=' + id + '" title="' + name + '">' +
        '<img width="80" height="118" src="' + image + '"alt="' + name + '"/>' +
        '</a>' +
        '<h5><a class="product_link" href="book?id=' + id + '">' + name + '</a></h5>' +
        '<a class="product_descr" href="book?id=' + id + '" title="More">' + description + '</a>' +
        '</div>' +
        '<div class="accessories_price bordercolor">' +
        '<a class="exclusive ajax_add_to_cart_button" href="' + fileLink + '" ' +
        'title="Download">' + downloadMessage + '</a></div></li>';
};

var authors = function (authorList, authorsMessage) {
    var result = authorsMessage +  '<br/>';
    for (i = 0; i < authorList.length; i++) {
        if (i != authorList.length - 1) {
            result += author(authorList[i].id, authorList[i].name) + ', ';
        } else {
            result += author(authorList[i].id, authorList[i].name);
        }
    }
    return result;
};

$('#more_details').click(function () {
    $('html, body').animate({
        scrollTop: $("#idTab1").offset().top
    }, 1000);
});

$("#view_full_size").click(function(){
    window.scrollTo(0, 0);
    var src = book.image;
    $("body").append("<div class='popup'>"+
        "<div class='popup_bg'></div>"+
        "<img src='"+src+"' class='popup_img' />"+
        "</div>");
    $(".popup").fadeIn(800);
    $(".popup_bg").click(function(){
        $(".popup").fadeOut(800);
        setTimeout(function() {
            $(".popup").remove();
        }, 800);
    });
});

function initTitle(title, count, find){
    $("#navigation_page_last").text(title)
    $("#title").text(title).append('<span class="category-product-count">' + find + ' ' + count + '</span>')
}

function initCategoriesForBooks(categories, categoryId){
    for (i = 0; i < categories.length; i++) {
        var id = categories[i].id;
        var name = categories[i].name;
        if (id == categoryId) {
            $("#category-list").append(categorySelected(id, name));
        } else {
            $("#category-list").append(category(id, name));
        }
    }
}

function initCategories(categories) {
    for (i = 0; i < categories.length; i++) {
        var id = categories[i].id;
        var name = categories[i].name;
        $("#category-list").append(category(id, name));
    }
}

function initMainPageBooks(books, downloadLink, userId, downloadMessage) {
    for (i = 0; i < books.length; i++) {
        var id = books[i].id;
        var name = books[i].name;
        var image = books[i].image;
        var description = books[i].description.substring(0, 100) + '...';
        var fileLink = "";
        if (userId == 0) {
            fileLink = "/auth";
        } else {
            fileLink = downloadLink + '/pdf/download?id=' + books[i].fileId + '&name=' + name.replaceAll(" ", "_");
        }
        $("#book-list ul").append(mainPageBook(id, name, image, description, fileLink, downloadMessage));
    }
}

function initLastBooks(lastBooks, downloadLink, userId, downloadMessage) {
    for (i = 0; i < lastBooks.length; i++) {
        var id = lastBooks[i].id;
        var name = lastBooks[i].name;
        var image = lastBooks[i].image;
        var description = lastBooks[i].description.substring(0, 100) + '...';
        var fileLink = "";
        if (userId == 0) {
            fileLink = "/auth";
        } else {
            fileLink = downloadLink + '/pdf/download?id=' + lastBooks[i].fileId + '&name=' + name.replaceAll(" ", "_");
        }
        $("#idTab4").append(prepareLastBook(id, name, image, description, fileLink, downloadMessage));
    }
}

function addRating(votes, points, bookId, userId, ratingMessage, votesMessage) {
    var averageRating = 0;
    if (votes != 0 && points != 0) {
        averageRating = Math.floor(points/votes)
    }

    $('#averageRating').text(ratingMessage + " " + averageRating + "/5")
    $('#votes_count').text(votesMessage + " " + votes)

    var el = document.querySelector('#el');
    var currentRating = averageRating;
    var maxRating= 5;
    var callback = function(rating) {
        var value = rating;
        var userId = this.userId;
        var bookId = this.book.id;
        var ratingId = this.book.rating.id;

        if (userId == 0) {
            notifyAlert("Sorry, only registered users can vote.")
        } else {
            $.ajax({
                type: "GET",
                url: "vote",
                data: {value: value, userId:userId, bookId:bookId, ratingId:ratingId},
                success: function (response) {
                    notifyMessage("Thank you for your vote!")
                    addRating(response.votes, response.points, bookId, userId, ratingMessage, votesMessage);
                }
            });
        }
    };
    var myRating = rating(el, currentRating, maxRating, callback);
}

function initComments(){
    /*
     var disqus_config = function () {
     this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
     this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
     };
     */
    (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://devlib.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
}

function initDownloadButtons(downloadLink, userId, authorsMessage) {
    var downloadFileLink = "";
    var openFileLink = "";
    if (userId == 0) {
        downloadFileLink = "/auth";
        openFileLink = "/auth";
    } else {
        downloadFileLink = downloadLink + '/pdf/download?id=' + book.fileId + '&name=' + book.name.replaceAll(" ", "_");
        openFileLink = downloadLink + '/pdf/open?id=' + book.fileId + '&name=' + book.name.replaceAll(" ", "_");
    }
    $('#download_button').attr('href', downloadFileLink)
    $('#open_button').attr('href', openFileLink)
    $('#short_description_content').append(authors(book.author, authorsMessage))
}

function initUserCred(email, userId, welcome, login, logout){
    if (userId != 0) {
        $('#header_user_info').append('<a href="user?id=' + userId + '">' + email + '</a> (<a href="logout">' + logout + '</a>)');
        $('#your_account a').attr('href', 'user?id=' + userId);
        $('#your_account_footer').attr('href', 'user?id=' + userId);
    } else {
        $('#header_user_info').append(welcome + ', (<a href="auth">' + login + '</a>)');
        $('#your_account a').attr('href', 'auth');
        $('#your_account_footer').attr('href', 'auth');
    }
}


function notifyAlert(text){
    noty(
        {
            "text":text,
            "layout":"top",
            "type":"error",
            "textAlign":"center",
            "easing":"swing",
            "animateOpen":{"height":"toggle"},
            "animateClose":{"height":"toggle"},
            "speed":"500",
            "timeout":"3000",
            "closable":true,
            "closeOnSelfClick":true
        });
}

function notifyMessage(text){
    noty(
        {
            "text":text,
            "layout":"top",
            "type":"success",
            "textAlign":"center",
            "easing":"swing",
            "animateOpen":{"height":"toggle"},
            "animateClose":{"height":"toggle"},
            "speed":"500",
            "timeout":"3000",
            "closable":true,
            "closeOnSelfClick":true
    });
}

function resolveLocale(locale) {
    if (locale==='eng') {
        $('#lang_en').attr('class', 'selected_language')
        $('#lang_ru').attr('class', '')
    } else {
        $('#lang_ru').attr('class', 'selected_language')
        $('#lang_en').attr('class', '')
    }
}

function checkEmail(email) {
    if (!email.trim()) {
        notifyAlert('Please provide correct email.');
        return false;
    } else {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            notifyAlert('Please provide correct email.');
            return false;
        } else {
            return true;
        }
    }
}

function checkPassword(password, confirmPassword) {
    if (password.length < 8) {
        notifyAlert('Try one with at least 8 characters in password.');
        return false;
    } else if (password != confirmPassword) {
        notifyAlert("Passwords should be the same");
        return false;
    } else {
        return true;
    }
}

$('#submit_create').click(function() {
    var email = $('#email_create').val();
    var password = $('#password_create').val();
    var confirmPassword = $('#confirm_password').val();
    var emailCorrect = checkEmail(email);
    var passwordCorrect = checkPassword(password, confirmPassword)

    if (emailCorrect && passwordCorrect) {
        $.ajax({
            type: "POST",
            url: "registration",
            data: {email:email, password:password},
            success: function (response) {
                if (response) {
                    $(location).attr('href', '/')
                } else {
                    notifyAlert("User with email " + email + " has been already registered.")
                }
            }
        });
    }
});

$('#product_view_grid').click(function () {
    $('#product_list').attr('class', 'bordercolor grid');
    $('#product_view_grid').attr('class', 'current');
    $('#product_view_list').attr('class', '');
});

$('#lang_en').click(function(){
    if (window.location.href.indexOf("ru") > 0 || window.location.href.indexOf("en") > 0) {
        window.location.href = window.location.href.replace("ru", "en");
    } else if (window.location.href.indexOf("?") > 0) {
        window.location.href = window.location.href.replace("?", "?lang=en&");
    } else {
        window.location.href += "?lang=en";
    }
});

$('#lang_ru').click(function(){
    if (window.location.href.indexOf("en") > 0 || window.location.href.indexOf("ru") > 0) {
        window.location.href = window.location.href.replace("en", "ru");
    } else if (window.location.href.indexOf("?") > 0) {
        window.location.href = window.location.href.replace("?", "?lang=ru&");
    } else {
        window.location.href += "?lang=ru";
    }
});

$('#product_view_list').click(function () {
    $('#product_list').attr('class', 'bordercolor list');
    $('#product_view_grid').attr('class', '');
    $('#product_view_list').attr('class', 'current');
});
