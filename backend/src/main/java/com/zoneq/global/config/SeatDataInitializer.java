package com.zoneq.global.config;

import com.zoneq.domain.seat.domain.Seat;
import com.zoneq.domain.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SeatDataInitializer implements CommandLineRunner {

    private final SeatRepository seatRepository;

    @Override
    public void run(String... args) {
        if (seatRepository.count() > 0) {
            log.info("[Seat] Already initialized: {} seats exist", seatRepository.count());
            return;
        }

        log.info("[Seat] Initializing master data...");

        String[] zones = {"S", "A", "B", "C"};
        for (String zone : zones) {
            for (int seatNumber = 1; seatNumber <= 14; seatNumber++) {
                seatRepository.save(Seat.of(zone, seatNumber));
            }
        }

        log.info("[Seat] Initialization complete: {} seats created", seatRepository.count());
    }
}
