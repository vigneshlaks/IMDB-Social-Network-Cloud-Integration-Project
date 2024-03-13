# Web GUI for the Movie Search Application

## Getting Started

Before starting, ensure that Node.js and npm (Node Package Manager) are of the latest versions. You
can check by running `node -v` and `npm -v` in your Docker's terminal. If these are not of the
latest stable versions, please refer to Homework 2 Milestone 1 to update them. You may have to do
this once every time you start a new Docker container.

## Components

The web GUI consists of the following main components:

- `MovieSearchForm`: This component provides the interface for users to enter search criteria (e.g.,
  actor name). It communicates user input back to the main `App.js` component to perform the search.

- `MovieGallery`: This component displays the search results. It receives movie data from `App.js`
  and renders it in a user-friendly format.

- `PageNavigator`: This component (used for extra credit) allows users to navigate through
  paginated search results. It displays page numbers and manages user interaction to fetch and
  display results for the selected page.

## Development

When developing the web GUI, focus on completing the unimplemented parts marked with `TODO` comments
in the `App.js` file. Specifically, you will need to:

- Implement the `handleSearch` function to send search requests to the server and process the
  response.

- Handle error states properly, showing meaningful messages to the user when the search fails or no
  results are found.

- Implement pagination logic (for extra credit) by handling page changes and fetching corresponding
  search results.

## Testing

You can test your application by running it using `npm install` followed by `npm start` inside
the `web` directory and trying out different search queries. Ensure that the search results are
displayed correctly and that the error handling works as expected.

Additionally, sample server responses are provided
in [`sample-response.json`](/web/src/sample-response.json) for offline testing. You can temporarily
use this mock data to get an idea of what the server response and GUI will look like.

## Additional Resources

For more information on React and its features, refer to
the [official React documentation](https://react.dev/). This documentation provides comprehensive
guides and tutorials that can help you understand React concepts and best practices.