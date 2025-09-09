import "./Buys.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom'

export default function Buys() {

    const { user } = useParams()

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        fetchVehicles();
    }, [user]);

    const fetchVehicles = async () => {
        try {
            const res = await axios.get("http://localhost:5000/getvehicleuser", {
                params: { user: user }
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
            <div id="vehicles-container" className="row mt-4">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                        <div key={index} className="col-md-4">
                            <div className="vehicle-card card p-3">
                                <h3 className="text-center">{vehicle.name}</h3>
                                <p><strong>Description:</strong> {vehicle.description}</p>
                                <p><strong>Price:</strong> {vehicle.price}</p>
                                <p><strong>Quoted Amount:</strong> {vehicle.bid}</p>
                                <p><strong>Owner:</strong> {vehicle.cowner}</p>
                                <p><strong>District:</strong> {vehicle.district}</p>

                                <div className="vehicle-images">
                                    <div id={`carousel${index}`} className="carousel slide" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            {vehicle.images.map((img, idx) => (
                                                <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                                    <img src={`http://localhost:5000${img}`} className="d-block w-100" alt="Vehicle" style={{ width: "400px", height: "250px" }} />
                                                </div>
                                            ))}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${index}`} data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel${index}`} data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <p className="text-danger mx-2 my-4 h5"><strong>Venue :</strong> {vehicle.venue}</p>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <>

                    </>
                )}
            </div>
        </>
    )
}