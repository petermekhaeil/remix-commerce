import { createCookieSessionStorage } from '@remix-run/cloudflare';

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set');
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [ENCRYPTION_KEY]
    }
  });

const cartSessionKey = 'cart';

export { getSession, commitSession, destroySession, cartSessionKey };
