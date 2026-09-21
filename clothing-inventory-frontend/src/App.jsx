import { useState } from "react";

function App() {
  const [page, setPage] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const login = async () => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.role === "ADMIN" || data.role === "USER") {
        setRole(data.role);
        setPage("dashboard");
        setMessage("");
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      setMessage("Unable to connect to Spring Boot backend.");
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/products");
      const data = await response.json();

      setProducts(data);
      setPage("products");
    } catch (error) {
      alert("Unable to connect to Spring Boot backend.");
    }
  };

  const addProduct = async () => {
    try {
      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: productName,
          category: category,
          size: size,
          color: color,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });

      if (response.ok) {
        alert("Product added successfully");

        setProductName("");
        setCategory("");
        setSize("");
        setColor("");
        setQuantity("");
        setPrice("");

        getProducts();
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      alert("Unable to connect to Spring Boot backend.");
    }
  };

  const logout = () => {
    setUsername("");
    setPassword("");
    setRole("");
    setProducts([]);
    setPage("login");
  };

  if (page === "login") {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1>Clothing Inventory</h1>

          <h2>Login</h2>

          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={login}>
            Login
          </button>

          {message && <p style={styles.error}>{message}</p>}

          <div style={styles.loginInfo}>
            <p>Admin: admin / admin123</p>
            <p>User: user / user123</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === "dashboard") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1>Clothing Inventory Management</h1>
            <p>
              Welcome, {username} ({role})
            </p>
          </div>

          <button style={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>

        <div style={styles.dashboard}>
          <div style={styles.card} onClick={getProducts}>
            <h2>Products</h2>
            <p>View all products</p>
          </div>

          {role === "ADMIN" && (
            <div
              style={styles.card}
              onClick={() => setPage("addProduct")}
            >
              <h2>Add Product</h2>
              <p>Add a new clothing product</p>
            </div>
          )}

          <div
            style={styles.card}
            onClick={() => setPage("orders")}
          >
            <h2>Orders</h2>
            <p>Place an order</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === "products") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Product List</h1>

          <button
            style={styles.logoutButton}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Size</th>
              <th style={styles.th}>Color</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Price</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td style={styles.td}>{product.productId}</td>
                <td style={styles.td}>{product.productName}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>{product.size}</td>
                <td style={styles.td}>{product.color}</td>
                <td style={styles.td}>{product.quantity}</td>
                <td style={styles.td}>₹{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (page === "addProduct") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Add Product</h1>

          <button
            style={styles.logoutButton}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
        </div>

        <div style={styles.formBox}>
          <input
            style={styles.input}
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button style={styles.button} onClick={addProduct}>
            Add Product
          </button>
        </div>
      </div>
    );
  }

  if (page === "orders") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Place Order</h1>

          <button
            style={styles.logoutButton}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
        </div>

        <div style={styles.formBox}>
          <h2>Order Management</h2>

          <p>Order functionality will be connected to the backend here.</p>

          <button
            style={styles.button}
            onClick={() => alert("Order page ready")}
          >
            Place Order
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    fontFamily: "Arial, sans-serif",
  },

  loginBox: {
    width: "350px",
    padding: "35px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  container: {
    minHeight: "100vh",
    padding: "30px",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  dashboard: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    width: "220px",
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },

  formBox: {
    maxWidth: "500px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  button: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#646cff",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    marginRight: "10px",
  },

  logoutButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#555",
    color: "white",
    cursor: "pointer",
  },

  error: {
    color: "red",
  },

  loginInfo: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#666",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },

  th: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#eee",
    textAlign: "left",
  },

  td: {
    border: "1px solid #ddd",
    padding: "12px",
  },
};

export default App;