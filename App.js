import React, { useState, useEffect } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "T-Shirt", price: 250 },
  { id: 2, name: "Jeans", price: 500 },
  { id: 3, name: "Shoes", price: 800 },
];

const FREE_GIFT = { id: "gift", name: "Free Cap", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const qty = quantities[product.id] || 0;
    if (qty === 0) return;

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }

    setQuantities({ ...quantities, [product.id]: 0 });
  };

  const updateQty = (id, newQty) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    if (id === FREE_GIFT.id) return;
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart
    .filter((item) => item.id !== FREE_GIFT.id)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const percent = Math.min((subtotal / THRESHOLD) * 100, 100);
  const remaining = THRESHOLD - subtotal;

  useEffect(() => {
    const hasGift = cart.find((item) => item.id === FREE_GIFT.id);
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart([...cart, { ...FREE_GIFT, quantity: 1 }]);
      alert("Free gift added to your cart!");
    } else if (subtotal < THRESHOLD && hasGift) {
      setCart(cart.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [subtotal]);

  return (
    <div className="App">
      <h1>Shopping Cart</h1>

      <h2>Products</h2>
      {PRODUCTS.map((product) => (
        <div key={product.id}>
          <strong>{product.name}</strong> - ₹{product.price}
          <div>
            <button onClick={() =>
              setQuantities({
                ...quantities,
                [product.id]: Math.max((quantities[product.id] || 0) - 1, 0),
              })
            }>-</button>
            <span>{quantities[product.id] || 0}</span>
            <button onClick={() =>
              setQuantities({
                ...quantities,
                [product.id]: (quantities[product.id] || 0) + 1,
              })
            }>+</button>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        </div>
      ))}

      <h2>Progress</h2>
      {subtotal < THRESHOLD ? (
        <p>Add ₹{remaining} more to unlock the free gift!</p>
      ) : (
        <p>Congratulations! You’ve unlocked the free gift.</p>
      )}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <h2>Cart</h2>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      {cart.map((item) => (
        <div key={item.id}>
          {item.name} - ₹{item.price} x {item.quantity}
          {item.id !== "gift" && (
            <>
              <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </>
          )}
        </div>
      ))}
      <h3>Subtotal: ₹{subtotal}</h3>
    </div>
  );
}

export default App;
