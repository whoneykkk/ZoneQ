package com.zoneq.domain.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "프로필 수정 요청")
public record ProfileUpdateRequest(
        @Schema(description = "변경할 이름 (null이면 변경 안 함)", example = "새이름") String name,
        @Schema(description = "현재 비밀번호 (newPassword 있을 때 필수)", example = "currentPw123!") String currentPassword,
        @Schema(description = "변경할 비밀번호 (null이면 변경 안 함)", example = "newPw456!") String newPassword
) {}
