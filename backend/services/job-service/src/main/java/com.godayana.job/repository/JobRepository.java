package com.godayana.job.repository;

import com.godayana.job.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {

    Page<Job> findByCompanyId(UUID companyId, Pageable pageable);

    Page<Job> findByCompanyIdAndStatus(UUID companyId, Job.JobStatus status, Pageable pageable);

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE " +
            "(:search IS NULL OR LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(j.jobDescription) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:type IS NULL OR j.type = :type) AND " +
            "(:employmentType IS NULL OR LOWER(j.employmentType) = LOWER(:employmentType)) AND " +
            "(:category IS NULL OR LOWER(j.category) = LOWER(:category)) AND " +
            "(:status IS NULL OR j.status = :status)")
    Page<Job> searchJobs(@Param("search") String search,
                         @Param("location") String location,
                         @Param("type") String type,
                         @Param("employmentType") String employmentType,
                         @Param("category") String category,
                         @Param("status") String status,
                         Pageable pageable);

    @Query("SELECT j FROM Job j WHERE LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.jobDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Job> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Job j SET j.viewCount = j.viewCount + 1 WHERE j.id = :jobId")
    void incrementViewCount(@Param("jobId") UUID jobId);

    @Modifying
    @Transactional
    @Query("UPDATE Job j SET j.applicationCount = j.applicationCount + 1 WHERE j.id = :jobId")
    void incrementApplicationCount(@Param("jobId") UUID jobId);

    long countByStatus(Job.JobStatus status);

    long countByCompanyId(UUID companyId);

    // Add this method
    @Query("SELECT COUNT(j) FROM Job j WHERE j.companyId = :companyId AND j.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") UUID companyId, @Param("status") Job.JobStatus status);
}