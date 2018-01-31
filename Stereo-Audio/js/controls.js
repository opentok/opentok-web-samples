((exports) => {
  const $publishButton = document.getElementById('publishButton');
  const $unpublishButton = document.getElementById('unpublishButton');
  const $panControls = document.getElementById('panControls');
  const $panValueLabel = document.getElementById('panValueLabel');
  const $panValueSlider = document.getElementById('panValueSlider');

  const hide = $el => ($el.style.display = 'none');
  const show = $el => ($el.style.display = 'block');

  const callbacks = {
    publish: null,
    unpublish: null,
    setPanValue: null
  };

  const onPublishClick = () => {
    if (callbacks.publish) {
      callbacks.publish();
    }
  };

  const onUnpublishClick = () => {
    if (callbacks.unpublish) {
      callbacks.unpublish();
    }
  };

  const onSliderChange = () => {
    const { value } = $panValueSlider;
    $panValueLabel.textContent = Number(value).toFixed(1);

    if (callbacks.setPanValue) {
      callbacks.setPanValue(value);
    }
  };

  $publishButton.addEventListener('click', onPublishClick);
  $unpublishButton.addEventListener('click', onUnpublishClick);
  $panValueSlider.addEventListener('input', onSliderChange);
  $panValueSlider.addEventListener('change', onSliderChange);

  Object.assign(exports, {
    hideControls() {
      callbacks.publish = null;
      callbacks.unpublish = null;
      callbacks.setPanValue = null;
      hide($publishButton);
      hide($unpublishButton);
      hide($panControls);
    },

    showPublishButton(publishCallback) {
      callbacks.publish = publishCallback;
      callbacks.unpublish = null;
      callbacks.setPanValue = null;
      show($publishButton);
      hide($unpublishButton);
      hide($panControls);
    },

    showSlider(setPanValueCallback, unpublishCallback) {
      callbacks.publish = null;
      callbacks.unpublish = unpublishCallback;
      callbacks.setPanValue = setPanValueCallback;
      hide($publishButton);
      show($unpublishButton);
      show($panControls);
    }
  });
})(exports);
