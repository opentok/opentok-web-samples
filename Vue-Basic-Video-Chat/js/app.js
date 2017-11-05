Vue.component('publisher', {
  template: '<div></div>',
  props: {
    session: {
      type: OT.Session,
      required: false
    },
    opts: {
      type: Object,
      required: false
    }
  },
  mounted: function() {
    const publisher = OT.initPublisher(this.$el, this.opts, (err) => {
      if (err) {
        this.$emit('error', err);
      } else {
        this.$emit('publisherCompleted');
      }
    });
    this.$emit('publisherCreated', publisher);
    const publish = () => {
      this.session.publish(publisher, function(err) {
        if (err) {
          this.$emit('error', err);
        } else {
          this.$emit('publisherConnected', publisher);
        }
      });
    };
    if (this.session && this.session.isConnected()) {
      publish();
    } else if (this.session) {
      this.session.on('sessionConnected', publish);
    }
  }
});

Vue.component('subscriber', {
  props: {
    stream: {
      type: OT.Stream,
      required: true
    },
    session: {
      type: OT.Session,
      required: true
    },
    opts: {
      type: Object,
      required: false
    }
  },
  template: '<div></div>',
  mounted: function() {
    const subscriber = this.session.subscribe(this.stream, this.$el, this.opts, (err) => {
      if (err) {
        this.$emit('error', err);
      } else {
        this.$emit('subscriberConnected', subscriber);
      }
    });
    this.$emit('subscriberCreated', subscriber);
  }
});

function initializeSession(apiKey, sessionId, token) {
  new Vue({
    el: '#session',
    data: {
      streams: [],
      connections: [],
      connected: false,
      session: null
    },
    created: function() {
      this.session = OT.initSession(apiKey, sessionId);
      this.session.on('streamCreated', (event) => {
        this.streams.push(event.stream);
        this.$emit('streamCreated', event);
      });
      this.session.on('streamDestroyed', (event) => {
        const idx = this.streams.indexOf(event.stream);
        if (idx > -1) {
          this.streams.splice(idx, 1);
        }
      });
      this.session.connect(token, (err) => {
        if (err) {
          this.errorHandler(err);
        } else {
          this.connected = true;
        }
      });
    },
    methods: {
      errorHandler: function(err) {
        alert(err.message);
      }
    }
  });
}

if (API_KEY && TOKEN && SESSION_ID) {
  initializeSession(API_KEY, SESSION_ID, TOKEN);
} else {
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
    .then((data) => data.json())
    .then((json) => {
      initializeSession(json.apiKey, json.sessionId, json.token);
  });
}
