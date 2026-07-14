package com.godayana.job.service.impl;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.job.dto.request.JobApplicationRequest;
import com.godayana.job.dto.response.JobApplicationResponse;
import com.godayana.job.entity.Job;
import com.godayana.job.entity.JobApplication;
import com.godayana.job.repository.JobApplicationRepository;
import com.godayana.job.repository.JobRepository;
import com.godayana.job.service.interfaces.IJobApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobApplicationServiceImpl implements IJobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional
    public JobApplicationResponse applyForJob(UUID seekerId, JobApplicationRequest request) {
        log.info("Applying for job: {} by seeker: {}", request.getJobId(), seekerId);

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        if (job.getStatus() != Job.JobStatus.APPROVED) {
            throw new BusinessException("Job is not open for applications",
                    ErrorCode.BUSINESS_ERROR.getCode(), 400);
        }

        if (jobApplicationRepository.existsBySeekerIdAndJobId(seekerId, request.getJobId())) {
            throw new BusinessException("You have already applied for this job",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(), 409);
        }

        JobApplication application = JobApplication.builder()
                .jobId(request.getJobId())
                .seekerId(seekerId)
                .coverLetter(request.getCoverLetter())
                .status(JobApplication.ApplicationStatus.PENDING)
                .createdBy(seekerId)
                .build();

        application = jobApplicationRepository.save(application);
        jobRepository.incrementApplicationCount(request.getJobId());

        return mapToResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getApplicationsByJob(UUID jobId, UUID companyId, Pageable pageable) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to view these applications",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        return jobApplicationRepository.findByJobId(jobId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getApplicationsBySeeker(UUID seekerId, Pageable pageable) {
        return jobApplicationRepository.findBySeekerId(seekerId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationResponse getApplicationById(UUID applicationId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        return mapToResponse(application);
    }

    @Override
    @Transactional
    public JobApplicationResponse updateApplicationStatus(UUID applicationId, UUID companyId, String status) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        JobApplication finalApplication = application;
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", finalApplication.getJobId()));

        if (!job.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to update this application",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        application.setStatus(JobApplication.ApplicationStatus.valueOf(status));
        application = jobApplicationRepository.save(application);

        return mapToResponse(application);
    }

    @Override
    @Transactional
    public void withdrawApplication(UUID applicationId, UUID seekerId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!application.getSeekerId().equals(seekerId)) {
            throw new BusinessException("You don't have permission to withdraw this application",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        jobApplicationRepository.delete(application);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasApplied(UUID seekerId, UUID jobId) {
        return jobApplicationRepository.existsBySeekerIdAndJobId(seekerId, jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countApplicationsByJob(UUID jobId) {
        return jobApplicationRepository.countByJobId(jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countApplicationsByJobAndStatus(UUID jobId, String status) {
        return jobApplicationRepository.countByJobIdAndStatus(jobId,
                JobApplication.ApplicationStatus.valueOf(status));
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJobId())
                .seekerId(application.getSeekerId())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus() != null ? application.getStatus().toString() : null)
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}