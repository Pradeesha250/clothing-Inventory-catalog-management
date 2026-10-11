package com.pradeesha.clothing_inventory.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pradeesha.clothing_inventory.entity.User;
import com.pradeesha.clothing_inventory.service.UserService;

/**
 * LoginController manages database-backed user registration and authentication.
 * Passwords are encrypted with BCrypt hashing and stored in MySQL table 'users'.
 *
 * NOTE ON SECURITY STATUS:
 * While credentials are now stored in MySQL with BCrypt hashing (no plain text passwords),
 * production security requires additional controls such as JWT or session cookies,
 * HTTPS encryption in transit, CSRF protection, and rate limiting / brute-force lockout.
 */
@RestController
@CrossOrigin(origins = "*")
public class LoginController {

    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /login - Authenticate user against MySQL database using BCrypt password matching
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody(required = false) Map<String, String> loginData) {
        Map<String, String> response = new HashMap<>();

        if (loginData == null) {
            response.put("message", "Request body cannot be empty");
            response.put("role", "INVALID");
            return ResponseEntity.badRequest().body(response);
        }

        String username = loginData.get("username");
        String password = loginData.get("password");

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            response.put("message", "Username and password are required");
            response.put("role", "INVALID");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userService.authenticate(username, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            response.put("message", "Login successful");
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid username or password");
            response.put("role", "INVALID");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * POST /register - Register a new user with BCrypt hashed password persisted to MySQL
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody(required = false) Map<String, String> registerData) {
        Map<String, String> response = new HashMap<>();

        if (registerData == null) {
            response.put("message", "Request body cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        String username = registerData.get("username");
        String password = registerData.get("password");
        String role = registerData.get("role");

        if (username == null || username.trim().isEmpty()) {
            response.put("message", "Username is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (password == null || password.trim().isEmpty()) {
            response.put("message", "Password is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (password.length() < 4) {
            response.put("message", "Password must be at least 4 characters long");
            return ResponseEntity.badRequest().body(response);
        }

        if (userService.usernameExists(username)) {
            response.put("message", "Username '" + username.trim() + "' is already taken");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        try {
            Optional<User> registeredUserOpt = userService.registerUser(username, password, role);

            if (registeredUserOpt.isPresent()) {
                User registeredUser = registeredUserOpt.get();
                response.put("message", "User registered successfully");
                response.put("username", registeredUser.getUsername());
                response.put("role", registeredUser.getRole());
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                response.put("message", "Registration failed. Username may already exist.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
        } catch (IllegalArgumentException ex) {
            response.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception ex) {
            response.put("message", "Registration error: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}