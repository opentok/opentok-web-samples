/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('Archiving Sample Test', () => {
  beforeAll(() => {
    browser.url('Archiving');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'OpenTok Archiving Sample');
  });

  it('The publisher should load', () => {
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
    browser.pause(2000);
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
      const subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber.waitForExist(10000);
      browser.switchTab();
      const subscriber2 = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber2.waitForExist(5000);
    });

    it('The Start Archive button should start archiving', () => {
      $('#buttons #start').click();
      $('.OT_publisher .OT_archiving-on.OT_mode-on').waitForExist(10000);
    });

    it('The Stop Archive button should stop archiving', () => {
      $('#buttons #stop').click();
      $('.OT_publisher .OT_archiving-off.OT_mode-on').waitForExist(10000);
    });

    it('The View Archive button should take you to view the archive', () => {
      const viewButton = $('#buttons #view');
      viewButton.waitForVisible(2000);
      // Wait for us go to the archive view URL
      viewButton.click();
      browser.waitUntil(() => {
        let pageUrl = browser.getUrl();
        return pageUrl.match('^https:\/\/.+\/archive\/.+\/view$', 'ga');
      }, 5000);
    });
  });
});
