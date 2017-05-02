const AWS = require('aws-sdk');

class SyncResults {
  constructor(experimentName, region, identityPoolId, functionName='experiment_file_results_handler') {
    this.experimentName = experimentName;
    this.region = region;
    this.identityPoolId = identityPoolId;
    this.functionName = functionName;

    AWS.config.update({region: this.region});
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: this.identityPoolId});
    this.lambda = new AWS.Lambda({region: this.region, apiVersion: '2015-03-31'});
  }

  syncResults(results) {
    var syncParams = {
      FunctionName : this.functionName,
      InvocationType : 'RequestResponse',
      LogType : 'None'
    };

    var body = {};
    body.experimentName = this.experimentName;
    body.data = results;

    syncParams.Payload = JSON.stringify(body);

    this.lambda.invoke(syncParams, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        console.log("sync complete");
        console.log(JSON.parse(data.Payload));
      }
    });
  }
}

module.exports.SyncResults = SyncResults;
