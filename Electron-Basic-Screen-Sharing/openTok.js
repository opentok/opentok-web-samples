// Set Credentials
const apiKey = '47383071';
const sessionId = '2_MX40NzM4MzA3MX5-MTYzODk5NzkyODM2MH5VaWpyQjk5VTlPSEZJcWNmWWZKODVvR1J-fg';
const token = 'T1==cGFydG5lcl9pZD00NzM4MzA3MSZzaWc9ODEzOThmMWRhOTViYTE4Y2RiOTViNzZkNzZmMzczZTFkY2U5NmQ5YzpzZXNzaW9uX2lkPTJfTVg0ME56TTRNekEzTVg1LU1UWXpPRGs1TnpreU9ETTJNSDVWYVdweVFqazVWVGxQU0VaSmNXTm1XV1pLT0RWdlIxSi1mZyZjcmVhdGVfdGltZT0xNjM4OTk3OTQ1Jm5vbmNlPTAuMzMwMjcyMjk1NTI2ODg0MiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjM5NjAyNzQ0JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

if (!apiKey || !sessionId || !token) {
  alert('You need to add your apiKey, sessionId and token to openTok.js');
}

// Initialize Session
const session = OT.initSession(apiKey, sessionId);

// Set session event listeners
session.on({
  streamCreated: (event) => {
    session.subscribe(event.stream, 'subscriber', (error) => {
      if (error) {
        console.error(`There was an issue subscribing to the stream: ${error}`);
      }
    });
  },
  streamDestroyed: (event) => {
    console.log(`Stream with name ${event.stream.name} ended because of reason: ${event.reason}`);
  }
});

// Create a publisher
const publisher = OT.initPublisher('publisher', { videoSource: 'screen' }, (initError) => {
  if (initError) {
    console.error(`There was an error initializing the publisher: ${initError}`);
  }
});

// Connect to the session
session.connect(token, (error) => {
  // If the connection is successful, initialize a publisher and publish to the session
  if (error) {
    console.error(`There was an error connecting to session: ${error}`);
    publisher.destroy();
    return;
  }
  session.publish(publisher, (pubError) => {
    if (pubError) {
      console.error(`There was an error when trying to publish: ${pubError}`);
    }
  });
});
