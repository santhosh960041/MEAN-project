import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Bidding.css";

export default function Bidding() {
    const { id, user } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bidValue, setBidValue] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await axios.get("http://localhost:5000/getonevehicle", {
                    params: { v_id: id }
                });
                setVehicle(res.data);
            } catch (err) {
                console.error("Error fetching vehicle:", err);
                setError("Failed to load vehicle details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchVehicle();
    }, [id]);

    const updateBid = async () => {
        const amount = parseFloat(bidValue);
        if (isNaN(amount) || amount <= 0) {
            setMessage("Please enter a valid bid amount.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/updatebid", {
                bid: amount,
                vehicle_id: id,
                user: user
            });
            
            setMessage(res.data.message);
            if (res.status === 200) {
                setVehicle((prev) => ({ ...prev, bid: res.data.vehicle.bid }));
            }
        } catch (err) {
            console.error("Error updating bid:", err);
            setMessage("Error updating bid. Please try again.");
        }
    };

    if (loading) return <p>Loading vehicle details...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="bidding-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="/">AutoAuction</a>
                </div>
            </nav>

            <div className="container mt-5 vehicle-details">
                {vehicle ? (
                    <div className="row">
                        <div className="col-md-8">
                            <h2 className="vehicle-title">{vehicle.name}</h2>
                            <p>{vehicle.description}</p>
                            <p><strong>Initial Price:</strong> Rs.{vehicle.price}</p>
                            <p><strong>Owner:</strong> {vehicle.cowner}</p>
                            <p><strong>District:</strong> {vehicle.district}</p>
                        </div>
                        <div className="col-md-4">
                            <div id={`carousel-${id}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {vehicle.images.map((img, idx) => (
                                        <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                            <img
                                                src={`http://localhost:5000${img}`}
                                                className="d-block w-100 vehicle-image"
                                                alt="Vehicle"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${id}`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${id}`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No vehicle found.</p>
                )}

                <div className="bid-section">
                    <h3 className="bid-title">Add Bid Amount</h3>
                    <div className="bid-input-container">
                        <input
                            type="number"
                            id="bid-input"
                            value={bidValue}
                            onChange={(e) => setBidValue(e.target.value)}
                            min="1"
                            step="500"
                            placeholder="Enter bid amount"
                            className="bid-input"
                        />
                        <button onClick={updateBid} className="bid-button">Place Bid</button>
                    </div>
                    {message && <div className="bid-message">{message}</div>}
                </div>
            </div>
        </div>
    );
}
