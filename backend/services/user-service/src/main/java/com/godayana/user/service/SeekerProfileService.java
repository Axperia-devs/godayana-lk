package com.godayana.user.service;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.user.dto.SeekerProfileRequest;
import com.godayana.user.dto.SeekerProfileResponse;
import com.godayana.user.entity.SeekerProfile;
import com.godayana.user.repository.SeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeekerProfileService {

    private final SeekerProfileRepository seekerProfileRepository;

    @Transactional
    public SeekerProfileResponse createProfile(UUID userId, SeekerProfileRequest request) {
        log.info("Creating seeker profile for user: {}", userId);

        if (seekerProfileRepository.existsByUserId(userId)) {
            throw new BusinessException(
                    "Profile already exists for this user",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
                    HttpStatus.SC_CONFLICT
            );
        }

        SeekerProfile profile = SeekerProfile.builder()
                .userId(userId)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .profilePicUrl(request.getProfilePicUrl())
                .resumeUrl(request.getResumeUrl())
                .skills(request.getSkills())
                .experienceYears(request.getExperienceYears())
                .education(request.getEducation())
                .studyField(request.getStudyField())
                .location(request.getLocation())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .nationality(request.getNationality())
                .employmentStatus(request.getEmploymentStatus())
                .currentJobTitle(request.getCurrentJobTitle())
                .currentSalary(request.getCurrentSalary())
                .expectedSalary(request.getExpectedSalary())
                .noticePeriod(request.getNoticePeriod())
                .portfolioUrl(request.getPortfolioUrl())
                .professionalSummary(request.getProfessionalSummary())
                .preferredJobCategories(request.getPreferredJobCategories())
                .shareCv(request.getShareCv() != null ? request.getShareCv() : true)
                .build();

        profile = seekerProfileRepository.save(profile);
        log.info("Seeker profile created successfully with id: {}", profile.getId());

        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public SeekerProfileResponse getProfileByUserId(UUID userId) {
        log.debug("Fetching seeker profile for user: {}", userId);

        SeekerProfile profile = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Seeker profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return mapToResponse(profile);
    }

    @Transactional
    public SeekerProfileResponse updateProfile(UUID userId, SeekerProfileRequest request) {
        log.info("Updating seeker profile for user: {}", userId);

        SeekerProfile profile = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Seeker profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        // Update fields
        if (request.getFullName() != null) profile.setFullName(request.getFullName());
        if (request.getEmail() != null) profile.setEmail(request.getEmail());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getProfilePicUrl() != null) profile.setProfilePicUrl(request.getProfilePicUrl());
        if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        if (request.getEducation() != null) profile.setEducation(request.getEducation());
        if (request.getStudyField() != null) profile.setStudyField(request.getStudyField());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getNationality() != null) profile.setNationality(request.getNationality());
        if (request.getEmploymentStatus() != null) profile.setEmploymentStatus(request.getEmploymentStatus());
        if (request.getCurrentJobTitle() != null) profile.setCurrentJobTitle(request.getCurrentJobTitle());
        if (request.getCurrentSalary() != null) profile.setCurrentSalary(request.getCurrentSalary());
        if (request.getExpectedSalary() != null) profile.setExpectedSalary(request.getExpectedSalary());
        if (request.getNoticePeriod() != null) profile.setNoticePeriod(request.getNoticePeriod());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getProfessionalSummary() != null) profile.setProfessionalSummary(request.getProfessionalSummary());
        if (request.getPreferredJobCategories() != null) profile.setPreferredJobCategories(request.getPreferredJobCategories());
        if (request.getShareCv() != null) profile.setShareCv(request.getShareCv());

        profile = seekerProfileRepository.save(profile);
        log.info("Seeker profile updated successfully for user: {}", userId);

        return mapToResponse(profile);
    }

    @Transactional
    public void deleteProfile(UUID userId) {
        log.info("Deleting seeker profile for user: {}", userId);
        seekerProfileRepository.deleteByUserId(userId);
    }

    @Transactional
    public void updateShareCvStatus(UUID userId, Boolean shareCv) {
        log.info("Updating share CV status for user: {} to {}", userId, shareCv);
        seekerProfileRepository.updateShareCvStatus(userId, shareCv);
    }

    private SeekerProfileResponse mapToResponse(SeekerProfile profile) {
        return SeekerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .profilePicUrl(profile.getProfilePicUrl())
                .resumeUrl(profile.getResumeUrl())
                .skills(profile.getSkills())
                .experienceYears(profile.getExperienceYears())
                .education(profile.getEducation())
                .studyField(profile.getStudyField())
                .location(profile.getLocation())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .nationality(profile.getNationality())
                .employmentStatus(profile.getEmploymentStatus())
                .currentJobTitle(profile.getCurrentJobTitle())
                .currentSalary(profile.getCurrentSalary())
                .expectedSalary(profile.getExpectedSalary())
                .noticePeriod(profile.getNoticePeriod())
                .portfolioUrl(profile.getPortfolioUrl())
                .professionalSummary(profile.getProfessionalSummary())
                .preferredJobCategories(profile.getPreferredJobCategories())
                .shareCv(profile.getShareCv())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}