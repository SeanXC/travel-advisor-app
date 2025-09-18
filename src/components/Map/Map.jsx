import React from 'react';
import GoogleMapReact from 'google-map-react';
import useStyles from './styles';

const Map = () => {
    const classes = useStyles();
    const coordinates = { lat: 0, lng: 0 };

    return (
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: '' }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={''}
                onChildClick={''}
            >
            </GoogleMapReact>
        </div>
    );
};

export default Map;