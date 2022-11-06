import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { getSession } from '~/session.server';
import commerce from '~/commerce.server';

import styles from './tailwind.css';
import remixImageStyles from 'remix-image/remix-image.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Shop',
  viewport: 'width=device-width,initial-scale=1'
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: remixImageStyles }
];

type LoaderData = {
  cart: Awaited<ReturnType<typeof commerce.getCart>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const cartId = session.get('cartId');

  const cart = await commerce.getCart(cartId);

  return { cart };
};

export default function App() {
  const { cart } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <>
          <Header cartCount={cart.total_items} />
          <Outlet />
          <Footer />
        </>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
