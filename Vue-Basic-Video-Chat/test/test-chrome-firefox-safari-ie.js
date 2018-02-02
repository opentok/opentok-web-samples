/* global browser describe it beforeAll $ */

var assert = require('assert');

describe('Vue Basic Video Chat Test', () => {
  beforeAll(() => {
    browser.url('Vue-Basic-Video-Chat');
  });

  it('should have the right title', () => {
    var title = browser.getTitle();
    assert.equal(title, 'vue-basic-video-chat');
  });

  it('The publisher should load', () => {
    var publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
  });

  it('The subscriber should load if you open a new window', () => {
    browser.execute('window.open(window.location.href)');
    var subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
    subscriber.waitForExist(10000);
  });
});
