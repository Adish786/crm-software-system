package com.crm.repository;

import com.crm.model.User;
import com.crm.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if email exists for other users
     */
    boolean existsByEmailAndIdNot(String email, Long id);

    /**
     * Find users by role
     */
    List<User> findByRole(Role role);

    /**
     * Count users by role
     */
    Long countByRole(Role role);

    /**
     * Find users by full name containing (case-insensitive)
     */
    List<User> findByFullNameContainingIgnoreCase(String fullName);

    /**
     * Find active sales representatives
     */
    List<User> findByRoleOrderByFullName(Role role);
}