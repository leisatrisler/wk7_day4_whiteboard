const apiKey = '9c37c18676c29baba7c1535d821032c6';

async function fetchWeatherData(location, inputType) {
    try {
        let url;

        if (inputType === 'zipcode') {
            url = `https://api.openweathermap.org/data/2.5/weather?zip=${location}&appid=${apiKey}&units=imperial`;
        } else if (inputType === 'coordinates') {
            const [lat, lon] = location.split(',');
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`;
        }

        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

function createForecastCard(city, currentTemp, humidity, highTemp, lowTemp, condition, iconCode) {
    const forecastDiv = document.getElementById('forecast');

    const card = document.createElement('div');
    card.classList.add('card', 'col-md-4');
    

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.textContent = city;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    console.log(currentTemp);
    cardTitle.textContent = `${currentTemp}°F`

    const cardSubtitle = document.createElement('h6');
    cardSubtitle.classList.add('card-subtitle', 'mb-2');
    cardSubtitle.textContent = `Humidity: ${humidity}%`;

    const highTempElem = document.createElement('p');
    highTempElem.textContent = `High: ${highTemp}°F`;

    const lowTempElem = document.createElement('p');
    lowTempElem.textContent = `Low: ${lowTemp}°F`;

    const conditionElem = document.createElement('p');
    conditionElem.classList.add('icon-description');
    conditionElem.textContent = condition;

    const icon = document.createElement('img');
    icon.classList.add('weather-icon');
    icon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubtitle);
    cardBody.appendChild(highTempElem);
    cardBody.appendChild(lowTempElem);
    cardBody.appendChild(conditionElem);
    cardHeader.appendChild(icon);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    forecastDiv.appendChild(card);
}

document.getElementById('location-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const locationInput = document.getElementById('location-input');
    const location = locationInput.value;
    const inputType = determineInputType(location);

    fetchWeatherData(location, inputType)
        .then(data => {
            console.log(data)
            const city = data.name;
            const currentTemp = data.main.temp;
            const humidity = data.main.humidity;
            const highTemp = data.main.temp_max;
            const lowTemp = data.main.temp_min;
            const condition = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            createForecastCard(city, currentTemp, humidity, highTemp, lowTemp, condition, iconCode);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    locationInput.value = '';
});
        
function determineInputType(location) {
    if (location.match(/^\d+$/)) {
        return 'zipcode';
    } else if (location.match(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)) {
        return 'coordinates';
    } else {
        return 'city';
    }
}