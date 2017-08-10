// babel-node --presets es2015 test.js

import MicroMobile from './index';

let syncResults = new MicroMobile.SyncResults("api.adtrtwo.com", "/production/experiment/result");

syncResults.sync("foo");
