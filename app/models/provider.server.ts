import type {
  Asset,
  Cart,
  Category,
  Price,
  Product,
  ProductVariantGroup
} from './providers/commercejs.types.server';

export type { Product } from './providers/commercejs.types.server';
export interface Provider {
  getCart: (cartId?: string) => Promise<Cart>;
  getAllProducts: (
    options: Record<string, string | undefined>
  ) => Promise<Product[]>;
  getProduct: (
    productId: string,
    selectedOptions: {
      name: string;
      value: string;
    }[]
  ) => Promise<{
    id: string;
    permalink: string;
    name: string;
    descriptionHtml: string;
    price: Price;
    image: Asset | null;
    variant_groups: ProductVariantGroup[];
    selectedVariantIds: {}[];
  }>;
  getAllCategories: () => Promise<Category[]>;
  getSortOptions: () => Promise<
    {
      key: string;
      name: string;
    }[]
  >;
  addToCart: (options: {
    cartId: string;
    productId: string;
    quantity?: number | undefined;
    variantOptions?: string | object | undefined;
  }) => Promise<Cart>;
  removeFromCart: (options: {
    cartId: string;
    lineItemId: string;
  }) => Promise<Cart>;
}
