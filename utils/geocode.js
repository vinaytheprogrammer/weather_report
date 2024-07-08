const request = require('request');

const geocode = (address, callback = geocodeCallback) => {
    const access_token = 'pk.eyJ1IjoiYW5jYWxpbWV4IiwiYSI6ImNrc3V1NG82MDBjMW4ycGxncnEzMzJvbzEifQ.FR_RD1Hpdcyv3mgNOTwLTA';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json`;


    console.log('Colling the location: ', address);

    request({
        url,
        json: true,
        qs: {
            access_token,
            limit: 1

        }
    }, (err, res) => {
        if (err) {
            callback('There was an error while making request');
        } else if (!res.body.features || !res.body.features.length) {
            callback('Unable to find location. Try another search.')
        } else {
            const {place_name: placeName, center: [longitude, latitude]} = res.body.features[0];
            callback(undefined, {placeName, longitude, latitude});
        }
    });
}

const geocodeCallback = (err, res) => {
    if (err) {
        console.error(err)
    } else {
        console.log('Given data: ', res);
    }
}

module.exports = {
    geocode,
    geocodeCallback
}
