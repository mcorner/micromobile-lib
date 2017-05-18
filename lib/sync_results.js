import uuid from 'uuid';
import https from 'https';

class SyncResults {
  constructor(host, path) {
    this.host = host;
    this.path = path;
    this.experimentName = new Date().getTime() + "-" + uuid.v4();
    this.inProgress = false;
    this.backlogResults = null;
  }

  sendBacklog(){
    const results = this.backlogResults;
    this.backlogResults = null;
    if (results){
      this.sync(results);
    }
  }

  sync(results){
    if (this.inProgress){
      console.log("sync in progress, delay");
      this.backlogResults = results;
      return;
    }
    this.inProgress = true;

    let postBody = {};
    postBody.experimentName = this.experimentName;
    postBody.data = results;
    postBody= JSON.stringify(postBody);

    const options = {
      hostname: this.host,
      port: 443,
      path: this.path,
      method: 'POST',
      headers : {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Length': postBody.length
      }
    };
    console.log("Sync: " + JSON.stringify(options));

    const req = https.request(options, (res) => {
      console.log('sync statusCode:', res.statusCode);

      res.on('data', (d) => {
        this.inProgress = false;
        this.sendBacklog();
      });
    });

    req.on('error', (e) => {
      this.inProgress = false;
      this.sendBacklog();

      console.error("Sync error: " + e);
    });

    req.write(postBody);

    req.end();
  }
}

module.exports.SyncResults = SyncResults;
