var combinations = new Array();
var selectedCombination = new Array();
var globalQuantity = new Number;
var colors = new Array();
var input_save_customized_datas = '';
function function_exists(function_name) {
    if (typeof function_name == 'string')
        return (typeof window[function_name] == 'function');
    return (function_name instanceof Function);
}
function oosHookJsCode() {
    for (var i = 0; i < oosHookJsCodeFunctions.length; i++) {
        if (function_exists(oosHookJsCodeFunctions[i]))
            setTimeout(oosHookJsCodeFunctions[i] + '()', 0);
    }
}
function addCombination(idCombination, arrayOfIdAttributes, quantity, price, ecotax, id_image, reference, unit_price, minimal_quantity) {
    globalQuantity += quantity;
    var combination = new Array();
    combination['idCombination'] = idCombination;
    combination['quantity'] = quantity;
    combination['idsAttributes'] = arrayOfIdAttributes;
    combination['price'] = price;
    combination['ecotax'] = ecotax;
    combination['image'] = id_image;
    combination['reference'] = reference;
    combination['unit_price'] = unit_price;
    combination['minimal_quantity'] = minimal_quantity;
    combinations.push(combination);
}
function findCombination(firstTime) {
    $('#minimal_quantity_wanted_p').fadeOut();
    $('#quantity_wanted').val(1);
    var choice = new Array();
    $('div#attributes select').each(function () {
        choice.push($(this).val());
    });
    for (var combination = 0; combination < combinations.length; ++combination) {
        var combinationMatchForm = true;
        $.each(combinations[combination]['idsAttributes'], function (key, value) {
            if (!in_array(value, choice)) {
                combinationMatchForm = false;
            }
        })
        if (combinationMatchForm) {
            if (combinations[combination]['minimal_quantity'] > 1) {
                $('#minimal_quantity_label').html(combinations[combination]['minimal_quantity']);
                $('#minimal_quantity_wanted_p').fadeIn();
                $('#quantity_wanted').val(combinations[combination]['minimal_quantity']);
                $('#quantity_wanted').bind('keyup', function () {
                    checkMinimalQuantity(combinations[combination]['minimal_quantity'])
                });
            }
            selectedCombination['unavailable'] = false;
            selectedCombination['reference'] = combinations[combination]['reference'];
            $('#idCombination').val(combinations[combination]['idCombination']);
            quantityAvailable = combinations[combination]['quantity'];
            selectedCombination['price'] = combinations[combination]['price'];
            selectedCombination['unit_price'] = combinations[combination]['unit_price'];
            if (combinations[combination]['ecotax'])
                selectedCombination['ecotax'] = combinations[combination]['ecotax']; else
                selectedCombination['ecotax'] = default_eco_tax;
            if (combinations[combination]['image'] && combinations[combination]['image'] != -1)
                displayImage($('#thumb_' + combinations[combination]['image']).parent());
            updateDisplay();
            if (typeof(firstTime) != 'undefined' && firstTime)
                refreshProductImages(0); else
                refreshProductImages(combinations[combination]['idCombination']);
            return;
        }
    }
    selectedCombination['unavailable'] = true;
    updateDisplay();
}
function updateColorSelect(id_attribute) {
    if (id_attribute == 0) {
        refreshProductImages(0);
        return;
    }
    $('#color_' + id_attribute).fadeTo('fast', 1, function () {
        $(this).fadeTo('slow', 0, function () {
            $(this).fadeTo('slow', 1, function () {
            });
        });
    });
    $('#group_' + id_color_default + ' option[value=' + id_attribute + ']').attr('selected', 'selected');
    $('#group_' + id_color_default + ' option[value!=' + id_attribute + ']').removeAttr('selected');
    findCombination();
}
function updateDisplay() {
    if (!selectedCombination['unavailable'] && quantityAvailable > 0 && productAvailableForOrder == 1) {
        $('#quantity_wanted_p:hidden').show('slow');
        $('#add_to_cart:hidden').fadeIn(600);
        $('#oosHook').hide();
        if (availableNowValue != '') {
            $('#availability_value').removeClass('warning_inline');
            $('#availability_value').text(availableNowValue);
            $('#availability_statut:hidden').show();
        }
        else {
            $('#availability_statut:visible').hide();
        }
        if (!allowBuyWhenOutOfStock) {
            if (quantityAvailable <= maxQuantityToAllowDisplayOfLastQuantityMessage)
                $('#last_quantities').show('slow'); else
                $('#last_quantities').hide('slow');
        }
        if (quantitiesDisplayAllowed) {
            $('#pQuantityAvailable:hidden').show('slow');
            $('#quantityAvailable').text(quantityAvailable);
            if (quantityAvailable < 2) {
                $('#quantityAvailableTxt').show();
                $('#quantityAvailableTxtMultiple').hide();
            }
            else {
                $('#quantityAvailableTxt').hide();
                $('#quantityAvailableTxtMultiple').show();
            }
        }
    }
    else {
        if (productAvailableForOrder == 1) {
            $('#oosHook').show();
            if ($('#oosHook').length > 0 && function_exists('oosHookJsCode'))
                oosHookJsCode();
        }
        $('#last_quantities:visible').hide('slow');
        $('#pQuantityAvailable:visible').hide('slow');
        if (!allowBuyWhenOutOfStock)
            $('#quantity_wanted_p:visible').hide('slow');
        if (!selectedCombination['unavailable'])
            $('#availability_value').text(doesntExistNoMore + (globalQuantity > 0 ? ' ' + doesntExistNoMoreBut : '')).addClass('warning_inline'); else {
            $('#availability_value').text(doesntExist).addClass('warning_inline');
            $('#oosHook').hide();
        }
        $('#availability_statut:hidden').show();
        if (allowBuyWhenOutOfStock && !selectedCombination['unavailable'] && productAvailableForOrder == 1) {
            $('#add_to_cart:hidden').fadeIn(600);
            if (availableLaterValue != '') {
                $('#availability_value').text(availableLaterValue);
                $('p#availability_statut:hidden').show('slow');
            }
            else
                $('p#availability_statut:visible').hide('slow');
        }
        else {
            $('#add_to_cart:visible').fadeOut(600);
            $('p#availability_statut:hidden').show('slow');
        }
        if (productAvailableForOrder == 0)
            $('p#availability_statut:visible').hide();
    }
    if (selectedCombination['reference'] || productReference) {
        if (selectedCombination['reference'])
            $('#product_reference span').text(selectedCombination['reference']); else if (productReference)
            $('#product_reference span').text(productReference);
        $('#product_reference:hidden').show('slow');
    }
    else
        $('#product_reference:visible').hide('slow');
    if (!selectedCombination['unavailable'] && productShowPrice == 1) {
        if (!displayPrice && !noTaxForThisProduct) {
            var priceTaxExclWithoutGroupReduction = ps_round(productPriceTaxExcluded, 6) * (1 / group_reduction);
        } else {
            var priceTaxExclWithoutGroupReduction = ps_round(productPriceTaxExcluded, 6) * (1 / group_reduction);
        }
        var combination_add_price = selectedCombination['price'] * group_reduction;
        var tax = (taxRate / 100) + 1;
        var taxExclPrice = (specific_price ? (specific_currency ? specific_price : specific_price * currencyRate) : priceTaxExclWithoutGroupReduction) + selectedCombination['price'] * currencyRate;
        if (specific_price)
            var productPriceWithoutReduction = priceTaxExclWithoutGroupReduction + selectedCombination['price'] * currencyRate;
        if (!displayPrice && !noTaxForThisProduct) {
            var productPrice = taxExclPrice * tax;
            if (specific_price)
                productPriceWithoutReduction = ps_round(productPriceWithoutReduction * tax, 2);
        }
        else {
            var productPrice = ps_round(taxExclPrice, 2);
            if (specific_price)
                productPriceWithoutReduction = ps_round(productPriceWithoutReduction, 2);
        }
        var reduction = 0;
        if (reduction_price || reduction_percent) {
            reduction_price = (specific_currency ? reduction_price : reduction_price * currencyRate);
            reduction = productPrice * (parseFloat(reduction_percent) / 100) + reduction_price;
            if (reduction_price && (displayPrice || noTaxForThisProduct))
                reduction = ps_round(reduction / tax, 6);
        }
        if (!specific_price)
            productPriceWithoutReduction = productPrice * group_reduction;
        productPrice -= reduction;
        var tmp = productPrice * group_reduction;
        productPrice = ps_round(productPrice * group_reduction, 2);
        var ecotaxAmount = !displayPrice ? ps_round(selectedCombination['ecotax'] * (1 + ecotaxTax_rate / 100), 2) : selectedCombination['ecotax'];
        productPrice += ecotaxAmount;
        productPriceWithoutReduction += ecotaxAmount;
        if (productPrice > 0)
            $('#our_price_display').text(formatCurrency(productPrice, currencyFormat, currencySign, currencyBlank)); else
            $('#our_price_display').text(formatCurrency(0, currencyFormat, currencySign, currencyBlank));
        $('#old_price_display').text(formatCurrency(productPriceWithoutReduction, currencyFormat, currencySign, currencyBlank));
        if (!noTaxForThisProduct)
            var productPricePretaxed = productPrice / tax; else
            var productPricePretaxed = productPrice;
        $('#pretaxe_price_display').text(formatCurrency(productPricePretaxed, currencyFormat, currencySign, currencyBlank));
        productUnitPriceRatio = parseFloat(productUnitPriceRatio);
        if (productUnitPriceRatio > 0) {
            newUnitPrice = (productPrice / parseFloat(productUnitPriceRatio)) + selectedCombination['unit_price'];
            $('#unit_price_display').text(formatCurrency(newUnitPrice, currencyFormat, currencySign, currencyBlank));
        }
        var ecotaxAmount = !displayPrice ? ps_round(selectedCombination['ecotax'] * (1 + ecotaxTax_rate / 100), 2) : selectedCombination['ecotax'];
        $('#ecotax_price_display').text(formatCurrency(ecotaxAmount, currencyFormat, currencySign, currencyBlank));
    }
}
function displayImage(domAAroundImgThumb) {
    if (domAAroundImgThumb.attr('href')) {
        var newSrc = domAAroundImgThumb.attr('href').replace('thickbox', 'large');
        if ($('#bigpic').attr('src') != newSrc) {
            $('#bigpic').fadeIn('fast', function () {
                $(this).attr('src', newSrc).show();
                if (typeof(jqZoomEnabled) != 'undefined' && jqZoomEnabled)
                    $(this).attr('alt', domAAroundImgThumb.attr('href'));
            });
        }
        $('#views_block li a').removeClass('shown');
        $(domAAroundImgThumb).addClass('shown');
    }
}
function serialScrollFixLock(event, targeted, scrolled, items, position) {
    serialScrollNbImages = $('#thumbs_list li:visible').length;
    serialScrollNbImagesDisplayed = 3;
    var leftArrow = position == 0 ? true : false;
    var rightArrow = position + serialScrollNbImagesDisplayed >= serialScrollNbImages ? true : false;
    $('a#view_scroll_left').css('cursor', leftArrow ? 'default' : 'pointer').css('display', leftArrow ? 'none' : 'block').fadeTo(0, leftArrow ? 0 : 1);
    $('a#view_scroll_right').css('cursor', rightArrow ? 'default' : 'pointer').fadeTo(0, rightArrow ? 0 : 1).css('display', rightArrow ? 'none' : 'block');
    return true;
}
function refreshProductImages(id_product_attribute) {
    $('#thumbs_list_frame').scrollTo('li:eq(0)', 700, {axis: 'x'});
    $('#thumbs_list li').hide();
    id_product_attribute = parseInt(id_product_attribute);
    if (typeof(combinationImages) != 'undefined' && typeof(combinationImages[id_product_attribute]) != 'undefined') {
        for (var i = 0; i < combinationImages[id_product_attribute].length; i++)
            $('#thumbnail_' + parseInt(combinationImages[id_product_attribute][i])).show();
    }
    if (i > 0) {
        var thumb_width = $('#thumbs_list_frame >li').width() + parseInt($('#thumbs_list_frame >li').css('marginRight'));
        $('#thumbs_list_frame').width((parseInt((thumb_width) * i) - 10) + 'px');
    }
    else {
        $('#thumbnail_' + idDefaultImage).show();
        displayImage($('#thumbnail_' + idDefaultImage + ' a'));
    }
    $('#thumbs_list').trigger('goto', 0);
    serialScrollFixLock('', '', '', '', 0);
}
$(document).ready(function () {
    $('#thumbs_list').serialScroll({
        items: 'li:visible',
        prev: 'a#view_scroll_left',
        next: 'a#view_scroll_right',
        axis: 'x',
        offset: 0,
        start: 0,
        stop: true,
        onBefore: serialScrollFixLock,
        duration: 700,
        step: 2,
        lazy: true,
        lock: false,
        force: false,
        cycle: false
    });
    $('#thumbs_list').trigger('goto', 1);
    $('#thumbs_list').trigger('goto', 0);
    $('#views_block li a').hover(function () {
        displayImage($(this));
    }, function () {
    });
    if (typeof(jqZoomEnabled) != 'undefined' && jqZoomEnabled) {
        $('img.jqzoom').jqueryzoom({xzoom: 200, yzoom: 200, offset: 21});
    }
    $('div#short_description_block p a.button').click(function () {
        $('#more_info_tab_more_info').click();
        $.scrollTo('#more_info_tabs', 1200);
    });
    $('p#customizedDatas input').click(function () {
        input_save_customized_datas = $('p#customizedDatas').html();
        $('p#customizedDatas input').hide();
        $('#ajax-loader').fadeIn();
        $('p#customizedDatas').append(uploading_in_progress);
    });
    if (typeof productHasAttributes != 'undefined' && productHasAttributes)
        findCombination(true); else if (typeof productHasAttributes != 'undefined' && !productHasAttributes)
        refreshProductImages(0);
    $('a#resetImages').click(function () {
        updateColorSelect(0);
    });
    $('.thickbox').fancybox({'hideOnContentClick': true, 'transitionIn': 'elastic', 'transitionOut': 'elastic'});
});
function saveCustomization() {
    $('#quantityBackup').val($('#quantity_wanted').val());
    customAction = $('#customizationForm').attr('action');
    $('body select[id^="group_"]').each(function () {
        customAction = customAction.replace(new RegExp(this.id + '=\\d+'), this.id + '=' + this.value);
    });
    $.ajax({
        type: 'POST',
        url: customAction,
        data: 'ajax=true&' + $('#customizationForm').serialize(),
        dataType: 'json',
        async: true,
        success: function (data) {
            $('#customizedDatas').fadeOut();
            $('#customizedDatas').html(input_save_customized_datas);
            $('#customizedDatas').fadeIn();
            if (!data.hasErrors) {
                $('#customizationForm').find('.error').fadeOut(function () {
                    $(this).remove();
                });
                if ($('#customizationForm').find('.success').val() == undefined)
                    $('#customizationForm').prepend("<p class='success'>" + data.conf + "</p>"); else
                    $('#customizationForm.success').html("<p class='success'>" + data.conf + "</p>");
            }
            else {
                $('#customizationForm').find('.success').fadeOut(function () {
                    $(this).remove();
                });
                if ($('#customizationForm').find('.error').val() == undefined) {
                    $('#customizationForm').prepend("<p class='error'></p>");
                    for (var i = 0; i < data.errors.length; i++)
                        $('#customizationForm .error').html($('#customizationForm .error').html() + data.errors[i] + "<br />");
                }
                else {
                    $('#customizationForm .error').html('');
                    for (var i = 0; i < data.errors.length; i++)
                        $('#customizationForm .error').html($('#customizationForm .error').html() + data.errors[i] + "<br />");
                }
            }
        }
    });
    return false;
}
function submitPublishProduct(url, redirect) {
    var id_product = $('#admin-action-product-id').val();
    $.ajaxSetup({async: false});
    $.post(url + '/ajax.php', {
        submitPublishProduct: '1',
        id_product: id_product,
        status: 1,
        redirect: redirect
    }, function (data) {
        if (data.indexOf('error') === -1)
            document.location.href = data;
    });
    return true;
}
function checkMinimalQuantity(minimal_quantity) {
    if ($('#quantity_wanted').val() < minimal_quantity) {
        $('#quantity_wanted').css('border', '1px solid red');
        $('#minimal_quantity_wanted_p').css('color', 'red');
    }
    else {
        $('#quantity_wanted').css('border', '1px solid #BDC2C9');
        $('#minimal_quantity_wanted_p').css('color', '#374853');
    }
}