// src/main/java/com/godayana/file/dto/FileUploadResponse.java
package com.godayana.file.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String fileId;
    private String fileKey;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String folder;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime uploadedAt;
}