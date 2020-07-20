const createMarker = require("./resolvers").createMarker;

const INCREASE_RATE = 0.0001;

let currentLocation = {
    longitude: 126.981834,
    latitude: 37.556398,
};


setInterval(async () => {
    currentLocation.longitude += INCREASE_RATE;
    currentLocation.latitude += INCREASE_RATE;
    try {
        await createMarker(currentLocation);
    }
    catch (error) {
        console.log(error);
    }
}, 1000);
