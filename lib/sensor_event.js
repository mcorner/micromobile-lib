const BufferedSensor = require('./buffered_sensor');

const SensorTypes = {
  SENSOR_CONTINUOUS : 0,
  SENSOR_SINGLE : 1
};

class SensorEvent {
  constructor(eventStructure) {
    this.eventData = eventStructure.eventData;
    this.sensors = eventStructure.sensors;

    if (this.eventData == undefined){
      throw ("eventData not in structure");
    }
    for (var i = 0; i < this.sensors.length; i++){
      let sensor = this.sensors[i];
      this.eventData[sensor.name] = {};
      this.eventData[sensor.name].data = [];
    }
  }

  start(){
    this.eventData.startTime = new Date().getTime();
    for (var i = 0; i < this.sensors.length; i++){
      let sensor = this.sensors[i];
      if (sensor.type == SensorTypes.SENSOR_CONTINUOUS){
        console.log(sensor instanceof BufferedSensor);
        this.eventData[sensor.name].startSample = sensor.sensor.totalSamples;
      } else if (sensor.type == SensorTypes.SENSOR_SINGLE){
        throw ("need to implement SENSOR_SINGLE");
      }
    }
  }

  end(){
    let promises = [];
    this.eventData.startTime = new Date().endTime();

    for (var i = 0; i < this.sensors.length; i++){
      let sensor = this.sensors[i];
      if (sensor.type != SensorTypes.SENSOR_CONTINUOUS){
        continue;
      }

      promises.push(new Promise((resolve,reject) =>{
        sensor.setTimeout(function() {
          const totalSamples = sensor.sensor.totalSamples - sensor.startSample + 2 * sensor.buffer;

          if (totalSamples > sensor.sensor.size){
            console.log ("WARNING: OVERFLOW on " + sensor.name);
            this.eventData.overflow = true;
          }
          this.eventData[sensor.name].concat(sensor.sensor.lastN(totalSamples));
          resolve();
        }.bind(this, sensor), sensor.buffer);
      }));
    }
    return Promise.all(promises);
  }
}

module.exports.SENSOR_TYPES = SensorTypes;
module.exports.SensorEvent = SensorEvent;
