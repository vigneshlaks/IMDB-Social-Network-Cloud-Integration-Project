import React, {useState} from 'react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

const MovieSearchForm = ({onSearch}) => {
  const [searchCriteria, setSearchCriteria] = useState({
    title: '',
    person: '',
    minRating: 0,
  });

  const handleChange = (e) => {
    setSearchCriteria({...searchCriteria, [e.target.name]: e.target.value});
  };

  const handleSliderChange = (event, newValue) => {
    setSearchCriteria({...searchCriteria, minRating: newValue});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchCriteria);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#ffb74d',
      },
      background: {
        default: '#282c34',
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: '#ffb74d', // Slider color
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit} className="movieSearchForm">
        <TextField
          fullWidth
          label="Movie Title"
          variant="outlined"
          name="title"
          value={searchCriteria.title}
          onChange={handleChange}
          className="textField"
          InputLabelProps={{style: {color: 'white'}}}
        />
        <TextField
          fullWidth
          label="Person Name"
          variant="outlined"
          name="person"
          value={searchCriteria.person}
          onChange={handleChange}
          className="textField"
          InputLabelProps={{style: {color: 'white'}}}
        />
        <Slider
          value={searchCriteria.minRating}
          onChange={handleSliderChange}
          min={0}
          max={10}
          step={0.1}
          aria-labelledby="continuous-slider"
          className="ratingSlider"
        />
        <p className="ratingText">
          Minimum Rating: {searchCriteria.minRating}
        </p>
        <Button
          variant="contained"
          type="submit"
          className="searchButton"
        >
          Search
        </Button>
      </form>
    </ThemeProvider>
  );
};

export default MovieSearchForm;
