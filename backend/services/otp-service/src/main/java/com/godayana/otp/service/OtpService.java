package com.godayana.otp.service;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.otp.dto.SendOtpRequest;
import com.godayana.otp.dto.VerifyOtpRequest;
import com.godayana.otp.entity.OtpCode;
import com.godayana.otp.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;

    @Value("${otp.length:4}")
    private int otpLength;

    @Value("${otp.expiration-minutes:5}")
    private int expirationMinutes;

    @Value("${otp.max-attempts:3}")
    private int maxAttempts;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void sendOtp(SendOtpRequest request) {
        String otpCode = generateOtp();
        
        // Delete old unverified OTPs for this identifier
        otpRepository.findTopByIdentifierAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                request.getIdentifier(), request.getPurpose()
        ).ifPresent(otpRepository::delete);

        // Save new OTP
        OtpCode otp = OtpCode.builder()
                .identifier(request.getIdentifier())
                .code(otpCode)
                .purpose(request.getPurpose())
                .expiresAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                .verified(false)
                .attempts(0)
                .createdAt(LocalDateTime.now())
                .build();
        
        otpRepository.save(otp);

        // Send via appropriate channel
        if ("SMS".equalsIgnoreCase(request.getChannel())) {
            sendSms(request.getIdentifier(), otpCode);
        } else if ("EMAIL".equalsIgnoreCase(request.getChannel())) {
            sendEmail(request.getIdentifier(), otpCode);
        }
        
        log.info("OTP sent to {} for purpose: {}", request.getIdentifier(), request.getPurpose());
    }

    //@Transactional
    public boolean verifyOtp(VerifyOtpRequest request) {
        OtpCode otp = otpRepository.findTopByIdentifierAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                request.getIdentifier(), request.getPurpose()
        ).orElseThrow(() -> new BusinessException(
                "OTP not found or already verified",
                ErrorCode.VALIDATION_ERROR.getCode(),
                HttpStatus.SC_OK
        ));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otp);
            throw new BusinessException(
                    "OTP has expired",
                    ErrorCode.INVALID_OTP.getCode(),
                    HttpStatus.SC_OK
            );
        }

        if (otp.getAttempts() >= maxAttempts) {
            otpRepository.delete(otp);
            throw new BusinessException(
                    "Maximum attempts exceeded",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_OK
            );
        }

        otp.setAttempts(otp.getAttempts() + 1);
        
        if (otp.getCode().equals(request.getCode())) {
            otp.setVerified(true);
            otpRepository.save(otp);
            log.info("OTP verified successfully for: {}", request.getIdentifier());
            return true;
        }

        System.out.println("OTP attempt: " + otp.getAttempts());
        otpRepository.save(otp);

        throw new BusinessException(
                "Invalid OTP code",
                ErrorCode.INVALID_OTP.getCode(),
                HttpStatus.SC_OK
        );
    }

    private String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }

    private void sendSms(String phoneNumber, String otpCode) {
        // TODO: Integrate with actual SMS provider (Twilio, etc.)
        log.info("SMS to {}: Your verification code is: {}", phoneNumber, otpCode);
        
        // For development, just log. In production, integrate with SMS API.
        System.out.println("========== SMS OTP ==========");
        System.out.println("To: " + phoneNumber);
        System.out.println("OTP: " + otpCode);
        System.out.println("============================");
    }

    private void sendEmail(String email, String otpCode) {
        if (fromEmail == null || fromEmail.isEmpty()) {
            log.info("Email to {}: Your verification code is: {}", email, otpCode);
            System.out.println("========== EMAIL OTP ==========");
            System.out.println("To: " + email);
            System.out.println("OTP: " + otpCode);
            System.out.println("==============================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("GoDayana - Email Verification Code");
            message.setText("Your verification code is: " + otpCode + "\n\nThis code will expire in " + expirationMinutes + " minutes.\n\nIf you didn't request this, please ignore this email.");
            mailSender.send(message);
            log.info("Email OTP sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
            // Fallback to logging
            System.out.println("Email OTP for " + email + ": " + otpCode);
        }
    }

    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
        log.info("Cleaned up expired OTPs");
    }
}