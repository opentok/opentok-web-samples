# AngularBasicVideoChat

A basic video chat application using Angular.js 6 and OpenTok. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

>For an example of how to use OpenTok with Angular.js 1 have a look at [opentok-angular](http://github.com/aullman/opentok-angular).

## Important!

When building an Angular app with OpenTok you need to make sure to include the zone.js polyfills for rtcpeerconnection and getusermedia otherwise your application will not work in Safari, you will get timeouts subscribing. See [polyfills.ts](src/polyfills.ts) and [#17](/opentok/opentok-web-samples/issues/17) for details.

## Known Limitations

* This sample app does not work in IE 11. To get it to work in IE 11 you will need to turn on the extra polyfills for IE in [polyfills.ts](src/polyfills.ts).

## Demo

You can see a demo of this sample running at [opentok.github.io/opentok-web-samples/Angular-Basic-Video-Chat/](https://opentok.github.io/opentok-web-samples/Angular-Basic-Video-Chat/)

> **Note** The demo is setup so that a new room is generated based on your public IP address. So will only work if you are connecting from 2 browsers on the same network.

## Running the App

### Setting your OpenTok apiKey, sessionId and token

Before you can run this application you need to modify [config.ts](src/config.ts) and include your OpenTok API Key, Session ID and a valid token. For more details on how to get these values see [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/).

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
