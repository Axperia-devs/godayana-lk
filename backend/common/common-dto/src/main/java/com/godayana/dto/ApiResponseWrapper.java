// src/main/java/com/godayana/dto/ApiResponseWrapper.java
package com.godayana.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseWrapper<T> {
    private Boolean success;
    private String message;
    private T data;
    private String errorCode;
    private Long timestamp;
}