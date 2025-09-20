import '@testing-library/jest-dom';

// Mock Google Maps API
global.google = {
  maps: {
    Map: class {
      constructor() {}
      setCenter() {}
      setZoom() {}
    },
    LatLng: class {
      constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
      }
    },
    places: {
      Autocomplete: class {
        constructor() {}
        addListener() {}
        getPlace() {
          return {
            geometry: {
              location: {
                lat: () => 40.7128,
                lng: () => -74.0060
              }
            }
          };
        }
      }
    }
  }
};

// Mock geolocation
Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn((success) => 
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      })
    )
  }
});

// Mock environment variables
process.env.REACT_APP_GOOGLE_MAPS_API_KEY = 'test-key';
process.env.REACT_APP_RAPIDAPI_KEY = 'test-key';
process.env.REACT_APP_OPENWEATHER_API_KEY = 'test-key';
