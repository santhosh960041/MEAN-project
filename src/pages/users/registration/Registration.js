import "./Registration.css";
import { useState } from "react";
import axios from "axios";

export default function Registration() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.password) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/userregister", user);
      alert(`✅ ${res.data.message}`);
    } catch (error) {
      alert("❌ An error occurred during registration.");
      console.error(error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            AutoAuction
          </a>
        </div>
      </nav>

      <img id="background" src="/back.gif" alt="..." />

      <div id="con" className="container text-center mt-5">
        <header className="mb-4">
          <h1 className="text-danger">Join AutoAuction</h1>
          <p className="lead">Register to start bidding on seized vehicles.</p>
        </header>
        <div className="card mx-auto p-4 shadow-lg" style={{ maxWidth: "400px" }}>
          <h2 className="mb-3">📝 User Registration</h2>
          <input
            type="text"
            className="form-control mb-3"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="👤 Enter Your Name"
          />
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="📧 Enter Your Email"
          />
          <input
            type="password"
            className="form-control mb-3"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="🔒 Enter Your Password"
          />
          <button className="btn btn-primary w-100" onClick={handleRegister}>
            🚀 Register
          </button>
          <div className="mt-3">
            <a href="/">🔑 Already have an account? Login</a>
          </div>
        </div>
        <footer className="mt-4">
          <p className="text-muted">Start bidding on vehicles today! 🚗💨</p>
        </footer>
      </div>
    </>
  );
}
