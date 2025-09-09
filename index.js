const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const VehicleModel = require('./models/VehicleModel');
const VenueModel = require('./models/VenueModel');
const UserModel = require('./models/UserModel');

const app = express();

// Use environment PORT for Render or fallback to 5000 for local
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ Multer Storage ------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// ------------------ MongoDB Connection ------------------
const mongourl = "mongodb+srv://santhoshar2101:5tGP5rnzHgR3KuZZ@cluster0.pv0yq.mongodb.net/vehicleDB?retryWrites=true&w=majority";

mongoose.connect(mongourl)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ------------------ Venue Routes ------------------
app.post('/addvenue', async (req, res) => {
    const { district, venue } = req.body;
    if (!district || !venue) return res.status(400).json({ message: "District and venue are required" });
    try {
        const newVenue = new VenueModel({ district, venue });
        await newVenue.save();
        res.json({ message: "Venue added successfully", venue: newVenue });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/getdistrict', async (req, res) => {
    try {
        const districts = await VenueModel.find().distinct('district');
        res.json(districts);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// ------------------ Vehicle Routes ------------------
app.post('/addvehicle', upload.array('images', 4), async (req, res) => {
    try {
        const { name, description, price, cowner, district } = req.body;

        if (!name || !description || !price || !cowner || !district || !req.files.length)
            return res.status(400).json({ message: "All fields including images are required" });

        const images = req.files.map(file => `/uploads/${file.filename}`);
        const venue = await VenueModel.findOne({ district });

        if (!venue) return res.status(400).json({ message: "Venue not found for this district" });

        const newVehicle = new VehicleModel({
            name, description, price, cowner, images, district,
            venue: venue.venue, bid: price, status: 'available'
        });

        await newVehicle.save();
        res.json({ message: "Vehicle added successfully", vehicle: newVehicle });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.get('/getvehicle', async (req, res) => {
    try {
        const { district } = req.query;
        const vehicles = await VehicleModel.find({ district, status: 'available' });
        res.json(vehicles);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/getonevehicle', async (req, res) => {
    try {
        const { v_id } = req.query;
        if (!v_id) return res.status(400).json({ message: "Vehicle ID is required" });

        const vehicle = await VehicleModel.findById(v_id);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        res.json(vehicle);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/updatebid', async (req, res) => {
    try {
        const { bid, vehicle_id, user } = req.body;
        if (!bid || !vehicle_id || !user) return res.status(400).json({ message: "Bid, vehicle_id and user are required" });

        const vehicle = await VehicleModel.findById(vehicle_id);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        const currentBid = parseFloat(vehicle.bid);
        const updatedBid = parseFloat(bid);

        if (updatedBid <= currentBid) return res.status(400).json({ message: "Bid must be higher than current bid" });

        vehicle.bid = updatedBid;
        vehicle.highest = user;
        await vehicle.save();

        res.json({ message: "Bid updated successfully", vehicle });
    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ------------------ User Routes ------------------
app.post('/userregister', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const userExists = await UserModel.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        const newUser = new UserModel({ name, email, password });
        await newUser.save();
        res.json({ message: "User registered successfully", user: newUser });
    } catch(err) {
        res.status(500).json({ message: "Registration error", error: err.message });
    }
});

app.post('/userlogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const user = await UserModel.findOne({ email, password });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User logged in successfully", user });
    } catch(err) {
        res.status(500).json({ message: "Login error", error: err.message });
    }
});

// ------------------ Admin Routes ------------------
app.get('/getvehiclesadmin', async (req, res) => {
    try {
        const { district } = req.query;
        if (!district) return res.status(400).json({ message: "District is required" });

        const vehicles = await VehicleModel.find({ district });
        res.json(vehicles);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/closedeal', async (req, res) => {
    try {
        const { v_id } = req.body;
        if (!v_id) return res.status(400).json({ message: "Vehicle ID is required" });

        const vehicle = await VehicleModel.findById(v_id);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        vehicle.status = "sold out";
        await vehicle.save();
        res.json({ message: "Deal closed successfully", vehicle });
    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ------------------ User-specific vehicle route ------------------
app.get('/getvehicleuser', async (req, res) => {
    try {
        const { user } = req.query;
        if (!user) return res.status(400).json({ message: "User is required" });

        const vehicles = await VehicleModel.find({ highest: user, status: "sold out" });
        res.json(vehicles);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
