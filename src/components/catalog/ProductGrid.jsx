import { ProductCard } from "./ProductCard.jsx";

export function ProductGrid({ products, from }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          from={from}
        />
      ))}
    </div>
  );
}
