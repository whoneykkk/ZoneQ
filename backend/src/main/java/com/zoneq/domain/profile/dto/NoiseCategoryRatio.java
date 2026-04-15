package com.zoneq.domain.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "소음 카테고리별 비율 (%)")
public record NoiseCategoryRatio(
        @Schema(description = "대화 소음 비율", example = "30.0") double talk,
        @Schema(description = "키보드 소음 비율", example = "40.0") double keyboard,
        @Schema(description = "기침 소음 비율", example = "10.0") double cough,
        @Schema(description = "기타 소음 비율", example = "20.0") double other
) {
    public static NoiseCategoryRatio zero() {
        return new NoiseCategoryRatio(0.0, 0.0, 0.0, 0.0);
    }
}
