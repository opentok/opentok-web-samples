import Vue from 'vue';
import Session from '@/components/Session.vue';

Vue.config.productionTip = false;

const createSession = (apiKey, sessionId, token) => {
  new Vue({
    render: h =>
      h(Session, {
        props: {
          sessionId,
          apiKey,
          token
        }
      })
  }).$mount('#app');
};

if (
  process.env.VUE_APP_API_KEY &&
  process.env.VUE_APP_TOKEN &&
  process.env.VUE_APP_SESSION_ID
) {
  createSession();
} else {
  fetch(process.env.VUE_APP_SAMPLE_SERVER_BASE_URL + '/session')
    .then(data => data.json())
    .then(json => {
      createSession(json.apiKey, json.sessionId, json.token);
    })
    .catch(() => {
      alert(
        'Failed to get opentok sessionId and token. Make sure you have updated the .env file.'
      );
    });
}
