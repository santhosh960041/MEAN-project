import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddVenue() {
    const [address, setAddress] = useState({
        district: '',
        venue: '',
    });

    const handleClick = async () => {
        console.log(address);
        if (address.district !== '' && address.venue !== '') {
            const res = await axios.post(`http://localhost:5000/addvenue`, address);
            alert(res.data.message);
            setAddress({
                district: '',
                venue: '',
            });
        } else {
            alert("⚠️ Please fill in all details");
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
                                <a className="nav-link" href="/adminvehicle">🚗 Add Vehicles</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/vehiclesadmin">📋 View Vehicles</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <img id="background" src="/back.gif" alt="Background" />
            <div id="con" className="container text-center mt-5">
                <header className="mb-4">
                    <h1 className="text-danger">Add Venue</h1>
                    <p className="lead">Manage and add new auction venues easily.</p>
                </header>
                <div className="card mx-auto p-4 shadow-lg" style={{ maxWidth: "400px" }}>
                    <h2 className="mb-3">📍 Add Venue</h2>
                    <input
                        type="text"
                        className="form-control mb-3"
                        name="district"
                        value={address.district}
                        onChange={(e) => setAddress({ ...address, district: e.target.value })}
                        placeholder="🏙️ Enter District"
                    />
                    <textarea
                        className="form-control mb-3"
                        name="venue"
                        value={address.venue}
                        onChange={(e) => setAddress({ ...address, venue: e.target.value })}
                        placeholder="📍 Enter Venue Details"
                    />
                    <button className="btn btn-primary w-100" onClick={handleClick}>➕ Add Venue</button>
                </div>
                <footer className="mt-4">
                    <p className="text-muted">Ensure accurate venue details for seamless auction management. 🏠</p>
                </footer>
            </div>
        </>
    );
}
