import CBuffer from 'cbuffer';

class BufferedSensor {
  constructor(sensorStart, size, options) {
    this.buffer = new CBuffer(size);
    this.timeoutCallbacks = [];
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

  addTimeout(cb, numSamples){
    this.timeoutCallbacks.push({cb, numSamples});
  }

  fireTimeout(){
    this.timeoutCallbacks = this.timeoutCallbacks.filter(function(tcb) {
      tcb.numSamples--;
      if (tcb.numSamples <= 0){
        tcb.cb();
        return false;
      }
      return true;
    });
  }
}

module.exports.BufferedSensor = BufferedSensor;
