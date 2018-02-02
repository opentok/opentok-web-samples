/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('Basic Video Chat Test', () => {
  beforeAll(() => {
    browser.url('Basic Video Chat');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'OpenTok Getting Started');
  });

  it('The publisher should load', () => {
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
  });

  it('The subscriber should load if you open a new window', () => {
    browser.execute('window.open(window.location.href)');
    const subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
    subscriber.waitForExist(10000);
  });
});
