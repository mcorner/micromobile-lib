const CBuffer = require('cbuffer');

class BufferedSensor {
  constructor(sensorStart, size, options) {
    this.buffer = new CBuffer(size);
    this.timeoutCallback = null;
    sensorStart(this.success.bind(this), this.error.bind(this), options);
  }

  success(reading) {
    if (this.lastSample == reading.timestamp){
      return;
    }
    this.lastSample = reading.timestamp;

    this.buffer.push(reading);

    if (this.startTime === undefined){
      this.startTime = new Date().getTime();
      this.totalSamples = 1;
    } else {
      this.totalSamples++;
      this.rate = this.totalSamples / (1.0 * (new Date().getTime()-this.startTime)) * 1000;
    }
    this.fireTimeout();
  }

  error() {
    console.error('onError for BufferedSensor');
  }

  rate() {
    return this.rate;
  }

  lastN(n){
    return this.buffer.slice(this.buffer.length - n, this.buffer.length);
  }

  full(n){
    return this.buffer.length == this.buffer.size;
  }

  all() {
    return this.buffer.toArray();
  }

  clear(){
    this.buffer.empty();
  }

  clearTimeout(){
    this.timeoutCallback == null;
  }

  setTimeout(cb, numSamples){
    if (this.timeoutCallback != null){
      throw("Buffered sensor only supports one timed callback at a time.");
    }
    this.timeoutCallback = cb;
    this.timeoutSamples = numSamples;
  }

  fireTimeout(){
    if (this.timeoutCallback != null){
      this.timeoutSamples--;
      if (this.timeoutSamples == 0){
        let cb = this.timeoutCallback;
        this.timeoutCallback = null;
        cb();
      }
    }
  }
}

module.exports.BufferedSensor = BufferedSensor;
