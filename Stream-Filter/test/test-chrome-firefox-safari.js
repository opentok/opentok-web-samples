/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('Stream Filter Test', () => {
  beforeAll(() => {
    browser.url('Stream-Filter');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'OpenTok Stream Filters');
  });

  it('The publisher should load', () => {
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
  });

  it('You should be able to set the filter', () => {
    const filterSelect = $('#filter');
    filterSelect.selectByValue('grayscale');
    filterSelect.selectByValue('sepia');
    filterSelect.selectByValue('invert');
  });

  it('The subscriber should load if you open a new window', () => {
    browser.execute('window.open(window.location.href)');
    var subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
    subscriber.waitForExist(10000);
  });
});
