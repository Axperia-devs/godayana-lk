// src/main/java/com/godayana/file/dto/PresignedUrlResponse.java
package com.godayana.file.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlResponse {
    private String uploadUrl;
    private String fileUrl;
    private String fileId;
    private String fileName;
    private String folder;
}