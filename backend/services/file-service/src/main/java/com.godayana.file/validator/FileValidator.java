// src/main/java/com/godayana/file/validator/FileValidator.java
package com.godayana.file.validator;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.file.config.StorageConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileValidator {

    private final StorageConfig storageConfig;

    /**
     * Validate file type against allowed types
     */
    public void validateFileType(String fileName, String fileType) {
        log.debug("Validating file type: {} for file: {}", fileType, fileName);

        if (fileType == null || fileType.isEmpty()) {
            log.warn("File type is null or empty");
            throw new BusinessException(
                    "File type is required",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        // Get allowed types from config
        String allowedImageTypesStr = storageConfig.getAllowedImageTypes();
        String allowedDocumentTypesStr = storageConfig.getAllowedDocumentTypes();

        if (allowedImageTypesStr == null || allowedDocumentTypesStr == null) {
            log.error("Allowed file types not configured properly");
            throw new BusinessException(
                    "File validation configuration error",
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }

        List<String> imageTypes = Arrays.stream(allowedImageTypesStr.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        List<String> documentTypes = Arrays.stream(allowedDocumentTypesStr.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        String normalizedFileType = fileType.toLowerCase().trim();

        boolean isValidImage = imageTypes.contains(normalizedFileType);
        boolean isValidDocument = documentTypes.contains(normalizedFileType);

        if (!isValidImage && !isValidDocument) {
            log.warn("Invalid file type: {} for file: {}", fileType, fileName);
            throw new BusinessException(
                    String.format("Invalid file type: '%s'. Allowed types: images (%s) or documents (%s)",
                            fileType,
                            storageConfig.getAllowedImageTypes(),
                            storageConfig.getAllowedDocumentTypes()),
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        log.debug("File type validated successfully: {}", fileType);
    }

    /**
     * Validate file size against max allowed size
     */
    public void validateFileSize(Long fileSize) {
        log.debug("Validating file size: {} bytes", fileSize);

        if (fileSize == null) {
            log.warn("File size is null");
            throw new BusinessException(
                    "File size is required",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        if (fileSize <= 0) {
            log.warn("File size is invalid: {}", fileSize);
            throw new BusinessException(
                    "File size must be greater than 0",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        Long maxFileSize = storageConfig.getMaxFileSize();
        if (maxFileSize == null || maxFileSize <= 0) {
            log.error("Max file size not configured properly");
            throw new BusinessException(
                    "File validation configuration error",
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }

        if (fileSize > maxFileSize) {
            long maxSizeInMB = maxFileSize / (1024 * 1024);
            long fileSizeInMB = fileSize / (1024 * 1024);
            log.warn("File size {} bytes ({} MB) exceeds limit {} bytes ({} MB)",
                    fileSize, fileSizeInMB, maxFileSize, maxSizeInMB);
            throw new BusinessException(
                    String.format("File size %d MB exceeds maximum allowed size of %d MB",
                            fileSizeInMB, maxSizeInMB),
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        log.debug("File size validated successfully: {} bytes", fileSize);
    }

    /**
     * Validate MultipartFile completely
     */
    public void validateFile(MultipartFile file) {
        log.debug("Validating file: {}", file != null ? file.getOriginalFilename() : "null");

        if (file == null) {
            log.warn("File is null");
            throw new BusinessException(
                    "File is required",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        if (file.isEmpty()) {
            log.warn("File is empty: {}", file.getOriginalFilename());
            throw new BusinessException(
                    "File is empty",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        // Validate file name
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            log.warn("File name is null or empty");
            throw new BusinessException(
                    "File name is required",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        // Validate file size
        validateFileSize(file.getSize());

        // Validate file type
        validateFileType(fileName, file.getContentType());

        log.info("File validated successfully: {} ({} bytes)", fileName, file.getSize());
    }

    /**
     * Validate image file specifically
     */
    public void validateImageFile(MultipartFile file) {
        validateFile(file);

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            log.warn("Not an image file: {}", contentType);
            throw new BusinessException(
                    "File must be an image (JPEG, PNG, WEBP, etc.)",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }
    }

    /**
     * Validate document file specifically (PDF, DOC, DOCX)
     */
    public void validateDocumentFile(MultipartFile file) {
        validateFile(file);

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new BusinessException(
                    "Invalid document file",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        boolean isValidDocument = contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        if (!isValidDocument) {
            log.warn("Not a valid document file: {}", contentType);
            throw new BusinessException(
                    "File must be a PDF, DOC, or DOCX document",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }
    }

    /**
     * Check if file is an image
     */
    public boolean isImageFile(MultipartFile file) {
        if (file == null || file.getContentType() == null) {
            return false;
        }
        return file.getContentType().startsWith("image/");
    }

    /**
     * Check if file is a document
     */
    public boolean isDocumentFile(MultipartFile file) {
        if (file == null || file.getContentType() == null) {
            return false;
        }
        String contentType = file.getContentType();
        return contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    /**
     * Get human-readable file size
     */
    public String getReadableFileSize(long size) {
        if (size <= 0) return "0 B";
        final String[] units = {"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return String.format("%.1f %s", size / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}