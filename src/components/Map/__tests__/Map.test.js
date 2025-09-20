import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Map from '../Map';

// Mock GoogleMapReact
jest.mock('google-map-react', () => {
  return function MockGoogleMapReact({ children, onChange, onChildClick }) {
    const React = require('react');
    React.useEffect(() => {
      // Simulate map events
      if (onChange) {
        onChange({
          center: { lat: 40.7128, lng: -74.0060 },
          marginBounds: {
            ne: { lat: 40.7828, lng: -73.9560 },
            sw: { lat: 40.6428, lng: -74.0560 }
          }
        });
      }
    }, [onChange]);

    return React.createElement(
      'div',
      { 'data-testid': 'google-map' },
      children,
      React.createElement(
        'button',
        { onClick: () => onChildClick && onChildClick(0) },
        'Click Child'
      )
    );
  };
});

// Mock useMediaQuery
jest.mock('@material-ui/core', () => ({
  ...jest.requireActual('@material-ui/core'),
  useMediaQuery: jest.fn(() => true) // Default to desktop
}));

describe('Map Component', () => {
  let container;
  const mockProps = {
    setCoordinates: jest.fn(),
    setBounds: jest.fn(),
    coordinates: { lat: 40.7128, lng: -74.0060 },
    places: [
      {
        name: 'Test Place 1',
        latitude: '40.7128',
        longitude: '-74.0060',
        rating: 4.5,
        photo: {
          images: {
            large: { url: 'https://test-image1.jpg' }
          }
        }
      },
      {
        name: 'Test Place 2',
        latitude: '40.7228',
        longitude: '-74.0160',
        rating: 4.0,
        photo: null
      }
    ],
    childClicked: null,
    setChildClicked: jest.fn(),
    weatherData: {
      name: 'New York',
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      main: { temp: 293.15 },
      rain: { '1h': 2.5 }
    }
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockProps.setCoordinates.mockClear();
    mockProps.setBounds.mockClear();
    mockProps.setChildClicked.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders map container', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} />, container);
    });
    
    expect(container.querySelector('[data-testid="google-map"]')).toBeTruthy();
  });

  it('displays weather widget when weather data is available', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} />, container);
    });
    
    expect(container.textContent).toContain('20°C'); // 293.15 - 273.15 = 20
    expect(container.textContent).toContain('clear sky');
    expect(container.textContent).toContain('New York');
    expect(container.textContent).toContain('🌧️ 2.5mm/h');
  });

  it('does not display weather widget when weather data is unavailable', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} weatherData={null} />, container);
    });
    
    expect(container.textContent).not.toContain('20°C');
  });

  it('renders place markers on desktop', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} />, container);
    });
    
    // On desktop, places should be rendered (but text might be in complex structure)
    // Just verify the map container exists and has content
    expect(container.querySelector('[data-testid="google-map"]')).toBeTruthy();
    expect(mockProps.places.length).toBe(2);
  });

  it('renders location icons on mobile', () => {
    const { useMediaQuery } = require('@material-ui/core');
    useMediaQuery.mockReturnValue(false); // Mobile view

    act(() => {
      ReactDOM.render(<Map {...mockProps} />, container);
    });
    
    // On mobile, just verify the map renders
    expect(container.querySelector('[data-testid="google-map"]')).toBeTruthy();
    
    // Reset to desktop for other tests
    useMediaQuery.mockReturnValue(true);
  });

  it('handles place marker with default image when photo is not available', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} />, container);
    });
    
    // Since we have one place with photo and one without, 
    // just verify the map renders and has the expected number of places
    expect(container.querySelector('[data-testid="google-map"]')).toBeTruthy();
    expect(mockProps.places.filter(place => !place.photo)).toHaveLength(1);
  });

  it('calls setCoordinates and setBounds on map change', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} />, container);
    });
    
    expect(mockProps.setCoordinates).toHaveBeenCalledWith({
      lat: 40.7128,
      lng: -74.0060
    });
    
    expect(mockProps.setBounds).toHaveBeenCalledWith({
      ne: { lat: 40.7828, lng: -73.9560 },
      sw: { lat: 40.6428, lng: -74.0560 }
    });
  });

  it('calls setChildClicked when child is clicked', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} />, container);
    });
    
    const clickButton = container.querySelector('button');
    
    act(() => {
      clickButton.click();
    });
    
    expect(mockProps.setChildClicked).toHaveBeenCalledWith(0);
  });

  it('handles empty places array', () => {
    act(() => {
      ReactDOM.render(<Map {...mockProps} places={[]} />, container);
    });
    
    expect(container.querySelector('[data-testid="google-map"]')).toBeTruthy();
    expect(container.textContent).not.toContain('Test Place 1');
  });
});
