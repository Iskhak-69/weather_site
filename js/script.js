const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    if (cityName) {
        window.location.href = `weather.html?city=${encodeURIComponent(cityName)}`;
    }
});
