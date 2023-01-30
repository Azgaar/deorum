import PocketBase from 'pocketbase';

import { URL } from '$lib/config';

const admin = new PocketBase(URL);

// make sure admin is not exposed to the client!
export default admin;
