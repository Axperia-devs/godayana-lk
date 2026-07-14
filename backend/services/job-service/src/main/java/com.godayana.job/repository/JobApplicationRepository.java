package com.godayana.job.repository;

import com.godayana.job.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    Page<JobApplication> findByJobId(UUID jobId, Pageable pageable);

    Page<JobApplication> findBySeekerId(UUID seekerId, Pageable pageable);

    boolean existsBySeekerIdAndJobId(UUID seekerId, UUID jobId);

    long countByJobId(UUID jobId);

    long countByJobIdAndStatus(UUID jobId, JobApplication.ApplicationStatus status);
}