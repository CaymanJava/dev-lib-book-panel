package org.cayman.service;


import lombok.extern.slf4j.Slf4j;
import org.cayman.dto.MessageDto;
import org.cayman.dto.ReCaptchaDto;
import org.cayman.utils.Constants;
import org.cayman.utils.LoggedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

@Controller
@Slf4j
public class ContactService {
    private final Constants constants;
    private final RestTemplate restTemplate;

    @Autowired
    public ContactService(Constants constants, RestTemplate restTemplate) {
        this.constants = constants;
        this.restTemplate = restTemplate;
    }

    public boolean sendMessage(String email, String message, String ip, String recaptcha) {
        boolean captchaValid = isReCaptchaValid(recaptcha);
        if (!captchaValid) return false;
        String url = constants.getMailServiceUrl() + "/message/save";
        return restTemplate.postForObject(url, new MessageDto(LoggedUser.id(), email, message, ip), Boolean.class);
    }

    private boolean isReCaptchaValid(String recaptcha) {
        String url = "https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={response}";
        return restTemplate.getForObject(url, ReCaptchaDto.class, constants.getRecaptchaKey(), recaptcha).isSuccess();
    }
}
