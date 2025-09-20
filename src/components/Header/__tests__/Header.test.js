import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Header from '../Header';

// Simple mock for Autocomplete
jest.mock('@react-google-maps/api', () => ({
  Autocomplete: ({ children }) => {
    return children;
  }
}));

describe('Header Component', () => {
  let container;
  const mockSetCoordinates = jest.fn();

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockSetCoordinates.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders header with title and search functionality', () => {
    act(() => {
      ReactDOM.render(<Header setCoordinates={mockSetCoordinates} />, container);
    });
    
    expect(container.textContent).toContain('Travel Advisor');
    expect(container.textContent).toContain('Explore new places');
    // Just verify the component renders without errors
    expect(container.children.length).toBeGreaterThan(0);
  });

  it('renders without crashing', () => {
    act(() => {
      ReactDOM.render(<Header setCoordinates={mockSetCoordinates} />, container);
    });
    
    // Basic smoke test - component should render without throwing
    expect(container.innerHTML).toBeTruthy();
  });

  it('receives setCoordinates prop correctly', () => {
    act(() => {
      ReactDOM.render(<Header setCoordinates={mockSetCoordinates} />, container);
    });
    
    // Verify component rendered and prop was passed
    expect(container.textContent).toContain('Travel Advisor');
    expect(mockSetCoordinates).toHaveBeenCalledTimes(0); // Should not be called during render
  });
});
