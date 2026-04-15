package com.zoneq.domain.profile.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.zoneq.domain.auth.dto.SignupRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProfileControllerTest {

    @Autowired WebApplicationContext context;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());
    private String userToken;

    private MockMvc mockMvc() {
        return MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity()).build();
    }

    @BeforeAll
    void setUp() throws Exception {
        MvcResult r = mockMvc().perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new SignupRequest("프로필유저", "profile_user@test.com", "password123!"))))
                .andReturn();
        userToken = objectMapper.readTree(r.getResponse().getContentAsString())
                .at("/data/accessToken").asText();
    }

    @Test
    @Order(1)
    void getProfile_returns200_withValidToken() throws Exception {
        mockMvc().perform(get("/api/profile/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("프로필유저"))
                .andExpect(jsonPath("$.data.email").value("profile_user@test.com"))
                .andExpect(jsonPath("$.data.visitCount").value(0))
                .andExpect(jsonPath("$.data.noiseCategoryRatio.talk").value(0.0))
                .andExpect(jsonPath("$.data.noiseCategoryRatio.keyboard").value(0.0))
                .andExpect(jsonPath("$.data.noiseCategoryRatio.cough").value(0.0))
                .andExpect(jsonPath("$.data.noiseCategoryRatio.other").value(0.0));
    }

    @Test
    @Order(2)
    void getProfile_returns401_withoutToken() throws Exception {
        mockMvc().perform(get("/api/profile/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    void updateProfile_returns200_whenNameChanged() throws Exception {
        mockMvc().perform(patch("/api/profile/me")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "변경된이름"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("변경된이름"));
    }

    @Test
    @Order(4)
    void updateProfile_returns200_whenPasswordChanged() throws Exception {
        mockMvc().perform(patch("/api/profile/me")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "currentPassword", "password123!",
                                "newPassword", "newPassword456!"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(5)
    void updateProfile_returns400_whenNewPasswordWithoutCurrentPassword() throws Exception {
        mockMvc().perform(patch("/api/profile/me")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "newPassword", "someNewPw456!"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(6)
    void updateProfile_returns400_whenCurrentPasswordWrong() throws Exception {
        mockMvc().perform(patch("/api/profile/me")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "currentPassword", "wrongPassword!",
                                "newPassword", "someNewPw456!"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(7)
    void updateProfile_returns401_withoutToken() throws Exception {
        mockMvc().perform(patch("/api/profile/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "무인증"))))
                .andExpect(status().isUnauthorized());
    }
}
