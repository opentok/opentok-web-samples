<template>
  <div></div>
</template>

<script>
import OT from '@opentok/client';
export default {
  name: 'publisher',
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
    const publisher = OT.initPublisher(this.$el, this.opts, err => {
      if (err) {
        this.$emit('error', err);
      } else {
        this.$emit('publisherCompleted');
      }
    });
    this.$emit('publisherCreated', publisher);
    const publish = () => {
      this.session.publish(publisher, err => {
        if (err) {
          this.$emit('error', err);
        } else {
          this.$emit('publisherConnected', publisher);
        }
      });
    };
    if (this.session && this.session.isConnected()) {
      publish();
    }
    if (this.session) {
      this.session.on('sessionConnected', publish);
    }
  }
};
</script>
