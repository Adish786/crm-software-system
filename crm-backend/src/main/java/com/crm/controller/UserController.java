package com.crm.controller;

import com.crm.model.User;
import com.crm.dto.UserCreateRequest;
import com.crm.dto.UserUpdateRequest;
import com.crm.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(
            summary = "Get all users",
            description = "Retrieves a paginated list of all users with optional filtering and sorting"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved users",
                    content = @Content(schema = @Schema(implementation = User.class, type = "array"))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public CompletableFuture<ResponseEntity<Page<User>>> getAllUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "DESC") String direction,
            @Parameter(description = "Filter by role") @RequestParam(required = false) String role,
            @Parameter(description = "Filter by email containing") @RequestParam(required = false) String email) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return userService.findAllUsers(pageable, role, email)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get user by ID",
            description = "Retrieves a specific user by their unique identifier"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User found successfully",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<User>> getUserById(
            @Parameter(description = "User ID", example = "1", required = true)
            @PathVariable Long id) {
        return userService.findById(id)
                .thenApply(user -> user.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build()));
    }

    @Operation(
            summary = "Get current user profile",
            description = "Retrieves the profile of the currently authenticated user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/profile")
    public CompletableFuture<ResponseEntity<User>> getCurrentUserProfile() {
        // This would typically get the user from security context
        // For now, returning a placeholder - you'll need to implement security context
        return CompletableFuture.completedFuture(ResponseEntity.badRequest().build());
    }

    @Operation(
            summary = "Create a new user",
            description = "Creates a new user with the provided details. Note: This endpoint should be protected."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User created successfully",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid user data provided or email already exists",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public CompletableFuture<ResponseEntity<User>> createUser(
            @Parameter(description = "User data to create", required = true)
            @Valid @RequestBody UserCreateRequest request) {
        return userService.createUser(request)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Update user",
            description = "Updates an existing user's information"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User updated successfully",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<User>> updateUser(
            @Parameter(description = "User ID", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated user data", required = true)
            @Valid @RequestBody UserUpdateRequest request) {
        return userService.updateUser(id, request)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Update user role",
            description = "Updates only the role of a specific user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User role updated successfully",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/role")
    public CompletableFuture<ResponseEntity<User>> updateUserRole(
            @Parameter(description = "User ID", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "New role for the user", required = true)
            @RequestParam String role) {
        return userService.updateUserRole(id, role)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Delete user",
            description = "Permanently deletes a user from the system"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Cannot delete user with associated data",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteUser(
            @Parameter(description = "User ID", example = "1", required = true)
            @PathVariable Long id) {
        return userService.deleteUser(id)
                .thenApply(v -> ResponseEntity.ok().<Void>build())
                .exceptionally(ex -> ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Get users by role",
            description = "Retrieves all users with a specific role"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved users by role",
                    content = @Content(schema = @Schema(implementation = User.class, type = "array"))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/role/{role}")
    public CompletableFuture<ResponseEntity<List<User>>> getUsersByRole(
            @Parameter(description = "User role", example = "SALES_REP", required = true)
            @PathVariable String role) {
        return userService.findByRole(role)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Check if email exists",
            description = "Checks if a user with the given email already exists"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Email existence check completed",
                    content = @Content(schema = @Schema(implementation = Boolean.class))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/check-email")
    public CompletableFuture<ResponseEntity<Boolean>> checkEmailExists(
            @Parameter(description = "Email to check", example = "user@example.com", required = true)
            @RequestParam String email) {
        return userService.existsByEmail(email)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get user statistics",
            description = "Retrieves statistics about users"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Statistics retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Object.class))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/statistics")
    public CompletableFuture<ResponseEntity<Object>> getUserStatistics() {
        return userService.getUserStatistics()
                .thenApply(ResponseEntity::ok);
    }
}
