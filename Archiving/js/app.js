/* global OT SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let archive;

const archiveStartBtn = document.querySelector('#start');
const archiveStopBtn = document.querySelector('#stop');
const archiveLinkSpan = document.querySelector('#archiveLink');

archiveStopBtn.style.display = "none";

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  const session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('archiveStarted', (event) => {
    archive = event;
    console.log('Archive started ' + archive.id);
    archiveStartBtn.style.display = 'none';
    archiveStopBtn.style.display = 'inline';
    archiveLinkSpan.innerHTML = '';
  });

  session.on('archiveStopped', (event) => {
    archive = event;
    console.log('Archive stopped ' + archive.id);
    archiveStartBtn.style.display = 'inline';
    archiveStopBtn.style.display = 'none';
    archiveLinkSpan.innerHTML = `<a href="${SAMPLE_SERVER_BASE_URL}/archive/${archive.id}/view" target="_blank">View Archive</a>`;
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  const randomColour = () => {
    return Math.round(Math.random() * 255);
  };

  // Canvas
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { height: 480, width: 640}
  }).then((stream) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    const video = document.createElement('video');
    video.height = 480;
    video.width = 640;
    video.autoplay = true;
    video.setAttribute('playsinline', 'true');
    video.srcObject = stream;
    document.querySelector('#videos').appendChild(video);
  
    // Draw a random colour in the Canvas every 3 seconds
    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgb(${randomColour()}, ${randomColour()}, ${randomColour()})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, video.width, video.height, 0, 0, canvas.width, canvas.height)
    }, 33);
  
    // initialize the publisher
    const publisherOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      scalableVideo: false,
      videoSource: canvas.captureStream(30).getVideoTracks()[0], // Use canvas.captureStream at 3 fps and pass the video track to the Publisher
      audioSource: stream.getAudioTracks()[0]
    };
  
    const publisher = OT.initPublisher('publisher', publisherOptions, (error) => {
      if (error) {
        clearInterval(interval);
        handleError(error);
        alert(error.message);
      }
    });
  
    publisher.on('destroyed', () => {
      clearInterval(interval);
    });
  
    // Connect to the session
    session.connect(token, (error) => {
      if (error) {
        handleError(error);
      } else {
        // If the connection is successful, publish the publisher to the session
        session.publish(publisher, handleError);
      }
    });
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

async function startArchiving(){
  console.log('start archiving');
  try {
    archive = await postData(SAMPLE_SERVER_BASE_URL +'/archive/start',{sessionId});
    console.log('archive started: ', archive);
    if (archive.status !== 'started'){
      handleError(archive.error);
    } else {
      console.log('successfully started archiving: ',archive);
    }
  }
  catch(error){
    handleError(error);
  }
}

async function stopArchiving(){
  console.log('stop archiving');
  try {
    archive = await postData(`${SAMPLE_SERVER_BASE_URL}/archive/${archive.id}/stop`,{});
    console.log('archive stopped: ', archive);
    if (archive.status !== 'stopped'){
      handleError(archive.error);
    } else {
      console.log('successfully stopped archiving: ',archive);
    }
  }
  catch(error){
    handleError(error);
  }
}

archiveStartBtn.addEventListener('click', startArchiving, false);
archiveStopBtn.addEventListener('click', stopArchiving, false);

// See the config.js file.
if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
  .then((response) => response.json())
  .then((json) => {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;
    console.log(json);
    // Initialize an OpenTok Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
