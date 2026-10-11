package com.pradeesha.clothing_inventory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pradeesha.clothing_inventory.entity.Product;
import com.pradeesha.clothing_inventory.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Integer id) {
        if (id == null) {
            return Optional.empty();
        }
        return productRepository.findById(id);
    }

    public Product addProduct(Product product) {
        // Ensure ID is null so database auto-increments product_id
        product.setProductId(null);
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(Integer id, Product product) {
        if (id == null) {
            return Optional.empty();
        }

        return productRepository.findById(id).map(existingProduct -> {
            if (product.getProductName() != null) {
                existingProduct.setProductName(product.getProductName());
            }
            if (product.getCategory() != null) {
                existingProduct.setCategory(product.getCategory());
            }
            if (product.getSize() != null) {
                existingProduct.setSize(product.getSize());
            }
            if (product.getColor() != null) {
                existingProduct.setColor(product.getColor());
            }
            if (product.getQuantity() != null) {
                existingProduct.setQuantity(product.getQuantity());
            }
            if (product.getPrice() != null) {
                existingProduct.setPrice(product.getPrice());
            }
            return productRepository.save(existingProduct);
        });
    }

    public boolean deleteProduct(Integer id) {
        if (id == null || !productRepository.existsById(id)) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }
}