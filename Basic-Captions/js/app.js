/* global OT SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
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

function displayCaption(captionText, widgetType) {
  console.log(`Caption text: ${captionText}`);
  let container;
  if (widgetType === 'subscriber'){
    container = OT.subscribers.find().element;
  } else if (widgetType === 'publisher'){
    container = OT.publishers.find().element;
  } else {
    console.warn('Invalid Widget Type');
    return
  }
  const [widget] = container.getElementsByClassName('OT_widget-container');

  const oldCaptionBox = widget.querySelector('.caption-box');
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

  widget.appendChild(captionBox);
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

    // add captions to the subscriber object
    try {
      await subscriber.subscribeToCaptions(true);
    } catch (err) {
      console.warn(err);
    }

    subscriber.on('captionReceived', (event) => {
      if (!captions){
        // Client didn't initiate the captions. Remove controls.
        captionsStartBtn.style.display = 'none';
        captionsStopBtn.style.display = 'none';
      }
      displayCaption(event.caption, 'subscriber')
    });
  });

  session.on('sessionDisconnected', (event) => {
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
        publishCaptions: true,
      };
      publisher = OT.initPublisher('publisher', publisherOptions, (err) => {
        if (err) {
          handleError(err);
        } else {
          session.publish(publisher, () => {
            selfSubscribe(session)
          });
        }
      });
    }
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

const selfSubscribe = (session) => {
  const captionSub = session.subscribe(publisher.stream, document.createElement('div'),
   {testNetwork: true})
   // Note that testNetwork will be fixed in 2.25.1
  captionSub.setAudioVolume(0)

  captionSub.on('captionReceived', (event) => {
    displayCaption(event.caption, 'publisher')
})
}

async function startCaptions(){
  console.log('start captions');
  try {
    captions = await postData(SAMPLE_SERVER_BASE_URL +'/captions/start',{sessionId, token});
    captionsStartBtn.style.display = 'none';
    captionsStopBtn.style.display = 'inline';
  }
  catch(error){
    handleError(error);
  }
}

async function stopCaptions(){
  console.log('stop captions');
  try {
    captions = await postData(`${SAMPLE_SERVER_BASE_URL}/captions/${captions.id}/stop`,{});
    captionsStartBtn.style.display = 'none';
    captionsStopBtn.style.display = 'inline';
  }
  catch(error){
    captionsStartBtn.style.display = 'inline';
    captionsStopBtn.style.display = 'none';
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
