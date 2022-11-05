import { json } from '@remix-run/cloudflare';
import type { LoaderFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData, useLocation } from '@remix-run/react';
import commerce from '~/commerce.server';
import ProductCard from '~/components/ProductCard';
import IconMenu from '~/components/IconMenu';

type LoaderData = {
  products: Awaited<ReturnType<typeof commerce.getAllProducts>>;
  categories: Awaited<ReturnType<typeof commerce.getAllCategories>>;
  sortOptions: Awaited<ReturnType<typeof commerce.getSortOptions>>;
  searchQuery: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  let category = url.searchParams.get('category') || undefined;
  let sortOption = url.searchParams.get('sort') || undefined;
  let searchQuery = url.searchParams.get('q') || undefined;

  const products = await commerce.getAllProducts({
    category,
    sortOption,
    searchQuery
  });

  const categories = await commerce.getAllCategories();
  const sortOptions = await commerce.getSortOptions();

  return json({ products, categories, sortOptions, searchQuery });
};

const Search = () => {
  const { products, categories, sortOptions, searchQuery } =
    useLoaderData() as LoaderData;
  const location = useLocation();

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-4">
            <details
              open
              className="overflow-hidden rounded border border-gray-200 lg:border-0"
            >
              <summary className="flex items-center justify-between bg-gray-100 px-5 py-3 lg:hidden">
                <span className="text-sm font-medium"> Categories </span>
                <IconMenu />
              </summary>

              <div className="border-t border-gray-200 lg:border-t-0">
                <fieldset>
                  <div className="space-y-2 px-5 py-6">
                    <div className="flex items-center">
                      <input type="hidden" />
                      <Link
                        to="/"
                        prefetch="intent"
                        className="text-sm font-medium"
                      >
                        All Categories
                      </Link>
                    </div>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          id={category.slug}
                          type="hidden"
                          name="category"
                          value={category.slug}
                        />

                        <Link
                          prefetch="intent"
                          className="whitespace-nowrap text-sm font-medium hover:underline focus:underline"
                          to={`/search?category=${category.slug}`}
                        >
                          {category.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </details>
            <details
              open
              className="overflow-hidden rounded border border-gray-200 lg:border-0"
            >
              <summary className="flex items-center justify-between bg-gray-100 px-5 py-3 lg:hidden">
                <span className="text-sm font-medium"> Sort </span>
                <IconMenu />
              </summary>

              <div className="border-t border-gray-200 lg:border-t-0">
                <fieldset>
                  <div className="space-y-2 px-5 py-6">
                    {sortOptions.map((sortOption) => {
                      const params = new URLSearchParams(location.search);
                      params.set('sort', sortOption.key);
                      const link = '/search?' + params.toString();

                      return (
                        <div className="flex items-center" key={sortOption.key}>
                          <Link
                            prefetch="intent"
                            className="whitespace-nowrap text-sm font-medium hover:underline focus:underline"
                            to={link}
                          >
                            {sortOption.name}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </details>
          </div>
          <div className="lg:col-span-3">
            <p data-testid="search-results-label" className="mt-4 mb-8 pl-4">
              Showing {products.length} results
              {searchQuery ? ` for "${searchQuery}"` : ''}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
