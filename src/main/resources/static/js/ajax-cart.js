var ajaxCart = {
    overrideButtonsInThePage: function () {
        $('.ajax_add_to_cart_button').unbind('click').click(function () {
            var idProduct = $(this).attr('rel').replace('ajax_id_product_', '');
            if ($(this).attr('disabled') != 'disabled')
                ajaxCart.add(idProduct, null, false, this);
            return false;
        });
        $('body#product #add_to_cart input').unbind('click').click(function () {
            ajaxCart.add($('#product_page_product_id').val(), $('#idCombination').val(), true, null, $('#quantity_wanted').val(), null);
            return false;
        });
        $('#cart_block_list .ajax_cart_block_remove_link').unbind('click').click(function () {
            var customizationId = 0;
            var productId = 0;
            var productAttributeId = 0;
            if ($($(this).parent().parent()).attr('name') == 'customization')
                var customizableProductDiv = $($(this).parent().parent()).find("div[id^=deleteCustomizableProduct_]"); else
                var customizableProductDiv = $($(this).parent()).find("div[id^=deleteCustomizableProduct_]");
            if (customizableProductDiv && $(customizableProductDiv).length) {
                $(customizableProductDiv).each(function () {
                    var ids = $(this).attr('id').split('_');
                    if (typeof(ids[1]) != 'undefined') {
                        customizationId = parseInt(ids[1]);
                        productId = parseInt(ids[2]);
                        if (typeof(ids[3]) != 'undefined')
                            productAttributeId = parseInt(ids[3]);
                        return false;
                    }
                });
            }
            if (!customizationId) {
                var firstCut = $(this).parent().parent().attr('id').replace('cart_block_product_', '');
                firstCut = firstCut.replace('deleteCustomizableProduct_', '');
                ids = firstCut.split('_');
                productId = parseInt(ids[0]);
                if (typeof(ids[1]) != 'undefined')
                    productAttributeId = parseInt(ids[1]);
            }
            ajaxCart.remove(productId, productAttributeId, customizationId);
            return false;
        });
    }, expand: function () {
        $(['left_column', 'right_column']).each(function (id, parentId) {
            if ($('#' + parentId + ' #cart_block #cart_block_list').hasClass('collapsed')) {
                $('#' + parentId + ' #cart_block #cart_block_summary').slideUp(200, function () {
                    $(this).addClass('collapsed').removeClass('expanded');
                    $('#' + parentId + ' #cart_block #cart_block_list').slideDown({
                        duration: 600,
                        complete: function () {
                            $(this).addClass('expanded').removeClass('collapsed');
                        }
                    });
                });
                $('#' + parentId + ' #cart_block h4 span#block_cart_expand').fadeOut('slow', function () {
                    $('#' + parentId + ' #cart_block h4 span#block_cart_collapse').fadeIn('fast');
                });
                $.ajax({
                    type: 'GET',
                    url: baseDir + 'modules/blockcart/blockcart-set-collapse.php',
                    async: true,
                    data: 'ajax_blockcart_display=expand' + '&rand=' + new Date().getTime()
                });
            }
        });
    }, refresh: function () {
        $.ajax({
            type: 'GET',
            url: baseDir + 'cart.php',
            async: true,
            cache: false,
            dataType: "json",
            data: 'ajax=true&token=' + static_token,
            success: function (jsonData) {
                ajaxCart.updateCart(jsonData);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }, collapse: function () {
        if ($('#cart_block #cart_block_list').hasClass('expanded')) {
            $('#cart_block #cart_block_list').slideUp('slow', function () {
                $(this).addClass('collapsed').removeClass('expanded');
                $('#cart_block #cart_block_summary').slideDown(700, function () {
                    $(this).addClass('expanded').removeClass('collapsed');
                });
            });
            $('#cart_block h4 span#block_cart_collapse').fadeOut('slow', function () {
                $('#cart_block h4 span#block_cart_expand').fadeIn('fast');
            });
            $.ajax({
                type: 'GET',
                url: baseDir + 'modules/blockcart/blockcart-set-collapse.php',
                async: true,
                data: 'ajax_blockcart_display=collapse' + '&rand=' + new Date().getTime()
            });
        }
    }, updateCartInformation: function (jsonData, addedFromProductPage) {
        ajaxCart.updateCart(jsonData);
        if (addedFromProductPage)
            $('body#product #add_to_cart input').removeAttr('disabled').addClass('exclusive').removeClass('exclusive_disabled'); else
            $('.ajax_add_to_cart_button').removeAttr('disabled');
    }, add: function (idProduct, idCombination, addedFromProductPage, callerElement, quantity, whishlist) {
        if (addedFromProductPage && !checkCustomizations()) {
            alert(fieldRequired);
            return;
        }
        emptyCustomizations();
        if (addedFromProductPage) {
            $('body#product #add_to_cart input').attr('disabled', 'disabled').removeClass('exclusive').addClass('exclusive_disabled');
            $('.filled').removeClass('filled');
        }
        else
            $(callerElement).attr('disabled', 'disabled');
        if ($('#cart_block #cart_block_list').hasClass('collapsed'))
            this.expand();
        $.ajax({
            type: 'POST',
            url: baseDir + 'cart.php',
            async: true,
            cache: false,
            dataType: "json",
            data: 'add=1&ajax=true&qty=' + ((quantity && quantity != null) ? quantity : '1') + '&id_product=' + idProduct + '&token=' + static_token + ((parseInt(idCombination) && idCombination != null) ? '&ipa=' + parseInt(idCombination) : ''),
            success: function (jsonData, textStatus, jqXHR) {
                if (whishlist && !jsonData.errors)
                    WishlistAddProductCart(whishlist[0], idProduct, idCombination, whishlist[1]);
                var $element = $(callerElement).parent().parent().find('a.product_image img,a.product_img_link img');
                if (!$element.length)
                    $element = $('#bigpic');
                var $picture = $element.clone();
                var pictureOffsetOriginal = $element.offset();
                if ($picture.size())
                    $picture.css({
                        'position': 'absolute',
                        'top': pictureOffsetOriginal.top,
                        'left': pictureOffsetOriginal.left
                    });
                var pictureOffset = $picture.offset();
                var cartBlockOffset = $('#shopping_cart').offset();
                if (cartBlockOffset != undefined && $picture.size()) {
                    $picture.appendTo('body');
                    $picture.css({
                        'position': 'absolute',
                        'top': $picture.css('top'),
                        'left': $picture.css('left')
                    }).animate({
                        'width': $element.attr('width') * 0.66,
                        'height': $element.attr('height') * 0.66,
                        'opacity': 0.2,
                        'top': cartBlockOffset.top + 30,
                        'left': cartBlockOffset.left + 15
                    }, 1000).fadeOut(100, function () {
                        ajaxCart.updateCartInformation(jsonData, addedFromProductPage);
                    });
                }
                else
                    ajaxCart.updateCartInformation(jsonData, addedFromProductPage);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("TECHNICAL ERROR: unable to add the product.\n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
                if (addedFromProductPage)
                    $('body#product #add_to_cart input').removeAttr('disabled').addClass('exclusive').removeClass('exclusive_disabled'); else
                    $(callerElement).removeAttr('disabled');
            }
        });
    }, remove: function (idProduct, idCombination, customizationId) {
        $.ajax({
            type: 'POST',
            url: baseDir + 'cart.php',
            async: true,
            cache: false,
            dataType: "json",
            data: 'delete=1&id_product=' + idProduct + '&ipa=' + ((idCombination != null && parseInt(idCombination)) ? idCombination : '') + ((customizationId && customizationId != null) ? '&id_customization=' + customizationId : '') + '&token=' + static_token + '&ajax=true',
            success: function (jsonData) {
                ajaxCart.updateCart(jsonData);
                if ($('body').attr('id') == 'order' || $('body').attr('id') == 'order-opc')
                    deletProductFromSummary(idProduct + '_' + idCombination);
            },
            error: function () {
                alert('ERROR: unable to delete the product');
            }
        });
    }, hideOldProducts: function (jsonData) {
        $(['left_column', 'right_column']).each(function (id, parentId) {
            if ($('#cart_block #cart_block_list dl.products').length > 0) {
                var removedProductId = null;
                var removedProductData = null;
                var removedProductDomId = null;
                $('#' + parentId + ' #cart_block_list dl.products dt').each(function () {
                    var domIdProduct = $(this).attr('id');
                    var firstCut = domIdProduct.replace('cart_block_product_', '');
                    var ids = firstCut.split('_');
                    var stayInTheCart = false;
                    for (aProduct in jsonData.products) {
                        if (jsonData.products[aProduct]['id'] == ids[0] && (!ids[1] || jsonData.products[aProduct]['idCombination'] == ids[1])) {
                            stayInTheCart = true;
                            ajaxCart.hideOldProductCustomizations(jsonData.products[aProduct], domIdProduct);
                        }
                    }
                    if (!stayInTheCart) {
                        removedProductId = $(this).attr('id');
                    }
                    if (removedProductId != null) {
                        var firstCut = removedProductId.replace('cart_block_product_', '');
                        var ids = firstCut.split('_');
                        $('#' + parentId + ' #' + removedProductId).addClass('strike').fadeTo('slow', 0, function () {
                            $(this).slideUp('slow', function () {
                                $(this).remove();
                                if ($('#' + parentId + ' #cart_block dl.products dt').length == 0) {
                                    $('#' + parentId + ' p#cart_block_no_products').slideDown('fast');
                                    $('#' + parentId + ' div#cart_block dl.products').remove();
                                }
                            });
                        });
                        $('#' + parentId + ' dd#cart_block_combination_of_' + ids[0] + (ids[1] ? '_' + ids[1] : '')).fadeTo('fast', 0, function () {
                            $(this).slideUp('fast', function () {
                                $(this).remove();
                            });
                        });
                    }
                });
            }
        });
    }, hideOldProductCustomizations: function (product, domIdProduct) {
        $(['left_column', 'right_column']).each(function (id, parentId) {
            var customizationList = $('#' + parentId + ' #cart_block #cart_block_list ul#customization_' + product['id'] + '_' + product['idCombination']);
            if (customizationList.length > 0) {
                $(customizationList).find("li").each(function () {
                    $(this).find("div").each(function () {
                        var customizationDiv = $(this).attr('id');
                        var tmp = customizationDiv.replace('deleteCustomizableProduct_', '');
                        var ids = tmp.split('_');
                        if ((parseInt(product.idCombination) == parseInt(ids[2])) && !ajaxCart.doesCustomizationStillExist(product, ids[0]))
                            $('#' + customizationDiv).parent().addClass('strike').fadeTo('slow', 0, function () {
                                $(this).slideUp('slow');
                                $(this).remove();
                            });
                    });
                });
            }
            var removeLinks = $('#' + parentId + ' #cart_block_product_' + domIdProduct).find('a.ajax_cart_block_remove_link');
            if (!product.hasCustomizedDatas && !removeLinks.length)
                $('#' + parentId + ' #' + domIdProduct + ' span.remove_link').html('<a class="ajax_cart_block_remove_link" rel="nofollow" href="' + baseDir + 'cart.php?delete&amp;id_product=' + product['id'] + '&amp;ipa=' + product['idCombination'] + '&amp;token=' + static_token + '" title="' + removingLinkText + '"> </a>');
        });
    }, doesCustomizationStillExist: function (product, customizationId) {
        var exists = false;
        $(product.customizedDatas).each(function () {
            if (this.customizationId == customizationId) {
                exists = true;
                return false;
            }
        });
        return (exists);
    }, refreshVouchers: function (jsonData) {
        if (jsonData.discounts.length == 0)
            $('#vouchers').remove(); else {
            $('.bloc_cart_voucher').each(function () {
                var idElmt = $(this).attr('id').replace('bloc_cart_voucher_', '');
                var toDelete = true;
                for (y = 0; y < jsonData.discounts.length; y++) {
                    if (jsonData.discounts[y].id == idElmt) {
                        $('#bloc_cart_voucher_' + idElmt + ' td.price').text(jsonData.discounts[y].price);
                        toDelete = false;
                    }
                }
                if (toDelete) {
                    $('#bloc_cart_voucher_' + idElmt).fadeTo('fast', 0, function () {
                        $(this).remove();
                    });
                }
            });
        }
    }, updateProductQuantity: function (product, quantity) {
        $(['left_column', 'right_column']).each(function (id, parentId) {
            $('#' + parentId + ' dt#cart_block_product_' + product.id + (product.idCombination ? '_' + product.idCombination : '') + ' .quantity').fadeTo('fast', 0, function () {
                $(this).text(quantity);
                $(this).fadeTo('fast', 1, function () {
                    $(this).fadeTo('fast', 0, function () {
                        $(this).fadeTo('fast', 1, function () {
                            $(this).fadeTo('fast', 0, function () {
                                $(this).fadeTo('fast', 1);
                            });
                        });
                    });
                });
            });
        });
    }, displayNewProducts: function (jsonData) {
        $(['left_column', 'right_column']).each(function (id, parentId) {
            $(jsonData.products).each(function () {
                if (this.id != undefined) {
                    if ($('#' + parentId + ' div#cart_block dl.products').length == 0)
                        $('#' + parentId + ' p#cart_block_no_products').fadeTo('fast', 0, function () {
                            $(this).slideUp('fast').fadeTo(0, 1);
                        }).before('<dl class="products"></dl>');
                    var domIdProduct = this.id + (this.idCombination ? '_' + this.idCombination : '');
                    var domIdProductAttribute = this.id + '_' + (this.idCombination ? this.idCombination : '0');
                    if ($('#' + parentId + ' #cart_block dt#cart_block_product_' + domIdProduct).length == 0) {
                        var productId = parseInt(this.id);
                        var productAttributeId = (this.hasAttributes ? parseInt(this.attributes) : 0);
                        var content = '<dt class="hidden" id="cart_block_product_' + domIdProduct + '">';
                        content += '<span class="quantity-formated"><span class="quantity">' + this.quantity + '</span>x</span>';
                        var name = (this.name.length > 12 ? this.name.substring(0, 10) + '...' : this.name);
                        content += '<a href="' + this.link + '" title="' + this.name + '">' + name + '</a>';
                        content += '<span class="remove_link"><a rel="nofollow" class="ajax_cart_block_remove_link" href="' + baseDir + 'cart.php?delete&amp;id_product=' + productId + '&amp;token=' + static_token + (this.hasAttributes ? '&amp;ipa=' + parseInt(this.idCombination) : '') + '"> </a></span>';
                        content += '<span class="price">' + this.priceByLine + '</span>';
                        content += '</dt>';
                        if (this.hasAttributes)
                            content += '<dd id="cart_block_combination_of_' + domIdProduct + '" class="hidden"><a href="' + this.link + '" title="' + this.name + '">' + this.attributes + '</a>';
                        if (this.hasCustomizedDatas)
                            content += ajaxCart.displayNewCustomizedDatas(this);
                        if (this.hasAttributes) content += '</dd>';
                        $('#' + parentId + ' #cart_block dl.products').append(content);
                    }
                    else {
                        var jsonProduct = this;
                        if ($('#' + parentId + ' dt#cart_block_product_' + domIdProduct + ' .quantity').text() != jsonProduct.quantity || $('dt#cart_block_product_' + domIdProduct + ' .price').text() != jsonProduct.priceByLine) {
                            $('#' + parentId + ' dt#cart_block_product_' + domIdProduct + ' .price').text(jsonProduct.priceByLine);
                            ajaxCart.updateProductQuantity(jsonProduct, jsonProduct.quantity);
                            if (jsonProduct.hasCustomizedDatas) {
                                customizationFormatedDatas = ajaxCart.displayNewCustomizedDatas(jsonProduct);
                                if (!$('#' + parentId + ' #cart_block ul#customization_' + domIdProductAttribute).length) {
                                    if (jsonProduct.hasAttributes)
                                        $('#' + parentId + ' #cart_block dd#cart_block_combination_of_' + domIdProduct).append(customizationFormatedDatas); else
                                        $('#' + parentId + ' #cart_block dl.products').append(customizationFormatedDatas);
                                }
                                else
                                    $('#' + parentId + ' #cart_block ul#customization_' + domIdProductAttribute).append(customizationFormatedDatas);
                            }
                        }
                    }
                    $('#' + parentId + ' #cart_block dl.products .hidden').slideDown('slow').removeClass('hidden');
                    var removeLinks = $('#' + parentId + ' #cart_block_product_' + domIdProduct).find('a.ajax_cart_block_remove_link');
                    if (this.hasCustomizedDatas && removeLinks.length)
                        $(removeLinks).each(function () {
                            $(this).remove();
                        });
                }
            });
        });
    }, displayNewCustomizedDatas: function (product) {
        var content = '';
        $('#cart_block').each(function (id, parentId) {
            var productId = parseInt(product.id);
            var productAttributeId = typeof(product.idCombination) == 'undefined' ? 0 : parseInt(product.idCombination);
            var hasAlreadyCustomizations = $(this).children('ul#customization_' + productId + '_' + productAttributeId).length;
            if (!hasAlreadyCustomizations) {
                if (!product.hasAttributes)
                    content += '<dd id="cart_block_combination_of_' + productId + '" class="hidden">';
                if ($('#customization_' + productId + '_' + productAttributeId).val() == undefined)
                    content += '<ul class="cart_block_customizations" id="customization_' + productId + '_' + productAttributeId + '">';
            }
            $(product.customizedDatas).each(function () {
                var done = 0;
                customizationId = parseInt(this.customizationId);
                productAttributeId = typeof(product.idCombination) == 'undefined' ? 0 : parseInt(product.idCombination);
                if ($("#deleteCustomizableProduct_" + customizationId + "_" + productId + "_" + productAttributeId).length)
                    return ('');
                content += '<li name="customization"><div class="deleteCustomizableProduct" id="deleteCustomizableProduct_' + customizationId + '_' + productId + '_' + (productAttributeId ? productAttributeId : '0') + '"><a  rel="nofollow" class="ajax_cart_block_remove_link" href="' + baseDir + 'cart.php?delete&amp;id_product=' + productId + '&amp;ipa=' + productAttributeId + '&amp;id_customization=' + customizationId + '&amp;token=' + static_token + '"> </a></div><span class="quantity-formated"><span class="quantity">' + parseInt(this.quantity) + '</span>x</span>';
                $(this.datas).each(function () {
                    if (this['type'] == CUSTOMIZE_TEXTFIELD) {
                        $(this.datas).each(function () {
                            if (this['index'] == 0) {
                                content += this.truncatedValue.replace(/<br \/>/g, ' ');
                                done = 1;
                                return false;
                            }
                        })
                    }
                });
                if (!done)
                    content += customizationIdMessage + customizationId;
                if (!hasAlreadyCustomizations) content += '</li>';
                if (customizationId) {
                    $(this).children('#uploadable_files li div.customizationUploadBrowse img').remove();
                    $(this).children('#text_fields li input').attr('value', '');
                }
            });
            if (!hasAlreadyCustomizations) {
                content += '</ul>';
                if (!product.hasAttributes) content += '</dd>';
            }
        });
        return content;
    }, updateCart: function (jsonData) {
        if (jsonData.hasError) {
            var errors = '';
            for (error in jsonData.errors)
                if (error != 'indexOf')
                    errors += jsonData.errors[error] + "\n";
            alert(errors);
        }
        else {
            ajaxCart.updateCartEverywhere(jsonData);
            ajaxCart.hideOldProducts(jsonData);
            ajaxCart.displayNewProducts(jsonData);
            ajaxCart.refreshVouchers(jsonData);
            $(['left_column', 'right_column']).each(function (id, parentId) {
                $('#' + parentId + ' #cart_block dl.products dt').removeClass('first_item').removeClass('last_item').removeClass('item');
                $('#' + parentId + ' #cart_block dl.products dt:first').addClass('first_item');
                $('#' + parentId + ' #cart_block dl.products dt:not(:first,:last)').addClass('item');
                $('#' + parentId + ' #cart_block dl.products dt:last').addClass('last_item');
            });
            ajaxCart.overrideButtonsInThePage();
        }
    }, updateCartEverywhere: function (jsonData) {
        $('.ajax_cart_total').text(jsonData.productTotal);
        $('.ajax_cart_shipping_cost').text(jsonData.shippingCost);
        $('.ajax_cart_tax_cost').text(jsonData.taxCost);
        $('.cart_block_wrapping_cost').text(jsonData.wrappingCost);
        $('.ajax_block_cart_total').text(jsonData.total);
        if (parseInt(jsonData.nbTotalProducts) > 0) {
            $('.ajax_cart_no_product').hide();
            $('.ajax_cart_quantity').text(jsonData.nbTotalProducts);
            $('.ajax_cart_quantity').fadeIn('slow');
            $('.ajax_cart_total').fadeIn('slow');
            if (parseInt(jsonData.nbTotalProducts) > 1) {
                $('.ajax_cart_product_txt').each(function () {
                    $(this).hide();
                });
                $('.ajax_cart_product_txt_s').each(function () {
                    $(this).show();
                });
            }
            else {
                $('.ajax_cart_product_txt').each(function () {
                    $(this).show();
                });
                $('.ajax_cart_product_txt_s').each(function () {
                    $(this).hide();
                });
            }
        }
        else {
            $('.ajax_cart_quantity, .ajax_cart_product_txt_s, .ajax_cart_product_txt, .ajax_cart_total').each(function () {
                $(this).hide();
            });
            $('.ajax_cart_no_product').show('slow');
        }
    }
};
$(document).ready(function () {
    $('#block_cart_collapse').click(function () {
        ajaxCart.collapse();
    });
    $('#block_cart_expand').click(function () {
        ajaxCart.expand();
    });
    ajaxCart.overrideButtonsInThePage();
    ajaxCart.refresh();
});