package com.zoneq.domain.seat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zoneq.domain.auth.dto.SignupRequest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SeatAssignControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // USER 등급 없음 (B구역 배정)
    private String userToken;
    // USER 등급 S (S구역 배정)
    private String sUserToken;

    private MockMvc mockMvc() {
        return MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @BeforeAll
    void setUpUsers() throws Exception {
        // 등급 없는 일반 유저
        MvcResult r1 = mockMvc().perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest("일반유저", "assign_user@test.com", "password123!"))))
                .andReturn();
        userToken = objectMapper.readTree(r1.getResponse().getContentAsString())
                .at("/data/accessToken").asText();

        // S등급 유저 (DB에서 직접 grade 설정)
        MvcResult r2 = mockMvc().perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest("S등급유저", "assign_s@test.com", "password123!"))))
                .andReturn();
        sUserToken = objectMapper.readTree(r2.getResponse().getContentAsString())
                .at("/data/accessToken").asText();
        jdbcTemplate.execute("UPDATE users SET grade = 'S' WHERE email = 'assign_s@test.com'");
    }

    @BeforeEach
    void setUpSeats() {
        jdbcTemplate.execute("DELETE FROM sessions");
        jdbcTemplate.execute("DELETE FROM seats");
        jdbcTemplate.execute("UPDATE users SET grade = 'S' WHERE email = 'assign_s@test.com'");

        jdbcTemplate.execute("INSERT INTO seats (zone, seat_number, status, created_at) VALUES ('S', 1, 'AVAILABLE', CURRENT_TIMESTAMP)");
        jdbcTemplate.execute("INSERT INTO seats (zone, seat_number, status, created_at) VALUES ('A', 1, 'AVAILABLE', CURRENT_TIMESTAMP)");
        jdbcTemplate.execute("INSERT INTO seats (zone, seat_number, status, created_at) VALUES ('B', 1, 'AVAILABLE', CURRENT_TIMESTAMP)");
        jdbcTemplate.execute("INSERT INTO seats (zone, seat_number, status, created_at) VALUES ('C', 1, 'AVAILABLE', CURRENT_TIMESTAMP)");
    }

    @Test
    void assign_userWithoutGrade_assignedToBZone() throws Exception {
        mockMvc().perform(post("/api/seats/assign")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.zone").value("B"));
    }

    @Test
    void assign_sGradeUser_assignedToSZone() throws Exception {
        mockMvc().perform(post("/api/seats/assign")
                        .header("Authorization", "Bearer " + sUserToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.zone").value("S"));
    }

    @Test
    void assign_whenAlreadyHasSeat_returns409() throws Exception {
        mockMvc().perform(post("/api/seats/assign")
                .header("Authorization", "Bearer " + userToken));

        mockMvc().perform(post("/api/seats/assign")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isConflict());
    }

    @Test
    void release_succeeds_andSeatBecomesAvailable() throws Exception {
        mockMvc().perform(post("/api/seats/assign")
                .header("Authorization", "Bearer " + userToken));

        mockMvc().perform(delete("/api/seats/assign/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void release_whenNoSeat_returns404() throws Exception {
        mockMvc().perform(delete("/api/seats/assign/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound());
    }
}
