package com.zoneq.domain.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DashboardScheduler {

    private final DashboardService dashboardService;

    @Scheduled(fixedDelay = 5000)
    public void broadcast() {
        dashboardService.broadcastRealtime();
    }
}
