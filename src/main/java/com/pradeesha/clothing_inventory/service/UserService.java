package com.pradeesha.clothing_inventory.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pradeesha.clothing_inventory.entity.User;
import com.pradeesha.clothing_inventory.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Seeds initial admin and demo user into the database if no users exist.
     * All passwords are encrypted with BCrypt before saving to MySQL.
     */
    @PostConstruct
    public void seedInitialUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("user")) {
            User standardUser = new User();
            standardUser.setUsername("user");
            standardUser.setPassword(passwordEncoder.encode("user123"));
            standardUser.setRole("USER");
            userRepository.save(standardUser);
        }
    }

    /**
     * Registers a new user with BCrypt password hashing.
     *
     * @param username    The desired username (must be unique)
     * @param rawPassword The plain text password to be hashed
     * @param role        Optional user role (defaults to USER)
     * @return The saved User entity, or Optional.empty() if username already exists
     */
    public Optional<User> registerUser(String username, String rawPassword, String role) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (rawPassword.length() < 4) {
            throw new IllegalArgumentException("Password must be at least 4 characters");
        }

        String trimmedUsername = username.trim();

        if (userRepository.existsByUsername(trimmedUsername)) {
            return Optional.empty(); // Username already taken
        }

        String assignedRole = (role != null && !role.trim().isEmpty()) ? role.trim().toUpperCase() : "USER";

        // Hash the password securely with BCrypt - Never store plain text passwords
        String hashedPassword = passwordEncoder.encode(rawPassword);

        User newUser = new User();
        newUser.setUsername(trimmedUsername);
        newUser.setPassword(hashedPassword);
        newUser.setRole(assignedRole);

        User savedUser = userRepository.save(newUser);
        return Optional.of(savedUser);
    }

    /**
     * Authenticates a user by checking credentials against the database with BCrypt matching.
     *
     * @param username    The entered username
     * @param rawPassword The entered plain-text password
     * @return Optional containing the User if credentials are valid, empty otherwise
     */
    public Optional<User> authenticate(String username, String rawPassword) {
        if (username == null || rawPassword == null) {
            return Optional.empty();
        }

        return userRepository.findByUsername(username.trim())
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()));
    }

    public boolean usernameExists(String username) {
        if (username == null) {
            return false;
        }
        return userRepository.existsByUsername(username.trim());
    }
}
