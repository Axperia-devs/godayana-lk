package com.godayana.user.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.user.dto.CompanyProfileRequest;
import com.godayana.user.dto.CompanyProfileResponse;
import com.godayana.user.service.CompanyProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/company/profiles")
@RequiredArgsConstructor
public class CompanyProfileController {

    private final CompanyProfileService companyProfileService;

    @GetMapping("/me")
    public ApiResponse<CompanyProfileResponse> getMyProfile(@RequestHeader("X-User-Id") String userId) {
        return ApiResponse.success(companyProfileService.getProfileByUserId(UUID.fromString(userId)));
    }

    @PutMapping("/me")
    public ApiResponse<CompanyProfileResponse> updateMyProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(companyProfileService.updateProfile(UUID.fromString(userId), request));
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMyProfile(@RequestHeader("X-User-Id") String userId) {
        companyProfileService.deleteProfile(UUID.fromString(userId));
        return ApiResponse.success(null);
    }

    // Profile Picture Upload
    @PostMapping("/me/logo")
    public ApiResponse<CompanyProfileResponse> uploadProfileLog(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(companyProfileService.uploadProfileLogo(UUID.fromString(userId), file));
    }

    // Admin endpoints
    @GetMapping("/admin/pending")
    public ApiResponse<Page<CompanyProfileResponse>> getPendingApprovals(Pageable pageable) {
        return ApiResponse.success(companyProfileService.getPendingApprovals(pageable));
    }

    @GetMapping("/admin/unverified")
    public ApiResponse<List<CompanyProfileResponse>> getUnverifiedCompanies() {
        return ApiResponse.success(companyProfileService.getUnverifiedCompanies());
    }

    @PostMapping("/admin/{userId}/approve")
    public ApiResponse<CompanyProfileResponse> approveCompany(@PathVariable UUID userId) {
        return ApiResponse.success(companyProfileService.approveCompany(userId));
    }

    @PostMapping("/admin/{userId}/suspend")
    public ApiResponse<CompanyProfileResponse> suspendCompany(
            @PathVariable UUID userId,
            @RequestParam String reason) {
        return ApiResponse.success(companyProfileService.suspendCompany(userId, reason));
    }

    // Internal endpoints for auth service
    @PostMapping("/internal")
    public ApiResponse<CompanyProfileResponse> createProfileInternal(
            @RequestParam UUID userId,
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(companyProfileService.createProfile(userId, request));
    }

    @GetMapping("/internal/{companyId}")
    public ApiResponse<CompanyDetailsResponse> getCompanyProfile(@PathVariable UUID companyId) {
        return ApiResponse.success(companyProfileService.getInternalProfileByUserId(companyId));
    }
}