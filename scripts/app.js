/* DOM Selectors */

const weatherForm = document.querySelector('.weather-form');
const weatherShow = document.querySelector('.weather-show');
const weatherPlace = document.querySelector('.weather-place');
const weatherInfo = document.querySelector('.weather-info');
const weatherCond = document.querySelector('.weather-cond');
const currentTemp = document.querySelector('.current-temp span');
const weatherTempBox = document.querySelector('.weather-temp-box');
const dayTitles = document.querySelectorAll('.day');
const dayImages = document.querySelectorAll('.day-img');
const dayMaxs = document.querySelectorAll('.day-max');
const dayMins = document.querySelectorAll('.day-min');

// Event Handlers

const updateFiveDays = fiveDaysDets => {

    const daysArray = [];
    const days = [];
    const iconsArray = [];
    const maxArray = [];
    const minArray = [];

    // Retrive day indexes from each date for five days

    for (let i = 0; i < fiveDaysDets.DailyForecasts.length; i++) {
        daysArray.push(new Date(fiveDaysDets.DailyForecasts[i].Date).getDay());
    }

    // Update days

    for (let i = 0; i < daysArray.length; i++) {
        if (daysArray[i] === 0) {
            days.push('sun');
        } else if (daysArray[i] === 1) {
            days.push('mon');
        } else if (daysArray[i] === 2) {
            days.push('tue');
        } else if (daysArray[i] === 3) {
            days.push('wed');
        } else if (daysArray[i] === 4) {
            days.push('thu');
        } else if (daysArray[i] === 5) {
            days.push('fri');
        } else if (daysArray[i] === 6) {
            days.push('sat');
        }
    }

    dayTitles.forEach((title, index) => {
        title.textContent = days[index];
    });

    // Update icons

    for (let i = 0; i < fiveDaysDets.DailyForecasts.length; i++) {
        iconsArray.push(fiveDaysDets.DailyForecasts[i].Day.Icon);
    }

    dayImages.forEach((img, index) => {
        img.src = `img/icons/${iconsArray[index]}.svg`;
    });

    // Update maximum temperatures

    for (let i = 0; i < fiveDaysDets.DailyForecasts.length; i++) {
        maxArray.push(fiveDaysDets.DailyForecasts[i].Temperature.Maximum.Value);
    }

    dayMaxs.forEach((max, index) => max.textContent = maxArray[index] + '\xB0' + 'C');

    // Update minimum temperatures

    for (let i = 0; i < fiveDaysDets.DailyForecasts.length; i++) {
        minArray.push(fiveDaysDets.DailyForecasts[i].Temperature.Minimum.Value);
    }

    dayMins.forEach((min, index) => min.textContent = minArray[index] + '\xB0' + 'C');

};

const displayUi = data => {

    // Destructure data

    const { cityDets, weatherDets, fiveDaysDets } = data;

    // Update day/night image and color

    const imgSrc = weatherDets.IsDayTime ? 'day.svg' : 'night.svg';
    const colorSrc = imgSrc === 'night.svg' ? '#DDDDDDAA' : '#333333AA';

    weatherPlace.style.color = colorSrc;
    weatherPlace.style.backgroundImage = `url(../img/${imgSrc})`;

    // Update city and state

    const placeHtml = `
                        <h2 class="weather-city">${cityDets.EnglishName}</h2>
                        <h2 class="weather-state">${cityDets.Country.EnglishName}</h2>
                    `;

    weatherPlace.innerHTML = placeHtml;

    // Update weather message

    weatherInfo.textContent = fiveDaysDets.Headline.Text;

    // Update condition

    const condHtml = `
                        <img src="img/icons/${weatherDets.WeatherIcon}.svg" alt="icon-1" class="weather-cond-img">
                        <span class="weather-cond-text">${weatherDets.WeatherText}</span>
                    `;

    weatherCond.innerHTML = condHtml;

    // Update temperature

    currentTemp.textContent = `${weatherDets.Temperature.Metric.Value}`;

    const tempHtml = `
                        <span class="max-temp">Max <span>${fiveDaysDets.DailyForecasts[0].Temperature.Maximum.Value}</span>&deg;C</span>
                        <div class="underline"></div>
                        <span class="min-temp">Min <span>${fiveDaysDets.DailyForecasts[0].Temperature.Minimum.Value}</span>&deg;C</span>
                    `;

    weatherTempBox.innerHTML = tempHtml;

    // Display weather box

    weatherShow.style.display = 'none' ? 'block' : 'none';

    setTimeout(() => {
        weatherShow.style.opacity = 1;
    }, 400);

    // Update five days forecast

    updateFiveDays(fiveDaysDets);

};

/* API request - Get data */

const updateUi = async city => {

    const cityDets = await getCity(city);
    const weatherDets = await getWeather(cityDets.Key);
    const fiveDaysDets = await getFiveDays(cityDets.Key);

    return { cityDets, weatherDets, fiveDaysDets };

};

/* Event Listeners */

weatherForm.addEventListener('submit', e => {

    // Prevent form from submitting
    e.preventDefault();

    // Get user input
    const city = weatherForm.city.value.trim();

    // Reset input field
    weatherForm.reset();

    // Update UI
    updateUi(city)
        .then(data => {
            displayUi(data);
        })
        .catch(error => {
            console.log(error);
        });
    
    // Set local storage
    localStorage.setItem('city', city);

});

// Get local storage
if (localStorage.getItem('city')) {
    updateUi(localStorage.getItem('city'))
        .then(data => {
            displayUi(data);
        })
        .catch(error => {
            console.log(error);
        });
}