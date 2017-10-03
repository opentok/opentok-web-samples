// Set Credentials
const apiKey = "";
const sessionId = "";
const token = "";

// Initialize Session
const session = OT.initSession(apiKey, sessionId);

// Set session event listeners
session.on({
  streamCreated: (event) => {
    session.subscribe(event.stream, 'subscriber', (error) => {
      if (error) {
        console.log(`There was an issue subscribing to the stream: ${error}`);
      }
    });
  },
  streamDestroyed: (event) => {
    console.log(`Stream with name ${event.stream.name} ended because of reason: ${event.reason}`);
  }
})

// Connect to the session
session.connect(token, (error) => {
  // If the connection is successful, initialize a publisher and publish to the session
  if (error) {
    return console.log(`There was an error connecting to session: ${error}`);
  } else {
    // Create a publisher
    const publisher = OT.initPublisher('publisher', (error) => {
      if (error) {
        return console.log(`There was an error initializing the publisher: ${error}`);
      }
    });
    session.publish(publisher, (error) => {
      if (error) {
        return console.log(`There was an error when trying to publish: ${error}`);
      }
    });
  }
});
