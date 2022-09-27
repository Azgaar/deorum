import PocketBase from 'pocketbase';

import { URL } from '$lib/config';

const client = new PocketBase(URL);

export default client;
