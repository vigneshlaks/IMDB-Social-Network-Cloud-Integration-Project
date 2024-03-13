import React from 'react';
import {Card, CardContent, Grid} from '@mui/material';

const MovieCard = ({title, actors, directors, writers, averageRating, numVotes}) => (
  <Card>
    <CardContent>
      <p className="movieTitle">
        🎬 {title}
      </p>

      <p className="movieInfo" id="dictorInfo">
        <strong>Directed by: </strong> {directors}
      </p>
      <p className="movieInfo" id="actorInfo">
        <strong>Starring: </strong> {actors}
      </p>
      <p className="movieInfo lastInfo" id="writerInfo">
        <strong>Written by: </strong> {writers}
      </p>

      <div className="ratingContainer">
        <p className="movieRating">
          <strong> {averageRating} / 10 </strong>
        </p>
        <p className="movieVotes">
          {numVotes} votes
        </p>
      </div>
    </CardContent>
  </Card>
);

const MovieList = ({movies}) => (
  <Grid container spacing={1}>
    {movies.map((movie, key) => (
      <Grid item key={key} xs={10} sm={6} md={4} lg={3}>
        <MovieCard
          title={movie.primaryTitle}
          actors={movie.actors.join(", ")}
          directors={movie.directors.join(", ")}
          writers={movie.writers.join(", ")}
          averageRating={movie.averageRating}
          numVotes={movie.numVotes}
        />
      </Grid>
    ))}
  </Grid>
);

const MovieGallery = ({movieResults}) => {
  const movies = Object.values(movieResults);
  return (
    <div className="movieGallery">
      <MovieList movies={movies}/>
    </div>
  );
};

export default MovieGallery;
