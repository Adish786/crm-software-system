package com.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Login response with JWT token")
public class LoginResponse {

    @Schema(description = "JWT authentication token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "User's email", example = "user@example.com")
    private String email;

    @Schema(description = "User's role", example = "USER")
    private String role;

    @Schema(description = "JWT authentication refreshtoken", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;

    @Schema(description = "Full name of the user", example = "John Doe", required = true)
    private String fullName;

    public LoginResponse() {}

    public LoginResponse(String token, String email, String role, String refreshToken, String fullName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.refreshToken = refreshToken;
        this.fullName = fullName;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}