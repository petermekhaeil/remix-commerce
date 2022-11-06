import { json, redirect } from '@remix-run/cloudflare';
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useLocation,
  useSearchParams,
  useTransition
} from '@remix-run/react';
import Image from 'remix-image';
import invariant from 'tiny-invariant';
import classNames from 'classnames';
import { commitSession, getSession } from '~/session.server';
import Button from '~/components/Button';
import commerce from '~/commerce.server';

type LoaderData = {
  product: Awaited<ReturnType<typeof commerce.getProduct>>;
  selectedVariantIds: Array<string>;
};

export let action: ActionFunction = async ({ request, params }) => {
  const body = await request.text();
  const session = await getSession(request.headers.get('Cookie'));

  let formData = new URLSearchParams(body);
  let productId = formData.get('productId');
  let variantIds = formData.getAll('variantIds');

  let cartId = session.get('cartId');
  let redirectTo = formData.get('redirect') || `/product/${params.slug}`;

  if (!productId) {
    return redirect(redirectTo);
  }

  // The variant Ids are returned from the HTML form as "id,value" string
  // We turn this into an object that our commerce model understands.
  const variantOptions = variantIds.reduce((prev, curr) => {
    const [id, value] = curr.split(',');
    return {
      ...prev,
      [id]: value
    };
  }, {});

  const cart = await commerce.getCart(cartId);

  // Save cart ID if we just created a new cart
  cartId = cartId || cart.id;
  session.set('cartId', cart.id);

  await commerce.addToCart({
    cartId,
    productId,
    quantity: 1,
    variantOptions
  });

  const cookie = await commitSession(session);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': cookie
    }
  });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.slug, `params.slug is required`);

  const url = new URL(request.url);

  try {
    // Get the selected variant from the url search params
    let selectedOptions = Array.from(url.searchParams.entries()).map(
      ([name, value]) => ({
        name,
        value
      })
    );

    const product = await commerce.getProduct(params.slug, selectedOptions);

    return json({ product });
  } catch {
    throw new Response('Not Found', {
      status: 404
    });
  }
};

export default function ProductSlug() {
  const { product } = useLoaderData<LoaderData>();
  const location = useLocation();
  const [currentSearchParams] = useSearchParams();
  const transition = useTransition();

  const searchParams =
    transition.type === 'loaderSubmission' && transition.submission?.formData
      ? (transition.submission.formData as URLSearchParams)
      : currentSearchParams;

  const disabled = transition.state !== 'idle';

  return (
    <section>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="aspect-w-1 aspect-h-1 mx-auto max-w-md">
              {product.image ? (
                <Image
                  loading="eager"
                  decoding="auto"
                  src={product.image.url}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  height={480}
                  width={480}
                  placeholder="blur"
                />
              ) : null}
            </div>
          </div>

          <div className="sticky top-0">
            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch]">
                <h1 className="text-2xl font-bold">{product.name}</h1>
              </div>

              <p className="text-lg font-bold">
                {product.price.formatted_with_symbol}
              </p>
            </div>

            {product.variant_groups.map((variant) => (
              <div key={variant.id} className="mt-8">
                <Form replace action={location.pathname}>
                  {Array.from(searchParams.entries()).map(([key, value]) =>
                    key === variant.name ? null : (
                      <input
                        key={key + value}
                        type="hidden"
                        name={key}
                        defaultValue={value}
                      />
                    )
                  )}

                  <h2 className="text-sm font-medium text-gray-900">
                    {variant.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center space-x-3">
                    {variant.options?.map((option) => (
                      <button
                        key={option.id}
                        name={variant.name}
                        value={option.name}
                        type="submit"
                        className="cursor-pointer"
                      >
                        <span
                          className={classNames(
                            `block rounded-full border border-gray-200 px-3 py-1 text-xs ${
                              searchParams.get(variant.name) === option.name
                                ? 'bg-yellow-500'
                                : ''
                            }`
                          )}
                        >
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </Form>
              </div>
            ))}
            <div className="mt-8">
              <Form replace method="post" className="mt-8">
                <input type="hidden" name="_action" value="AddToCart" />

                <input
                  key={product.id}
                  defaultValue={product.id}
                  type="hidden"
                  name="productId"
                />

                <input
                  key={location.pathname + location.search}
                  defaultValue={location.pathname + location.search}
                  type="hidden"
                  name="redirect"
                />

                {product.selectedVariantIds.map((variantId) => (
                  <input
                    key={Object.entries(variantId).toString()}
                    type="hidden"
                    name="variantIds"
                    defaultValue={Object.entries(variantId).toString()}
                  />
                ))}

                <SubmitButton action="AddToCart" disabled={disabled} />
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({
  action,
  disabled
}: {
  action: string;
  disabled: boolean;
}) {
  const transition = useTransition();
  const transitionAction = transition.submission?.formData.get('_action');

  let text = 'Add to cart';

  if (transitionAction === action && transition.state === 'submitting') {
    text = 'Adding...';
  }

  if (transitionAction === action && transition.state === 'loading') {
    text = 'Added!';
  }

  return (
    <Button type="submit" disabled={disabled}>
      <span className="text-sm font-medium">{text}</span>
    </Button>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <section>
        <div className="relative mx-auto max-w-screen-xl px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link
            to="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Continue Shopping
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </section>
    );
  }
}
