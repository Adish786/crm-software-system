package com.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Schema(description = "DTO for updating an existing user")
public class UserUpdateRequest {

    @Schema(description = "Full name of the user", example = "John Smith")
    private String fullName;

    @Email(message = "Email should be valid")
    @Schema(description = "Email address of the user", example = "john.smith@example.com")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    @Schema(description = "Password of the user", example = "newpassword123", minLength = 6)
    private String password;

    @Schema(description = "Role of the user", example = "MANAGER")
    private String role;

    // Constructors
    public UserUpdateRequest() {}

    // Getters and setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
