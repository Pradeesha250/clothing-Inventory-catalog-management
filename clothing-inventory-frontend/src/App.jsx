import { useState } from "react";

// Use environment variable for backend API URL in production, falling back to localhost:8080 for local development
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [page, setPage] = useState("login"); // "login" | "register" | "home" | "products" | "add" | "order" | "shop"

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");

  // Registration State
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState("USER");

  // Product Catalog State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "success" | "error"

  // Demo Orders & Shipping State (Client-side simulation only; not persisted to MySQL)
  const [orderCustomer, setOrderCustomer] = useState("");
  const [orderProduct, setOrderProduct] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [placedOrders, setPlacedOrders] = useState([
    {
      orderId: "ORD-101",
      customer: "Priya",
      product: "T-Shirt",
      quantity: 2,
      address: "Chennai, Tamil Nadu",
      status: "In Transit",
      date: "2026-10-10",
    },
    {
      orderId: "ORD-102",
      customer: "Arun",
      product: "Jeans",
      quantity: 1,
      address: "Coimbatore, Tamil Nadu",
      status: "Delivered",
      date: "2026-10-09",
    },
  ]);

  // Shop Details State (Client-side profile; not persisted to MySQL)
  const [shopInfo, setShopInfo] = useState({
    shopName: "Urban Trendz Apparel & Catalog",
    tagline: "Quality clothing inventory and retail catalog management",
    contactEmail: "contact@urbantrendz.local",
    contactPhone: "+91 98765 43210",
    address: "12/4 Fashion Avenue, T. Nagar, Chennai - 600017",
    businessHours: "Monday - Saturday: 9:30 AM - 9:00 PM",
    currency: "INR (₹)",
    catalogStatus: "Connected to MySQL Database",
  });

  const showNotification = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${API}/products`);

      if (!response.ok) {
        showNotification("Failed to fetch products from backend", "error");
        setLoadingProducts(false);
        return;
      }

      const data = await response.json();
      setProducts(data);
      setLoadingProducts(false);
    } catch (err) {
      console.error("Error loading products:", err);
      showNotification("Cannot connect to Spring Boot backend API. Ensure backend is running on " + API, "error");
      setLoadingProducts(false);
    }
  };

  const login = async () => {
    if (!username || !password) {
      showNotification("Please enter both username and password", "error");
      return;
    }

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.role === "INVALID") {
        showNotification(data.message || "Invalid username or password", "error");
        return;
      }

      setUser(data.username || username);
      setUserRole(data.role || "USER");
      showNotification("Login successful! Welcome, " + (data.username || username), "success");
      setPage("home");
      loadProducts();
    } catch (err) {
      console.error("Login fetch error:", err);
      showNotification("Cannot connect to Spring Boot backend at " + API + ". Please check if backend is running.", "error");
    }
  };

  const register = async () => {
    if (!regUsername || !regPassword) {
      showNotification("Please enter both username and password", "error");
      return;
    }

    if (regPassword.length < 4) {
      showNotification("Password must be at least 4 characters long", "error");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: regUsername.trim(),
          password: regPassword.trim(),
          role: regRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification(data.message || "Registration failed", "error");
        return;
      }

      showNotification(
        `User "${data.username}" registered successfully with BCrypt hashing! Please log in now.`,
        "success"
      );
      setUsername(data.username);
      setPassword("");
      setRegUsername("");
      setRegPassword("");
      setRegConfirmPassword("");
      setPage("login");
    } catch (err) {
      console.error("Registration fetch error:", err);
      showNotification("Cannot connect to Spring Boot backend at " + API + ". Please ensure backend is running.", "error");
    }
  };

  const handleFillDemoCreds = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setMessage("");
  };

  const clearForm = () => {
    setProductName("");
    setCategory("");
    setSize("");
    setColor("");
    setQuantity("");
    setPrice("");
    setEditingId(null);
  };

  const addProduct = async () => {
    if (!productName || !category || !size || !color || quantity === "" || price === "") {
      showNotification("Please fill in all product fields", "error");
      return;
    }

    if (Number(quantity) < 0 || Number(price) < 0) {
      showNotification("Quantity and Price must be positive values", "error");
      return;
    }

    const productPayload = {
      productName: productName.trim(),
      category: category.trim(),
      size: size.trim(),
      color: color.trim(),
      quantity: Number(quantity),
      price: Number(price),
    };

    try {
      const response = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || "Failed to add product to database", "error");
        return;
      }

      const savedProduct = await response.json();
      showNotification(`Product "${savedProduct.productName}" added successfully to MySQL!`, "success");
      clearForm();
      loadProducts();
      setPage("products");
    } catch (err) {
      console.error("Add product error:", err);
      showNotification("Cannot connect to Spring Boot backend", "error");
    }
  };

  const updateProduct = async () => {
    if (!editingId) {
      showNotification("No product selected for update", "error");
      return;
    }

    if (!productName || !category || !size || !color || quantity === "" || price === "") {
      showNotification("Please fill in all product fields", "error");
      return;
    }

    if (Number(quantity) < 0 || Number(price) < 0) {
      showNotification("Quantity and Price must be positive values", "error");
      return;
    }

    const productPayload = {
      productName: productName.trim(),
      category: category.trim(),
      size: size.trim(),
      color: color.trim(),
      quantity: Number(quantity),
      price: Number(price),
    };

    try {
      const response = await fetch(`${API}/products/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || "Failed to update product in database", "error");
        return;
      }

      showNotification(`Product ID #${editingId} updated successfully in MySQL!`, "success");
      clearForm();
      loadProducts();
      setPage("products");
    } catch (err) {
      console.error("Update product error:", err);
      showNotification("Cannot connect to Spring Boot backend", "error");
    }
  };

  const deleteProduct = async (id) => {
    if (!id) {
      showNotification("Invalid product ID", "error");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete Product #${id} from MySQL?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || "Failed to delete product from database", "error");
        return;
      }

      showNotification(`Product #${id} deleted successfully from MySQL!`, "success");
      loadProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      showNotification("Cannot connect to Spring Boot backend", "error");
    }
  };

  const editProduct = (product) => {
    const id = product.productId ?? product.id;
    setEditingId(id);
    setProductName(product.productName || "");
    setCategory(product.category || "");
    setSize(product.size || "");
    setColor(product.color || "");
    setQuantity(product.quantity !== undefined ? product.quantity : "");
    setPrice(product.price !== undefined ? product.price : "");
    setPage("add");
    showNotification(`Editing Product #${id}`, "info");
  };

  const logout = () => {
    setUser("");
    setUserRole("");
    setUsername("");
    setPassword("");
    setPage("login");
    clearForm();
    setMessage("");
  };

  const createOrder = (e) => {
    e.preventDefault();
    if (!orderCustomer || !orderProduct || !orderQuantity || !shippingAddress) {
      showNotification("Please fill in all order and shipping details", "error");
      return;
    }

    const newOrder = {
      orderId: `ORD-${Date.now().toString().slice(-4)}`,
      customer: orderCustomer.trim(),
      product: orderProduct.trim(),
      quantity: Number(orderQuantity),
      address: shippingAddress.trim(),
      status: "Processing (Demo)",
      date: new Date().toISOString().split("T")[0],
    };

    setPlacedOrders([newOrder, ...placedOrders]);
    showNotification(`Demo Order ${newOrder.orderId} placed successfully! (Client simulation only)`, "success");

    setOrderCustomer("");
    setOrderProduct("");
    setOrderQuantity("");
    setShippingAddress("");
  };

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    const name = (p.productName || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    const clr = (p.color || "").toLowerCase();
    const sz = (p.size || "").toLowerCase();
    return name.includes(query) || cat.includes(query) || clr.includes(query) || sz.includes(query);
  });

  // Calculate dashboard inventory statistics
  const totalItemsCount = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + (Number(p.quantity) || 0) * (Number(p.price) || 0),
    0
  );
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))].length;

  // --- RENDER REGISTRATION VIEW ---
  if (page === "register") {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <div style={styles.loginHeader}>
            <span style={styles.brandBadge}>MySQL Database Storage</span>
            <h1 style={styles.loginTitle}>Create New Account</h1>
            <p style={styles.loginSubtitle}>Register user with BCrypt password hashing</p>
          </div>

          <div style={styles.loginForm}>
            <label style={styles.inputLabel}>New Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Choose a username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
            />

            <label style={styles.inputLabel}>Password (Min 4 chars)</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Create a password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />

            <label style={styles.inputLabel}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm your password"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && register()}
            />

            <label style={styles.inputLabel}>Account Role</label>
            <select
              style={styles.input}
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
            >
              <option value="USER">Standard User (USER)</option>
              <option value="ADMIN">Administrator (ADMIN)</option>
            </select>

            <button style={styles.successButton} onClick={register}>
              Register Account in MySQL
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => {
                setPage("login");
                setMessage("");
              }}
            >
              ← Back to Login
            </button>
          </div>

          {message && (
            <div
              style={{
                ...styles.notification,
                marginTop: "16px",
                ...(messageType === "error"
                  ? styles.notifError
                  : messageType === "success"
                  ? styles.notifSuccess
                  : styles.notifInfo),
              }}
            >
              {message}
            </div>
          )}

          <div style={styles.demoBox}>
            <p style={styles.demoDisclaimer}>
              🔐 <b>Security Note:</b> Passwords are encrypted using BCrypt salted hashing before saving into MySQL table <code>users</code>.
              Plain-text passwords are never stored. For production environments, further safeguards like HTTPS, JWT tokens, and rate-limiting are recommended.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN VIEW ---
  if (page === "login") {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <div style={styles.loginHeader}>
            <span style={styles.brandBadge}>MySQL Database Auth</span>
            <h1 style={styles.loginTitle}>Clothing Inventory Catalog</h1>
            <p style={styles.loginSubtitle}>Management System</p>
          </div>

          <div style={styles.loginForm}>
            <label style={styles.inputLabel}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />

            <label style={styles.inputLabel}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />

            <button style={styles.button} onClick={login}>
              Log In (Verify with MySQL)
            </button>

            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>Need a new account? </span>
              <button
                type="button"
                style={styles.linkButton}
                onClick={() => {
                  setPage("register");
                  setMessage("");
                }}
              >
                Register Here
              </button>
            </div>
          </div>

          {message && (
            <div
              style={{
                ...styles.notification,
                marginTop: "16px",
                ...(messageType === "error"
                  ? styles.notifError
                  : messageType === "success"
                  ? styles.notifSuccess
                  : styles.notifInfo),
              }}
            >
              {message}
            </div>
          )}

          <div style={styles.demoBox}>
            <p style={styles.demoTitle}>Default Database Users (BCrypt Stored in MySQL):</p>
            <div style={styles.demoButtonsRow}>
              <button
                type="button"
                style={styles.demoPill}
                onClick={() => handleFillDemoCreds("admin", "admin123")}
              >
                Admin: admin / admin123
              </button>
              <button
                type="button"
                style={styles.demoPill}
                onClick={() => handleFillDemoCreds("user", "user123")}
              >
                User: user / user123
              </button>
            </div>
            <p style={styles.demoDisclaimer}>
              🔐 Authentication validates against MySQL database table <code>users</code> using BCrypt hashing.
              Note: This educational authentication verifies passwords against MySQL, but does not yet include production features like JWT session expiry, OAuth2, or brute-force lockouts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN APPLICATION VIEW ---
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Clothing Inventory Catalog Management System</h1>
          <span style={styles.headerSub}>MySQL Database: clothing_inventory | Spring Boot 3.2</span>
        </div>

        <div style={styles.headerUserSection}>
          <span style={styles.userBadge}>
            Role: <b>{userRole}</b>
          </span>
          <span style={styles.userName}>
            Logged in as: <b>{user}</b>
          </span>
          <button style={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <nav style={styles.nav}>
        <button
          style={page === "home" ? styles.navButtonActive : styles.navButton}
          onClick={() => setPage("home")}
        >
          Dashboard
        </button>
        <button
          style={page === "products" ? styles.navButtonActive : styles.navButton}
          onClick={() => {
            setPage("products");
            loadProducts();
          }}
        >
          Products Catalog ({products.length})
        </button>
        <button
          style={page === "add" ? styles.navButtonActive : styles.navButton}
          onClick={() => {
            if (!editingId) clearForm();
            setPage("add");
          }}
        >
          {editingId ? `Edit Product #${editingId}` : "+ Add Product"}
        </button>
        <button
          style={page === "order" ? styles.navButtonActive : styles.navButton}
          onClick={() => setPage("order")}
        >
          Orders & Shipping (Demo)
        </button>
        <button
          style={page === "shop" ? styles.navButtonActive : styles.navButton}
          onClick={() => setPage("shop")}
        >
          Shop Details
        </button>
      </nav>

      {message && (
        <div
          style={{
            ...styles.notification,
            ...(messageType === "error"
              ? styles.notifError
              : messageType === "success"
              ? styles.notifSuccess
              : styles.notifInfo),
          }}
        >
          <span>{message}</span>
          <button
            style={styles.closeNotifBtn}
            onClick={() => setMessage("")}
            title="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* --- DASHBOARD TAB --- */}
      {page === "home" && (
        <main style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2>Inventory Dashboard Overview</h2>
            <span style={styles.liveBadge}>● Real MySQL Database Connected</span>
          </div>

          <div style={styles.cards}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>Total Catalog Products</div>
              <div style={styles.cardValue}>{products.length}</div>
              <div style={styles.cardMeta}>Unique product records in MySQL</div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>Total Units In Stock</div>
              <div style={styles.cardValue}>{totalItemsCount}</div>
              <div style={styles.cardMeta}>Aggregated inventory pieces</div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>Total Inventory Value</div>
              <div style={styles.cardValue}>₹{totalInventoryValue.toLocaleString("en-IN")}</div>
              <div style={styles.cardMeta}>Calculated from quantity × price</div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>Active Categories</div>
              <div style={styles.cardValue}>{uniqueCategories}</div>
              <div style={styles.cardMeta}>Clothing classifications</div>
            </div>
          </div>

          <div style={styles.twoColumn}>
            <div style={styles.section}>
              <h3>Product Inventory Actions</h3>
              <p style={styles.textMuted}>
                The catalog connects directly to the Spring Boot REST API layer and persists all additions, edits,
                and deletions to the MySQL database `clothing_inventory`.
              </p>
              <div style={styles.actionButtonsRow}>
                <button
                  style={styles.button}
                  onClick={() => {
                    setPage("products");
                    loadProducts();
                  }}
                >
                  View Product Catalog Table
                </button>
                <button
                  style={styles.secondaryButton}
                  onClick={() => {
                    clearForm();
                    setPage("add");
                  }}
                >
                  + Add New Clothing Item
                </button>
              </div>
            </div>

            <div style={styles.section}>
              <h3>System Architecture & Status</h3>
              <ul style={styles.featureList}>
                <li>
                  <b>Frontend:</b> React 19 + Vite (Running on port 5173)
                </li>
                <li>
                  <b>Backend:</b> Spring Boot 3.2.3 REST APIs (Port 8080)
                </li>
                <li>
                  <b>Database:</b> MySQL 26.7 (`clothing_inventory` tables `products`, `users`)
                </li>
                <li>
                  <b>Authentication:</b> MySQL database storage with BCrypt hashing (`/register`, `/login`)
                </li>
                <li>
                  <b>ORM Layer:</b> Spring Data JPA & Hibernate 6.4
                </li>
                <li>
                  <b>Persistence Status:</b> <span style={{ color: "#27ae60", fontWeight: "bold" }}>Active & Verified</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      )}

      {/* --- PRODUCTS CATALOG TAB --- */}
      {page === "products" && (
        <main style={styles.container}>
          <div style={styles.sectionHeader}>
            <div>
              <h2>Clothing Inventory Catalog</h2>
              <p style={styles.textMuted}>
                Live products retrieved from MySQL table `products`. All CRUD operations persist permanently.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={styles.button}
                onClick={loadProducts}
                disabled={loadingProducts}
              >
                {loadingProducts ? "Refreshing..." : "↻ Refresh From DB"}
              </button>
              <button
                style={styles.successButton}
                onClick={() => {
                  clearForm();
                  setPage("add");
                }}
              >
                + Add New Product
              </button>
            </div>
          </div>

          <div style={styles.filterBar}>
            <input
              style={styles.searchInput}
              placeholder="🔍 Search products by name, category, size, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span style={styles.filterCount}>
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product ID</th>
                  <th style={styles.th}>Product Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Color</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Total Value</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={styles.emptyTable}>
                      {loadingProducts
                        ? "Loading products from MySQL..."
                        : searchQuery
                        ? "No products match the search query."
                        : "No products in database. Click '+ Add New Product' to create one."}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const id = product.productId ?? product.id;
                    const stock = Number(product.quantity) || 0;
                    const priceVal = Number(product.price) || 0;
                    const totalVal = stock * priceVal;

                    return (
                      <tr key={id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.idBadge}>#{id}</span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: "600" }}>{product.productName}</td>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>{product.category}</span>
                        </td>
                        <td style={styles.td}>{product.size}</td>
                        <td style={styles.td}>
                          <span style={styles.colorPill}>{product.color}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={stock <= 5 ? styles.stockLow : styles.stockNormal}>
                            {stock} {stock <= 5 && "(Low)"}
                          </span>
                        </td>
                        <td style={styles.td}>₹{priceVal.toLocaleString("en-IN")}</td>
                        <td style={styles.td}>₹{totalVal.toLocaleString("en-IN")}</td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button
                              style={styles.editButton}
                              onClick={() => editProduct(product)}
                              title="Edit product"
                            >
                              Update
                            </button>
                            <button
                              style={styles.deleteButton}
                              onClick={() => deleteProduct(id)}
                              title="Delete product from database"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* --- ADD / EDIT PRODUCT TAB --- */}
      {page === "add" && (
        <main style={styles.container}>
          <div style={styles.sectionHeader}>
            <div>
              <h2>{editingId ? `Update Product #${editingId}` : "Add New Clothing Item"}</h2>
              <p style={styles.textMuted}>
                {editingId
                  ? `Modifying existing record #${editingId} in MySQL table products.`
                  : "Insert a new clothing record into MySQL database with auto-generated ID."}
              </p>
            </div>
            {editingId && (
              <button
                style={styles.secondaryButton}
                onClick={() => {
                  clearForm();
                  setPage("products");
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div style={styles.formCard}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>
                  Product Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="e.g. Linen Cotton Shirt"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>
                  Category <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="e.g. Formal, Casual, Clothing, Denim"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>
                  Size <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="e.g. S, M, L, XL, 32, 34"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>
                  Color <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="e.g. Black, Navy Blue, White"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>
                  Stock Quantity <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  placeholder="e.g. 25"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>
                  Unit Price (₹) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1299.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formActions}>
              {editingId ? (
                <button style={styles.button} onClick={updateProduct}>
                  💾 Save Updates to MySQL
                </button>
              ) : (
                <button style={styles.successButton} onClick={addProduct}>
                  ➕ Save Product to MySQL
                </button>
              )}

              <button style={styles.cancelButton} onClick={clearForm}>
                Clear Form
              </button>

              <button
                style={styles.secondaryButton}
                onClick={() => setPage("products")}
              >
                Back to Product List
              </button>
            </div>
          </div>
        </main>
      )}

      {/* --- ORDERS & SHIPPING TAB --- */}
      {page === "order" && (
        <main style={styles.container}>
          <div style={styles.sectionHeader}>
            <div>
              <h2>Order & Shipping Management</h2>
              <p style={styles.textMuted}>
                Customer ordering and dispatch tracking interface.
              </p>
            </div>
          </div>

          <div style={styles.disclaimerBanner}>
            <b>⚠️ Academic Demo Notice:</b> Order placement and Shipping records shown below operate in frontend state
            for display and demonstration purposes. Unlike the Product Catalog (which is fully persisted in MySQL),
            orders and shipping do not yet have dedicated backend JPA repositories or MySQL tables.
          </div>

          <div style={styles.twoColumn}>
            <div style={styles.formCard}>
              <h3>Place Simulated Customer Order</h3>
              <form onSubmit={createOrder}>
                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Customer Name</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. Rajesh Kumar"
                    value={orderCustomer}
                    onChange={(e) => setOrderCustomer(e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Select Product</label>
                  <select
                    style={styles.input}
                    value={orderProduct}
                    onChange={(e) => setOrderProduct(e.target.value)}
                  >
                    <option value="">-- Choose a product from catalog --</option>
                    {products.map((p) => {
                      const id = p.productId ?? p.id;
                      return (
                        <option key={id} value={p.productName}>
                          {p.productName} ({p.size}, {p.color}) - ₹{p.price}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Order Quantity</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Shipping Address</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Enter complete shipping address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>

                <button style={styles.button} type="submit">
                  Place Order (Simulated)
                </button>
              </form>
            </div>

            <div style={styles.section}>
              <h3>Recent Order Dispatch Status</h3>
              <div style={styles.orderList}>
                {placedOrders.map((ord) => (
                  <div key={ord.orderId} style={styles.orderItem}>
                    <div style={styles.orderItemHeader}>
                      <b>{ord.orderId}</b>
                      <span
                        style={
                          ord.status === "Delivered"
                            ? styles.statusDelivered
                            : styles.statusTransit
                        }
                      >
                        {ord.status}
                      </span>
                    </div>
                    <div style={styles.orderItemBody}>
                      <p>
                        <b>Customer:</b> {ord.customer} | <b>Date:</b> {ord.date}
                      </p>
                      <p>
                        <b>Item:</b> {ord.product} × {ord.quantity} pcs
                      </p>
                      <p>
                        <b>Ship to:</b> {ord.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- SHOP DETAILS TAB --- */}
      {page === "shop" && (
        <main style={styles.container}>
          <div style={styles.sectionHeader}>
            <div>
              <h2>Shop & Store Profile</h2>
              <p style={styles.textMuted}>
                Retail storefront configuration, business details, and system contact information.
              </p>
            </div>
          </div>

          <div style={styles.disclaimerBanner}>
            <b>ℹ️ Store Configuration Note:</b> Shop metadata is maintained in frontend application state for
            branding and presentation. It does not alter MySQL schema tables.
          </div>

          <div style={styles.formCard}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Store / Shop Name</label>
                <input
                  style={styles.input}
                  value={shopInfo.shopName}
                  onChange={(e) => setShopInfo({ ...shopInfo, shopName: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Tagline / Description</label>
                <input
                  style={styles.input}
                  value={shopInfo.tagline}
                  onChange={(e) => setShopInfo({ ...shopInfo, tagline: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Contact Email</label>
                <input
                  style={styles.input}
                  value={shopInfo.contactEmail}
                  onChange={(e) => setShopInfo({ ...shopInfo, contactEmail: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Contact Phone</label>
                <input
                  style={styles.input}
                  value={shopInfo.contactPhone}
                  onChange={(e) => setShopInfo({ ...shopInfo, contactPhone: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Physical Store Address</label>
                <input
                  style={styles.input}
                  value={shopInfo.address}
                  onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Business Operating Hours</label>
                <input
                  style={styles.input}
                  value={shopInfo.businessHours}
                  onChange={(e) => setShopInfo({ ...shopInfo, businessHours: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Currency Symbol</label>
                <input
                  style={styles.input}
                  value={shopInfo.currency}
                  onChange={(e) => setShopInfo({ ...shopInfo, currency: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.inputLabel}>Database Status</label>
                <input
                  style={styles.input}
                  disabled
                  value={shopInfo.catalogStatus}
                />
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                style={styles.successButton}
                onClick={() => showNotification("Shop details updated in active session!", "success")}
              >
                Save Profile Changes (Session)
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "20px",
  },

  loginBox: {
    width: "440px",
    maxWidth: "100%",
    padding: "36px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
    boxSizing: "border-box",
  },

  loginHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },

  brandBadge: {
    background: "#e0e7ff",
    color: "#4338ca",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  loginTitle: {
    margin: "12px 0 4px 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
  },

  loginSubtitle: {
    margin: "0",
    fontSize: "13px",
    color: "#64748b",
  },

  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  inputLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "2px",
    display: "block",
  },

  app: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1e293b",
  },

  header: {
    background: "#0f172a",
    color: "white",
    padding: "16px 36px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  headerTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  headerSub: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  headerUserSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  userBadge: {
    background: "#334155",
    color: "#38bdf8",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
  },

  userName: {
    fontSize: "14px",
    color: "#e2e8f0",
  },

  nav: {
    background: "#ffffff",
    padding: "12px 36px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  navButton: {
    background: "transparent",
    color: "#475569",
    border: "1px solid transparent",
    padding: "9px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.15s ease",
  },

  navButtonActive: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "1px solid #4f46e5",
    padding: "9px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
  },

  container: {
    maxWidth: "1200px",
    margin: "24px auto",
    padding: "0 24px 48px 24px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },

  liveBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },

  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  cardHeader: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },

  cardValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },

  cardMeta: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
  },

  section: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  formCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
  },

  formActions: {
    marginTop: "24px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    background: "#f8fafc",
    color: "#1e293b",
  },

  searchInput: {
    flex: "1",
    padding: "11px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#ffffff",
    minWidth: "260px",
  },

  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },

  filterCount: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "500",
  },

  textarea: {
    width: "100%",
    height: "90px",
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#f8fafc",
    fontFamily: "inherit",
  },

  button: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background 0.15s ease",
  },

  successButton: {
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  secondaryButton: {
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },

  linkButton: {
    background: "transparent",
    border: "none",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
  },

  logoutButton: {
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },

  cancelButton: {
    background: "#94a3b8",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },

  editButton: {
    background: "#f59e0b",
    color: "#ffffff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  deleteButton: {
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  actionButtons: {
    display: "flex",
    gap: "6px",
  },

  actionButtonsRow: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
    flexWrap: "wrap",
  },

  tableContainer: {
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },

  th: {
    background: "#f8fafc",
    color: "#475569",
    padding: "14px 18px",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "14px 18px",
    color: "#334155",
    verticalAlign: "middle",
  },

  emptyTable: {
    padding: "36px",
    textAlign: "center",
    color: "#64748b",
  },

  idBadge: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "12px",
  },

  categoryBadge: {
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },

  colorPill: {
    background: "#f3f4f6",
    color: "#374151",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "12px",
  },

  stockNormal: {
    color: "#16a34a",
    fontWeight: "600",
  },

  stockLow: {
    color: "#dc2626",
    fontWeight: "700",
  },

  notification: {
    maxWidth: "1200px",
    margin: "16px auto 0 auto",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
  },

  notifInfo: {
    background: "#e0f2fe",
    color: "#0369a1",
    border: "1px solid #bae6fd",
  },

  notifSuccess: {
    background: "#dcfce7",
    color: "#15803d",
    border: "1px solid #bbf7d0",
  },

  notifError: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },

  closeNotifBtn: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "inherit",
    padding: "0 4px",
  },

  demoBox: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },

  demoTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "10px",
    textAlign: "center",
  },

  demoButtonsRow: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "12px",
  },

  demoPill: {
    background: "#f1f5f9",
    color: "#334155",
    border: "1px solid #cbd5e1",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "500",
  },

  demoDisclaimer: {
    fontSize: "11px",
    color: "#94a3b8",
    lineHeight: "1.5",
    margin: 0,
    textAlign: "center",
  },

  disclaimerBanner: {
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
    padding: "14px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: "1.5",
    marginBottom: "20px",
  },

  textMuted: {
    fontSize: "13px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },

  featureList: {
    margin: "12px 0 0 0",
    paddingLeft: "20px",
    fontSize: "14px",
    lineHeight: "2",
    color: "#334155",
  },

  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "14px",
  },

  orderItem: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    background: "#f8fafc",
  },

  orderItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  orderItemBody: {
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.6",
    margin: 0,
  },

  statusDelivered: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  statusTransit: {
    background: "#fef3c7",
    color: "#b45309",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "bold",
  },
};

export default App;