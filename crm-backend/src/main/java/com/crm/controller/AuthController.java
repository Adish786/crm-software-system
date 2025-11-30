package com.crm.controller;


import com.crm.dto.LoginRequest;
import com.crm.dto.LoginResponse;
import com.crm.dto.RegisterRequest;
import com.crm.enums.Role;
import com.crm.model.User;
import com.crm.security.JwtUtil;
import com.crm.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,UserDetailsService userDetailsService,UserService userService,JwtUtil jwtUtil) {
        this.authenticationManager=authenticationManager;
        this.userDetailsService=userDetailsService;
        this.userService=userService;
        this.jwtUtil=jwtUtil;
    }

    @PostMapping("/register")
    public CompletableFuture<ResponseEntity<?>> register(@RequestBody RegisterRequest request) {
        return userService.existsByEmail(request.getEmail())
                .thenCompose(emailExists -> {
                    if (emailExists) {
                        return CompletableFuture.completedFuture(
                                ResponseEntity.badRequest().body("Email already exists")
                        );
                    }

                    try {
                        // Create user directly in the service layer
                        User user = new User(
                                request.getFullName(),
                                request.getEmail(),
                                request.getPassword(),
                                Role.valueOf(request.getRole().toUpperCase())
                        );

                        CompletableFuture<User> registrationFuture = userService.registerUser(user);

                        return registrationFuture.thenApply(savedUser -> {
                            return ResponseEntity.ok("User registered successfully");
                        });

                    } catch (IllegalArgumentException e) {
                        return CompletableFuture.completedFuture(
                                ResponseEntity.badRequest().body("Invalid role: " + request.getRole())
                        );
                    } catch (Exception e) {
                        return CompletableFuture.completedFuture(
                                ResponseEntity.badRequest().body("Registration failed: " + e.getMessage())
                        );
                    }
                });
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest authRequest) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication failed: " + e.getMessage());
        }

        // Load user details and generate token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        // Get user role - use join() to get the result from CompletableFuture
        try {
            Optional<User> userOptional = userService.findByEmail(authRequest.getEmail()).join();
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                return ResponseEntity.ok(new LoginResponse(jwt, user.getEmail(), user.getRole().toString()));
            } else {
                return ResponseEntity.status(404).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving user: " + e.getMessage());
        }
    }
    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            Optional<User> userOptional = userService.findByEmail(authentication.getName()).join();
            if (userOptional.isPresent()) {
                return ResponseEntity.ok(userOptional.get());
            } else {
                return ResponseEntity.status(404).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving user: " + e.getMessage());
        }
    }
}