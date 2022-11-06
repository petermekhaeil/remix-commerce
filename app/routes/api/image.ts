import type { LoaderFunction } from '@remix-run/server-runtime';
import type { Resolver } from 'remix-image/serverPure';
import {
  fetchResolver,
  imageLoader,
  mB,
  MemoryCache,
  pureTransformer
} from 'remix-image/serverPure';

const SELF_URL = 'http://localhost:8787';

const whitelistedDomains = new Set([SELF_URL, 'cdn.chec.io']);

export const myResolver: Resolver = async (asset, url, options, basePath) => {
  if (!whitelistedDomains.has(new URL(url).host)) {
    throw new Error('Domain not allowed!');
  }

  return fetchResolver(asset, url, options, basePath);
};

const config = {
  selfUrl: SELF_URL,
  cache: new MemoryCache({
    maxSize: mB(50)
  }),
  resolver: myResolver,
  transformer: pureTransformer
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
