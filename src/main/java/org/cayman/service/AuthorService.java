package org.cayman.service;

import lombok.extern.slf4j.Slf4j;
import org.cayman.dto.Author;
import org.cayman.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
@Slf4j
public class AuthorService {
    private final Constants constants;
    private final RestTemplate restTemplate;

    @Autowired
    public AuthorService(Constants constants, RestTemplate restTemplate) {
        this.constants = constants;
        this.restTemplate = restTemplate;
    }

    public List<Author> getAllAuthors() {
        String url = constants.getBookServiceUrl() + "/author";
        List<Author> authors = Arrays.asList(restTemplate.getForObject(url, Author[].class));
        Collections.sort(authors);
        return authors;
    }

    public Author getById(int id) {
        String url = constants.getBookServiceUrl() + "/author/one?id={id}";
        return restTemplate.getForObject(url, Author.class, id);
    }
}
