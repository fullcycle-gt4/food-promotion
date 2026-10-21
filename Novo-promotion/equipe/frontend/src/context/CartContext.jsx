import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'fp:cart';
const CartContext = createContext(null);

export function CartProvider({ children }) {
  // items: [{ product, qty }]
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items]);

  const value = useMemo(() => {
    const total = items.reduce((a, i) => a + i.product.promoPrice * i.qty, 0);
    const original = items.reduce((a, i) => a + i.product.originalPrice * i.qty, 0);
    return {
      items,
      count: items.length,
      totals: { total, original, savings: original - total },
      add(product, qty = 1) {
        setItems((list) => {
          const found = list.find((i) => i.product.id === product.id);
          if (found)
            return list.map((i) =>
              i.product.id === product.id ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i,
            );
          return [...list, { product, qty: Math.min(product.stock, qty) }];
        });
      },
      setQty(id, qty) {
        setItems((list) =>
          list.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, Math.min(i.product.stock, qty)) } : i)),
        );
      },
      remove(id) {
        setItems((list) => list.filter((i) => i.product.id !== id));
      },
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
