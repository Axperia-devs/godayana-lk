package com.godayana.user.service;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.user.dto.CompanyProfileRequest;
import com.godayana.user.dto.CompanyProfileResponse;
import com.godayana.user.entity.CompanyProfile;
import com.godayana.user.repository.CompanyProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyProfileService {

    private final CompanyProfileRepository companyProfileRepository;

    @Transactional
    public CompanyProfileResponse createProfile(UUID userId, CompanyProfileRequest request) {
        log.info("Creating company profile for user: {}", userId);

        if (companyProfileRepository.existsByUserId(userId)) {
            throw new BusinessException(
                    "Profile already exists for this user",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
                    HttpStatus.SC_CONFLICT
            );
        }

        CompanyProfile profile = CompanyProfile.builder()
                .userId(userId)
                .companyName(request.getCompanyName())
                .registrationNumber(request.getRegistrationNumber())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .companyType(request.getCompanyType())
                .employeeCount(request.getEmployeeCount())
                .location(request.getLocation())
                .companyEmail(request.getCompanyEmail())
                .hotlineNumber(request.getHotlineNumber())
                .facebookUrl(request.getFacebookUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .instagramUrl(request.getInstagramUrl())
                .contactPersonName(request.getContactPersonName())
                .designation(request.getDesignation())
                .cvDeliveryEmail(request.getCvDeliveryEmail())
                .isVerified(false)
                .status(CompanyProfile.CompanyStatus.PENDING)
                .build();

        profile = companyProfileRepository.save(profile);
        log.info("Company profile created successfully with id: {}, status: PENDING", profile.getId());

        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public CompanyProfileResponse getProfileByUserId(UUID userId) {
        log.debug("Fetching company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public Page<CompanyProfileResponse> getPendingApprovals(Pageable pageable) {
        log.debug("Fetching pending company approvals");

        return companyProfileRepository.findByStatus(CompanyProfile.CompanyStatus.PENDING, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<CompanyProfileResponse> getUnverifiedCompanies() {
        log.debug("Fetching unverified companies");

        return companyProfileRepository.findByIsVerifiedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CompanyProfileResponse updateProfile(UUID userId, CompanyProfileRequest request) {
        log.info("Updating company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        // Update fields
        if (request.getCompanyName() != null) profile.setCompanyName(request.getCompanyName());
        if (request.getRegistrationNumber() != null) profile.setRegistrationNumber(request.getRegistrationNumber());
        if (request.getWebsite() != null) profile.setWebsite(request.getWebsite());
        if (request.getLogoUrl() != null) profile.setLogoUrl(request.getLogoUrl());
        if (request.getDescription() != null) profile.setDescription(request.getDescription());
        if (request.getIndustry() != null) profile.setIndustry(request.getIndustry());
        if (request.getCompanyType() != null) profile.setCompanyType(request.getCompanyType());
        if (request.getEmployeeCount() != null) profile.setEmployeeCount(request.getEmployeeCount());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());
        if (request.getCompanyEmail() != null) profile.setCompanyEmail(request.getCompanyEmail());
        if (request.getHotlineNumber() != null) profile.setHotlineNumber(request.getHotlineNumber());
        if (request.getFacebookUrl() != null) profile.setFacebookUrl(request.getFacebookUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getInstagramUrl() != null) profile.setInstagramUrl(request.getInstagramUrl());
        if (request.getContactPersonName() != null) profile.setContactPersonName(request.getContactPersonName());
        if (request.getDesignation() != null) profile.setDesignation(request.getDesignation());
        if (request.getCvDeliveryEmail() != null) profile.setCvDeliveryEmail(request.getCvDeliveryEmail());

        profile = companyProfileRepository.save(profile);
        log.info("Company profile updated successfully for user: {}", userId);

        return mapToResponse(profile);
    }

    @Transactional
    public CompanyProfileResponse approveCompany(UUID userId) {
        log.info("Approving company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        profile.setStatus(CompanyProfile.CompanyStatus.APPROVED);
        profile.setIsVerified(true);
        profile = companyProfileRepository.save(profile);

        log.info("Company profile approved for user: {}", userId);
        return mapToResponse(profile);
    }

    @Transactional
    public CompanyProfileResponse suspendCompany(UUID userId, String reason) {
        log.info("Suspending company profile for user: {}, reason: {}", userId, reason);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        profile.setStatus(CompanyProfile.CompanyStatus.SUSPENDED);
        profile = companyProfileRepository.save(profile);

        log.info("Company profile suspended for user: {}", userId);
        return mapToResponse(profile);
    }

    @Transactional
    public void deleteProfile(UUID userId) {
        log.info("Deleting company profile for user: {}", userId);
        companyProfileRepository.deleteByUserId(userId);
    }

    private CompanyProfileResponse mapToResponse(CompanyProfile profile) {
        return CompanyProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .registrationNumber(profile.getRegistrationNumber())
                .website(profile.getWebsite())
                .logoUrl(profile.getLogoUrl())
                .description(profile.getDescription())
                .industry(profile.getIndustry())
                .companyType(profile.getCompanyType())
                .employeeCount(profile.getEmployeeCount())
                .location(profile.getLocation())
                .companyEmail(profile.getCompanyEmail())
                .hotlineNumber(profile.getHotlineNumber())
                .facebookUrl(profile.getFacebookUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .instagramUrl(profile.getInstagramUrl())
                .contactPersonName(profile.getContactPersonName())
                .designation(profile.getDesignation())
                .cvDeliveryEmail(profile.getCvDeliveryEmail())
                .isVerified(profile.getIsVerified())
                .status(profile.getStatus().toString())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}