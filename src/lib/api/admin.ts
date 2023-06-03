import PocketBase from 'pocketbase';

import { URL } from '$lib/config';

const admin = new PocketBase(URL);

// PocketBase JS SDK documentation: https://github.com/pocketbase/js-sdk/blob/v0.7/README.md
// disable autocancellation for all requests
admin.beforeSend = function (url, reqConfig) {
  delete reqConfig.signal;
  return reqConfig;
};

// make sure admin is not exposed to the client!
export default admin;
