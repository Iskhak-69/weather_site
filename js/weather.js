const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const currentTempEl = document.getElementById('current-temp');
const otherForecastEl = document.getElementById('other-forecast');

const API_KEY = 'cb560160b0894836bdd162611242210';
let timeInterval;
let lastTimezone = '';

function updateTimeAndDate(timezone) {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
        const time = new Date();
        const options = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        const dateOptions = {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        timeEl.innerHTML = new Intl.DateTimeFormat('en-US', options).format(time);
        dateEl.innerHTML = new Intl.DateTimeFormat('en-US', dateOptions).format(time);
    }, 1000);
}

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    if (cityName) {
        window.location.href = `weather.html?city=${encodeURIComponent(cityName)}`;
    }
});

function getWeatherData(cityName) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7`)
        .then(res => res.json())
        .then(data => {
            showWeatherData(data);
            if (data.location.tz_id !== lastTimezone) {
                lastTimezone = data.location.tz_id;
                updateTimeAndDate(lastTimezone);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get('city');
if (city) {
    getWeatherData(city);
}

function showWeatherData(data) {
    const { humidity, pressure_mb, wind_kph, cloud } = data.current;
    const { sunrise, sunset } = data.forecast.forecastday[0].astro;

    timezone.innerHTML = data.location.tz_id;
    countryEl.innerHTML = `${data.location.region}, ${data.location.country}`;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item"><div>Humidity</div><div>${humidity}%</div></div>
        <div class="weather-item"><div>Pressure</div><div>${pressure_mb} millibar</div></div>
        <div class="weather-item"><div>Wind Speed</div><div>${wind_kph} kph</div></div>
        <div class="weather-item"><div>Cloud Cover</div><div>${cloud}%</div></div>
        <div class="weather-item"><div>Sunrise</div><div>${sunrise}</div></div>
        <div class="weather-item"><div>Sunset</div><div>${sunset}</div></div>
    `;

    currentTempEl.innerHTML = `
        <img src="${data.current.condition.icon}" alt="weather icon" class="weather-icon">
        <div class="other"><div class="temp">Current - ${data.current.temp_c}&#176;C</div></div>
    `;

    let otherDayForecast = '';
    data.forecast.forecastday.forEach((day) => {
        otherDayForecast += `
            <div class="other-forecast-item">
                <div class="day">${window.moment(day.date).format('dddd')}</div>
                <img src="${day.day.condition.icon}" alt="weather icon" class="weather-icon">
                <div class="temp">Day - ${day.day.maxtemp_c}&#176;C</div>
                <div class="temp">Night - ${day.day.mintemp_c}&#176;C</div>
            </div>
        `;
    });

    otherForecastEl.innerHTML = otherDayForecast; 
}
