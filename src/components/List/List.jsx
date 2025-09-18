import React, { useState } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import useStyles from './styles';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

const List = () => {
    const classes = useStyles();
    const [type, setType] = useState('restaurant');
    const [rating, setRating] = useState('');
    const places = [
        { name: 'cool place'},
        { name: 'best beer'},
        { name: 'best coffee'},
        { name: 'best pizza'},
        { name: 'best steak'},
        { name: 'best sushi'},
        { name: 'best ramen'},
        { name: 'best taco'},
        { name: 'best burger'},
        { name: 'best ice cream'},
    ];

    return (
        <div className={classes.container}>
            <Typography variant="h4">Restaurants, Hotels & Attractions around you</Typography>
            <FormControl className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="restaurant">Restaurant</MenuItem>
                    <MenuItem value="hotel">Hotel</MenuItem>
                    <MenuItem value="attraction">Attraction</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Rating</InputLabel>
                <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <MenuItem value="0">All</MenuItem>
                    <MenuItem value="3">Above 3.0</MenuItem>
                    <MenuItem value="4">Above 4.0</MenuItem>
                    <MenuItem value="4.5">Above 4.5</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={3} className={classes.list}>
                {places?.map((place, i) => (
                    <Grid item xs={12} key={i}>
                        <PlaceDetails place={place} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default List;