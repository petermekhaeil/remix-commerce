export interface Price {
  raw: number;
  formatted: string;
  formatted_with_symbol: string;
  formatted_with_code: string;
}

export interface Currency {
  symbol: string;
  code: string;
}

export interface Asset {
  id: string;
  url: string;
  description: string | null;
  is_image: boolean;
  filename: string;
  file_extension: string;
  image_dimensions: {
    width: number;
    height: number;
  };
  file_size?: number | undefined;
  meta: any;
  created_at: number;
  updated_at: number;
}

export interface SelectedVariant {
  group_id: string;
  group_name: string;
  option_id: string;
  option_name: string;
  price: Price;
}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  product_id: string;
  product_name: string;
  product_meta: any;
  sku: string;
  permalink: string;
  media: any; // todo
  selected_options: SelectedVariant[];
  variant?: Variant;
  price: Price;
  line_total: Price;
  image: Asset | null;
}

export interface Variant {
  id: string;
  sku: string | null;
  description: string | null;
  inventory: number | null;
  price: Price | null;
  is_valid: boolean;
  invalid_reason_code: string | null;
  meta: any;
  created?: number | undefined;
  updated?: number | undefined;
  options: { [name: string]: string };
  assets: Asset[];
}

export interface Cart {
  id: string;
  created: number;
  updated: number;
  expires: number;
  total_items: number;
  total_unique_items: number;
  subtotal: Price;
  currency: Currency;
  discount_code: any; // todo
  hosted_checkout_url: string;
  line_items: LineItem[];
}

export interface ProductVariantGroup {
  id: string;
  name: string;
  meta?: any;
  created: number | null;
  updated: number | null;
  options: ProductVariantOption[];
}

export interface ProductVariantOption {
  id: string;
  name: string;
  price: Price;
  assets: string[] | null;
  meta: any;
  created: number | null;
  updated: number | null;
}

export interface ProductAttributeOption {
  label: string;
  value: string;
}

export interface ProductAttribute {
  id: string;
  meta: any;
  name: string;
  value: string | number | ProductAttributeOption[] | null;
}

export interface Product {
  id: string;
  created: number;
  updated: number;
  active: boolean;
  permalink: string;
  name: string;
  description: string;
  price: Price;
  inventory: {
    managed: boolean;
    available: number;
  };
  media: {
    type: string;
    source: string;
  };
  sku: string | null;
  sort_order: number;
  seo: {
    title: string | null;
    description: string | null;
  };
  thank_you_url: string | null;
  meta: any;
  conditionals: {
    is_active: boolean;
    is_tax_exempt: boolean;
    is_pay_what_you_want: boolean;
    is_inventory_managed: boolean;
    is_sold_out: boolean;
    has_digital_delivery: boolean;
    has_physical_delivery: boolean;
    has_images: boolean;
    collects_fullname: boolean;
    collects_shipping_address: boolean;
    collects_billing_address: boolean;
    collects_extra_fields: boolean;
  };
  is: {
    active: boolean;
    tax_exempt: boolean;
    pay_what_you_want: boolean;
    inventory_managed: boolean;
    sold_out: boolean;
  };
  has: {
    digital_delivery: boolean;
    physical_delivery: boolean;
    images: boolean;
    video: boolean;
    rich_embed: boolean;
  };
  collects: {
    fullname: boolean;
    shipping_address: boolean;
    billing_address: boolean;
    extra_fields: boolean;
  };
  checkout_url: {
    checkout: string;
    display: string;
  };
  extra_fields: any[];
  variant_groups: ProductVariantGroup[];
  categories: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  assets: Asset[];
  image: Asset | null;
  attributes: ProductAttribute[];
  related_products: any[];
}

export interface PaginationMeta {
  pagination: {
    count: number;
    current_page: number;
    links: any;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ProductCollection {
  data: Product[];
  meta: PaginationMeta;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  products: number;
  created: number;
  meta: any;
}

export interface CategoryCollection {
  data: Category[];
  meta: PaginationMeta;
}
