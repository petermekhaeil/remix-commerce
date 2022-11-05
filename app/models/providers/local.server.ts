import type { Provider } from '../provider.server';

export function createLocalProvider(): Provider {
  return {
    getCart: async (cartId?: string) => {
      throw new Error('Not yet implemented.');
    },
    getAllProducts: async (options: Record<string, string | undefined>) => {
      throw new Error('Not yet implemented.');
    },
    getProduct: async (
      productId: string,
      selectedOptions: {
        name: string;
        value: string;
      }[]
    ) => {
      throw new Error('Not yet implemented.');
    },
    getAllCategories: async () => {
      throw new Error('Not yet implemented.');
    },
    getSortOptions: async () => {
      throw new Error('Not yet implemented.');
    },
    addToCart: async (options: {
      cartId: string;
      productId: string;
      quantity?: number | undefined;
      variantOptions?: string | object | undefined;
    }) => {
      throw new Error('Not yet implemented.');
    },
    removeFromCart: async (options: { cartId: string; lineItemId: string }) => {
      throw new Error('Not yet implemented.');
    }
  };
}
