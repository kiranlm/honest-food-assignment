/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Typography, Button, Box } from '@material-ui/core';
import { useState } from 'react';
import axios from 'axios';

export default function SearchRestaurants() {
  const [restaurant, setRestaurant] = useState(null);
  const [address, setAddress] = useState('');
  const getRestaurant = () => {
    axios
      .post(
        'http://localhost:3001/search',
        {
          address: address,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(function (response) {
        setRestaurant(response.data);
      });
  };
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Search Restaurants
        </Typography>
      </Grid>
      <Box mb={2} component={Grid} item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              id="standard-basic"
              label="Restaurants"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <Button variant="contained" color="primary" onClick={getRestaurant}>
              Search
            </Button>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Box>

      <Grid item xs={12}>
        {JSON.stringify(restaurant)}
      </Grid>
    </Grid>
  );
}
