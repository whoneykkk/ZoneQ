package com.zoneq.domain.profile.dto;

import com.zoneq.domain.seat.domain.Seat;
import com.zoneq.domain.user.domain.User;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "내 프로필 응답")
public record ProfileResponse(
        @Schema(description = "이름", example = "홍길동") String name,
        @Schema(description = "이메일", example = "user@example.com") String email,
        @Schema(description = "소음 등급 (S/A/B/C, 미부여 시 null)", example = "A") String grade,
        @Schema(description = "전체 방문 횟수", example = "12") int visitCount,
        @Schema(description = "소음 카테고리 비율") NoiseCategoryRatio noiseCategoryRatio,
        @Schema(description = "현재 배정 좌석 (미배정 시 null)") SeatInfo seat
) {
    public record SeatInfo(
            @Schema(description = "구역", example = "B") String zone,
            @Schema(description = "좌석 번호", example = "1") int seatNumber
    ) {}

    public static ProfileResponse of(User user, long visitCount, NoiseCategoryRatio ratio, Seat currentSeat) {
        SeatInfo seatInfo = currentSeat != null
                ? new SeatInfo(currentSeat.getZone(), currentSeat.getSeatNumber())
                : null;
        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getGrade(),
                (int) visitCount,
                ratio,
                seatInfo
        );
    }
}
