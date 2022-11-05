import type { Provider } from '../provider.server';
import type {
  Cart,
  CategoryCollection,
  Product,
  ProductCollection
} from './commercejs.types.server';

export function createCommerceProvider({ token }: { token: string }): Provider {
  const host = `https://api.chec.io/v1`;

  const request = {
    get: async <ResponseType>(
      path: string,
      params?: Record<string, string | undefined>
    ) => {
      const url = new URL(`${host}${path}`);

      if (params) {
        const searchParams = Object.entries(params)
          .filter(([key, val]) => val != null && val != undefined)
          .map(([key, val]) => `${key}=${val}`)
          .join('&');

        url.search = searchParams;
      }

      let request = new Request(url, {
        method: 'GET',
        headers: {
          'X-Authorization': token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const res = await fetch(request);
      return res.json() as ResponseType;
    },
    post: async <ResponseType>(path: string, body?: any) => {
      const url = new URL(`${host}${path}`);

      let request = new Request(url, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body || {})
      });

      const res = await fetch(request);
      return res.json() as ResponseType;
    },
    delete: async <ResponseType>(path: string, body?: any) => {
      const url = new URL(`${host}${path}`);

      let request = new Request(url, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const res = await fetch(request);
      return res.json() as ResponseType;
    }
  };

  return {
    getCart: async (cartId?: string) => {
      if (cartId) {
        const data = await request.get<Cart>(`/carts/${cartId}`);
        return data;
      } else {
        const data = await request.get<Cart>(`/carts`);
        return data;
      }
    },
    getAllProducts: async (options: Record<string, string | undefined>) => {
      const { category, sortOption, searchQuery } = options;
      const [sortBy, sortDirection] = sortOption?.split('-') || '';

      const { data } = await request.get<ProductCollection>(`/products`, {
        category_slug: category,
        sortBy,
        sortDirection,
        query: searchQuery
      });

      return data;
    },
    getProduct: async (
      productId: string,
      selectedOptions: {
        name: string;
        value: string;
      }[]
    ) => {
      let selectedVariantIds: Record<string, string>[] = [];

      const product = await request.get<Product>(`/products/${productId}`, {
        type: 'permalink'
      });

      if (!product.id) {
        throw new Error('Product not found.');
      }

      // Search the product's variant groups for matching variants
      // and get the variant Ids if they are found.
      for (let selectedOption of selectedOptions) {
        const { name, value } = selectedOption;

        var variantGroup = product.variant_groups.find(
          (option) => option.name === name
        );

        var variantOption = variantGroup?.options.find(
          (option) => option.name === value
        );

        if (variantGroup && variantOption) {
          selectedVariantIds.push({ [variantGroup.id]: variantOption.id });
        }
      }

      return {
        id: product.id,
        permalink: product.permalink,
        name: product.name,
        descriptionHtml: product.description,
        price: product.price,
        image: product.image,
        variant_groups: product.variant_groups,
        selectedVariantIds
      };
    },
    getAllCategories: async () => {
      const { data } = await request.get<CategoryCollection>(`/categories`);
      return data;
    },
    getSortOptions: async () => {
      return Promise.resolve([
        { key: 'price-desc', name: 'Price: High to low' },
        { key: 'price-asc', name: 'Price: Low to high' }
      ]);
    },
    addToCart: async (options: {
      cartId: string;
      productId: string;
      quantity?: number | undefined;
      variantOptions?: string | object | undefined;
    }) => {
      const { cartId, productId, quantity, variantOptions } = options;

      const response = await request.post<Cart>(`/carts/${cartId}`, {
        id: productId,
        quantity: quantity || 1,
        options: variantOptions
      });

      return response;
    },
    removeFromCart: async (options: { cartId: string; lineItemId: string }) => {
      const { cartId, lineItemId } = options;

      const response = await request.delete<Cart>(
        `/carts/${cartId}/items/${lineItemId}`
      );

      return response;
    }
  };
}
