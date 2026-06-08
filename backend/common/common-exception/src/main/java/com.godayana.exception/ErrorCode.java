package com.godayana.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // Authentication & Authorization (1000-1999)
    UNAUTHORIZED("AUTH_1000", "Authentication required"),
    INVALID_TOKEN("AUTH_1001", "Invalid or expired token"),
    INVALID_CREDENTIALS("AUTH_1002", "Invalid email/phone or password"),
    ACCESS_DENIED("AUTH_1003", "Access denied"),
    ACCOUNT_LOCKED("AUTH_1004", "Account is locked"),
    ACCOUNT_DISABLED("AUTH_1005", "Account is disabled"),

    // Validation (2000-2999)
    VALIDATION_ERROR("VAL_2000", "Validation failed"),
    INVALID_INPUT("VAL_2001", "Invalid input provided"),
    INVALID_OTP("VAL_2002", "Invalid OTP provided"),
    MISSING_REQUIRED_FIELD("VAL_2002", "Required field is missing"),

    // Resource (3000-3999)
    RESOURCE_NOT_FOUND("RES_3000", "Resource not found"),
    DUPLICATE_RESOURCE("RES_3001", "Resource already exists"),
    RESOURCE_CONFLICT("RES_3002", "Resource conflict"),

    // Business Logic (4000-4999)
    BUSINESS_ERROR("BIZ_4000", "Business rule violation"),
    INSUFFICIENT_FUNDS("BIZ_4001", "Insufficient funds"),
    INVALID_STATUS_TRANSITION("BIZ_4002", "Invalid status transition"),

    // External Services (5000-5999)
    EXTERNAL_SERVICE_ERROR("EXT_5000", "External service error"),
    OTP_SEND_FAILED("EXT_5001", "Failed to send OTP"),
    OTP_VERIFICATION_FAILED("EXT_5002", "OTP verification failed"),
    PAYMENT_GATEWAY_ERROR("EXT_5003", "Payment gateway error"),

    // System (9000-9999)
    INTERNAL_ERROR("SYS_9000", "Internal server error"),
    DATABASE_ERROR("SYS_9001", "Database error"),
    RATE_LIMIT_EXCEEDED("SYS_9002", "Rate limit exceeded");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }
}