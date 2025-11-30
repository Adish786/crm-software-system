package com.crm.model;

import com.crm.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Schema(description = "User entity representing a user in the CRM system")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the user", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Full name is required")
    @Schema(description = "Full name of the user", example = "John Doe", required = true)
    private String fullName;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Schema(description = "Email address of the user", example = "john.doe@example.com", required = true)
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    @Schema(description = "Password of the user", example = "password123", required = true, minLength = 6)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Role is required")
    @Schema(description = "Role of the user", example = "USER", implementation = Role.class, required = true)
    private Role role;

    @Schema(description = "Date and time when the user was created",
            example = "2024-01-15T10:30:00",
            accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String fullName, String email, String password, Role role) {
        this();
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters with Schema annotations
    @Schema(description = "Unique identifier of the user", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Schema(description = "Full name of the user", example = "John Doe", required = true)
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    @Schema(description = "Email address of the user", example = "john.doe@example.com", required = true)
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @Schema(description = "Password of the user", example = "password123", required = true, minLength = 6)
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Schema(description = "Role of the user", example = "USER", implementation = Role.class, required = true)
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    @Schema(description = "Date and time when the user was created",
            example = "2024-01-15T10:30:00",
            accessMode = Schema.AccessMode.READ_ONLY)
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", createdAt=" + createdAt +
                '}';
    }
}