// Polyfill findIndex for IE 11 support
import findIndex from 'array.prototype.findindex';
findIndex.shim();
