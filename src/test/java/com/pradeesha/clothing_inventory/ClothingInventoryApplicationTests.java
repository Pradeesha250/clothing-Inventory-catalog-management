package com.pradeesha.clothing_inventory;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.pradeesha.clothing_inventory.entity.Product;
import com.pradeesha.clothing_inventory.entity.User;
import com.pradeesha.clothing_inventory.repository.ProductRepository;
import com.pradeesha.clothing_inventory.repository.UserRepository;
import com.pradeesha.clothing_inventory.service.ProductService;
import com.pradeesha.clothing_inventory.service.UserService;

@SpringBootTest
class ClothingInventoryApplicationTests {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    void contextLoads() {
        assertNotNull(productRepository, "ProductRepository should be injected and not null");
        assertNotNull(productService, "ProductService should be injected and not null");
        assertNotNull(userRepository, "UserRepository should be injected and not null");
        assertNotNull(userService, "UserService should be injected and not null");
    }

    @Test
    void testCanReadExistingProductsFromDatabase() {
        // Verifies Spring Boot connects to the existing MySQL database and reads existing products
        List<Product> products = productService.getAllProducts();
        assertNotNull(products, "Products list should not be null");
        // Verify that existing products in MySQL table can be read
        System.out.println("Total existing products read from MySQL: " + products.size());
        for (Product p : products) {
            System.out.println("Found product: " + p.getProductId() + " - " + p.getProductName() + " - Rs." + p.getPrice());
        }
    }

    @Test
    void testCompleteProductCrudLifecycle() {
        // 1. Create a temporary test product
        Product testProduct = new Product(null, "Test Jacket", "Outerwear", "XL", "Navy", 5, 2999.0);
        Product saved = productService.addProduct(testProduct);
        assertNotNull(saved.getProductId(), "Saved product must have generated productId");
        Integer generatedId = saved.getProductId();

        try {
            // 2. Read by ID
            Optional<Product> foundOpt = productService.getProductById(generatedId);
            assertTrue(foundOpt.isPresent(), "Product should be retrievable by ID");
            Product found = foundOpt.get();
            assertEquals("Test Jacket", found.getProductName());
            assertEquals("Outerwear", found.getCategory());
            assertEquals(2999.0, found.getPrice());

            // 3. Update product
            found.setPrice(3499.0);
            found.setQuantity(8);
            Optional<Product> updatedOpt = productService.updateProduct(generatedId, found);
            assertTrue(updatedOpt.isPresent(), "Updated product should be returned");
            assertEquals(3499.0, updatedOpt.get().getPrice());
            assertEquals(8, updatedOpt.get().getQuantity());

            // 4. Verify update persisted in repository
            Optional<Product> rechecked = productService.getProductById(generatedId);
            assertTrue(rechecked.isPresent());
            assertEquals(3499.0, rechecked.get().getPrice());
        } finally {
            // 5. Clean up temporary test product so original database data is preserved
            boolean deleted = productService.deleteProduct(generatedId);
            assertTrue(deleted, "Temporary test product should be deleted successfully");

            // Verify deletion
            Optional<Product> deletedCheck = productService.getProductById(generatedId);
            assertFalse(deletedCheck.isPresent(), "Product should no longer exist after deletion");
        }
    }

    @Test
    void testUserRegistrationAndBCryptAuthentication() {
        String testUsername = "testuser_" + System.currentTimeMillis();
        String testPassword = "SecretPassword123";

        // 1. Register new user
        Optional<User> registeredOpt = userService.registerUser(testUsername, testPassword, "USER");
        assertTrue(registeredOpt.isPresent(), "User should register successfully");
        User registeredUser = registeredOpt.get();

        try {
            // 2. Verify password is NOT stored as plain text
            assertNotEquals(testPassword, registeredUser.getPassword(), "Stored password must NEVER be plain text!");
            assertTrue(registeredUser.getPassword().startsWith("$2a$") || registeredUser.getPassword().startsWith("$2b$"),
                    "Stored password must be a valid BCrypt hash format ($2a$ or $2b$)");

            // 3. Authenticate with correct password against database
            Optional<User> authSuccess = userService.authenticate(testUsername, testPassword);
            assertTrue(authSuccess.isPresent(), "Authentication should succeed with correct credentials");
            assertEquals(testUsername, authSuccess.get().getUsername());

            // 4. Authenticate with wrong password
            Optional<User> authFail = userService.authenticate(testUsername, "WrongPassword");
            assertFalse(authFail.isPresent(), "Authentication must fail with incorrect password");

            // 5. Verify duplicate username registration is prevented
            Optional<User> duplicate = userService.registerUser(testUsername, "AnotherPass", "USER");
            assertFalse(duplicate.isPresent(), "Duplicate username registration should be rejected");

        } finally {
            // Clean up temporary test user
            userRepository.delete(registeredUser);
            assertFalse(userRepository.existsByUsername(testUsername));
        }
    }
}
