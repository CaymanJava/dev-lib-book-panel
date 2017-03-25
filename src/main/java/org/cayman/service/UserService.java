package org.cayman.service;


import lombok.extern.slf4j.Slf4j;
import org.cayman.model.User;
import org.cayman.repository.UserRepository;
import org.cayman.utils.LoggedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase());
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.toLowerCase());
        if (user == null) {
            throw new UsernameNotFoundException("User with email '" + email + "' is not found");
        }
        return new LoggedUser(user);
    }
}
