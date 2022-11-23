# OpenTok.js

[![npm version](https://badge.fury.io/js/%40opentok%2Fclient.svg)](https://badge.fury.io/js/%40opentok%2Fclient)

The OpenTok.js library lets you use OpenTok-powered video sessions on the web.

## Installation

```sh
yarn add @opentok/client
```

or

```sh
npm install --save @opentok/client
```

## Usage

### As a module

The library is bundled as a standalone UMD module so it is CommonJS compatible.

Create your application file `app.js`:

```js
const OT = require('@opentok/client');
const publisher = OT.initPublisher();
```

Bundle the application with your favourite bundler. For browserify just run:

```sh
browserify app.js > bundle.js
```

And include the bundle in your webpage:

```html
<script src="bundle.js"></script>
```

Source maps can be found in `dist/js/`. Make sure your bundler is configured to include them if you need to generate source maps.

### As a global window object

Include the `dist/js/opentok.min.js` script in your webpage.

Then use the `OT` object exposed in the global scope.

```html
<script src="node_modules/@opentok/client/dist/js/opentok.min.js"></script>
<script>
const publisher = OT.initPublisher();
</script>
```

*Note:* OpenTok.js automatically loads CSS and image files from the TokBox CDN when included in a webpage.

## Documentation

The API reference and tutorials can be found at https://tokbox.com/developer/sdks/js/
