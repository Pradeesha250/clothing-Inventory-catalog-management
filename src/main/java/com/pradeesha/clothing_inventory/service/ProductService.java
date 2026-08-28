 package com.pradeesha.clothing_inventory.service;

import java.util.List;

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

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }
}