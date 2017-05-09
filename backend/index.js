const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const config = require('./config.json');

exports.experimentFileResultsHandler = function(event, context, callback) {
  const param = {Bucket: config.backend_bucket, Key: 'experiment-results/' + event.experimentName, Body: JSON.stringify(event.data)};

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
