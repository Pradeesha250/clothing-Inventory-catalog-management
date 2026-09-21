 package com.pradeesha.clothing_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pradeesha.clothing_inventory.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

}