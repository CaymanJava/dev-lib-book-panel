package org.cayman.service;

import lombok.extern.slf4j.Slf4j;
import org.cayman.dto.Category;
import org.cayman.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Controller
@Slf4j
public class CategoryService {
    private final Constants constants;
    private final RestTemplate restTemplate;

    @Autowired
    public CategoryService(Constants constants, RestTemplate restTemplate) {
        this.constants = constants;
        this.restTemplate = restTemplate;
    }

    public List<Category> getAllCategories() {
        String url = constants.getBookServiceUrl() + "/category";
        Category[] categories = restTemplate.getForObject(url, Category[].class);
        return Arrays.asList(categories);
    }

    public Category getById(int id) {
        String url = constants.getBookServiceUrl() + "/category/one?id={id}";
        return restTemplate.getForObject(url, Category.class, id);
    }
}
