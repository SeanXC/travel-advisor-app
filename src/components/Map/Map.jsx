import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOn';
import useStyles from './styles';
import Rating from '@material-ui/lab/Rating';

const Map = ({ setCoordinates, setBounds, coordinates, places, childClicked, setChildClicked, weatherData }) => {
    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)');

    return (
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={(e) => {
                    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
                }}
                onChildClick={(child) => setChildClicked(child)}
            >
                {places?.map((place, i) => (
                    <div
                        className={classes.markerContainer}
                        lat={Number(place.latitude)}
                        lng={Number(place.longitude)}
                        key={i}
                    >
                        {
                            !isDesktop ? (
                                <LocationOnOutlinedIcon color="primary" fontSize="large" />
                            ) : (
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography className={classes.typography} variant="subtitle2">{place.name}</Typography>
                                    <img 
                                        className={classes.pointer}
                                        src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                                        alt={place.name}
                                    />
                                    <Rating name="read-only" value={Number(place.rating)} readOnly />
                                </Paper>
                            )
                        }
                    </div>
                ))}
                
                {weatherData?.weather?.[0] && coordinates?.lat && coordinates?.lng && (
                    <div 
                        lat={coordinates.lat + 0.0} 
                        lng={coordinates.lng - 0.0}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '12px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '12px',
                            minWidth: '100px',
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}
                    >
                        <img 
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt={weatherData.weather[0].description}
                            style={{ width: '50px', height: '50px', marginBottom: '4px' }}
                        />
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                            {Math.round(weatherData.main.temp - 273.15)}°C
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', textTransform: 'capitalize' }}>
                            {weatherData.weather[0].description}
                        </div>
                        <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                            {weatherData.name}
                        </div>
                        {weatherData.rain && (
                            <div style={{ fontSize: '10px', color: '#4A90E2', marginTop: '2px' }}>
                                🌧️ {weatherData.rain['1h']}mm/h
                            </div>
                        )}
                    </div>
                )}
            </GoogleMapReact>
        </div>
    );
};

export default Map;