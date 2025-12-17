# OpenTok.js End-to-End Media Encryption

This sample application shows how to connect to an OpenTok [end-to-end media encrypted session](https://tokbox.com/developer/guides/end-to-end-encryption/).

> Note: In order for this demo to work, End-to-End Media Encryption must be added to your [TokBox account settings](https://tokbox.com/account/#/settings).

## Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/opentok/opentok-web-samples/tree/main/End-To-End-Media-Encryption)

- Rename the `.env.example` to `.env`
- Enter your credentials in `.env` and the application will load.
- Click "Open in New Tab" twice.
- Enter a name in one of the tabs as well as an encryption key and press the Enter button.
- In the other tab, enter a name, but the same encryption key from before and press the Enter button.
- You should be in an End-to-End Media Encrypted video call.
- Try changing the encryption key in one of tabs.

## Running the App Locally

- Clone this repo
- `npm install` the dependencies
- Rename the `.env.example` to `.env`
- In the .env file, enter in the values for API_KEY and
  API_SECRET for your application that you get from the [dashboard](https://tokbox.com/account)

  ```
  API_KEY='32545611'
  API_SECRET='d427z4678408b159g3a8321027b72d7a18ef1cf6'
  ```

- `npm run start` to start the application
- Visit http://localhost:3010 in a browser.
- Enter in a name and an encryption key and press enter.
- Open http://localhost:3010 in another tab/window and enter in another name, but the same encryption key from before.

## Getting an OpenTok session ID, token, and API key

An OpenTok session connects different clients letting them share audio-video streams and send
messages. Clients in the same session can include iOS, Android, and web browsers.

The End-to-End Media Encryption session is created on the server with the media mode set to routed and the e2ee flag set to true.

For example, in Node, it would look like this:

```
const sessionOptions = {
  mediaMode: 'routed',
  e2ee: 'true', // enable end-to-end media encryption
};

opentok.createSession(sessionOptions, (err, session) => {...
```

**Session ID** -- Each client that connects to the session needs the session ID, which identifies
the session. Think of a session as a room, in which clients meet. Depending on the requirements of
your application, you will either reuse the same session (and session ID) repeatedly or generate
new session IDs for new groups of clients.

_Important_: This demo application assumes that only two clients -- the local Web client and
another client -- will connect in the same OpenTok session. For test purposes, you can reuse the
same session ID each time two clients connect. However, in a production application, your
server-side code must create a unique session ID for each pair of clients. In other applications,
you may want to connect many clients in one OpenTok session (for instance, a meeting room) and
connect others in another session (another meeting room).

**Token** -- The client also needs a token, which grants them access to the session. Each client is
issued a unique token when they connect to the session. Since the user publishes an audio-video
stream to the session, the token generated must include the publish role (the default). For more
information about tokens, see the OpenTok [Token creation
overview](https://tokbox.com/opentok/tutorials/create-token/).

**API key** -- The API key identifies your OpenTok developer account.

## Connecting to the session

This application works very much in the same way as the [Basic Video Chat Web Sample](https://github.com/opentok/opentok-web-samples/blob/main/Basic%20Video%20Chat).

The main difference is in the way the session is initialized.

```
session = OT.initSession(apiKey, sessionId, {
  encryptionSecret: encryptKeyInput.value,
});
```

The encryption key that was entered into the page is passed into `OT.initSession`.

To change the encryption key's value while connected to a session, call `setEncryptionSecret` with the new encryption key.

```
session.setEncryptionSecret(newEncryptKeyInput.value);
```

To learn more, please read the accompanying [blog post](https://developer.vonage.com/en/blog/adding-end-to-end-media-encryption-to-your-video-calls) and visit the [End-to-End Media Encryption Developer Documentation page](https://tokbox.com/developer/guides/end-to-end-encryption/).
