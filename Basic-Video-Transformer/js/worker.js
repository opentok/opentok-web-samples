/* eslint-disable indent */
import { MediaProcessor } from '../node_modules/@vonage/media-processor/dist/media-processor.es.js';

let mediaProcessor;

onmessage = async (event) => {
  console.log('worker message');
  const { operation } = event.data;
  switch (operation) {
    case 'init': {
      console.log('worker initializing');
      mediaProcessor = new MediaProcessor();
      const transformers = [new GreyScaleTransformer()];
      mediaProcessor.setTransformers(transformers);
      break;
    }

    case 'transform': {
      console.log('worker transforming');
      const { readable, writable } = event.data;
      mediaProcessor.transform(readable, writable).then(() => {
        const msg = { callbackType: 'success', message: 'transform' };
        postMessage(JSON.stringify(msg));
      });
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
