const AWS = require('aws-sdk');
const uuid = require('uuid');

class SyncResults {
  constructor(region, identityPoolId, functionName='experimentFileResultsHandler') {
    this.region = region;
    this.identityPoolId = identityPoolId;
    this.functionName = functionName;
    this.experimentName = new Date().getTime() + "-" + uuid.v4();

    AWS.config.update({region: this.region});
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: this.identityPoolId});
    this.lambda = new AWS.Lambda({region: this.region, apiVersion: '2015-03-31'});
  }

  sync(results) {
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
        console.log("sync complete: " + data.Payload);
      }
    });
  }
}

module.exports.SyncResults = SyncResults;
