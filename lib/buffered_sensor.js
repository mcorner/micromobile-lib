const CBuffer = require('cbuffer');

class BufferedSensor {
  constructor(sensorStart, size, options) {
    this.buffer = new CBuffer(size);
    sensorStart(this.success.bind(this), this.error.bind(this), options);
  }

  success(reading) {
    if (this.last_sample == reading.timestamp){
      return;
    }
    this.lastSample = reading.timestamp;

    this.buffer.push(reading);

    if (this.start_time === undefined){
      this.startTime = new Date().getTime();
      this.totalSamples = 1;
    } else {
      this.total_samples++;
      this.rate = this.total_samples / (1.0 * (new Date().getTime()-this.start_time)) * 1000;
    }
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
}

module.exports.BufferedSensor = BufferedSensor;
