package com.godayana.user.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.user.dto.SeekerProfileRequest;
import com.godayana.user.dto.SeekerProfileResponse;
import com.godayana.user.service.SeekerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/seeker/profiles")
@RequiredArgsConstructor
public class SeekerProfileController {

    private final SeekerProfileService seekerProfileService;

    @GetMapping("/me")
    public ApiResponse<SeekerProfileResponse> getMyProfile(@RequestHeader("X-User-Id") String userId) {
        return ApiResponse.success(seekerProfileService.getProfileByUserId(UUID.fromString(userId)));
    }

    @PutMapping("/me")
    public ApiResponse<SeekerProfileResponse> updateMyProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody SeekerProfileRequest request) {
        return ApiResponse.success(seekerProfileService.updateProfile(UUID.fromString(userId), request));
    }

    @PatchMapping("/me/share-cv")
    public ApiResponse<Void> updateShareCvStatus(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam Boolean shareCv) {
        seekerProfileService.updateShareCvStatus(UUID.fromString(userId), shareCv);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMyProfile(@RequestHeader("X-User-Id") String userId) {
        seekerProfileService.deleteProfile(UUID.fromString(userId));
        return ApiResponse.success(null);
    }

    // Profile Picture Upload
    @PostMapping("/me/profile-pic")
    public ApiResponse<SeekerProfileResponse> uploadProfilePic(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(seekerProfileService.uploadProfilePic(UUID.fromString(userId), file));
    }

    // Resume Upload
    @PostMapping("/me/resume")
    public ApiResponse<SeekerProfileResponse> uploadResume(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(seekerProfileService.uploadResume(UUID.fromString(userId), file));
    }

    // Internal endpoints for auth service
    @PostMapping("/internal")
    public ApiResponse<SeekerProfileResponse> createProfileInternal(
            @RequestParam UUID userId,
            @Valid @RequestBody SeekerProfileRequest request) {
        return ApiResponse.success(seekerProfileService.createProfile(userId, request));
    }
}