import { browser, by, element, ProtractorBrowser } from 'protractor';

describe('angular-basic-video-chat App', () => {
  let secondBrowser: ProtractorBrowser;

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('/');
  });

  it('should load a publisher', () => {
    // Wait for the publishers to load
    browser.wait(() => element(by.css('div.OT_publisher:not(.OT_loading) .OT_video-element')).isPresent(), 20000);
  });

  it('should publish and subscribe', () => {
    secondBrowser = browser.forkNewDriverInstance(true);
    secondBrowser.ignoreSynchronization = true;
    secondBrowser.get('/');
    // Wait for the publishers to load
    browser.wait(() => element(by.css('div.OT_publisher:not(.OT_loading) .OT_video-element')).isPresent(), 20000);
    secondBrowser.wait(() => element(by.css('div.OT_publisher:not(.OT_loading) .OT_video-element')).isPresent(), 20000);

    // Wait for the subscribers to load
    browser.wait(() => element(by.css('div.OT_subscriber:not(.OT_loading) .OT_video-element')).isPresent(), 20000);
    secondBrowser.wait(() => element(by.css('div.OT_subscriber:not(.OT_loading) .OT_video-element')).isPresent(), 20000);
  });
});
