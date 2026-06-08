package com.godayana.otp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpRequest {
    @NotBlank(message = "Identifier is required")
    private String identifier;
    
    @NotBlank(message = "Channel is required")
    private String channel; // SMS, EMAIL
    
    @NotBlank(message = "Purpose is required")
    private String purpose; // REGISTRATION, LOGIN, PASSWORD_RESET
}