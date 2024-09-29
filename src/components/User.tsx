import React, { useEffect, useState } from 'react';
import { Grid, IconButton, CircularProgress, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WeatherCard from './WeatherCard';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

interface Widget {
  id: number;
  city: string;
  weatherData: any;
  unit: 'C' | 'F';
}

const User: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Load saved widgets from localStorage
    const savedWidgets = localStorage.getItem('UserData');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
    setLoading(false); // Set loading to false after data is loaded
  }, []);

  // Function to fetch updated weather data
  const fetchUpdatedWeather = async (city: string, unit: 'C' | 'F') => {
    try {
      const unitParam = unit === 'C' ? 'metric' : 'imperial';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unitParam}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  // Function to refresh weather data every 5 seconds
  useEffect(() => {
    const updateWeatherData = async () => {
      const updatedWidgets = await Promise.all(
        widgets.map(async (widget) => {
          const updatedData = await fetchUpdatedWeather(widget.city, widget.unit);
          return updatedData ? { ...widget, weatherData: updatedData } : widget;
        })
      );
      setWidgets(updatedWidgets);
    };

    const intervalId = setInterval(updateWeatherData, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [widgets]);

  const removeWidget = (id: number) => {
    // Filter out the widget with the given ID
    const updatedWidgets = widgets.filter((widget) => widget.id !== id);
    setWidgets(updatedWidgets); // Update state

    // Update local storage
    localStorage.setItem('UserData', JSON.stringify(updatedWidgets));
  };

  return (
    <div>
      {loading ? (
        // Show loader while data is being fetched
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress size={60} />
        </Box>
      ) : (
        // Display Weather Cards for each widget after loading is complete
        <Grid container spacing={2} style={{ marginTop: '0px' }}>
          {widgets
            .slice() // create a shallow copy of widgets array
            .reverse() // reverse the array to show latest first
            .map((widget) => (
              <Grid item xs={12} md={6} key={widget.id}>
                <div style={{ position: 'relative' }}>
                  <IconButton
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
                    onClick={() => removeWidget(widget.id)}
                  >
                    <DeleteIcon style={{ color: 'red' }} />
                  </IconButton>
                  <WeatherCard data={widget.weatherData} unit={widget.unit} />
                </div>
              </Grid>
            ))}
        </Grid>
      )}
    </div>
  );
};

export default User;
