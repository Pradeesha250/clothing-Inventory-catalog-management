package com.pradeesha.clothing_inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class ClothingInventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClothingInventoryApplication.class, args);
    }

}
 