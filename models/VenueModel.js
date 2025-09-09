const mongoose = require('mongoose')

const VenueSchema = mongoose.Schema({
    district:String,
    venue: String,    
})

const VenueModel = mongoose.model('Venue', VenueSchema)
module.exports = VenueModel;