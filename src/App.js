import './App.css';
import Search from './components/search/Search';
import Forecast from './components/forecast/forecast';
import CurrentWeather from './components/current-weather/current-weather';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import { useEffect, useState } from 'react';
import SavedCities from './components/saved-cities/saved-cities';

function App() {

  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem("savedCities");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }, [savedCities]);

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    setSelectedCity(searchData);

    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`)
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`)

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async(response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({city: searchData.label, ...weatherResponse});
        setForecast({city: searchData.label, ...forecastResponse});
      })
      .catch((err) => console.log(err))
  }

  const handleSaveCity = () => { 
    if(selectedCity && !savedCities.some(savedCity => savedCity.label === selectedCity.label)) {
      setSavedCities([...savedCities, selectedCity]);
    }
  };

  const handleRemoveCity = (city) => {
    setSavedCities(savedCities.filter(savedCity => savedCity.value !== city.value));
  }


  return (
    <div className="container">
      <div>
        <Search onSearchChange={handleOnSearchChange}></Search>
        {currentWeather && <CurrentWeather data={currentWeather} onSaveCity={handleSaveCity}/>}
        {forecast && <Forecast data={forecast}/>}
      </div>
      {savedCities && <SavedCities cities={savedCities} onCitySelected={handleOnSearchChange} onCityRemove={handleRemoveCity}/>}
    </div>
  );
}

export default App;
