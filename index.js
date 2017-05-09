const SyncResults = require('./lib/sync_results');
module.exports.SyncResults = SyncResults.SyncResults;

const BufferedSensor = require('./lib/buffered_sensor');
module.exports.BufferedSensor  = BufferedSensor.BufferedSensor;

const SensorEvent = require('./lib/sensor_event');
module.exports.SensorEvent = SensorEvent.SensorEvent;
module.exports.SENSOR_TYPES = SensorEvent.SENSOR_TYPES;
