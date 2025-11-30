package com.crm.service;

import com.crm.model.User;
import com.crm.dto.UserCreateRequest;
import com.crm.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public interface UserService {

    @Async
    CompletableFuture<Page<User>> findAllUsers(Pageable pageable, String role, String email);

    @Async
    CompletableFuture<Optional<User>> findById(Long id);

    @Async
    CompletableFuture<Optional<User>> findByEmail(String email); // Fixed: returns Optional<User>

    @Async
    CompletableFuture<User> createUser(UserCreateRequest request);

    @Async
    CompletableFuture<User> updateUser(Long id, UserUpdateRequest request);

    @Async
    CompletableFuture<User> updateUserRole(Long id, String role);

    @Async
    CompletableFuture<Void> deleteUser(Long id);

    @Async
    CompletableFuture<List<User>> findByRole(String role);
    @Async
    CompletableFuture<Boolean> existsByEmail(String email);

    @Async
    CompletableFuture<Object> getUserStatistics();

    @Async
    CompletableFuture<List<User>> findSalesRepresentatives();

    @Async
    CompletableFuture<Long> countByRole(String role);

    // Add this method for AuthController compatibility
    @Async
    CompletableFuture<User> getUserByEmail(String email);

    CompletableFuture<User> registerUser(User user);
}