import uuid from 'uuid';
import https from 'https';
var zlib = require('zlib');

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
      postBody = JSON.stringify(postBody);

      zlib.gzip(postBody, (err, buffer) => {

        const options = {
          hostname: this.host,
          port: 443,
          path: this.path,
          method: 'POST',
          headers : {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
          }
        };

        const startTime = new Date().getTime();

        const req = https.request(options, (res) => {
          console.log('sync statusCode:', res.statusCode);

          res.on('data', (d) => {
            console.log("Sync time: " + (new Date().getTime() - startTime));

            resolve();
          });
        });

        req.on('error', (e) => {
          console.error("Sync error: " + e);
          resolve();
        });

        req.write(buffer);

        req.end();
      });
    });
  }
}

module.exports.SyncResults = SyncResults;
