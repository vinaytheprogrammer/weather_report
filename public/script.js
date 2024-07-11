function getWeather() {
    const location = document.getElementById('location').value;

    fetch(`/weather?location=${location}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.error) {
                document.getElementById('weather-info').innerHTML = `<p>${data.message}</p>`;
            } else {
                document.getElementById('weather-info').innerHTML = `
                    <h2>City: ${data.name}</h2>
                    <h4>Temperature: ${Math.round(data.main.temp - 273.15)} °C</h4>
                    <h4>Description: ${data.description = "Mast Mosam hai bhai aaja Chay pete h"}</h4>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weather-info').innerHTML = `<p>Failed to fetch weather data</p>`;
        });
}
