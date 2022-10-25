import PocketBase from 'pocketbase';

import { URL } from '$lib/config';

const admin = new PocketBase(URL);

export default admin;
