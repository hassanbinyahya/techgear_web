import ProductCard from "./ProductCard";

export default function ProductList() {
  const products = [
    { id: 1, name: "Gaming Mouse", price: 25, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Mechanical Keyboard", price: 70, image: "https://via.placeholder.com/150" },
    { id: 3, name: "USB-C Hub", price: 40, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Headphones", price: 60, image: "https://via.placeholder.com/150" }
  ];

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}