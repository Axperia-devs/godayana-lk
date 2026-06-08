package com.godayana.auth.service;

import com.godayana.auth.entity.RefreshToken;
import com.godayana.auth.entity.User;
import com.godayana.auth.repository.RefreshTokenRepository;
import com.godayana.auth.repository.UserRepository;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration:604800000}")
    private Long refreshExpirationMs;

    @Transactional
    public String createRefreshToken(User user) {
        // Revoke existing tokens
        refreshTokenRepository.findByUserAndRevokedFalse(user)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusNanos(refreshExpirationMs * 1_000_000))
                .revoked(false)
                .createdAt(LocalDateTime.now())
                .build();

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    public String validateAndGetUserId(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException(
                        "Invalid refresh token",
                        ErrorCode.INVALID_TOKEN.getCode(),
                        HttpStatus.SC_BAD_REQUEST
                ));

        if (refreshToken.getRevoked()) {
            throw new BusinessException(
                    "Refresh token revoked",
                    ErrorCode.INVALID_TOKEN.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(
                    "Refresh token expired",
                    ErrorCode.INVALID_TOKEN.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        return refreshToken.getUser().getId().toString();
    }

    @Transactional
    public void revokeRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}