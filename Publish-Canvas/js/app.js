/* global OT */

(function closure() {
  const randomColour = () => {
    return Math.round(Math.random() * 255);
  };

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  // Draw a random colour in the Canvas every 1 second
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${randomColour()}, ${randomColour()}, ${randomColour()})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, 1000);

  // Use canvas.captureStream at 1 fps and pass the video track to the Publisher
  const publisher = OT.initPublisher('publisher', {
    videoSource: canvas.captureStream(1).getVideoTracks()[0]
  }, (err) => {
    if (err) {
      clearInterval(interval);
      alert(err.message);
    }
  });
  publisher.on('destroyed', () => {
    clearInterval(interval);
  });
})();
