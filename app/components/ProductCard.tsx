import React from 'react';
import { Link } from '@remix-run/react';
import Image from 'remix-image';
import type { Product } from '~/models/provider.server';

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      data-testid="product-card"
      prefetch="intent"
      to={`/product/${product.permalink}`}
      className="relative block bg-white hover:opacity-75"
    >
      {product.image ? (
        <Image
          className="w-full"
          src={product.image.url}
          width={480}
          height={480}
          alt={product.name}
          placeholder="blur"
        />
      ) : null}

      <div className="p-6">
        <h5 className="mt-4 text-lg font-bold">{product.name}</h5>

        <p className="mt-2 text-sm font-medium text-gray-600">
          {product.price.formatted_with_symbol}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
