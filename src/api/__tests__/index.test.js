import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getPlacesData, getWeatherData } from '../index';

const mock = new MockAdapter(axios);

describe('API Functions', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getPlacesData', () => {
    it('should fetch places data successfully', async () => {
      const mockData = [
        { name: 'Test Restaurant', rating: 4.5, num_reviews: 100 }
      ];
      
      mock.onGet(/travel-advisor/).reply(200, { data: mockData });

      const sw = { lat: 40.7128, lng: -74.0060 };
      const ne = { lat: 40.7829, lng: -73.9560 };
      const type = 'restaurants';

      const result = await getPlacesData(sw, ne, type);
      expect(result).toEqual(mockData);
    });

    it('should handle API error gracefully', async () => {
      mock.onGet(/travel-advisor/).reply(500);

      const sw = { lat: 40.7128, lng: -74.0060 };
      const ne = { lat: 40.7829, lng: -73.9560 };
      const type = 'restaurants';

      const result = await getPlacesData(sw, ne, type);
      expect(result).toBeUndefined();
    });
  });

  describe('getWeatherData', () => {
    it('should fetch and convert weather data successfully', async () => {
      const mockWeatherData = {
        name: 'New York',
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 20, feels_like: 22 },
        wind: { speed: 5 }
      };

      mock.onGet(/openweathermap/).reply(200, mockWeatherData);

      const result = await getWeatherData(40.7128, -74.0060);
      
      expect(result).toEqual({
        name: 'New York',
        weather: [{
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        main: {
          temp: 293.15, // 20 + 273.15
          feels_like: 295.15 // 22 + 273.15
        },
        wind: { speed: 5 },
        rain: null
      });
    });

    it('should handle weather API error', async () => {
      mock.onGet(/openweathermap/).reply(500);

      const result = await getWeatherData(40.7128, -74.0060);
      expect(result).toBeNull();
    });

    it('should handle rain data when present', async () => {
      const mockWeatherData = {
        name: 'New York',
        weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
        main: { temp: 18, feels_like: 19 },
        wind: { speed: 3 },
        rain: { '1h': 2.5 }
      };

      mock.onGet(/openweathermap/).reply(200, mockWeatherData);

      const result = await getWeatherData(40.7128, -74.0060);
      
      expect(result.rain).toEqual({ '1h': 2.5 });
    });
  });
});
