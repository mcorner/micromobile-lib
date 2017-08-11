// babel-node --presets es2015 test.js

import MicroMobile from './index';

let syncResults = new MicroMobile.SyncResults("api.adtrtwo.com", "/production/experiment/result");

syncResults.addResults("foo");
syncResults.addResults("foo");
syncResults.addResults("foo");
syncResults.addResults("foo");
syncResults.addResults("foo");
syncResults.addResults("foo");
syncResults.addResults("foo");

syncResults.sync().then(() => {
  console.log("Done with sync: foo");
  syncResults.addResults("bar");
  return syncResults.sync().then(() => {console.log("Done with sync: bar");});
});
