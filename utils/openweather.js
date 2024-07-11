const request = require('request');

const openWeather = (longitude, latitude, callback = openWeatherCallback, units = 'standard') => {

    const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';

    request({
        url: baseUrl,  
        json: true,
        qs: {
            appid: '3d67477c0d7bfe10ea723d3309994631',
            lat: latitude,
            lon: longitude,
            units
        }
    }, (error, res) => {
        if (error) {
            callback('There was error while connecting to OpenWeather');
        } else if (res.body.error) {
            callback('Unable to find the location');
        } else {
            callback(undefined, res.body);
        }
    });
}

const openWeatherCallback = (err, res) => {
    if (err) {
        console.error(err)
    } else {
        console.log('Given data: ', res);
    }
}

module.exports = {
    openWeather,
    openWeatherCallback
}