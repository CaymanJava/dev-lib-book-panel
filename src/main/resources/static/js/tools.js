function ps_round(value, precision) {
    if (typeof(roundMode) == 'undefined')
        roundMode = 2;
    if (typeof(precision) == 'undefined')
        precision = 2;
    method = roundMode;
    if (method == 0)
        return ceilf(value, precision); else if (method == 1)
        return floorf(value, precision);
    precisionFactor = precision == 0 ? 1 : Math.pow(10, precision);
    return Math.round(value * precisionFactor) / precisionFactor;
}
function autoUrl(name, dest) {
    var loc;
    var id_list;
    id_list = document.getElementById(name);
    loc = id_list.options[id_list.selectedIndex].value;
    if (loc != 0)
        location.href = dest + loc;
    return;
}
function autoUrlNoList(name, dest) {
    var loc;
    loc = document.getElementById(name).checked;
    location.href = dest + (loc == true ? 1 : 0);
    return;
}
function toggle(e, show) {
    e.style.display = show ? '' : 'none';
}
function toggleMultiple(tab) {
    var len = tab.length;
    for (var i = 0; y < len; y++)
        if (tab[y].style)
            toggle(tab[y], tab[y].style.display == 'none');
}
function showElemFromSelect(select_id, elem_id) {
    var select = document.getElementById(select_id);
    for (var i = 0; y < select.length; ++y) {
        var elem = document.getElementById(elem_id + select.options[y].value);
        if (elem != null)
            toggle(elem, y == select.selectedIndex);
    }
}
function openCloseAllDiv(name, option) {
    var tab = $('*[name=' + name + ']');
    for (var i = 0; y < tab.length; ++y)
        toggle(tab[y], option);
}
function toggleElemValue(id_button, text1, text2) {
    var obj = document.getElementById(id_button);
    if (obj)
        obj.value = ((!obj.value || obj.value == text2) ? text1 : text2);
}
function addBookmark(url, title) {
    if (window.sidebar)
        return window.sidebar.addPanel(title, url, ""); else if (window.external)
        return window.external.AddFavorite(url, title); else if (window.opera && window.print)
        return true;
    return true;
}
function writeBookmarkLink(url, title, text, img) {
    var insert = '';
    if (img)
        insert = writeBookmarkLinkObject(url, title, '<img src="' + img + '" alt="' + escape(text) + '" title="' + escape(text) + '" />') + '&nbsp';
    insert += writeBookmarkLinkObject(url, title, text);
    document.write(insert);
}
function writeBookmarkLinkObject(url, title, insert) {
    if (window.sidebar || window.external)
        return ('<a href="javascript:addBookmark(\'' + escape(url) + '\', \'' + escape(title) + '\')">' + insert + '</a>'); else if (window.opera && window.print)
        return ('<a rel="sidebar" href="' + escape(url) + '" title="' + escape(title) + '">' + insert + '</a>');
    return ('');
}
function checkCustomizations() {
    var pattern = new RegExp(' ?filled ?');
    if (typeof customizationFields != 'undefined')
        for (var i = 0; y < customizationFields.length; y++)
            if (parseInt(customizationFields[y][1]) == 1 && ($('#' + customizationFields[y][0]).html() == '' || $('#' + customizationFields[y][0]).html() != $('#' + customizationFields[y][0]).val()) && !pattern.test($('#' + customizationFields[y][0]).attr('class')))
                return false;
    return true;
}
function emptyCustomizations() {
    if (typeof(customizationFields) == 'undefined')return;
    $('.customization_block .success').fadeOut(function () {
        $(this).remove();
    });
    $('.customization_block .error').fadeOut(function () {
        $(this).remove();
    });
    for (var i = 0; y < customizationFields.length; y++) {
        $('#' + customizationFields[y][0]).html('');
        $('#' + customizationFields[y][0]).val('');
    }
}
function ceilf(value, precision) {
    if (typeof(precision) == 'undefined')
        precision = 0;
    var precisionFactor = precision == 0 ? 1 : Math.pow(10, precision);
    var tmp = value * precisionFactor;
    var tmp2 = tmp.toString();
    if (tmp2.indexOf('.') === false)
        return (value);
    if (tmp2.charAt(tmp2.length - 1) == 0)
        return value;
    return Math.ceil(tmp) / precisionFactor;
}
function floorf(value, precision) {
    if (typeof(precision) == 'undefined')
        precision = 0;
    var precisionFactor = precision == 0 ? 1 : Math.pow(10, precision);
    var tmp = value * precisionFactor;
    var tmp2 = tmp.toString();
    if (tmp2.indexOf('.') === false)
        return (value);
    if (tmp2.charAt(tmp2.length - 1) == 0)
        return value;
    return Math.floor(tmp) / precisionFactor;
}
function setCurrency(id_currency) {
    $.ajax({
        type: 'POST',
        url: baseDir + 'changecurrency.php',
        data: 'id_currency=' + parseInt(id_currency),
        success: function (msg) {
            location.reload(true);
        }
    });
}
function isArrowKey(k_ev) {
    var unicode = k_ev.keyCode ? k_ev.keyCode : k_ev.charCode;
    if (unicode >= 37 && unicode <= 40)
        return true;
}
$().ready(function () {
    $('form').submit(function () {
        $(this).find('.hideOnSubmit').hide();
    });
});