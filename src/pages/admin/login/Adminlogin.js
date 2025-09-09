import "./AdminLogin.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        if (!user.email || !user.password) {
            alert('⚠️ Please fill in both fields');
            return;
        }

        try {
            if (user.email === 'admin@gmail.com' && user.password === 'admin') {
                navigate(`/admindash`);
            }
        } catch (error) {
            alert('❌ An error occurred during login.');
            console.error(error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="/">AutoAuction</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/userregister">📝 Register</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/admin">🔐 Admin Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <img id="background" src="/back.gif" alt="..." />
            <div id="con" className="container text-center mt-5">
                <header className="mb-4">
                    <h1 className="text-danger">Welcome to AutoAuction</h1>
                    <p className="lead">Manage and oversee vehicle auctions effortlessly.</p>
                </header>
                <div className="card mx-auto p-4 shadow-lg" style={{ maxWidth: "400px" }}>
                    <h2 className="mb-3">🔐 Admin Login</h2>
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
                    <button className="btn btn-primary w-100" onClick={handleLogin}>🚀 Login</button>
                </div>
                <footer className="mt-4">
                    <p className="text-muted">Securely manage the auction platform and oversee transactions. 🚔</p>
                </footer>
            </div>
        </>
    );
}
