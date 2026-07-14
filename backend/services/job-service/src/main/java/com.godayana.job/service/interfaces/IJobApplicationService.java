package com.godayana.job.service.interfaces;

import com.godayana.job.dto.request.JobApplicationRequest;
import com.godayana.job.dto.response.JobApplicationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IJobApplicationService {

    JobApplicationResponse applyForJob(UUID seekerId, JobApplicationRequest request);

    Page<JobApplicationResponse> getApplicationsByJob(UUID jobId, UUID companyId, Pageable pageable);

    Page<JobApplicationResponse> getApplicationsBySeeker(UUID seekerId, Pageable pageable);

    JobApplicationResponse getApplicationById(UUID applicationId);

    JobApplicationResponse updateApplicationStatus(UUID applicationId, UUID companyId, String status);

    void withdrawApplication(UUID applicationId, UUID seekerId);

    boolean hasApplied(UUID seekerId, UUID jobId);

    long countApplicationsByJob(UUID jobId);

    long countApplicationsByJobAndStatus(UUID jobId, String status);
}