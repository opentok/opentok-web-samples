/* global $ OT SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let captionsId;
let publisher;
let subscriber;

let captions;

// clears after a set amount of time
let captionsRemovalTimer;

const captionsStartBtn = document.querySelector('#start');
const captionsStopBtn = document.querySelector('#stop');


function handleError(error) {
  if (error) {
    console.error(error);
  }
}


// $(document).ready(function ready() {
//   // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
//   $.get(SAMPLE_SERVER_BASE_URL + '/session', function get(res) {
//     apiKey = res.apiKey;
//     sessionId = res.sessionId;
//     token = res.token;
//
//     initializeSession();
//   });
// });

function enableTranscription(session) {
  const { sessionId, token } = session;
  const url = `${SAMPLE_SERVER_BASE_URL}/captions/start`;

  let captionRes;
  try {
    captionRes = $.post(url, {
      sessionId,
      token,
    }).done(function response() {
      captionsId = captionRes.responseText;
    });
  } catch (e) {
    console.warn(e);
  }
}

async function disableTranscription() {
  const url = `${SAMPLE_SERVER_BASE_URL}/captions/stop`;
  try {
    $.post(url, {
      captionsId,
    });
  } catch (e) {
    console.warn(e);
  }
}


async function initializeSession() {
  let session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', async (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      testNetwork: true,
    };
    subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);

    // subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, function callback(error) {
    //   if (error) {
    //     console.log('There was an error publishing: ', error.name, error.message);
    //   }
    // });

    // add captions to the subscriber object
    // try {
    //   await subscriber.subscribeToCaptions(true);
    // } catch (err) {
    //   console.warn(err);
    // }

    subscriber.on('captionReceived', (event) => {
      const captionText = event.caption;
      const subscriberContainer = OT.subscribers.find().element;
      const [subscriberWidget] = subscriberContainer.getElementsByClassName('OT_widget-container');
    
      const oldCaptionBox = subscriberWidget.querySelector('.caption-box');
      if (oldCaptionBox) oldCaptionBox.remove();
    
      const captionBox = document.createElement('div');
      captionBox.classList.add('caption-box');
      captionBox.textContent = captionText;
    
      // remove the captions after 5 seconds
      const removalTimerDuration = 5 * 1000;
      clearTimeout(captionsRemovalTimer);
      captionsRemovalTimer = setTimeout(() => {
        captionBox.textContent = '';
      }, removalTimerDuration);
    
      subscriberWidget.appendChild(captionBox);
    });
    // $('#stop').show();
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, initialize a publisher and publish to the session
      const publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        // publishCaptions: true,
      };
      publisher = OT.initPublisher('publisher', publisherOptions, (err) => {
        if (err) {
          handleError(err);
        } else {
          session.publish(publisher, handleError);
        }
      });
    }

    // If the connection is successful, initialize a publisher and publish to the session
    // if (!error) {
    //   const publisherOptions = {
    //     insertMode: 'append',
    //     width: '100%',
    //     height: '100%',
    //     publishCaptions: true,
    //   };
    //   publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(err) {
    //     if (err) {
    //       console.log('There was an error initializing the publisher: ', err.name, err.message);
    //       return;
    //     }
    //     session.publish(publisher, function publishCallback(pubErr) {
    //       if (pubErr) {
    //         console.log('There was an error publishing: ', pubErr.name, pubErr.message);
    //       }
    //     });
    //   });
    //
    //   // enableTranscription(session);
    // } else {
    //   console.log('There was an error connecting to the session: ', error.name, error.message);
    // }
  });
}

async function postData(url='', data={}){
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok){
      throw new Error('error getting data!');
    }
    return response.json();
  }
  catch (error){
    handleError(error);
  }
}

async function startCaptions(){
  console.log('start captions');
  try {
    captions = await postData(SAMPLE_SERVER_BASE_URL +'/captions/start',{sessionId, token});
    console.log('captions started: ', captions);
    // if (archive.status !== 'started'){
    //   handleError(archive.error);
    // } else {
    //   console.log('successfully started archiving: ',archive);
    // }
  }
  catch(error){
    handleError(error);
  }
}

async function stopCaptions(){
  console.log('stop captions');
  try {
    // archive = await postData(`${SAMPLE_SERVER_BASE_URL}/archive/${archive.id}/stop`,{});
    console.log("captions: ",captions);
    captions = await postData(`${SAMPLE_SERVER_BASE_URL}/captions/stop`,{captionId:captionsId});
    console.log('captions stopped: ', captions);
    // if (archive.status !== 'stopped'){
    //   handleError(archive.error);
    // } else {
    //   console.log('successfully stopped archiving: ',archive);
    // }
  }
  catch(error){
    handleError(error);
  }
}

captionsStartBtn.addEventListener('click', startCaptions, false);
captionsStopBtn.addEventListener('click', stopCaptions, false);


// See the config.js file.
if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
      .then((response) => response.json())
      .then((json) => {
        apiKey = json.apiKey;
        sessionId = json.sessionId;
        token = json.token;
        // Initialize an OpenTok Session object
        initializeSession();
      }).catch((error) => {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
