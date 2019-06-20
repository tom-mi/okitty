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

## Troubleshooting

### Failed requests due to CORS

When serving okitty under another domain than the ot-recorder API, your browser might block some requests to the API
depending on your setup because of missing or wrong `Access-Control-` headers.

* If you are accessing the API via a reverse proxy, you need to configure the proxy to handle OPTIONS requests properly.
* As of version 0.8.4, ot-recorder API does not send any `Access-Control-` headers when requesting GPX files, i.e.
  `format=gpx`. This affects the "Download GPX" feature. There are multiple ways to work around that, e.g. by setting up
  a reverse proxy adding those missing headers.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Local config.json

To simplify development & avoid changing the example `public/config.json`, you can override the config file for local
development:

* Put another config file next to `public/config.json`, e.g. `public/config.local.json`.
* Add a file `.env.development.local` with the content `REACT_APP_CONFIG_URL=config.local.json`.

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
