import uuid from 'uuid';
import https from 'https';

class SyncResults {
  constructor(host, path) {
    this.host = host;
    this.path = path;
    this.experimentName = new Date().getTime() + "-" + uuid.v4();
  }

  sync(results){
    let postBody = {};

    postBody.experimentName = this.experimentName;
    postBody.data = results;

  }
}

module.exports.SyncResults = SyncResults;
