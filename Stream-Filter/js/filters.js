/* global Uint8ClampedArray */
// This file exposes a Filters object which has methods for different filters
// none, grayscale, sepia and invert. It also has a selectedFilter property which is the currently
// selected filter.

(function closure(exports) {
  var Filters = {
    none: function none(imgData) {
      return imgData;
    },

    grayscale: function grayscale(imgData) {
      const res = new Uint8ClampedArray(imgData.data.length);
      for (let i = 0; i < imgData.data.length; i += 4) {
        // Using the luminosity algorithm for grayscale 0.21 R + 0.72 G + 0.07 B
        // https://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
        var inputRed = imgData.data[i];
        var inputGreen = imgData.data[i + 1];
        var inputBlue = imgData.data[i + 2];
        res[i] = res[i + 1] = res[i + 2] = Math.round(0.21 * inputRed + 0.72 * inputGreen + 0.07 * inputBlue);
        res[i + 3] = imgData.data[i + 3];
      }
      return new ImageData(res, imgData.width, imgData.height);
    },

    sepia: function sepia(imgData) {
      const res = new Uint8ClampedArray(imgData.data.length);
      for (let i = 0; i < imgData.data.length; i += 4) {
        // Using the algorithm for sepia from:
        // https://www.techrepublic.com/blog/how-do-i/how-do-i-convert-images-to-grayscale-and-sepia-tone-using-c/
        var inputRed = imgData.data[i];
        var inputGreen = imgData.data[i + 1];
        var inputBlue = imgData.data[i + 2];
        res[i] = Math.round((inputRed * 0.393) + (inputGreen * 0.769) + (inputBlue * 0.189));
        res[i + 1] = Math.round((inputRed * 0.349) + (inputGreen * 0.686) + (inputBlue * 0.168));
        res[i + 2] = Math.round((inputRed * 0.272) + (inputGreen * 0.534) + (inputBlue * 0.131));
        res[i + 3] = imgData.data[i + 3];
      }
      return new ImageData(res, imgData.width, imgData.height);
    },

    invert: function invert(imgData) {
      const res = new Uint8ClampedArray(imgData.data.length);
      for (let i = 0; i < imgData.data.length; i += 4) {
        // Invert the colors red = 255 - inputRed etc.
        res[i] = 255 - imgData.data[i];
        res[i + 1] = 255 - imgData.data[i + 1];
        res[i + 2] = 255 - imgData.data[i + 2];
        res[i + 3] = imgData.data[i + 3]; // Leave alpha alone
      }
      return new ImageData(res, imgData.width, imgData.height);
    }
  };
  // Set the initial filter to none
  Filters.selectedFilter = Filters.none;

  // When the filter selector changes we update the selectedFilter
  var filterSelector = document.querySelector('#filter');
  filterSelector.addEventListener('change', function change() {
    Filters.selectedFilter = Filters[filterSelector.value];
  });

  exports.Filters = Filters;
})(exports);
