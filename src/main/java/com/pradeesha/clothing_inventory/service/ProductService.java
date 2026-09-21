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

    public Product updateProduct(Integer id, Product product) {
        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setProductName(product.getProductName());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setSize(product.getSize());
        existingProduct.setColor(product.getColor());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setPrice(product.getPrice());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}