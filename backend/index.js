const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const config = require('./config.json');

exports.experimentFileResultsHandler = function(event, context, callback) {
  console.log(event);
  console.log(event.data);
  console.log(JSON.stringify(event));
  const param = {Bucket: config.backend_bucket, Key: 'experiment-results/' + event.experiment_name, Body: event.data};

  s3.upload(param, function(err, data) {
    if (err){
      callback(err);
      console.log(err, err.stack);
    } // an error occurred
    else{
      console.log(data);           // successful response
      callback(null, "done");
    }
  });
};
