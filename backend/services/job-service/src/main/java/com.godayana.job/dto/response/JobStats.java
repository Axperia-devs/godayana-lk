package com.godayana.job.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobStats {
    private long totalApproved;
    private long totalPending;
    private long totalRejected;
    private long totalClosed;
    private long totalDraft;
}
