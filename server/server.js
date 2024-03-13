const express = require('express');
const mysql = require('mysql2');
const config = require('./config.json'); // Load configuration
const cors = require('cors');

// Database connection setup
const db = mysql.createConnection(config.database);

// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});

const app = express();
app.use(cors());

const PORT = config.serverPort;

// Query route handler
app.get('/query', (req, res) => {
  /*
  // The number of results to return per page
  let pageSize = 20;
  const parsedSize = parseInt(req.query.pageSize);
  if (!isNaN(parsedSize) && parsedSize > 0) {
    pageSize = parsedSize;
  }
  */

  // TODO:
  //  1: Retrieve query parameters {title, person, rating}.
  //  2: Create a SQL Query, referencing instructions from the README. Use LIMIT to limit the number
  //  of results returned to pageSize.
  //  3: Query the database using `db.query`.
  //  4: Return the results as JSON in the format specified in the README and `sample-response.json`.

  // TODO: EC:
  //  1: Retrieve the query parameter page. If not provided, default to 1.
  //  2: If page is < 1 or > ceil(numResults/pageSize) or not an integer, return 400.
  //  3: Out of all the results, return the subset of results which correspond to the page parameter
  //  provided, e.g if page is 2 and pageSize = 20, you should return the 20th-40th results.
  //  Note: You should achieve this by modifying the SQL Query to include a LIMIT clause and an
  //  OFFSET clause, the OFFSET should be calculated from the page and pageSize parameters.
  //  You should not fetch all the results from the database and then filter them in your code.
  //  4: numResults should be the TOTAL number of results from a query without any result limits.
  //  Consider using COUNT(*) to calculate numResults.
  let { title, person, minRating, pageSize = 20, page = 1 } = req.query;

  // Convert parameters to ensure they are in the correct format.
  minRating = parseFloat(minRating);
  pageSize = parseInt(pageSize, 10);
  page = parseInt(page, 10);

  // Validation checks
  // Check if minRating is provided and is a valid number
  if (req.query.minRating !== undefined) {
    const minRating = parseFloat(req.query.minRating);
    if (isNaN(minRating)) {
      return res.status(400).json({ error: 'Invalid request' });
    }
  }

  // Check if pageSize is provided and is a valid, positive number
  if (req.query.pageSize !== undefined) {
    pageSize = parseInt(req.query.pageSize, 10);
    if (isNaN(pageSize) || pageSize <= 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }
  }

  // Check if page is provided and is a valid, positive number
  if (req.query.page !== undefined) {
    page = parseInt(req.query.page, 10);
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }
  }

  // Constructing the base SQL query
  let query = `
      SELECT t.primaryTitle, GROUP_CONCAT(DISTINCT a.primaryName SEPARATOR ', ') AS actors,
      GROUP_CONCAT(DISTINCT d.primaryName SEPARATOR ', ') AS directors,
      GROUP_CONCAT(DISTINCT w.primaryName SEPARATOR ', ') AS writers,
      r.averageRating, r.numVotes
      FROM titles t
      LEFT JOIN principals p ON t.tconst = p.tconst
      LEFT JOIN names a ON p.nconst = a.nconst AND p.category = 'actor'
      LEFT JOIN names d ON p.nconst = d.nconst AND p.category = 'director'
      LEFT JOIN names w ON p.nconst = w.nconst AND p.category = 'writer'
      INNER JOIN ratings r ON t.tconst = r.tconst
  `;

    // Constructing WHERE conditions based on input parameters
    let conditions = [];
    if (title) {
        conditions.push(`t.primaryTitle LIKE '%${title}%'`);
    }
    
    if (person) {
      // Include a subquery or an additional join condition to filter movies by the person's involvement in any role
      conditions.push(`
        EXISTS (
          SELECT 1 FROM principals
          JOIN names ON principals.nconst = names.nconst
          WHERE principals.tconst = t.tconst AND names.primaryName LIKE '%${person}%'
        )
      `);
  }

  if (!isNaN(minRating)) {
      conditions.push(`r.averageRating >= ${minRating}`);
  }

  // Adding WHERE conditions to the query
  if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
  }

  // Adding GROUP BY to consolidate results by title
  query += ' GROUP BY t.tconst';

  // Adding ORDER BY and LIMIT to handle sorting and pagination
  query += ` ORDER BY t.primaryTitle ASC`;

  // Executing the query
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          return res.status(500).json({ error: 'Error querying database' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'No matching results found' });
      }

      res.json({
        results: results.map(row => ({
            primaryTitle: row.primaryTitle,
            actors: row.actors ? row.actors.split(', ') : [],
            directors: row.directors ? row.directors.split(', ') : [],
            writers: row.writers ? row.writers.split(', ') : [],
            averageRating: row.averageRating.toString(),
            numVotes: row.numVotes.toString()
        })),
        numResults: results.length
    });
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});