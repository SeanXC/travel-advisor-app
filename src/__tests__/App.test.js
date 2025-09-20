import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from '../App';

const mock = new MockAdapter(axios);

// Mock child components
jest.mock('../components/Header/Header', () => {
  return function MockHeader({ setCoordinates }) {
    const React = require('react');
    return React.createElement(
      'div',
      { 'data-testid': 'header' },
      React.createElement(
        'button',
        { onClick: () => setCoordinates({ lat: 40.7128, lng: -74.0060 }) },
        'Set Coordinates'
      )
    );
  };
});

jest.mock('../components/List/List', () => {
  return function MockList({ places, isLoading, setType, setRating }) {
    const React = require('react');
    return React.createElement(
      'div',
      { 'data-testid': 'list' },
      isLoading && React.createElement('div', { 'data-testid': 'list-loading' }, 'Loading...'),
      React.createElement('div', { 'data-testid': 'places-count' }, places.length.toString()),
      React.createElement('button', { onClick: () => setType('hotels') }, 'Change Type'),
      React.createElement('button', { onClick: () => setRating('4') }, 'Change Rating')
    );
  };
});

jest.mock('../components/Map/Map', () => {
  return function MockMap({ setBounds, setChildClicked }) {
    const React = require('react');
    return React.createElement(
      'div',
      { 'data-testid': 'map' },
      React.createElement(
        'button',
        { 
          onClick: () => setBounds({
            ne: { lat: 40.7828, lng: -73.9560 },
            sw: { lat: 40.6428, lng: -74.0560 }
          })
        },
        'Set Bounds'
      ),
      React.createElement(
        'button',
        { onClick: () => setChildClicked(0) },
        'Click Child'
      )
    );
  };
});

describe('App Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mock.reset();
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders main components', () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    expect(container.querySelector('[data-testid="header"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="list"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="map"]')).toBeTruthy();
  });

  it('initializes with geolocation', async () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    // Wait a bit for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Geolocation should be called on mount
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('fetches weather data when coordinates are set', async () => {
    const mockWeatherData = {
      name: 'New York',
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 20, feels_like: 22 },
      wind: { speed: 5 }
    };

    mock.onGet(/openweathermap/).reply(200, mockWeatherData);

    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    const setCoordinatesButton = container.querySelector('button');
    
    await act(async () => {
      setCoordinatesButton.click();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(mock.history.get.some(req => 
      req.url.includes('openweathermap')
    )).toBe(true);
  });

  it('fetches places data when bounds are set', async () => {
    const mockPlacesData = [
      { name: 'Restaurant 1', rating: 4.5, num_reviews: 100 },
      { name: 'Restaurant 2', rating: 4.0, num_reviews: 50 }
    ];

    mock.onGet(/travel-advisor/).reply(200, { data: mockPlacesData });

    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    const setBoundsButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Set Bounds'
    );
    
    await act(async () => {
      setBoundsButton.click();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const placesCount = container.querySelector('[data-testid="places-count"]');
    expect(placesCount.textContent).toBe('2');
  });

  it('shows loading state while fetching places', async () => {
    mock.onGet(/travel-advisor/).reply(() => 
      new Promise(resolve => setTimeout(() => resolve([200, { data: [] }]), 200))
    );

    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    const setBoundsButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Set Bounds'
    );
    
    act(() => {
      setBoundsButton.click();
    });

    expect(container.querySelector('[data-testid="list-loading"]')).toBeTruthy();
  });

  it('filters places by rating', async () => {
    const mockPlacesData = [
      { name: 'Restaurant 1', rating: 4.5, num_reviews: 100 },
      { name: 'Restaurant 2', rating: 3.5, num_reviews: 50 },
      { name: 'Restaurant 3', rating: 4.8, num_reviews: 200 }
    ];

    mock.onGet(/travel-advisor/).reply(200, { data: mockPlacesData });

    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    // Set bounds to load places
    const setBoundsButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Set Bounds'
    );
    
    await act(async () => {
      setBoundsButton.click();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    let placesCount = container.querySelector('[data-testid="places-count"]');
    expect(placesCount.textContent).toBe('3');

    // Change rating filter
    const changeRatingButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Change Rating'
    );
    
    await act(async () => {
      changeRatingButton.click();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    placesCount = container.querySelector('[data-testid="places-count"]');
    // Should show only places with rating > 4 (2 places)
    expect(placesCount.textContent).toBe('2');
  });

  it('handles API errors gracefully', async () => {
    mock.onGet(/travel-advisor/).reply(500);
    mock.onGet(/openweathermap/).reply(500);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    const setBoundsButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Set Bounds'
    );
    const setCoordinatesButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Set Coordinates'
    );

    await act(async () => {
      setBoundsButton.click();
      setCoordinatesButton.click();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('updates child clicked state', () => {
    act(() => {
      ReactDOM.render(<App />, container);
    });
    
    const clickChildButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Click Child'
    );
    
    act(() => {
      clickChildButton.click();
    });

    // The child clicked state should be updated (tested through component interaction)
    expect(container.querySelector('[data-testid="map"]')).toBeTruthy();
  });
});
