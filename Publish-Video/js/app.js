/* global OT */

(function closure() {
  const video = document.querySelector('#video');
  if (!video.captureStream) {
    alert('This browser does not support VideoElement.captureStream(). You must use Google Chrome.');
    return;
  }
  const stream = video.captureStream();
  let publisher;
  const publish = () => {
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    if (!publisher && videoTracks.length > 0 && audioTracks.length > 0) {
      stream.removeEventListener('addtrack', publish);
      publisher = OT.initPublisher('publisher', {
        videoSource: videoTracks[0],
        audioSource: audioTracks[0],
        fitMode: 'contain',
        width: 320,
        height: 240
      }, (err) => {
        if (err) {
          video.pause();
          alert(err.message);
        } else {
          video.play();
        }
      });
      publisher.on('destroyed', () => {
        video.pause();
      });
    }
  };
  stream.addEventListener('addtrack', publish);
  publish();
})();
