import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {

    const [places, setPlaces] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null);
    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');   

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        if (coordinates.lat && coordinates.lng) {
            console.log('Fetching weather for coordinates:', coordinates);
            getWeatherData(coordinates.lat, coordinates.lng)
                .then((data) => {
                    console.log('Weather data received:', data);
                    setWeatherData(data);
                })
                .catch((error) => {
                    console.error('Failed to fetch weather data:', error);
                });
        }
    }, [coordinates]);

    useEffect(() => {
        const filteredPlaces = places.filter((place) => Number(place.rating) > rating);
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {
        if (bounds.sw && bounds.ne) {
            setIsLoading(true);
            getPlacesData(bounds.sw, bounds.ne, type)
                .then((data) => {
                    setPlaces(data.filter((place) => place.name && place.num_reviews > 0) || []);
                    setFilteredPlaces([]);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Failed to fetch places:', error);
                    setIsLoading(false);
                });
        }
    }, [type, bounds]);

    return (
        <div>
            <CssBaseline />
            <Header setCoordinates={setCoordinates} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        rating={rating}
                        setType={setType}
                        setRating={setRating}
                     />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default App;