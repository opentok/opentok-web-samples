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
    const publisher = $('div.OT_publisher[data-stream-created=\'true\']');
    publisher.waitForExist(10000);
  });

  it('You should be able to set the filter', () => {
    const filterSelect = $('#filter');
    filterSelect.selectByValue('grayscale');
    filterSelect.selectByValue('sepia');
    filterSelect.selectByValue('invert');
  });

  describe('2 windows', () => {
    let firstTabId;
    let secondTabId;

    beforeAll(() => {
      [ firstTabId ] = browser.getTabIds();
      browser.newWindow('.');
      secondTabId = browser.getTabIds().find(tabId => tabId !== firstTabId);
      browser.switchTab(secondTabId);
    });

    it('The subscriber should load if you open a new window', () => {
      var subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber.waitForExist(10000);
      browser.switchTab(firstTabId);
      const subscriber2 = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber2.waitForExist(15000);
    });
  });
});
