package com.godayana.job.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.job.dto.request.JobApplicationRequest;
import com.godayana.job.dto.response.JobApplicationResponse;
import com.godayana.job.service.interfaces.IJobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Slf4j
public class JobApplicationController {

    private final IJobApplicationService jobApplicationService;

    @PostMapping
    public ApiResponse<JobApplicationResponse> applyForJob(
            @RequestHeader("X-User-Id") String seekerId,
            @Valid @RequestBody JobApplicationRequest request) {
        log.info("Applying for job: {} by seeker: {}", request.getJobId(), seekerId);
        return ApiResponse.success(jobApplicationService.applyForJob(UUID.fromString(seekerId), request));
    }

    @GetMapping("/job/{jobId}")
    public ApiResponse<Page<JobApplicationResponse>> getApplicationsByJob(
            @RequestHeader("X-User-Id") String companyId,
            @PathVariable UUID jobId,
            Pageable pageable) {
        log.info("Fetching applications for job: {} by company: {}", jobId, companyId);
        return ApiResponse.success(jobApplicationService.getApplicationsByJob(jobId,
                UUID.fromString(companyId), pageable));
    }

    @GetMapping("/me")
    public ApiResponse<Page<JobApplicationResponse>> getMyApplications(
            @RequestHeader("X-User-Id") String seekerId,
            Pageable pageable) {
        log.info("Fetching applications for seeker: {}", seekerId);
        return ApiResponse.success(jobApplicationService.getApplicationsBySeeker(
                UUID.fromString(seekerId), pageable));
    }

    @GetMapping("/{applicationId}")
    public ApiResponse<JobApplicationResponse> getApplicationById(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID applicationId) {
        log.info("Fetching application: {} by user: {}", applicationId, userId);
        return ApiResponse.success(jobApplicationService.getApplicationById(applicationId));
    }

    @PutMapping("/{applicationId}/status")
    public ApiResponse<JobApplicationResponse> updateApplicationStatus(
            @RequestHeader("X-User-Id") String companyId,
            @PathVariable UUID applicationId,
            @RequestParam String status) {
        log.info("Updating application: {} status to: {} by company: {}",
                applicationId, status, companyId);
        return ApiResponse.success(jobApplicationService.updateApplicationStatus(
                applicationId, UUID.fromString(companyId), status));
    }

    @DeleteMapping("/{applicationId}")
    public ApiResponse<Void> withdrawApplication(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID applicationId) {
        log.info("Withdrawing application: {} by seeker: {}", applicationId, seekerId);
        jobApplicationService.withdrawApplication(applicationId, UUID.fromString(seekerId));
        return ApiResponse.success(null);
    }

    @GetMapping("/check")
    public ApiResponse<Boolean> hasApplied(
            @RequestHeader("X-User-Id") String seekerId,
            @RequestParam UUID jobId) {
        log.info("Checking if seeker: {} has applied for job: {}", seekerId, jobId);
        return ApiResponse.success(jobApplicationService.hasApplied(
                UUID.fromString(seekerId), jobId));
    }
}