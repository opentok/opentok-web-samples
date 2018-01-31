/* global browser describe it beforeAll $ */

var assert = require('assert');

describe('webdriver.io page', () => {
  const URL = 'http://localhost:8080/Basic Video Chat';
  beforeAll(() => {
    browser.url(URL);
  });

  it('should have the right title', () => {
    var title = browser.getTitle();
    assert.equal(title, 'OpenTok Getting Started');
  });

  it('The publisher should load', () => {
    var publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(5000);
  });

  it('The subscriber should load if you open a new window', () => {
    browser.execute(`window.open("${URL}")`);
    var subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
    subscriber.waitForExist(10000);
  });
});
