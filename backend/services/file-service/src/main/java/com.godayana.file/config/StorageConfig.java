// src/main/java/com/godayana/file/config/StorageConfig.java
package com.godayana.file.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "storage")
public class StorageConfig {
    private String bucketName;
    private String region;
    private String endpoint;
    private String accessKey;
    private String secretKey;
    private Long presignedUrlExpiryMinutes = 15L;
    private Long maxFileSize = 5242880L; // 5MB
    private String allowedImageTypes = "image/jpeg,image/png,image/webp";
    private String allowedDocumentTypes = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
}