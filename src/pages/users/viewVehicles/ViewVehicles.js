import "./ViewVehicles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ViewVehicles() {
    const { user } = useParams();

    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/getdistrict");
                setDistricts(res.data);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        fetchDistricts();
    }, []);

    useEffect(() => {
        if (selectedDistrict) {
            fetchVehicles();
        }
    }, [selectedDistrict]);

    const fetchVehicles = async () => {
        try {
            const res = await axios.get("http://localhost:5000/getvehicle", {
                params: { district: selectedDistrict },
            });
            setVehicles(res.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
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
        <div id="vehicle-container" className="container mt-5">
                <a id="view-buys-link" href={`/viewbuys/${user}`} className="btn btn-outline-dark mb-3">📜 View Buys</a>

                <h2 id="page-title" className="text-center text-primary">🚗 View Available Vehicles</h2>

                <div id="filter-section" className="d-flex justify-content-center mt-3">
                    <select
                        id="district-select"
                        name="district"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="form-select w-50"
                    >
                        <option value="">🏙 Select a District</option>
                        {districts.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div id="vehicles-container" className="row mt-4">
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle, index) => (
                            <div key={vehicle._id} className="col-md-4">
                                <div className="vehicle-card card shadow-lg p-3">
                                    <h3 className="text-center text-success vehicle-title">{vehicle.name}</h3>
                                    <p className="vehicle-description"><strong>Description:</strong> {vehicle.description}</p>
                                    <p className="vehicle-price"><strong>Price:</strong> Rs.{vehicle.price}</p>
                                    <p className="vehicle-owner"><strong>Owner:</strong> {vehicle.cowner}</p>
                                    <p className="vehicle-district"><strong>District:</strong> {vehicle.district}</p>

                                    <div className="vehicle-images">
                                        <div id={`carousel-${vehicle._id}`} className="carousel slide" data-bs-ride="carousel">
                                            <div className="carousel-inner">
                                                {vehicle.images.map((img, idx) => (
                                                    <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                                        <img src={`http://localhost:5000${img}`} className="d-block w-100 rounded vehicle-img" alt="Vehicle" />
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${vehicle._id}`} data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon"></span>
                                            </button>
                                            <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${vehicle._id}`} data-bs-slide="next">
                                                <span className="carousel-control-next-icon"></span>
                                            </button>
                                        </div>
                                    </div>

                                    <a href={`/bidding/${vehicle._id}/${user}`} className="btn btn-success w-100 my-3">💰 Place a Bid</a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted mt-5">
                            <h4>No vehicles found for the selected district.</h4>
                        </div>
                    )}
                </div>
            </div>
            </>
    );
}
