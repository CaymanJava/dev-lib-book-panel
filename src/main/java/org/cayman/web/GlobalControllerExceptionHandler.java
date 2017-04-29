package org.cayman.web;

import lombok.extern.slf4j.Slf4j;
import org.cayman.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
@Slf4j
public class GlobalControllerExceptionHandler {

    private final CategoryService categoryService;

    @Autowired
    public GlobalControllerExceptionHandler(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @ExceptionHandler(Exception.class)
    @Order(Ordered.LOWEST_PRECEDENCE)
    String defaultErrorHandler(Model model, Exception e) throws Exception {
        log.warn("Exception: ", e);
        model.addAttribute("email", "");
        model.addAttribute("userId", 0);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        return "error";
    }
}
