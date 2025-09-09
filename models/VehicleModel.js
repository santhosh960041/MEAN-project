const mongoose = require('mongoose')

const VehicleSchema = mongoose.Schema({
    name:String,
    description: String,
    price: Number,
    cowner:String,
    images: [String],
    district: String,
    venue: { type: String, default: '' },   
    bid: { type: Number, default: 0 }, 
    status: { type: String },
    highest: {type: String, default: ''}
})

const VehicleModel = mongoose.model('Vehicle', VehicleSchema)
module.exports = VehicleModel;