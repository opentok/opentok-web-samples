import Vue from 'vue';
import Session from './Session.vue';

const createSession = (apiKey, sessionId, token)=> {
  new Vue({
    el: '#app',
    render: h => h(Session, {
      props: {
        sessionId,
        apiKey,
        token
      }
    })
  });
};

if (config.API_KEY && config.TOKEN && config.SESSION_ID) {
  createSession(config.API_KEY, config.SESSION_ID, config.TOKEN);
} else {
  fetch(config.SAMPLE_SERVER_BASE_URL + '/session')
    .then((data) => data.json())
    .then((json) => {
      createSession(json.apiKey, json.sessionId, json.token);
    }).catch((err) => {
      alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
    });
}
