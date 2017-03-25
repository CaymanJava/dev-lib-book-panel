package org.cayman.exception;


import org.jetbrains.annotations.NonNls;

public class UserAlreadyExistException extends RuntimeException{
    public UserAlreadyExistException(@NonNls String message) {
        super(message);
    }
}
