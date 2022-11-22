/* global browser describe it beforeAll $ */

var assert = require('assert');

describe('Publish Canvas Test', () => {
  beforeAll(() => {
    browser.url('Publish-Devices');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'Publish Different Devices');
  });

  it('should display available devices', () => {
    const audioSources = $('#audio-source-select option');
    audioSources.waitForExist(5000);

    const videoSources = $('#video-source-select option');
    videoSources.waitForExist(5000);
  });

  describe('when you click publish', () => {
    let audioMeter;
    beforeAll(() => {
      $('#publish-btn').click();
      audioMeter = $('#audio-meter meter');
    });

    it('The publisher should load', () => {
      const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
      publisher.waitForExist(10000);
    });

    it('click cycleVideo works', () => {
      const cycleVideoBtn = $('#cycle-video-btn');
      cycleVideoBtn.click();
      browser.waitUntil(() => cycleVideoBtn.isEnabled(), 5000);
    });

    const testAudio = () => {
      // Make sure audio is flowing
      browser.waitUntil(() => parseFloat(audioMeter.getAttribute('value'), 10) > 0, 10000, 'audio not flowing', 100);
    };

    it('The audio level meter should be working', () => {
      audioMeter.waitForVisible();
      testAudio();
    });

    it('switching audio source works', () => {
      const numAudioSources = browser.elements('#audio-source-select option').value.length;
      const audioSelector = $('#audio-source-select');
      if (numAudioSources > 1) {
        audioSelector.selectByIndex(1);
      }
      browser.waitUntil(() => audioSelector.isEnabled(), 5000);
      testAudio();
    });
  });
});
