package com.pradeesha.clothing_inventory.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pradeesha.clothing_inventory.entity.Product;
import com.pradeesha.clothing_inventory.service.ProductService;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /products - Retrieve all products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * GET /products/{id} - Retrieve a single product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        if (id == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Product ID must not be null");
            return ResponseEntity.badRequest().body(error);
        }

        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productOpt.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Product not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * POST /products - Create a new product
     */
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        String validationError = validateProduct(product, true);
        if (validationError != null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", validationError);
            return ResponseEntity.badRequest().body(error);
        }

        Product savedProduct = productService.addProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    /**
     * PUT /products/{id} - Update an existing product
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        if (id == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Product ID must not be null");
            return ResponseEntity.badRequest().body(error);
        }

        String validationError = validateProduct(product, false);
        if (validationError != null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", validationError);
            return ResponseEntity.badRequest().body(error);
        }

        Optional<Product> updatedOpt = productService.updateProduct(id, product);
        if (updatedOpt.isPresent()) {
            return ResponseEntity.ok(updatedOpt.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Product not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * DELETE /products/{id} - Delete a product by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        if (id == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Product ID must not be null");
            return ResponseEntity.badRequest().body(error);
        }

        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            response.put("productId", String.valueOf(id));
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Product not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Validate product input fields
     */
    private String validateProduct(Product product, boolean isCreation) {
        if (product == null) {
            return "Product data cannot be empty";
        }
        if (isCreation) {
            if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
                return "Product name is required";
            }
            if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
                return "Category is required";
            }
            if (product.getQuantity() == null || product.getQuantity() < 0) {
                return "Quantity must be a non-negative number";
            }
            if (product.getPrice() == null || product.getPrice() < 0.0) {
                return "Price must be a non-negative number";
            }
        } else {
            if (product.getProductName() != null && product.getProductName().trim().isEmpty()) {
                return "Product name cannot be empty";
            }
            if (product.getQuantity() != null && product.getQuantity() < 0) {
                return "Quantity must be a non-negative number";
            }
            if (product.getPrice() != null && product.getPrice() < 0.0) {
                return "Price must be a non-negative number";
            }
        }
        return null;
    }
}