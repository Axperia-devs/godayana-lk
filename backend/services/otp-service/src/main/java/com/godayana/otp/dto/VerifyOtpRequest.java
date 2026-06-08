package com.godayana.otp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyOtpRequest {
    @NotBlank(message = "Identifier is required")
    private String identifier;
    
    @NotBlank(message = "OTP code is required")
    private String code;
    
    @NotBlank(message = "Purpose is required")
    private String purpose;
}