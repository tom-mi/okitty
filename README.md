# okitty

Web Frontend for [OwnTracks Recorder](https://github.com/owntracks/recorder).
It uses the builtin [HTTP API of OwnTracks Recorder](https://github.com/owntracks/recorder/blob/master/API.md).

## Installation

* Extract the tarball
* Adapt the config file `config.json` to your needs
* Serve the content with a webserver

## Configuration

There are two options in `config.json`:

* `apiUrl`: The url to the OwnTracks Recorder API, including the base path (`.../api/0`).
* `authorizationType`: The login mechanism required for the API. Currently supported:
  * `NONE`: No login required.
  * `BASIC_AUTH`: Login via Basic Authentication. If specified, a login form will be displayed during initialization.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
