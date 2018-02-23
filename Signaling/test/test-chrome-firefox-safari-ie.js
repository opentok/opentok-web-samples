/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('Signaling Test', () => {
  beforeAll(() => {
    browser.url('Signaling');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'OpenTok Signaling Sample');
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
      [ firstTabId ] = browser.getTabIds();
      browser.newWindow('.');
      secondTabId = browser.getTabIds().find(tabId => tabId !== firstTabId);
      browser.switchTab(secondTabId);
    });

    it('The subscriber should load if you open a new window', () => {
      const subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber.waitForExist(15000);
      browser.switchTab(firstTabId);
      const subscriber2 = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
      subscriber2.waitForExist(15000);
    });

    it('You should be able to send text from one tab to another', () => {
      browser.setValue('#msgTxt', 'hello world\n');
      if (browser.desiredCapabilities.browserName === 'firefox') {
        // Sending the newline character doesn't work for firefox, we have to submit the form
        browser.submitForm('#msgTxt');
      }

      // Make sure my own text showed up in the text chat
      const myHistoryItem = $('#history p.mine');
      myHistoryItem.waitForExist(2000);
      const myHistoryText = browser.getText('#history p.mine');
      assert.equal(myHistoryText, 'hello world');

      // switch to other tab and make sure they got the message
      browser.switchTab(secondTabId);
      const theirHistoryItem = $('#history p.theirs');
      theirHistoryItem.waitForExist(2000);
      const theirHistoryText = browser.getText('#history p.theirs');
      assert.equal(theirHistoryText, 'hello world');
    });
  });
});
