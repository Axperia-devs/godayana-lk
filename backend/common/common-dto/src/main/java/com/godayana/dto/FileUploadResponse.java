// src/main/java/com/godayana/dto/FileUploadResponse.java
package com.godayana.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String fileId;
    private String fileUrl;
    private String fileKey;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String folder;
    private String status;
    private String createdAt;
    private String uploadedAt;
}