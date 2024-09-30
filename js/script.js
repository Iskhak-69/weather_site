const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const currentTempEl = document.getElementById('current-temp');
const otherForecastEl = document.getElementById('other-forecast');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'e10050cafcf945c3a0894443243009';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' +
        (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                showWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    });
}

function showWeatherData(data) {
    const { humidity, pressure_mb, wind_kph, cloud} = data.current;
    const { sunrise, sunset } = data.forecast.forecastday[0].astro;

    timezone.innerHTML = data.location.tz_id;
    countryEl.innerHTML = `${data.location.region}, ${data.location.country}`;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure_mb} millibar</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_kph} kph</div>
        </div>
        <div class="weather-item">
            <div>Cloud Cover</div>
            <div>${cloud}%</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${sunrise}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${sunset}</div>
        </div>
    `;

    currentTempEl.innerHTML = `
        <img src="${data.current.condition.icon}" alt="weather icon" class="weather-icon">
        <div class="other">
            <div class="temp">Current - ${data.current.temp_c}&#176;C</div>
        </div>
    `;

    let otherDayForecast = '';
    data.forecast.forecastday.slice(0, 7).forEach((day) => {
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
