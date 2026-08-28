 package com.pradeesha.clothing_inventory.repository;

import com.pradeesha.clothing_inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}