
/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('React Basic Video Chat Test', () => {
  beforeAll(() => {
    browser.url('React-Basic-Video-Chat');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'React Basic Video Chat');
  });

  it('The publisher should load', () => {
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
    browser.pause(2000);
  });

  it('The session status should update to Connected', () => {
    const status = $('#sessionStatus');
    browser.waitUntil(() => status.getText() === 'Session Status: Connected', 5000);
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
      browser.switchTab(secondTabId);
      $('div.OT_publisher:not(.OT_loading) .OT_video-element').waitForExist(15000);
      const subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber.waitForExist(10000);
      browser.switchTab(firstTabId);
      const subscriber2 = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber2.waitForExist(10000);
    });

    it('The disable video button should disable the video', () => {
      browser.switchTab(secondTabId);
      $('#videoButton').click();
      // Wait for the silhouette to show up in the publisher
      $('.OT_publisher .OT_video-poster').waitForVisible(2000);
      browser.switchTab(firstTabId);
      // Wait for the silhouette to show up in the subscriber on the other side
      $('.OT_subscriber .OT_video-poster').waitForVisible(2000);
    });

    it('The enable video button should enable the video', () => {
      browser.switchTab(secondTabId);
      $('#videoButton').click();
      // Wait for the silhouette to go away in the publisher
      browser.waitUntil(() => $('.OT_publisher .OT_video-poster').isVisible() === false);
      browser.switchTab(firstTabId);
      // Wait for the silhouette to go away in the subscriber
      browser.waitUntil(() => $('.OT_subscriber .OT_video-poster').isVisible() === false);
    });
  });
});
