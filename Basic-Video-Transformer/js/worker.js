import { MediaProcessor } from '../node_modules/@vonage/media-processor/dist/media-processor.es.js';
import { GreyScaleTransformer } from './transformer.js';

const mediaProcessor = new MediaProcessor();
const greyScaleTransformer = new GreyScaleTransformer();
const transformers = [greyScaleTransformer];
mediaProcessor.setTransformers(transformers);

onmessage = async (event) => {
  const { operation } = event.data;
  switch (operation) {
  case 'transform': {
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

  default:
    break;
  }
};
