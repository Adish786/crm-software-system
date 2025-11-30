package com.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Login response with JWT token")
public class LoginResponse {

    @Schema(description = "JWT authentication token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "User's email", example = "user@example.com")
    private String email;

    @Schema(description = "User's role", example = "USER")
    private String role;

    // Default constructor
    public LoginResponse() {}

    // Parameterized constructor
    public LoginResponse(String token, String email, String role) {
        this.token = token;
        this.email = email;
        this.role = role;
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
}