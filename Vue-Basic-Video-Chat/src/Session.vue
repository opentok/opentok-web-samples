<template>
  <div id="session" v-on:error="errorHandler">
    <publisher :session="session" v-on:error="errorHandler"></publisher>
    <div id="subscribers" v-for="stream in streams" :key="stream.streamId">
      <subscriber v-on:error="errorHandler" :stream="stream" :session="session"></subscriber>
    </div>
  </div>
</template>

<script>
import OT from '@opentok/client';
import Publisher from './Publisher.vue';
import Subscriber from './Subscriber.vue';

const data = {
  msg: 'Welcome to Your Vue.js + OpenTok App',
  streams: [],
  session: null
};

const errorHandler = (err) => {
  alert(err.message);
};

export default {
  name: 'session',
  components: { Publisher, Subscriber },
  props: {
    sessionId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    },
  },
  created () {
    data.session = OT.initSession(this.apiKey, this.sessionId);
    data.session.connect(config.TOKEN, (err) => {
      if (err) {
        errorHandler(err);
      }
    });
    data.session.on('streamCreated', (event) => {
      data.streams.push(event.stream);
    });
    data.session.on('streamDestroyed', (event) => {
      const idx = data.streams.indexOf(event.stream);
      if (idx > -1) {
        data.streams.splice(idx, 1);
      }
    });
  },
  data: () => data,
  methods: {
    errorHandler
  }
};
</script>

<style>
  .OT_subscriber {
    float: left;
  }
  .OT_publisher {
    float: left;
  }
</style>
