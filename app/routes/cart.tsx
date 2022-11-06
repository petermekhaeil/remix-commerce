import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useFetcher, useLoaderData } from '@remix-run/react';
import Image from 'remix-image';
import commerce from '../commerce.server';
import { getSession } from '~/session.server';
import Button from '~/components/Button';
import Anchor from '~/components/Anchor';

type LoaderData = {
  cart: Awaited<ReturnType<typeof commerce.getCart>>;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action');

  const session = await getSession(request.headers.get('Cookie'));
  const cartId = session.get('cartId');

  switch (action) {
    case 'removeFromCart': {
      const productId = formData.get('productId');
      await commerce.removeFromCart({ cartId, lineItemId: String(productId) });
      break;
    }
    default: {
      throw new Response('Bad Request', { status: 400 });
    }
  }

  return json({ success: true });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const cartId = session.get('cartId');
  const cart = await commerce.getCart(cartId);

  // TODO: Redirect if there is no cart?

  return { cart };
};

const Cart = () => {
  const { cart } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {cart.line_items.map((item) => (
                <li key={item.id} className="flex py-6" data-testid="cart-item">
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image?.url}
                        alt={item.name}
                        responsive={[
                          {
                            size: {
                              width: 128,
                              height: 128
                            }
                          }
                        ]}
                        placeholder="blur"
                      />
                    ) : null}
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm">
                          <p className="font-medium text-gray-700 hover:text-gray-800">
                            {item.name}
                          </p>
                        </h4>
                        <p className="ml-4 text-sm font-medium text-gray-900">
                          {item.price.formatted_with_symbol}
                        </p>
                      </div>
                      {item.selected_options.map((option) => {
                        return (
                          <p
                            className="mt-1 text-sm text-gray-500"
                            key={option.group_id}
                          >
                            {option.option_name}
                          </p>
                        );
                      })}
                    </div>

                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty: {item.quantity}</p>

                      <div className="flex">
                        <fetcher.Form method="post">
                          <input
                            type="hidden"
                            name="productId"
                            value={item.id}
                          />
                          <button
                            type="submit"
                            name="action"
                            value="removeFromCart"
                            disabled={fetcher.state !== 'idle'}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            {fetcher.submission &&
                            item.id ===
                              fetcher.submission?.formData.get('productId')
                              ? 'Removing...'
                              : 'Remove'}
                          </button>
                        </fetcher.Form>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="summary-heading" className="mt-10">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Subtotal
                  </dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    {cart.subtotal.formatted_with_symbol}
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>

            <div className="mt-10">
              <form method="get" action={cart.hosted_checkout_url}>
                <Button type="submit" name="action" value="checkout">
                  Checkout
                </Button>
              </form>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                <Anchor href="/">
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Anchor>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cart;
