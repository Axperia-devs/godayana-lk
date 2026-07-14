package com.godayana.job.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {
    private UUID id;
    private UUID jobId;
    private String jobTitle;
    private UUID seekerId;
    private String seekerName;
    private String seekerEmail;
    private String coverLetter;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}