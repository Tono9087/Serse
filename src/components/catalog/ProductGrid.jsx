import { ProductCard } from "./ProductCard.jsx";

export function ProductGrid({ products, onOpenModal }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
}
