package com.zoneq.domain.seat.controller;

import com.zoneq.domain.seat.dto.SeatAssignResponse;
import com.zoneq.domain.session.service.SessionService;
import com.zoneq.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Seat", description = "좌석 API")
@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatAssignController {

    private final SessionService sessionService;

    @Operation(summary = "좌석 배정 (입장)", description = "등급 기반 최적 좌석 배정. 등급 미부여자는 B구역 기본 배정")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "배정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "이미 좌석 배정됨"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "배정 가능한 좌석 없음")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/assign")
    public ApiResponse<SeatAssignResponse> assign(@AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.ok(sessionService.assign(userDetails.getUsername()));
    }

    @Operation(summary = "좌석 반납 (퇴실)", description = "세션 종료 및 좌석 반납을 단일 트랜잭션으로 처리")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "반납 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "활성 세션 없음")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/assign/me")
    public ApiResponse<Void> release(@AuthenticationPrincipal UserDetails userDetails) {
        sessionService.release(userDetails.getUsername());
        return ApiResponse.ok();
    }
}
