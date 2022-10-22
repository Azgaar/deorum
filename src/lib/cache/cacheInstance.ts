import Cache from './cache';

export const cache = new Cache({ debug: false });

export const expiration = 1000 * 60 * 60; // 1 hour
