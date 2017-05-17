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

    const options = {
      hostname: this.host,
      port: 443,
      path: this.path,
      method: 'POST'
    };

    const req = https.request(options, (res) => {
      console.log('sync statusCode:', res.statusCode);
      console.log('sync headers:', res.headers);

      res.on('data', (d) => {
        //process.stdout.write(d);
      });
    });

    req.on('error', (e) => {
      console.error("Sync error: " + e);
    });
    req.end();
  }
}

module.exports.SyncResults = SyncResults;
