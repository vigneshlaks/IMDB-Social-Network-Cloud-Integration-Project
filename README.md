# IMDB Social Network: Cloud Integration Project

In this project, I developed a client-server web application aimed at integrating cloud storage and utilizing relational databases. The main focus was on building a social network application centered around movie principals, allowing users to search for movies by actor name.

**Objective:** Develop an RDD to represent the network of movie principals. Load the IMDB movie datasets into AWS RDS, create a REST server in Java for name-based table queries, and utilize React to build the frontend for searching and displaying query results.

### Code Structure

#### Loader

Set up a connection to RDS and load the movies data into the service.

#### Server

Created a RESTful server for querying the RDS by actor and returning information about the movies they have worked on.

#### Web GUI

Implemented logic in `App.js` to build the frontend for the application. This involved making network requests to the server to search for and display query results.
