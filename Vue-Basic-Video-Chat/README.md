# vue-basic-video-chat

> A basic video chat application using vue.js and OpenTok. Based on the [webpack-simple](https://github.com/vuejs-templates/webpack-simple) vue-cli template.

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Vue-Basic-Video-Chat/](https://opentok.github.io/opentok-web-samples/Vue-Basic-Video-Chat/)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App

### Setting your OpenTok apiKey, sessionId and token

Before you can run this application you need to modify [config.js](./config.js) and include your OpenTok API Key, Session ID and a valid token. For more details on how to get these values see [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/).

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
