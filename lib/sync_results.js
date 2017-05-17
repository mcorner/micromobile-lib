import uuid from 'uuid';
import http from 'http';
//import request from 'request';

class SyncResults {
  constructor(url) {
    this.url = url;
    this.experimentName = new Date().getTime() + "-" + uuid.v4();
  }

  sync(results){
    let postBody = {};

    postBody.experimentName = this.experimentName;
    postBody.data = results;

    request.post(
      this.url,
      { json: JSON.stringify(postBody) },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        } else {
          console.log(error);
        }
      }
    );
  }
}

module.exports.SyncResults = SyncResults;
