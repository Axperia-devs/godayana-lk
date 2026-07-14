package com.godayana.job.dto.response;

import com.godayana.job.entity.Job;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCountsResponse {
    long all;
    long pending;
    long approved;
    long rejected;
    long closed;
    long draft;
}

