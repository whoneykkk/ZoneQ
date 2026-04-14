package com.zoneq.domain.seat.dto;

import com.zoneq.domain.seat.domain.Seat;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "좌석 배정 응답")
public record SeatAssignResponse(
        @Schema(description = "좌석 ID")
        Long seatId,

        @Schema(description = "구역", example = "B")
        String zone,

        @Schema(description = "좌석 번호", example = "3")
        int seatNumber,

        @Schema(description = "세션 ID")
        Long sessionId
) {
    public static SeatAssignResponse of(Seat seat, Long sessionId) {
        return new SeatAssignResponse(seat.getId(), seat.getZone(), seat.getSeatNumber(), sessionId);
    }
}
