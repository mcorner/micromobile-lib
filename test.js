// babel-node --presets es2015 test.js

import SyncResults from './lib/sync_results';

let syncResults = new SyncResults("api.adtrtwo.com", "/production/experiment/result");

syncResults.sync("foo");
