/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('Publish Video Test', () => {
  beforeAll(() => {
    browser.url('Publish-Video');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'Publish from a Video Element');
  });

  it('The publisher should load', () => {
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
  });
});
