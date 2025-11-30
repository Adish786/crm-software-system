package com.crm.service;

import com.crm.model.User;
import com.crm.dto.UserCreateRequest;
import com.crm.dto.UserUpdateRequest;
import com.crm.enums.Role;
import com.crm.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<Page<User>> findAllUsers(Pageable pageable, String role, String email) {
        logger.info("Fetching users with pagination and filters - Thread: {}", Thread.currentThread().getName());

        Specification<User> spec = buildUserSpecification(role, email);

        return CompletableFuture.completedFuture(userRepository.findAll(spec, pageable));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Optional<User>> findById(Long id) {
        logger.debug("Fetching user by ID: {} - Thread: {}", id, Thread.currentThread().getName());
        return CompletableFuture.completedFuture(userRepository.findById(id));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Optional<User>> findByEmail(String email) {
        logger.debug("Fetching user by email: {} - Thread: {}", email, Thread.currentThread().getName());
        return CompletableFuture.completedFuture(userRepository.findByEmail(email));
    }

    // New method for AuthController compatibility
    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<User> getUserByEmail(String email) {
        logger.debug("Getting user by email: {} - Thread: {}", email, Thread.currentThread().getName());
        return CompletableFuture.completedFuture(
                userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found with email: " + email))
        );
    }

    @Override
    @Async
    public CompletableFuture<User> createUser(UserCreateRequest request) {
        logger.info("Creating new user - Thread: {}", Thread.currentThread().getName());
        logger.info("User data - Name: {}, Email: {}, Role: {}",
                request.getFullName(), request.getEmail(), request.getRole());

        return CompletableFuture.supplyAsync(() -> {
            try {
                // Check if email already exists
                if (userRepository.existsByEmail(request.getEmail())) {
                    logger.warn("Email already exists: {}", request.getEmail());
                    throw new RuntimeException("Email already exists: " + request.getEmail());
                }

                User user = new User();
                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));

                // Log role conversion attempt
                logger.info("Attempting to convert role: {}", request.getRole());
                try {
                    Role userRole = Role.valueOf(request.getRole().toUpperCase());
                    user.setRole(userRole);
                    logger.info("Role converted successfully: {}", userRole);
                } catch (IllegalArgumentException e) {
                    logger.error("Invalid role provided: {}", request.getRole());
                    throw new RuntimeException("Invalid role: " + request.getRole() +
                            ". Valid roles are: " + Arrays.toString(Role.values()));
                }

                User savedUser = userRepository.save(user);
                logger.info("User created successfully with ID: {}", savedUser.getId());
                return savedUser;

            } catch (Exception e) {
                logger.error("Error creating user: {}", e.getMessage(), e);
                throw new RuntimeException("User creation failed: " + e.getMessage());
            }
        });
    }
    @Override
    @Async
    public CompletableFuture<User> updateUser(Long id, UserUpdateRequest request) {
        logger.info("Updating user with ID: {} - Thread: {}", id, Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            // Update fields if provided
            if (request.getFullName() != null) {
                user.setFullName(request.getFullName());
            }
            if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                // Check if new email already exists
                if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
                    throw new RuntimeException("Email already exists: " + request.getEmail());
                }
                user.setEmail(request.getEmail());
            }
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            if (request.getRole() != null) {
                try {
                    user.setRole(Role.valueOf(request.getRole().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid role: " + request.getRole());
                }
            }

            return userRepository.save(user);
        });
    }

    @Override
    @Async
    public CompletableFuture<User> updateUserRole(Long id, String role) {
        logger.info("Updating user role for ID: {} to {} - Thread: {}", id, role, Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            try {
                Role newRole = Role.valueOf(role.toUpperCase());
                user.setRole(newRole);
                return userRepository.save(user);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + role);
            }
        });
    }

    @Override
    @Async
    public CompletableFuture<Void> deleteUser(Long id) {
        logger.info("Deleting user with ID: {} - Thread: {}", id, Thread.currentThread().getName());

        return CompletableFuture.runAsync(() -> {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            // Check if user has associated data (leads, sales, tasks, etc.)
            if (hasAssociatedData(user)) {
                throw new RuntimeException("Cannot delete user with associated data. Please reassign or delete the associated data first.");
            }

            userRepository.delete(user);
        });
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<User>> findByRole(String role) {
        logger.debug("Fetching users by role: {} - Thread: {}", role, Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            try {
                Role userRole = Role.valueOf(role.toUpperCase());
                return userRepository.findByRole(userRole);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + role);
            }
        });
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Boolean> existsByEmail(String email) {
        logger.debug("Checking if email exists: {} - Thread: {}", email, Thread.currentThread().getName());
        return CompletableFuture.completedFuture(userRepository.existsByEmail(email));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Object> getUserStatistics() {
        logger.info("Calculating user statistics - Thread: {}", Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            Map<String, Object> stats = new ConcurrentHashMap<>();

            // Execute queries
            Long totalUsers = userRepository.count();
            Long adminUsers = userRepository.countByRole(Role.ADMIN);
            Long salesRepUsers = userRepository.countByRole(Role.SALES);
            Long regularUsers = userRepository.countByRole(Role.USER);
            Long managerUsers = userRepository.countByRole(Role.MANAGER);

            stats.put("totalUsers", totalUsers);
            stats.put("adminUsers", adminUsers);
            stats.put("salesRepUsers", salesRepUsers);
            stats.put("regularUsers", regularUsers);
            stats.put("managerUsers", managerUsers);

            return stats;
        });
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<User>> findSalesRepresentatives() {
        return CompletableFuture.supplyAsync(() -> userRepository.findByRole(Role.SALES));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Long> countByRole(String role) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Role userRole = Role.valueOf(role.toUpperCase());
                return userRepository.countByRole(userRole);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + role);
            }
        });
    }

    /**
     * Builds dynamic specification for filtering users
     */
    private Specification<User> buildUserSpecification(String role, String email) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (role != null && !role.isEmpty()) {
                try {
                    Role userRole = Role.valueOf(role.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("role"), userRole));
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid user role provided: {}", role);
                }
            }

            if (email != null && !email.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")),
                        "%" + email.toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Check if user has associated data that would prevent deletion
     */
    private boolean hasAssociatedData(User user) {
        // Implement checks for associated data
        // For example:
        // - Check if user has assigned leads
        // - Check if user has assigned sales
        // - Check if user has assigned tasks
        // Return true if any associated data exists

        // Placeholder implementation - you'll need to implement based on your relationships
        return false;
    }

    @Override
    @Async
    public CompletableFuture<User> registerUser(User user) {
        logger.info("Registering new user - Thread: {}", Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            // Check if email already exists
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Email already exists: " + user.getEmail());
            }

            // Encode password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            User savedUser = userRepository.save(user);
            logger.info("User registered successfully with ID: {}", savedUser.getId());
            return savedUser;
        });
    }
}