/* eslint-disable indent */
import { MediaProcessor } from '../node_modules/@vonage/media-processor/dist/media-processor.es.js';
import Transformer from './transformer.js';

let mediaProcessor;

onmessage = async (event) => {
  const { operation } = event.data;
  switch (operation) {
    case 'init': {
      mediaProcessor = new MediaProcessor();
      const transformers = [new Transformer()];
      mediaProcessor.setTransformers(transformers);
      break;
    }

    case 'transform': {
      const { readable, writable } = event.data;
      mediaProcessor.transform(readable, writable).then(() => {
        const msg = { callbackType: 'success', message: 'transform' };
        postMessage(JSON.stringify(msg));
      }).catch(e => console.error(e));
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
