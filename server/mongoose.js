const mongoose = require('mongoose');
const URL = "mongodb://localhost:27017/tracks";

mongoose.connect(URL, { useNewUrlParser: true });

const MarkerSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number,
});

const Markers = mongoose.model('Markers', MarkerSchema);

module.exports = Markers;
