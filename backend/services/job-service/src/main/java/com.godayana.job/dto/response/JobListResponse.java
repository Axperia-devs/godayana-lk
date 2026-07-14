package com.godayana.job.dto.response;

import com.godayana.dto.company.CompanyDetailsResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobListResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String jobTitle;
    private String location;
    private String type;
    private String employmentType;
    private String category;
    private String industry;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String status;
    private Integer applicationCount;
    private Integer viewCount;
    private Long postedHoursAgo;
    private LocalDateTime createdAt;

    private CompanyDetailsResponse company;
}