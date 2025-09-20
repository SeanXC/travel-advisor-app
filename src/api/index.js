import axios from 'axios';

export const getPlacesData = async (sw, ne, type) => {
    try {
        const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
          params: {
        bl_latitude: sw.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
        tr_latitude: ne.lat,
          },
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
          }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getWeatherData = async (lat, lng) => {
  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: lat,
        lon: lng,
        appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
        lang: 'en',
        units: 'metric'
      }
    });
    
    const convertedData = {
      name: data.name,
      weather: [{
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      }],
      main: {
        temp: data.main.temp + 273.15,
        feels_like: data.main.feels_like + 273.15
      },
      wind: {
        speed: data.wind.speed
      },
      rain: data.rain ? {
        '1h': data.rain['1h'] || 0
      } : null
    };
    
    console.log('Weather API Response:', convertedData);
    return convertedData;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
};