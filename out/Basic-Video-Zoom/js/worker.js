/* eslint-disable indent */
import { MediaProcessor } from '../node_modules/@vonage/media-processor/dist/media-processor.es.js';
import ResizeTransformer from './transformer.js';

let mediaProcessor;
let mediaipeTransformers;

onmessage = async (event) => {
  console.log('worker message');
  const { operation } = event.data;
  switch (operation) {
    case 'init': {
      console.log('worker initializing');
      mediaProcessor = new MediaProcessor();
      mediaipeTransformers = new ResizeTransformer();
      mediaProcessor.setTransformers([mediaipeTransformers]);
      break;
    }

    case 'transform': {
      console.log('worker transforming');
      const { readable, writable } = event.data;
      mediaProcessor.transform(readable, writable).then(() => {
        const msg = { callbackType: 'success', message: 'transform' };
        postMessage(JSON.stringify(msg));
      }).catch(e => console.error(e));
      console.log('done transforming');
      break;
    }
    case 'onResults': {
      const {result} = event.data;
      const faceDimension = {
          width: result.width,
          height: result.height,
          xCenter: result.xCenter,
          yCenter: result.yCenter
      };
      mediaipeTransformers.onResult(faceDimension);
      break;
    }
    case 'destroy': {
      let msg;
      try {
        await mediaProcessor.destroy();
        msg = { callbackType: 'success', message: 'destroy' };
      } catch (error) {
        msg = { callbackType: 'failure', message: error };
      }
      postMessage(JSON.stringify(msg));
      break;
    }

    default: {
      break;
    }
  }
};


