package com.zoneq.domain.profile.controller;

import com.zoneq.domain.profile.dto.ProfileResponse;
import com.zoneq.domain.profile.dto.ProfileUpdateRequest;
import com.zoneq.domain.profile.service.ProfileService;
import com.zoneq.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Profile", description = "프로필 API")
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "내 프로필 조회",
               description = "현재 등급, 전체 방문 횟수, 소음 카테고리 비율을 반환한다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ApiResponse<ProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.ok(profileService.getProfile(userDetails.getUsername()));
    }

    @Operation(summary = "내 프로필 수정",
               description = "이름 또는 비밀번호를 변경한다. 비밀번호 변경 시 currentPassword 필수.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "현재 비밀번호 불일치 또는 currentPassword 누락"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/me")
    public ApiResponse<ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.ok(profileService.updateProfile(userDetails.getUsername(), request));
    }
}
