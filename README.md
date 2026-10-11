# Clothing Inventory & Catalog Management System

A full-stack web application designed for clothing boutiques, apparel retailers, and inventory managers to streamline product catalog tracking, stock quantities, pricing, and category management.

Built with **React + Vite** for the frontend, **Spring Boot 3 + Spring Data JPA** for the REST API backend, and **MySQL** for relational persistence.

---

## 📌 Table of Contents
1. [Technology Stack](#-technology-stack)
2. [Project Architecture & Directory Layout](#-project-architecture--directory-layout)
3. [Database Schema (`clothing_inventory`)](#-database-schema-clothing_inventory)
4. [Prerequisites](#-prerequisites)
5. [Local Setup & Startup Guide](#-local-setup--startup-guide)
   - [Step 1: MySQL Database Configuration](#step-1-mysql-database-configuration)
   - [Step 2: Backend (Spring Boot) Setup](#step-2-backend-spring-boot-setup)
   - [Step 3: Frontend (React + Vite) Setup](#step-3-frontend-react--vite-setup)
6. [API Endpoints & Testing Guide](#-api-endpoints--testing-guide)
   - [Simulated Authentication APIs](#1-authentication-endpoints-demo-mode)
   - [Product Catalog CRUD APIs](#2-product-catalog-crud-endpoints-persisted-to-mysql)
7. [Postman Collection](#-postman-collection)
8. [Production Deployment Guide](#-production-deployment-guide)
   - [Option A: Containerized (Docker & Docker Compose)](#option-a-docker-compose)
   - [Option B: Cloud Deployment (Vercel + Render + Cloud MySQL)](#option-b-cloud-hosting)
9. [Project Notes for College Submission](#-project-notes-for-college-submission)

---

## 🚀 Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite 8 | Single Page Application (SPA), React Hooks, responsive CSS |
| **Backend** | Spring Boot 3.2.3, Java 17/21 | Spring MVC REST Controllers, Service Layer, Repository Layer |
| **ORM / Data** | Spring Data JPA, Hibernate 6.4 | Automatic mapping to MySQL tables, HikariCP connection pool |
| **Database** | MySQL 8 / 26 | Database name: `clothing_inventory` |
| **Build Tools** | Maven Wrapper (`mvnw`), npm | Dependency management and build packaging |
| **Testing** | JUnit 5, Spring Boot Test | Automated unit and integration tests |
| **API Testing** | Postman, cURL | REST API verification collection |
| **Version Control** | Git & GitHub | Main branch tracking |

---

## 📂 Project Architecture & Directory Layout

```text
clothing-Inventory-catalog-management/
├── .mvn/wrapper/                  # Maven wrapper binaries
├── mvnw, mvnw.cmd                 # Maven execution scripts
├── pom.xml                        # Maven dependencies & build configuration
├── Dockerfile                     # Spring Boot backend Docker image
├── docker-compose.yml             # Full-stack Docker orchestration
├── .env.example                   # Backend environment template
├── .gitignore                     # Git ignore rules (prevents committing secrets)
├── README.md                      # Project documentation
│
├── src/
│   ├── main/
│   │   ├── java/com/pradeesha/clothing_inventory/
│   │   │   ├── ClothingInventoryApplication.java  # Main Spring Boot entrypoint
│   │   │   ├── controller/
│   │   │   │   ├── ProductController.java         # REST APIs for /products CRUD
│   │   │   │   └── LoginController.java           # User auth & registration endpoints (/login, /register)
│   │   │   ├── service/
│   │   │   │   ├── ProductService.java            # Product catalog business logic
│   │   │   │   └── UserService.java               # BCrypt password hashing & authentication logic
│   │   │   ├── repository/
│   │   │   │   ├── ProductRepository.java         # Products Spring Data JPA interface
│   │   │   │   └── UserRepository.java            # Users Spring Data JPA interface
│   │   │   └── entity/
│   │   │       ├── Product.java                   # JPA entity mapped to 'products' table
│   │   │       └── User.java                      # JPA entity mapped to 'users' table
│   │   └── resources/
│   │       └── application.properties             # Spring datasource & JPA settings
│   └── test/
│       └── java/com/pradeesha/clothing_inventory/
│           └── ClothingInventoryApplicationTests.java # Automated integration & auth tests
│
├── clothing-inventory-frontend/   # React + Vite Client Application
│   ├── index.html                 # Single-page HTML container
│   ├── package.json               # Frontend dependencies & npm scripts
│   ├── vite.config.js             # Vite development & build setup
│   ├── Dockerfile                 # Frontend multi-stage Nginx container
│   ├── nginx.conf                 # Nginx routing configuration
│   ├── .env.example               # Frontend environment template
│   └── src/
│       ├── main.jsx               # React DOM root render
│       ├── App.jsx                # Main application component (Login, Register, Dashboard, Products, CRUD, Orders, Shop)
│       ├── App.css                # Component styling
│       └── index.css              # Global styles & resets
│
└── postman/
    └── clothing_inventory_postman_collection.json # Exportable Postman Collection
```

---

## 🗄 Database Schema (`clothing_inventory`)

The system operates against the MySQL database named `clothing_inventory`.

### Table 1: `products`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `product_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for product |
| `product_name`| `VARCHAR(100)` | NOT NULL | Name of the clothing item |
| `category` | `VARCHAR(50)` | NOT NULL | Item category (e.g. Formal, Casual, Outerwear) |
| `size` | `VARCHAR(20)` | NULLABLE | Garment size (e.g. S, M, L, XL, 32) |
| `color` | `VARCHAR(30)` | NULLABLE | Primary garment color (e.g. Blue, Black) |
| `quantity` | `INT` | Non-negative | Current stock count in warehouse |
| `price` | `DOUBLE` | Non-negative | Unit selling price in INR (₹) |

### Table 2: `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `username`| `VARCHAR(50)` | UNIQUE, NOT NULL | Unique username for login |
| `password`| `VARCHAR(255)`| NOT NULL | Cryptographic **BCrypt** salted hash (Never plain-text) |
| `role` | `VARCHAR(20)` | Default 'USER' | User authorization role (`USER` or `ADMIN`) |

---

## 📋 Prerequisites

Before running the application locally, ensure you have:
1. **Java JDK 17** or higher installed (`java -version`).
2. **Node.js 18+** and npm installed (`node -v` and `npm -v`).
3. **MySQL Server** installed and running on port `3306`.

---

## ⚙️ Local Setup & Startup Guide

### Step 1: MySQL Database Configuration
1. Open MySQL Command Line or MySQL Workbench:
   ```sql
   CREATE DATABASE IF NOT EXISTS clothing_inventory;
   ```
2. Verify the database exists. (If you already have existing products in the table, Spring Boot will read them automatically).

### Step 2: Backend (Spring Boot) Setup
1. Open a terminal in the project root directory (`clothing-Inventory-catalog-management`).
2. Set your MySQL credentials (if they differ from default) in `src/main/resources/application.properties` or set environment variables:
   ```powershell
   $env:SPRING_DATASOURCE_USERNAME="root"
   $env:SPRING_DATASOURCE_PASSWORD="YOUR_MYSQL_PASSWORD"
   ```
3. Run automated tests to verify connectivity:
   ```powershell
   .\mvnw.cmd test
   ```
4. Start the Spring Boot backend application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *The backend will start and listen on `http://localhost:8080`.*

### Step 3: Frontend (React + Vite) Setup
1. Open a second terminal and navigate to the frontend directory:
   ```powershell
   cd clothing-inventory-frontend
   ```
2. Install npm dependencies (if not already installed):
   ```powershell
   npm.cmd install
   ```
3. Start the Vite development server:
   ```powershell
   npm.cmd run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📡 API Endpoints & Testing Guide

All endpoints support Cross-Origin Resource Sharing (CORS) and return JSON responses.

### 1. Database-Backed Authentication Endpoints (BCrypt Protected)
> **Security Notice:** Passwords are encrypted using salted **BCrypt** hashing and validated against the MySQL `users` table. Plain-text passwords are never stored. For production environments, additional safeguards such as HTTPS, JWT session tokens, and rate-limiting should be configured.

#### `POST /register`
- **Description:** Register a new user account with BCrypt password encryption stored in MySQL.
- **Request Body:**
  ```json
  {
    "username": "priya_boutique",
    "password": "SecretPassword123",
    "role": "USER"
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "message": "User registered successfully",
    "username": "priya_boutique",
    "role": "USER"
  }
  ```
- **Conflict Response (`409 Conflict`):**
  ```json
  {
    "message": "Username 'priya_boutique' is already taken"
  }
  ```

#### `POST /login`
- **Description:** Authenticate user credentials against MySQL database using BCrypt password matching.
- **Request Body:**
  ```json
  {
    "username": "priya_boutique",
    "password": "SecretPassword123"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "message": "Login successful",
    "username": "priya_boutique",
    "role": "USER"
  }
  ```
- **Failure Response (`401 Unauthorized`):**
  ```json
  {
    "message": "Invalid username or password",
    "role": "INVALID"
  }
  ```

---

### 2. Product Catalog CRUD Endpoints (Persisted to MySQL)

#### `GET /products`
- **Description:** Retrieve all clothing items in the catalog.
- **Status:** `200 OK`
- **Response Example:**
  ```json
  [
    {
      "productId": 1,
      "productName": "T-Shirt",
      "category": "Clothing",
      "size": "M",
      "color": "Black",
      "quantity": 20,
      "price": 799.0
    }
  ]
  ```

#### `GET /products/{id}`
- **Description:** Retrieve a single product by its ID.
- **Example URL:** `http://localhost:8080/products/1`
- **Status:** `200 OK` (or `404 Not Found` if the ID does not exist)

#### `POST /products`
- **Description:** Create a new product and persist it to MySQL.
- **URL:** `http://localhost:8080/products`
- **Request Body:**
  ```json
  {
    "productName": "Linen Casual Shirt",
    "category": "Casual",
    "size": "L",
    "color": "Sky Blue",
    "quantity": 18,
    "price": 1299.0
  }
  ```
- **Response:** `201 Created` with the saved product object including generated `productId`.

#### `PUT /products/{id}`
- **Description:** Update an existing product in MySQL.
- **Example URL:** `http://localhost:8080/products/1`
- **Request Body:**
  ```json
  {
    "productName": "T-Shirt Premium Edition",
    "category": "Clothing",
    "size": "L",
    "color": "Midnight Black",
    "quantity": 25,
    "price": 899.0
  }
  ```
- **Response:** `200 OK` with updated product details (or `404 Not Found` if missing).

#### `DELETE /products/{id}`
- **Description:** Delete a product from MySQL by ID.
- **Example URL:** `http://localhost:8080/products/1`
- **Response:** `200 OK`
  ```json
  {
    "message": "Product deleted successfully",
    "productId": "1"
  }
  ```

---

## 📮 Postman Collection

An importable Postman collection is included in the project:
- Path: `postman/clothing_inventory_postman_collection.json`

**How to Import into Postman:**
1. Open the Postman application.
2. Click **Import** (top left).
3. Select `postman/clothing_inventory_postman_collection.json`.
4. Run requests against `http://localhost:8080`.

---

## 🌐 Production Deployment Guide

### Option A: Docker Compose (All-In-One Container Deployment)
The repository includes a ready-to-run `docker-compose.yml` defining MySQL, Spring Boot backend, and React frontend:
1. Ensure Docker Desktop is running.
2. Build and start all three containers:
   ```bash
   docker compose up --build -d
   ```
3. Access:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:8080/products`

### Option B: Cloud Hosting (Recommended for Free Student Tiers)
1. **Database:** Deploy a MySQL instance on [Aiven](https://aiven.io/) or [Railway](https://railway.app/).
2. **Backend (Spring Boot):**
   - Deploy on [Render](https://render.com/) as a Web Service.
   - Configure Environment Variables:
     - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<your-db-host>:3306/clothing_inventory?useSSL=true`
     - `SPRING_DATASOURCE_USERNAME`: `<your-db-username>`
     - `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
     - `PORT`: `8080`
3. **Frontend (React):**
   - Deploy on [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) pointing to `clothing-inventory-frontend/`.
   - Set Environment Variable:
     - `VITE_API_URL`: `<your-deployed-render-backend-url>`
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## 🎓 Project Notes for College Submission

1. **Layered Architecture:** The backend follows the standard Spring Boot layered design pattern:
   - **Entity Layer (`entity/Product.java`)**: Encapsulates database tables using JPA/Hibernate annotations.
   - **Repository Layer (`repository/ProductRepository.java`)**: Extends `JpaRepository` for data access.
   - **Service Layer (`service/ProductService.java`)**: Contains business logic, validation, and transaction handling.
   - **Controller Layer (`controller/ProductController.java`)**: Exposes RESTful HTTP endpoints with status codes (200, 201, 400, 404).
2. **Persistence vs Demo State:**
   - **Product Catalog (CRUD)**: Fully persisted into MySQL relational database `clothing_inventory`.
   - **Orders & Shipping Details**: Displayed as an interactive client simulation in the UI.
   - **Authentication**: Simulated educational login for role demonstration (Admin / User).
