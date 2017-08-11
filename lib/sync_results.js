import uuid from 'uuid';
import https from 'https';
var zlib = require('zlib');

class SyncResults {
  constructor(host, path) {
    this.host = host;
    this.path = path;
    this.experimentName = new Date().getTime() + "-" + uuid.v4();
    this.syncing = false;
    this.segments = [];
    this.nextSegment = 0;
  }

  addResults(newResults){
    this.segments.push(newResults);
  }

  syncOne(updateCount){
    return new Promise((resolve,reject)=>{
      if (((this.nextSegment + 1) > this.segments.length) || this.syncing){
        resolve();
        return;
      }

      this.syncing = true;

      let postBody = {};
      postBody.experimentName = this.experimentName + "-" + this.nextSegment;
      postBody.data = this.segments[this.nextSegment];
      this.nextSegment += 1;

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
            this.syncing = false;
            if (updateCount) { updateCount((this.segments.length - this.nextSegment));}
            resolve();
          });
        });

        req.on('error', (e) => {
          console.error("Sync error: " + e);
          this.syncing = false;
          if (updateCount) { updateCount((this.segments.length - this.nextSegment));}

          resolve();
        });

        req.write(buffer);

        req.end();
      });
    });
  }

  delay(t) {
    return new Promise((resolve) => {
      setTimeout(resolve, t);
    });
  }

  sync(updateCount){
    return this.syncOne(updateCount).then(() => {
      if (this.syncing){
        return this.delay(100).then(() => {
          return this.sync();
        });
      } else if (((this.nextSegment + 1) <= this.segments.length)){
        return this.sync();
      }
    });
  }
}

module.exports.SyncResults = SyncResults;
