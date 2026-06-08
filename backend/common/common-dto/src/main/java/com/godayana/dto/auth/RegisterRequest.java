package com.godayana.dto.auth;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "role", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = SeekerRegisterRequest.class, name = "seeker"),
    @JsonSubTypes.Type(value = CompanyRegisterRequest.class, name = "company")
})
public class RegisterRequest {
    private String role;
    private String phone;
    private String password;
}

@Data
class SeekerRegisterRequest extends RegisterRequest {
    private String fullName;
    private String email;
}

@Data
class CompanyRegisterRequest extends RegisterRequest {
    private String companyName;
    private String contactPerson;
    private String designation;
    private String email;
}