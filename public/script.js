function getWeather() {
    const apiKey = 'b5e4555b34208fe49d996137abada8a6';
    const location = document.getElementById('location').value;

    if (!location) {
        alert('Please enter a magical place');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            getWeatherImpact(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Oops! We couldn\'t find that magical place. Try another!');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
            displayFiveDayForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Oops! We couldn\'t peek into the future. Try again later!');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://static.vecteezy.com/system/resources/previews/016/131/142/original/weather-icon-in-comic-style-sun-cloud-and-rain-cartoon-illustration-on-white-isolated-background-meteorology-splash-effect-sign-business-concept-vector.jpg`;

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${data.name}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.style.display = 'block';

    anime({
        targets: '#weather-display',
        scale: [0.9, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 800
    });
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.querySelector('.hourly-items');
    hourlyForecastDiv.innerHTML = '';

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dataTime = new Date(item.dt * 1000);
        const hour = dataTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });

    anime({
        targets: '.hourly-item',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100)
    });
}

function displayFiveDayForecast(forecastData) {
    const fiveDayForecastDiv = document.getElementById('five-day-forecast');
    fiveDayForecastDiv.innerHTML = '';

    const dailyData = forecastData.filter(item => item.dt_txt.includes('12:00:00'));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const temperature = Math.round(day.main.temp - 273.15);
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const dayForecast = `
            <div class="day-forecast">
                <span>${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <img src="${iconUrl}" alt="Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        fiveDayForecastDiv.innerHTML += dayForecast;
    });

    anime({
        targets: '.day-forecast',
        scale: [0.5, 1],
        opacity: [0, 1],
        delay: anime.stagger(100)
    });
}

function compareWeather() {
    const mainCity = document.getElementById('location').value;
    const compareCity = document.getElementById('compare-city').value;
    const apiKey = 'b5e4555b34208fe49d996137abada8a6';

    Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${mainCity}&appid=${apiKey}`).then(res => res.json()),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${compareCity}&appid=${apiKey}`).then(res => res.json())
    ]).then(([mainData, compareData]) => {
        const mainTemp = Math.round(mainData.main.temp - 273.15);
        const compareTemp = Math.round(compareData.main.temp - 273.15);
        const tempDiff = Math.abs(mainTemp - compareTemp);
        
        let comparisonResult = `
            <h4>🌈 Weather Comparison 🌈</h4>
            <p>${mainCity}: ${mainTemp}°C | ${compareCity}: ${compareTemp}°C</p>
            <p>Temperature difference: ${tempDiff}°C</p>
            <p>${mainCity} is ${mainTemp > compareTemp ? 'warmer' : 'cooler'} than ${compareCity}</p>
        `;
        
        document.getElementById('comparison-result').innerHTML = comparisonResult;

        anime({
            targets: '#comparison-result',
            translateX: [-50, 0],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .8)'
        });
    }).catch(error => {
        console.error('Error comparing weather:', error);
        alert('Oops! We couldn\'t compare these magical places. Try again!');
    });
}

function startWeatherGame() {
    const questions = [
        {q: "What causes a rainbow?", a: "Sunlight refracting through water droplets"},
        {q: "What is the eye of a hurricane?", a: "The calm center of the storm"},
        {q: "What type of cloud produces rain?", a: "Nimbus"},
        {q: "What instrument measures atmospheric pressure?", a: "Barometer"},
        {q: "What is the study of weather called?", a: "Meteorology"}
    ];

    let currentQuestion = 0;
    let score = 0;

    function displayQuestion() {
        if (currentQuestion < questions.length) {
            const gameContainer = document.getElementById('game-container');
            gameContainer.innerHTML = `
                <h4>Question ${currentQuestion + 1}:</h4>
                <p>${questions[currentQuestion].q}</p>
                <input type="text" id="answer-input" placeholder="Your answer">
                <button onclick="checkAnswer()">Submit</button>
            `;

            anime({
                targets: '#game-container',
                translateY: [50, 0],
                opacity: [0, 1],
                easing: 'easeOutElastic(1, .8)'
            });
        } else {
            endGame();
        }
    }

    window.checkAnswer = function() {
        const userAnswer = document.getElementById('answer-input').value.toLowerCase();
        const correctAnswer = questions[currentQuestion].a.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            score++;
            alert('Correct! You\'re a weather wizard! ✨');
        } else {
            alert(`Oops! The correct answer was: ${questions[currentQuestion].a}`);
        }
        
        currentQuestion++;
        displayQuestion();
    }

    function endGame() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <h4>Game Over!</h4>
            <p>Your magical score: ${score} out of ${questions.length}</p>
            <button onclick="startWeatherGame()">Play Again</button>
        `;

        anime({
            targets: '#game-container',
            scale: [0.9, 1],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .8)'
        });
    }

    displayQuestion();
}

function getWeatherImpact(weatherData) {
    const temp = Math.round(weatherData.main.temp - 273.15);
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    
    let impact = "🌈 Weather Magic for Today: 🌈\n\n";
    
    if (temp > 30) {
        impact += "☀️ It's super sunny! Time for ice cream and beach adventures!\n";
    } else if (temp < 5) {
        impact += "❄️ Brrr! It's chilly! Perfect for building snowmen and drinking hot cocoa!\n";
    } else {
        impact += "🌻 Lovely weather! How about a picnic or a nature walk?\n";
    }
    
    if (weatherCondition.includes('rain')) {
        impact += "☔ Don't forget your umbrella! Puddle-jumping time!\n";
    } else if (weatherCondition.includes('snow')) {
        impact += "🎿 Snow day! Time for sledding and snowball fights!\n";
    } else if (weatherCondition.includes('clear')) {
        impact += "✨ Clear skies! Perfect for stargazing tonight!\n";
    }
    
    document.getElementById('impact-info').innerText = impact;

    anime({
        targets: '#impact-info',
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .8)'
    });
}