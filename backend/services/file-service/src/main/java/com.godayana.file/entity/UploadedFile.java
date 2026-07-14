// src/main/java/com/godayana/file/entity/UploadedFile.java
package com.godayana.file.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "uploaded_files")
public class UploadedFile {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false)
    private String folder;

    @Column(nullable = false, unique = true)
    private String fileKey;

    @Column(nullable = false)
    private String uploaderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime uploadedAt;

    private LocalDateTime deletedAt;

    public enum FileStatus {
        PENDING,
        UPLOADED,
        FAILED,
        DELETED
    }
}