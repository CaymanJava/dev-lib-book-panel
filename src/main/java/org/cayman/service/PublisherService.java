package org.cayman.service;

import lombok.extern.slf4j.Slf4j;
import org.cayman.dto.Publisher;
import org.cayman.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class PublisherService {
    private final Constants constants;
    private final RestTemplate restTemplate;

    @Autowired
    public PublisherService(Constants constants, RestTemplate restTemplate) {
        this.constants = constants;
        this.restTemplate = restTemplate;
    }

    public List<Publisher> getAllPublishers() {
        String url = constants.getBookServiceUrl() + "/publisher";
        Publisher[] publishers = restTemplate.getForObject(url, Publisher[].class);
        return Arrays.asList(publishers);
    }

    public Publisher getById(int id) {
        String url = constants.getBookServiceUrl() + "/publisher/one?id={id}";
        return restTemplate.getForObject(url, Publisher.class, id);
    }
}
