import { useState, useEffect } from "react";
import axios from "axios";

export default function Addvehicle() {
    const [districts, setDistricts] = useState([]);
    const [vehicle, setVehicle] = useState({
        name: '',
        description: '',
        price: '',
        cowner: '',
        images: [],
        district: '',
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/getdistrict`);
                setDistricts(res.data);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        fetchDistricts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setVehicle(prev => ({
            ...prev,
            images: [...prev.images, ...files],
        }));

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (index) => {
        setVehicle(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleAdd = async () => {
        if (!vehicle.name || !vehicle.description || !vehicle.price || !vehicle.cowner || !vehicle.district || vehicle.images.length === 0) {
            alert("Please fill all fields and upload at least one image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", vehicle.name);
        formData.append("description", vehicle.description);
        formData.append("price", vehicle.price);
        formData.append("cowner", vehicle.cowner);
        formData.append("district", vehicle.district);
        vehicle.images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const res = await axios.post("http://localhost:5000/addvehicle", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                alert("Vehicle Added Successfully");
                setVehicle({ name: '', description: '', price: '', cowner: '', images: [], district: '' });
                setImagePreviews([]);
            } else {
                alert("Failed to Add Vehicle");
            }
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert("Server error, try again later");
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

            <div className="container mt-4">
                <h2 className="text-center mb-4">Add New Vehicle</h2>
                <div className="card p-4 shadow">
                    <div className="mb-3">
                        <input type="text" name="name" placeholder="Enter Vehicle Name" value={vehicle.name} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <textarea name="description" placeholder="Enter Vehicle Description" value={vehicle.description} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <input type="number" name="price" placeholder="Enter Price" value={vehicle.price} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <input type="text" name="cowner" placeholder="Enter Owner Name" value={vehicle.cowner} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <input type="file" name="images" multiple onChange={handleImageChange} accept="image/*" className="form-control" />
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="position-relative">
                                <img src={src} alt={`preview ${index}`} className="img-thumbnail" width="100" height="100" />
                                <button onClick={() => handleRemoveImage(index)} className="btn btn-danger btn-sm position-absolute top-0 end-0">X</button>
                            </div>
                        ))}
                    </div>
                    <div className="mb-3 mt-3">
                        {districts.length > 0 ? (
                            <select name="district" value={vehicle.district} onChange={handleChange} className="form-select">
                                <option value="">Select District</option>
                                {districts.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                    <button onClick={handleAdd} className="btn btn-primary w-100">Add Vehicle</button>
                </div>
            </div>
        </>
    );
}
