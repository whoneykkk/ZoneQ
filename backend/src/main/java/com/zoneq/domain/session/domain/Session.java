package com.zoneq.domain.session.domain;

import com.zoneq.domain.seat.domain.Seat;
import com.zoneq.domain.user.domain.User;
import com.zoneq.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "sessions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Session extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "duration_min")
    private Integer durationMin;

    public static Session start(User user, Seat seat) {
        Session session = new Session();
        session.user = user;
        session.seat = seat;
        session.startedAt = LocalDateTime.now();
        return session;
    }

    public void end() {
        this.endedAt = LocalDateTime.now();
        this.durationMin = (int) ChronoUnit.MINUTES.between(this.startedAt, this.endedAt);
    }
}
