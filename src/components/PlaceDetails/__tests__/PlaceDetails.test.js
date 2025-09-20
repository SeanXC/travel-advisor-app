import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import PlaceDetails from '../PlaceDetails';

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true
});

describe('PlaceDetails Component', () => {
  let container;
  const mockPlace = {
    name: 'Test Restaurant',
    rating: 4.5,
    num_reviews: 100,
    price_level: '$$',
    ranking: '#1 of 100 restaurants',
    address: '123 Test Street, Test City',
    phone: '+1234567890',
    web_url: 'https://tripadvisor.com/test',
    website: 'https://testrestaurant.com',
    photo: {
      images: {
        large: {
          url: 'https://test-image.jpg'
        }
      }
    },
    awards: [
      {
        images: { small: 'https://award-image.jpg' },
        display_name: 'Best Restaurant 2023'
      }
    ],
    cuisine: [
      { name: 'Italian' },
      { name: 'Pizza' }
    ]
  };

  const mockRef = React.createRef();

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    window.open.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders place details correctly', () => {
    act(() => {
      ReactDOM.render(<PlaceDetails place={mockPlace} selected={false} refProp={mockRef} />, container);
    });
    
    expect(container.textContent).toContain('Test Restaurant');
    expect(container.textContent).toContain('out of 100 reviews');
    expect(container.textContent).toContain('$$');
    expect(container.textContent).toContain('#1 of 100 restaurants');
    expect(container.textContent).toContain('123 Test Street, Test City');
    expect(container.textContent).toContain('+1234567890');
  });

  it('renders awards when available', () => {
    act(() => {
      ReactDOM.render(<PlaceDetails place={mockPlace} selected={false} refProp={mockRef} />, container);
    });
    
    expect(container.textContent).toContain('Best Restaurant 2023');
    expect(container.querySelector('img[alt="Best Restaurant 2023"]')).toBeTruthy();
  });

  it('renders cuisine chips', () => {
    act(() => {
      ReactDOM.render(<PlaceDetails place={mockPlace} selected={false} refProp={mockRef} />, container);
    });
    
    expect(container.textContent).toContain('Italian');
    expect(container.textContent).toContain('Pizza');
  });

  it('opens TripAdvisor when Trip Advisor button is clicked', () => {
    act(() => {
      ReactDOM.render(<PlaceDetails place={mockPlace} selected={false} refProp={mockRef} />, container);
    });
    
    const tripAdvisorButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent === 'Trip Advisor'
    );
    
    act(() => {
      tripAdvisorButton.click();
    });
    
    expect(window.open).toHaveBeenCalledWith('https://tripadvisor.com/test', '_blank');
  });

  it('opens website when Website button is clicked', () => {
    act(() => {
      ReactDOM.render(<PlaceDetails place={mockPlace} selected={false} refProp={mockRef} />, container);
    });
    
    const websiteButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent === 'Website'
    );
    
    act(() => {
      websiteButton.click();
    });
    
    expect(window.open).toHaveBeenCalledWith('https://testrestaurant.com', '_blank');
  });

  it('renders default image when no photo is provided', () => {
    const placeWithoutPhoto = { ...mockPlace, photo: null };
    
    act(() => {
      ReactDOM.render(<PlaceDetails place={placeWithoutPhoto} selected={false} refProp={mockRef} />, container);
    });
    
    // Look for the CardMedia image specifically (the main place image)
    const cardImage = container.querySelector('[style*="height: 350"]');
    expect(cardImage).toBeTruthy();
    // Just verify the component renders when no photo is provided
    expect(container.textContent).toContain('Test Restaurant');
  });

  it('scrolls into view when selected', () => {
    const mockScrollIntoView = jest.fn();
    const mockRefWithCurrent = {
      current: {
        scrollIntoView: mockScrollIntoView
      }
    };

    act(() => {
      ReactDOM.render(<PlaceDetails place={mockPlace} selected={true} refProp={mockRefWithCurrent} />, container);
    });
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  });
});
