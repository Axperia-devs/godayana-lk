package com.godayana.user.service;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.ApiResponseWrapper;
import com.godayana.dto.FileUploadResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.user.dto.SeekerProfileRequest;
import com.godayana.user.dto.SeekerProfileResponse;
import com.godayana.user.entity.SeekerProfile;
import com.godayana.user.repository.SeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeekerProfileService {

    private final SeekerProfileRepository seekerProfileRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    @Value("${AUTH_SERVICE_URL}")
    private String authServiceUrl;

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
                .orElse(null);
//                .orElseThrow(() -> new BusinessException(
//                        "Seeker profile not found for user: " + userId,
//                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
//                        HttpStatus.SC_NOT_FOUND
//                ));

        // If profile doesn't exist, create a new one
        if (profile == null) {
            log.info("Profile not found for user: {}, creating new profile", userId);

            authNameUpdate(userId.toString(), request.getFullName());

            return createProfile(userId, request);
        }

        // Update fields
        if (request.getFullName() != null) profile.setFullName(request.getFullName());
        if (request.getEmail() != null) profile.setEmail(request.getEmail());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
//        if (request.getProfilePicUrl() != null) profile.setProfilePicUrl(request.getProfilePicUrl());
//        if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl());
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

//        webClientBuilder.build()
//                .post()
//                .uri(authServiceUrl + "/api/v1/auth/internal/update-name/" + userId + "?name=" + URLEncoder.encode(profile.getFullName(), StandardCharsets.UTF_8))
//                .contentType(MediaType.APPLICATION_JSON)
//                .retrieve()
//                .bodyToMono(Void.class)
//                .block();
        authNameUpdate(userId.toString(), profile.getFullName());

        log.info("Seeker profile updated successfully for user: {}", userId);

        return mapToResponse(profile);
    }

    private void authNameUpdate(String userId, String name) {
        webClientBuilder.build()
                .post()
                .uri(authServiceUrl + "/api/v1/auth/internal/update-name/" + userId + "?name=" + URLEncoder.encode(name, StandardCharsets.UTF_8))
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
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
        String profilePicUrl = getPresignedUrlFromFileService(profile.getProfilePicUrl());
        String resumeUrl = getPresignedUrlFromFileService(profile.getResumeUrl());

        return SeekerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .profilePicUrl(profilePicUrl)
                .resumeUrl(resumeUrl)
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

    private String getPresignedUrlFromFileService(String fileKey) {
        try {
            Map<String, String> requestBody = Map.of("fileKey", fileKey);

            ApiResponse<String> response = webClientBuilder.build()
                    .post()
                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-url")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<String>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }

            log.error("Failed to get presigned URL: {}", response != null ? response.getMessage() : "Unknown error");
            return null;
        } catch (Exception e) {
            log.error("Failed to get presigned URL", e);
            return null;
        }
    }

    @Transactional
    public SeekerProfileResponse uploadProfilePic(UUID userId, MultipartFile file) {
        log.info("Uploading profile picture for user: {}", userId);

        // Get profile
        SeekerProfile profile = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Seeker profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        try {
            // Call file service to upload
            String fileKey = uploadProfilePicToFileService(file, "seeker-profile-pics", userId.toString());
            //log.info("Received file URL from file service: {}", fileKey); // Add this log

            // Update profile with new URL
            profile.setProfilePicUrl(fileKey);
            profile = seekerProfileRepository.save(profile);

            //log.info("Profile picture updated successfully for user: {}", userId);
            return mapToResponse(profile);

        } catch (Exception e) {
            //log.error("Failed to upload profile picture for user: {}", userId, e);
            throw new BusinessException(
                    "Failed to upload profile picture: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    @Transactional
    public SeekerProfileResponse uploadResume(UUID userId, MultipartFile file) {
        log.info("Uploading resume for user: {}", userId);

        // Get profile
        SeekerProfile profile = seekerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Seeker profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        try {
            // Call file service to upload
            String fileKey = uploadResumeToFileService(file, "resumes", userId.toString(), profile.getFullName());

            // Update profile with new URL
            profile.setResumeUrl(fileKey);
            profile = seekerProfileRepository.save(profile);

            log.info("Resume updated successfully for user: {}", userId);
            return mapToResponse(profile);

        } catch (Exception e) {
            log.error("Failed to upload resume for user: {}", userId, e);
            throw new BusinessException(
                    "Failed to upload resume: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private String uploadProfilePicToFileService(MultipartFile file, String folder, String userId) {
        try {
            // Create multipart body
            MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            multipartBody.add("file", resource);

            // Use INTERNAL endpoint - this doesn't require X-User-Id header
            String internalUrl = fileServiceUrl + "/api/v1/files/internal/upload/profile-pic?folder=" + folder + "&userId=" + userId;

            ApiResponseWrapper<FileUploadResponse> responseWrapper = webClientBuilder.build()
                    .post()
                    .uri(internalUrl)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(multipartBody))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponseWrapper<FileUploadResponse>>() {})
                    .block();

            if (responseWrapper == null) {
                log.error("Response from file service is null");
                throw new BusinessException(
                        "No response from file service",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            if (!responseWrapper.getSuccess()) {
                log.error("File service returned error: {}", responseWrapper.getMessage());
                throw new BusinessException(
                        "File service error: " + responseWrapper.getMessage(),
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            FileUploadResponse data = responseWrapper.getData();
            if (data == null) {
                log.error("File service response data is null");
                throw new BusinessException(
                        "No data in file service response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            String fileKey = data.getFileKey();
            log.info("File uploaded successfully. FileId: {}, FileUrl: {}",
                    data.getFileId(), fileKey);

            if (fileKey == null || fileKey.isEmpty()) {
                throw new BusinessException(
                        "File URL not found in response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            return fileKey;

        } catch (IOException e) {
            log.error("Failed to read file bytes", e);
            throw new BusinessException(
                    "Failed to read file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        } catch (Exception e) {
            log.error("Failed to upload file to file service", e);
            throw new BusinessException(
                    "Failed to upload file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private String uploadResumeToFileService(MultipartFile file, String folder, String userId, String userName) {
        try {
            // Get the original file extension
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // Create new filename: userName_CV_date.extension
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String newFileName = userName + "_CV_" + dateStr + fileExtension;

            // Read the file bytes
            byte[] fileBytes = file.getBytes();

            // Create multipart body with renamed file
            MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return newFileName;
                }
            };
            multipartBody.add("file", resource);

            // Use INTERNAL endpoint - this doesn't require X-User-Id header
            String internalUrl = fileServiceUrl + "/api/v1/files/internal/upload/resume?folder=" + folder + "&userId=" + userId;

            ApiResponseWrapper<FileUploadResponse> responseWrapper = webClientBuilder.build()
                    .post()
                    .uri(internalUrl)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(multipartBody))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponseWrapper<FileUploadResponse>>() {})
                    .block();

            if (responseWrapper == null) {
                log.error("Response from file service is null");
                throw new BusinessException(
                        "No response from file service",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            if (!responseWrapper.getSuccess()) {
                log.error("File service returned error: {}", responseWrapper.getMessage());
                throw new BusinessException(
                        "File service error: " + responseWrapper.getMessage(),
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            FileUploadResponse data = responseWrapper.getData();
            if (data == null) {
                log.error("File service response data is null");
                throw new BusinessException(
                        "No data in file service response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            String fileKey = data.getFileKey();
            log.info("File uploaded successfully. FileId: {}, FileUrl: {}",
                    data.getFileId(), fileKey);

            if (fileKey == null || fileKey.isEmpty()) {
                throw new BusinessException(
                        "File Id not found in response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            return fileKey;

        } catch (IOException e) {
            log.error("Failed to read file bytes", e);
            throw new BusinessException(
                    "Failed to read file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        } catch (Exception e) {
            log.error("Failed to upload file to file service", e);
            throw new BusinessException(
                    "Failed to upload file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

}