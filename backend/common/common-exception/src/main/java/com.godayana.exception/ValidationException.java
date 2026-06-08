package com.godayana.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ValidationException extends BusinessException {
    private final Map<String, String> validationErrors;

    public ValidationException(String message, Map<String, String> validationErrors) {
        super(message, "VALIDATION_ERROR", 422);
        this.validationErrors = validationErrors;
    }

    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR", 422);
        this.validationErrors = null;
    }
}