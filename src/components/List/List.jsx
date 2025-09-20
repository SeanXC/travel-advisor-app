import React, { useState, useEffect, useRef, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import useStyles from './styles';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

const List = ( { places, childClicked, isLoading, type, rating, setType, setRating } ) => {
    const classes = useStyles();
    const [elRefs, setElRefs] = useState([]);

    useEffect(() => {
        if (places && places.length > 0) {
            const refs = Array(places.length).fill().map((_, i) => elRefs[i] || createRef());
            setElRefs(refs);
        }
    }, [places]);

    useEffect(() => {
        if (childClicked !== null && elRefs.length > 0 && elRefs[childClicked]) {
            setTimeout(() => {
                elRefs[childClicked]?.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    }, [childClicked, elRefs]);

    return (
        <div className={classes.container}>
            <Typography variant="h4">Restaurants, Hotels & Attractions around you</Typography>
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>
            <FormControl className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="restaurants">Restaurants</MenuItem>
                    <MenuItem value="attractions">Attractions</MenuItem>
                    <MenuItem value="hotels">Hotels</MenuItem>
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
                    <Grid item xs={12} key={i} ref={elRefs[i]}>
                        <PlaceDetails 
                            place={place}
                            selected={Number(childClicked) === i}
                            refProp={elRefs[i]}
                         />
                    </Grid>
                ))}
            </Grid>
                </>
            )}
        </div>
    );
};

export default List;