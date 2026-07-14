package com.godayana.job.service.interfaces;

import com.godayana.job.dto.request.JobRequest;
import com.godayana.job.dto.response.JobImageUploadResponse;
import com.godayana.job.dto.response.JobCountsResponse;
import com.godayana.job.dto.response.JobListResponse;
import com.godayana.job.dto.response.JobResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface IJobService {

    JobResponse createJob(UUID companyId, JobRequest request);

    JobResponse updateJob(UUID jobId, UUID companyId, JobRequest request);

    JobResponse getJobById(UUID jobId);

    JobResponse getCompanyJobById(UUID jobId);

    Page<JobListResponse> getAllJobs(String search, String location, String type,
                                     String employmentType, String category,
                                     String status, Pageable pageable);

    Page<JobListResponse> getJobsByCompany(UUID companyId, String status, Pageable pageable);

    Page<JobListResponse> getPendingJobs(Pageable pageable);

    JobResponse approveJob(UUID jobId, UUID adminId);

    JobResponse rejectJob(UUID jobId, UUID adminId, String reason);

    JobResponse closeJob(UUID jobId, UUID userId);

    void deleteJob(UUID jobId, UUID userId);

    void incrementViewCount(UUID jobId);

    void incrementApplicationCount(UUID jobId);

    Page<JobListResponse> getRecommendedJobs(UUID seekerId, Pageable pageable);

    Page<JobListResponse> searchJobs(String keyword, Pageable pageable);

    long countJobsByStatus(String status);

    long countJobsByCompany(UUID companyId);

    JobCountsResponse getJobCounts(UUID companyId);

    JobImageUploadResponse uploadJobImage(UUID companyId, MultipartFile file);
}