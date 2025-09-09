import "./VehiclesAdmin.css"
import { useState, useEffect } from "react";
import axios from "axios";

export default function VehiclesAdmin() {
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [vehicles, setVehicles] = useState([]);

    const getVehicles = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/getvehiclesadmin`, {
                params: { district: selectedDistrict }
            });
            setVehicles(res.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/getdistrict`);
                setDistricts(res.data);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        fetchDistricts();
        getVehicles();
    }, []);

    const handleClick = async (id) => {
        try {
            const res = await axios.post(`http://localhost:5000/closedeal/`, { v_id: id });
            alert(res.data.message);
        } catch (error) {
            console.error("Error closing deal:", error);
            alert("Failed to close deal!");
        }
    };

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">
                    AutoAuction
                </a>
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

            </div>
        </nav>
        <div className="container">
                <h1 className="text-center my-4">View Vehicles Here</h1>

                <div className="d-flex justify-content-center mb-3">
                    {districts.length > 0 ? (
                        <select
                            className="form-select w-25"
                            name="district"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                        >
                            <option value="">Select District</option>
                            {districts.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>

                <div className="text-center mb-4">
                    <button className="btn btn-primary" onClick={getVehicles}>Fetch Vehicles</button>
                </div>

                <div id="vehicles-container" className="row">
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <div key={vehicle._id} className="col-md-4">
                                <div className="vehicle-card card p-3">
                                    <h3 className="text-center">{vehicle.name}</h3>
                                    <p><strong>Description:</strong> {vehicle.description}</p>
                                    <p><strong>Price:</strong> {vehicle.price}</p>
                                    <p><strong>Owner:</strong> {vehicle.cowner}</p>
                                    <p><strong>District:</strong> {vehicle.district}</p>
                                    <p><strong>Status:</strong> <span className="text-danger">{vehicle.status}</span></p>

                                    {vehicle.highest && (
                                        <>
                                            <p><strong>Highest bid:</strong> {vehicle.bid}</p>
                                            <p><strong>Buyer Mail ID:</strong> {vehicle.highest}</p>
                                        </>
                                    )}

                                    <div className="vehicle-images">
                                        <div id={`carousel${vehicle._id}`} className="carousel slide" data-bs-ride="carousel">
                                            <div className="carousel-inner">
                                                {vehicle.images.map((img, idx) => (
                                                    <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                                        <img src={`http://localhost:5000${img}`} className="d-block w-100" alt="Vehicle" />
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${vehicle._id}`} data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button className="carousel-control-next" type="button" data-bs-target={`#carousel${vehicle._id}`} data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    </div>

                                    <button onClick={() => handleClick(vehicle._id)} className="btn btn-success my-3">Close Deal</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No vehicles available.</p>
                    )}
                </div>
            </div>
            </>
    );
}
