package com.godayana.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(seeker|company)$", message = "Role must be 'seeker' or 'company'")
    private String role;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[A-Z]).{6,}$", 
             message = "Password must be at least 6 characters with 1 uppercase and 1 number")
    private String password;
    
    // Seeker fields
    private String fullName;
    
    // Company fields
    private String email;
    private String companyName;
    private String contactPerson;
    private String designation;
}