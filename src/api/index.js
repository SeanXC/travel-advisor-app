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
    const { data } = await axios.get('https://open-weather13.p.rapidapi.com/latlon', {
      params: {
        latitude: lat,
        longitude: lng,
        lang: 'EN'
      },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
      }
    });
    console.log('Weather API Response:', data);
    return data;
  } catch (error) {
    console.log(error);
  }
};