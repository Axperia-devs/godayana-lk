package com.godayana.exception;

public class UnauthorizedException extends BusinessException {

    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED", 401);
    }

    public UnauthorizedException() {
        super("Authentication required", "UNAUTHORIZED", 401);
    }
}