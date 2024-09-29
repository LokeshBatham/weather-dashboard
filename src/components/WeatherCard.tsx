import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface WeatherCardProps {
  data: any;
  unit: 'C' | 'F';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit }) => {
  const { name, main, weather, wind } = data;
  const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <Card sx={{background: 'linear-gradient(135deg, #e0f2ff 0%, #b3dbff 50%, #cce6ff 100%)', color: "#042174"}} style={{ marginTop: 20 }}>
      <CardContent>
        <Typography className="cityname" sx={{ display: 'flex', alignItems: 'center' }}  variant="h4">{name} <img src={iconUrl} alt={weather[0].description} /></Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography className="disc" variant="h6">Temperature: {main.temp}°{unit}</Typography>
            <Typography className="disc" variant="h6">Feels like: {main.feels_like}°{unit}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className="disc" variant="h6">Weather: {weather[0].main}</Typography>
            <Typography className="disc" variant="h6">Wind Speed: {wind.speed} m/s</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
