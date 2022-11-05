import { createCommerceProvider } from './models/providers/commercejs.server';
import { createLocalProvider } from './models/providers/local.server';

let commerce = createLocalProvider();

if (PROVIDER === 'commercejs' && !COMMERCEJS_PUBLIC_KEY) {
  throw new Error(
    'Your Commerce.js public API key must be provided as an environment variable named COMMERCEJS_PUBLIC_KEY.'
  );
}

if (PROVIDER === 'commercejs') {
  commerce = createCommerceProvider({
    token: COMMERCEJS_PUBLIC_KEY
  });
}

export default commerce;
