/* global browser describe it beforeAll $ OT */

const assert = require('assert');

describe('OpenTok Stereo Audio Test', () => {
  beforeAll(() => {
    browser.url('Stereo-Audio');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'OpenTok Stereo Audio');
  });

  it('The publish button should show up', () => {
    $('#publishButton button').waitForVisible();
  });

  it('The publisher should load when you click publish', () => {
    $('#publishButton button').click();
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
  });

  it('The pan audio slider should appear', () => {
    const slider = $('#panValueSlider');
    slider.waitForVisible();
  });

  it('The subscriber should load if you open a new window', () => {
    browser.newWindow('.');
    const subscriber = $('div.OT_subscriber:not(.OT_loading) .OT_video-element');
    subscriber.waitForExist(10000);
  });

  it('The audio should be working', () => {
    // We check this by looking at the audio level meter and making sure it is moving
    browser.execute(() => {
      OT.subscribers.find().subscribeToVideo(false);
    });
    browser.waitUntil(() => {
      const widthProp = $('.OT_audio-level-meter__value').getCssProperty('width');
      return widthProp.parsed.value > 200;
    });
  });
});
