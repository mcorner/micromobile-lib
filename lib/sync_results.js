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

  sync(results){
    return new Promise((resolve,reject)=>{
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
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error("Sync error: " + e);
        resolve();
      });

      req.write(postBody);

      req.end();
    });
  }
}

module.exports.SyncResults = SyncResults;
