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

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
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
    // Initialize an OpenTok Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
