export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

export function setCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product: Omit<CartItem, "quantity">, quantity: number = 1): void {
  const cart = getCart();
  const existingItem = cart.find(item => item._id === product._id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  setCart(cart);
}

export function removeFromCart(productId: string): void {
  const cart = getCart();
  setCart(cart.filter(item => item._id !== productId));
}

export function updateQuantity(productId: string, quantity: number): void {
  const cart = getCart();
  const item = cart.find(item => item._id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  setCart(cart);
}

export function clearCart(): void {
  setCart([]);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}
