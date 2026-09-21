 package com.pradeesha.clothing_inventory.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {

        String username = loginData.get("username");
        String password = loginData.get("password");

        Map<String, String> response = new HashMap<>();

        if ("admin".equals(username) && "admin123".equals(password)) {

            response.put("message", "Login successful");
            response.put("username", "admin");
            response.put("role", "ADMIN");

        } else if ("user".equals(username) && "user123".equals(password)) {

            response.put("message", "Login successful");
            response.put("username", "user");
            response.put("role", "USER");

        } else {

            response.put("message", "Invalid username or password");
            response.put("role", "INVALID");
        }

        return response;
    }
}