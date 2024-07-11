const express = require('express');
const { geocode } = require('./utils/geocode');
const { openWeather } = require('./utils/openweather');

const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/weather', (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(422).json({
            error: 'MissingParameter',
            message: 'You must provide a location'
        });
    }

    geocode(location, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'GeocodeError',
                message: err.message
            });
        }

        const { longitude, latitude } = result;

        openWeather(longitude, latitude, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: 'OpenWeatherError',
                    message: err.message
                });
            }
            // console.log(result)
            return res.json(result);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
