package com.godayana.otp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "otp_codes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "identifier", nullable = false)
    private String identifier;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "purpose", nullable = false)
    private String purpose;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "verified")
    private Boolean verified = false;

    @Column(name = "attempts")
    private Integer attempts = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}