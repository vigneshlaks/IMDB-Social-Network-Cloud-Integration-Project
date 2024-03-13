# RESTful API for the Movie Search Application

In `server.js`, you will be creating the backend service which connects to your IMDB database hosted
on AWS RDS and returns the query results to the frontend.

## Configuration Setup

To connect your backend service to an AWS RDS instance, you will need to modify
the [`config.json`](/server/config.json) file to use the credentials and connection information for
your RDS database.

1. **Host**: The `host` value is the endpoint of your RDS instance. This endpoint is provided in the
   RDS dashboard and typically looks
   like `your-db-instance.cg034hpkmmjt.us-east-1.rds.amazonaws.com`. **However, for this
   assignment**, because we use a tunnel to forward requests, **you should set the host to
   `localhost`**.
2. **Port**: Ensure the `port` value matches the port used by your RDS instance. The default MySQL
   port is `3306`, but check your RDS instance settings to confirm.
3. **User**: Update the `user` field with the username created for your RDS database. This is not
   necessarily `admin` and will be whatever you specified when setting up the RDS instance.
4. **Database**: Ensure the `database` field matches the name of the database within your RDS
   instance you wish to connect to.
5. **Password**: Update the `password` field with the password associated with the username for your
   RDS database.

After updating `config.json`, your configuration should look something like this (note: these are
example values, replace them with your actual RDS details):


```json
{
  "database": {
    "host": "localhost",
    "port": "3306",
    "user": "yourRdsUsername",
    "database": "yourRdsDatabaseName",
    "password": "yourRdsPassword"
  },
  "serverPort": "8080"
}
```

Then, if you haven't already, you should follow the instructions
in [loader's README](/loader/README.md) to set up a tunnel connection to your RDS instance.

## API Specifications

The API has a single endpoint `/query` which accepts `GET` requests with the following optional
parameters:

- `title`: String contained in movie titles.
- `person`: Name of the person to filter movies by their involvement.
- `minRating`: Minimum average rating of the movies.
- `pageSize`: Number of results per page. Default to 20.
- `page`: Page number of the results (EC only). Default to 1.

The query should return the following for each movie:

- `primaryTitle`: The title of the movie.
- `actors`: A list of actors who acted in the movie. If there are no actors, this should default to
  an empty array `[]`.
- `directors`: A list of directors who directed the movie. If there are no directors, this should
  default to an empty array `[]`.
- `writers`: A list of writers who wrote the movie. If there are no writers, this should default to
  an empty array `[]`.
- `averageRating`: The average rating of the movie, returned as a string.
- `numVotes`: The number of votes for the movie, returned as a string.

It should also return the total number of results in a `numResults` field.

The results should be limited to `pageSize` entries per page, with the page number specified by
the `page` parameter (EC only). The results should be sorted in ascending order by
the `primaryTitle` of the movies.

### Sample API Response

For a sample query `http://localhost:8080/query?person=Charles%20Avery&minRating=7.0`, the response
should be structured as follows:

```json
{
  "results": [
    {
      "primaryTitle": "A Noise from the Deep",
      "actors": ["Charles Avery"],
      "directors": [],
      "writers": [],
      "averageRating": "7.0",
      "numVotes": "18"
    },
    {
      "primaryTitle": "Love and Bullets",
      "actors": [],
      "directors": ["Charles Avery"],
      "writers": [],
      "averageRating": "9.0",
      "numVotes": "17"
    }
  ],
  "numResults": 2
}
```

### Status Messages and Error Handling

- Return status `400` with JSON `{error: 'Invalid request'}` for invalid query parameters. These
  include:
  - `minRating` is not a number.
  - `pageSize` is not a number.
  - `pageSize` is not positive or not an integer.
  - `page` is not a number.
  - `page` is not positive, bigger than the total pages possible, or not an integer.
- Return status `500` with JSON `{error: 'Error querying database'}` for any database query errors.
- Return status `404` with JSON `{error: 'No matching results found'}` if no matching movie is
  found.
- Return status `200` with JSON containing the response data on success.

Note that the `400` error cases are not possible from our frontend, but you should still handle them
to ensure the API is robust. You may test these cases by manually entering the API URL with invalid
parameters in Postman or a web browser.

## SQL Query Construction

Using these parameters, you will write a **single** SQL query which does the following:

- If `title` is provided, filter the movies to include only those containing the `title` in
  their `primaryTitle` as a substring.
- If `person` is provided, filter the results to include only movies where the `person` is listed as
  substring of a principal's `primaryName`. The `person` could be of any role, even outside
  of `actors`, `directors`, and `writers`.
- If `minRating` is provided, filter the movies to include only those with an `averageRating`
  greater than or equal to the specified `minRating`.
- The results should be sorted in ascending order by the `primaryTitle` of the movies.

In your query, you are likely to employ the following SQL constructs:

- `SELECT`: To specify the fields to return.
- `FROM`: To specify the source table.
- `WHERE`: To filter the results based on specified conditions.
- `AND`: To combine multiple conditions in a WHERE clause.
- `LIKE`: To search for a specified pattern in a column.
- `JOIN`: To combine rows from different tables based on related columns.
- `GROUP BY`: To arrange identical data into groups.
- `ORDER BY`: To sort the results.
- `LIMIT`: To restrict the count of returned results.
- `OFFSET`: To skip a specified number of rows before returning the results.
- `COUNT`: To count the number of rows in a table.
- `GROUP_CONCAT`: To aggregate multiple row values into a single field.
- `DISTINCT CASE WHEN ... THEN ... END`: To conditionally select distinct values.

To assist in crafting your SQL query, refer to the following resources for syntax and functions:

- Basic SQL syntax and
  examples: [W3Schools SQL Examples](https://www.w3schools.com/sql/sql_examples.asp)
- Concatenating group
  results: [GROUP_CONCAT() function](https://www.w3resource.com/mysql/aggregate-functions-and-grouping/aggregate-functions-and-grouping-group_concat.php)
- Conditional
  aggregation: [COUNT DISTINCT with CASE WHEN ... THEN ...](https://tableplus.com/blog/2019/09/count-distinct-case-when-then.html)

## Running the Server

To run the server, you will need to install the required packages using `npm install` and then run
the server using `npm start` from inside the `server` directory and from the Docker terminal. The
server will be running on `http://localhost:8080`.
