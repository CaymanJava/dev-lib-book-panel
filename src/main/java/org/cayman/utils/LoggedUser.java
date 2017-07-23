package org.cayman.utils;

import org.cayman.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.EnumSet;

public class LoggedUser extends org.springframework.security.core.userdetails.User {
    private final User user;

    public LoggedUser(User user){
        super(user.getEmail(), user.getPassword(), user.isEnabled(),
                true, true, true, EnumSet.of(user.getRole()));
        this.user = user;
    }

    public static LoggedUser get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return null;
        }
        Object user = auth.getPrincipal();
        return (user instanceof LoggedUser) ? (LoggedUser) user : null;
    }

    public boolean checkPassword(String password) {
        return user != null && password.equals(user.getPassword());
    }

    public static int id() {
        try {
            return get().user.getId();
        } catch (Exception e) {
            // NullPointerException is a normal situation, if user doesn't login.
            return 0;
        }
    }

    @Override
    public String toString() {
        return user.toString();
    }
}
