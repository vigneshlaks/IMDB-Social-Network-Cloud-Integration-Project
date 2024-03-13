import React, {useState} from 'react';
import axios from 'axios';
import config from './config.json';
import MovieSearchForm from './components/MovieSearchForm';
import MovieGallery from './components/MovieGallery';
import PageNavigator from './components/PageNavigator';

import './App.css';

// Sample server response that can be used for testing!
import sampleResponse from './sample-response.json';

function App() {

  const [movies, setMovies] = useState([]);
  const [lastSearchCriteria, setLastSearchCriteria] = useState({});
  const [error, setError] = useState(null);

  const rootURL = config.serverRootURL;
  const pageSize = 20;

  // Used for EC
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (searchCriteria, page = currentPage) => {
    try {
      // TODO:
      //  (1) Save the last search criteria
      //  (2) Call the server /query endpoint; make sure to use the rootURL from the config file.
      //  If you implement the EC, make sure to also include the page and pageSize parameters.
      //  (3) Set the movie results and clear the error
      //  (4) If you implement the EC, set the total pages based on the response from the server
      //  (Hint: You can use Math.ceil to round up the number of pages)
      const queryParams = { ...searchCriteria, pageSize, page };
      
      const response = await axios.get(`${rootURL}/query`, {
        params: queryParams,
      });

      if (response.data && response.data.results.length > 0) {
        setMovies(response.data.results);
        setTotalPages(Math.ceil(response.data.numResults / pageSize));
        setError(null);
      } else {
        queryParams = { ...searchCriteria, pageSize, page };
        setMovies([]);
        setTotalPages(0);
        queryParams = { ...searchCriteria, pageSize, page };
        setError('No matching results found.');
      }

      // Uncomment to use the first 20 sample response as mock data
      //setMovies(sampleResponse.results.slice(0, pageSize));
      //setTotalPages(Math.ceil(sampleResponse.numResults / pageSize));
    } catch (err) {
      // TODO:
      //  (1) Clear the movies
      //  (2) Set the total pages to 0
      //  (3) Set the error message based on the error response from the server
      setMovies([]);
      setTotalPages(0);
      setError(err.response && err.response.data.error ? err.response.data.error : 'An error occurred during the search.');
    }
  };

  
  // Helper function for the EC
  const handlePageChange = pageNumber => {
    // TODO: Set the current page and call handleSearch
    setCurrentPage(pageNumber);
    handleSearch(lastSearchCriteria, pageNumber);
  };

  return (
    <div className="App">
      <header className="body">
        <div>
          <h4>NETS 2120 Movie Search</h4>
          <MovieSearchForm onSearch={handleSearch}/>
          {error && (
            <div className="errorMessage">
              {error}
            </div>
          )}
          <MovieGallery movieResults={movies} onSearch={handleSearch}/>
          {
            totalPages > 0 &&
            <PageNavigator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          }
        </div>
      </header>
    </div>
  );
}

export default App;
