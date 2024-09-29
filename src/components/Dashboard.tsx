import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Grid, IconButton, Autocomplete, Snackbar, FormControl, InputLabel, Select, MenuItem, CircularProgress, Box } from '@mui/material';
import WeatherCard from '../components/WeatherCard';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import City from '../Data/City.json';
import { SnackbarCloseReason } from '@mui/material';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

interface Widget {
  id: number;
  city: string;
  weatherData: any;
  unit: 'C' | 'F';
}

interface CityOption {
  title: string;
}

const Dashboard: React.FC = () => {
  const [city, setCity] = useState<string | null>(null);
  const [cityOption, setCityOption] = useState<CityOption[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [loading, setLoading] = useState<boolean>(false); 

  useEffect(() => {
    setCityOption(City);
  }, []);

  const fetchWeather = async (city: string, unit: 'C' | 'F') => {
    if (city) {
      setLoading(true); // Set loading to true when starting API call
      try {
        const unitParam = unit === 'C' ? 'metric' : 'imperial';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unitParam}`
        );
        return response.data;
      } catch (err) {
        setSnackbarMessage('City not found');
        setSnackbarOpen(true);
        return null;
      } finally {
        setLoading(false); // Set loading to false after the API call finishes
      }
    }
  };

  const searchWeather = async () => {
    if (city) {
      const weatherData = await fetchWeather(city, unit);
      if (weatherData) {
        setWidgets([
          {
            id: Date.now(),
            city,
            weatherData,
            unit,
          },
        ]);
      }
    } else {
      setSnackbarMessage('Please Select City');
      setSnackbarOpen(true);
    }
  };

  const removeWidget = (id: number) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
  };

  const saveWidgets = (widgetsToSave: Widget[]) => {
    const existingWidgetsJson = localStorage.getItem('UserData');
    const existingWidgets: Widget[] = existingWidgetsJson ? JSON.parse(existingWidgetsJson) : [];

    const uniqueWidgets = widgetsToSave.filter(widgetToSave => {
      return !existingWidgets.some(existingWidget => existingWidget.city === widgetToSave.city);
    });

    if (uniqueWidgets.length === 0) {
      setSnackbarMessage('This city already exists!');
      setSnackbarOpen(true);
      return;
    }

    const updatedWidgets = [...existingWidgets, ...uniqueWidgets];
    localStorage.setItem('UserData', JSON.stringify(updatedWidgets));

    setSnackbarMessage('Widgets saved successfully!');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={cityOption}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
              setCity(newValue ? newValue.title : null);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select City" variant="outlined" />
            )}
            style={{ width: "auto" }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="unit-select-label">Temperature Unit</InputLabel>
            <Select
              labelId="unit-select-label"
              value={unit}
              onChange={(event) => setUnit(event.target.value as 'C' | 'F')}
              label="Temperature Unit"
            >
              <MenuItem value="C">Celsius</MenuItem>
              <MenuItem value="F">Fahrenheit</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button variant="contained" color="primary" onClick={searchWeather} fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Search'} {/* Loader inside the button */}
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => saveWidgets(widgets)} 
            disabled={widgets.length === 0 || loading} 
            fullWidth
          >
            Add to User
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {loading ? ( // Display loader while fetching weather data
          <Box display="flex" justifyContent="center" width="100%" mt={5}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          widgets.map((widget) => (
            <Grid item xs={12} md={12} key={widget.id}>
              <div style={{ position: 'relative' }}>
                <IconButton
                  style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
                  onClick={() => removeWidget(widget.id)}
                >
                  <CloseIcon />
                </IconButton>
                <WeatherCard data={widget.weatherData} unit={widget.unit} />
              </div>
            </Grid>
          ))
        )}
      </Grid>

      {/* Snackbar for error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Dashboard;
