/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('Vue Basic Video Chat Test', () => {
  beforeAll(() => {
    browser.url('Vue-Basic-Video-Chat');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'vue-basic-video-chat');
  });

  it('The publisher should load', () => {
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(15000);
    browser.pause(2000);
  });

  describe('2 windows', () => {
    let firstTabId;
    let secondTabId;

    beforeAll(() => {
      [firstTabId] = browser.getTabIds();
      browser.newWindow('.');
      secondTabId = browser.getTabIds().find(tabId => tabId !== firstTabId);
      browser.switchTab(secondTabId);
    });

    it('The subscriber should load if you open a new window', () => {
      const subscriber = $(
        'div.OT_subscriber:not(.OT_loading) .OT_video-element'
      );
      subscriber.waitForExist(15000);
      browser.switchTab();
      const subscriber2 = $(
        'div.OT_subscriber:not(.OT_loading) .OT_video-element'
      );
      subscriber2.waitForExist(15000);
    });
  });
});
