package com.zoneq.domain.dashboard.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record RealtimeSeatData(
        @Schema(description = "좌석 ID") Long seatId,
        @Schema(description = "구역") String zone,
        @Schema(description = "좌석 번호") int seatNumber,
        @Schema(description = "최근 leqDb (측정값 없으면 null)") Double leqDb,
        @Schema(description = "착석 이용자 ID") Long userId
) {}
