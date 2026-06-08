package com.godayana.exception;

public class ForbiddenException extends BusinessException {

    public ForbiddenException(String message) {
        super(message, "FORBIDDEN", 403);
    }

    public ForbiddenException() {
        super("Access denied", "FORBIDDEN", 403);
    }
}