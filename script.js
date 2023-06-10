const countriesContainer = document.querySelector('.countries-container');
const searchInput = document.querySelector('.search-container input');
let allCountriesData;
let currentPage = 1;
const countriesPerPage = 20;
let filteredCountries = [];

fetch('https://restcountries.com/v3.1/all')
  .then((res) => res.json())
  .then((data) => {
    allCountriesData = data;
    filterCountries('');
    renderCountries(filteredCountries, currentPage);
    createPaginationButtons();
  });

function filterCountries(query) {
  filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase())
  );
}

searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  filterCountries(query);
  currentPage = 1;
  renderCountries(filteredCountries, currentPage);
  createPaginationButtons();
});

function renderCountries(data, page) {
  countriesContainer.innerHTML = '';

  const start = (page - 1) * countriesPerPage;
  const end = start + countriesPerPage;
  const countriesToShow = data.slice(start, end);

  countriesToShow.forEach((country) => {
    const countryCard = document.createElement('a');
    countryCard.classList.add('country-card');
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
       `;
    countryCard.addEventListener('click', () => {
      showPopup(country);
      fetchWeatherData(country.name.common); 
    });
    countriesContainer.append(countryCard);
  });
}

function createPaginationButtons() {
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);
  const paginationContainer = document.querySelector('.pagination');

  paginationContainer.innerHTML = '';

  const prevLink = document.createElement('a');
  prevLink.href = `#${currentPage - 1}`;
  prevLink.innerHTML = '&laquo;';
  paginationContainer.appendChild(prevLink);

  for (let i = 1; i <= totalPages; i++) {
    const paginationLink = document.createElement('a');
    paginationLink.textContent = i;
    paginationLink.href = `#${i}`;
    if (i === currentPage) {
      paginationLink.classList.add('active');
    }
    paginationContainer.appendChild(paginationLink);
  }

  const nextLink = document.createElement('a');
  nextLink.href = `#${currentPage + 1}`;
  nextLink.innerHTML = '&raquo;';
  paginationContainer.appendChild(nextLink);

  const paginationLinks = paginationContainer.querySelectorAll('a');

  paginationLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(link.getAttribute('href').substring(1));
      currentPage = page;
      renderCountries(filteredCountries, currentPage);
      createPaginationButtons();
    });
  });
}

function showPopup(country) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close">&times;</span>
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <h2>${country.name.common}</h2>
      
      <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
      <p><b>Region: </b>${country.region}</p>
      <p><b>Capital: </b>${country.capital?.[0]}</p>
      <p><b>Temperature: </b><span id="temperature"></span></p>
      <p><b>Humidity: </b><span id="humidity"></span></p>
    </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector('.close');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(popup);
  });
}

function fetchWeatherData(city) {
  const weatherApikey = '3154d47b93e1d0cf10b3387f83c99b59'; 
  const weatherBaseURL = 'https://api.openweathermap.org/data/2.5/weather';
  const queryURL = `${weatherBaseURL}?q=${city}&appid=${weatherApikey}`;

  fetch(queryURL)
    .then((res) => res.json())
    .then((data) => {
      const temperatureElement = document.getElementById('temperature');
      const humidityElement = document.getElementById('humidity');

      if (data.main) {
        const temperature = Math.round(data.main.temp - 273.15); // Converting temperature to Celsius
        const humidity = data.main.humidity;

        temperatureElement.textContent = `${temperature}°C`;
        humidityElement.textContent = `${humidity}%`;
      } else {
        temperatureElement.textContent = 'N/A';
        humidityElement.textContent = 'N/A';
      }
    })
    .catch((error) => {
      console.log('Error fetching weather data:', error);
    });
}

  let weatherApikey = '3154d47b93e1d0cf10b3387f83c99b59';
 let weatherBasepoint = 'https://pro.openweathermap.org/data/2.5/forecast/climate?q={city name},{country code}&appid={API key}';
