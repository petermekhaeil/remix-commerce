import type { LoaderFunction } from '@remix-run/server-runtime';
import {
  imageLoader,
  MemoryCache,
  pureTransformer
} from 'remix-image/serverPure';

const config = {
  selfUrl: 'http://localhost:3000',
  cache: new MemoryCache(),
  transformer: pureTransformer
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
