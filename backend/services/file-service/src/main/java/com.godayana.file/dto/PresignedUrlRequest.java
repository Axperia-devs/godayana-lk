// src/main/java/com/godayana/file/dto/PresignedUrlRequest.java
package com.godayana.file.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PresignedUrlRequest {
    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name too long")
    private String fileName;
    
    @NotBlank(message = "File type is required")
    private String fileType;
    
    private String folder = "uploads";
}
