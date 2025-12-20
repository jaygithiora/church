// CartService.js

const CART_KEY = 'cart';
const EXPIRY_KEY = 'cartExpiry';
const EXPIRY_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

class CartService {
  constructor() {
    this.cart = [];
    this.loadCart();
  }

  saveCart() {
    const now = Date.now();
    localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
    localStorage.setItem(EXPIRY_KEY, JSON.stringify(now + EXPIRY_DURATION));
  }

  loadCart() {
    const savedCart = localStorage.getItem(CART_KEY);
    const expiryTime = localStorage.getItem(EXPIRY_KEY);
    if (savedCart && expiryTime) {
      const now = Date.now();
      if (now < JSON.parse(expiryTime)) {
        this.cart = JSON.parse(savedCart);
      } else {
        this.clearCart();
      }
    }
  }

  addToCart(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity = product.quantity;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCart();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  getCart() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  }
}

export default new CartService();
