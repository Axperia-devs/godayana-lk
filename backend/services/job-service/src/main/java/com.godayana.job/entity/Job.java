package com.godayana.job.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "category")
    private String category;

    @Column(name = "location")
    private String location;

    @Column(name = "salary_min")
    private BigDecimal salaryMin;

    @Column(name = "salary_max")
    private BigDecimal salaryMax;

    @Column(name = "salary_negotiable")
    private Boolean salaryNegotiable;

    @Column(name = "education_level")
    private String educationLevel;

    @Column(name = "min_experience")
    private String minExperience;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(name = "field_of_study")
    private String fieldOfStudy;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;

//    @Column(name = "working_hours")
//    private String workingHours;

    @Column(name = "working_hours_start")
    private LocalTime workingHoursStart;

    @Column(name = "working_hours_end")
    private LocalTime workingHoursEnd;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "application_deadline")
    private LocalDateTime applicationDeadline;

    @Column(name = "confirmation_email")
    private String confirmationEmail;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private JobType type;

    @Column(name = "skills")
    private String[] skills;

    @Column(name = "description_image_url")
    private String descriptionImageUrl;

    @Column(name = "cv_delivery_option")
    @Enumerated(EnumType.STRING)
    private CvDeliveryOption cvDeliveryOption;

    // Store matching criteria as JSON string (will be converted in service)
    @Column(name = "matching_criteria", columnDefinition = "jsonb")
    private String matchingCriteria;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Column(name = "view_count")
    private Integer viewCount;

    @Column(name = "application_count")
    private Integer applicationCount;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Inner class for Matching Criteria
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchingCriteria {
        private boolean skills;
        private boolean experience;
        private boolean education;
        private boolean location;
    }

    public enum JobType {
        local, overseas
    }

    public enum JobStatus {
        PENDING, APPROVED, REJECTED, CLOSED, DRAFT
    }

    public enum CvDeliveryOption {
        direct, matched
    }
}