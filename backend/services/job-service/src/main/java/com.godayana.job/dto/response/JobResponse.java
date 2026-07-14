package com.godayana.job.dto.response;

import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.job.dto.request.JobRequest;
import com.godayana.job.entity.Job;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String jobTitle;
    private String category;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Boolean salaryNegotiable;
    private String educationLevel;
    private String minExperience;
    private String employmentType;
    private String fieldOfStudy;
    private Integer minAge;
    private Integer maxAge;
    private String jobDescription;
//    private String workingHours;
    private LocalTime startTime;
    private LocalTime endTime;
    private String benefits;
    private LocalDateTime applicationDeadline;
    private String confirmationEmail;
    private String type;
    private List<String> skills;
    private String descriptionImageUrl;
    private String descriptionImageFileKey;
    private String status;
    private Integer viewCount;
    private Integer applicationCount;
    private Long postedHoursAgo;
    private String cvDeliveryOption;
    private Job.MatchingCriteria matchingCriteria;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private CompanyDetailsResponse company;
}