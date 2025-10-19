const { db, nextId } = require('../data/mockData1');

class Cart {
  static async findByUser(userId) {
    let cart = db.carts.find(c => c.user_id === parseInt(userId));
    
    if (!cart) {
      return null;
    }
    
    // Populate product details
    cart.items = cart.items.map(item => {
      const product = db.products.find(p => p.id === item.product_id);
      return {
        ...item,
        product_name: product?.name,
        product_image: product?.images[0]?.url,
        product_stock: product?.stock
      };
    });
    
    return cart;
  }

  static async createForUser(userId) {
    const cart = {
      id: nextId.carts++,
      user_id: parseInt(userId),
      items: [],
      total_amount: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.carts.push(cart);
    return cart;
  }

  static async addItem(userId, productId, quantity, price) {
    let cart = db.carts.find(c => c.user_id === parseInt(userId));
    
    if (!cart) {
      cart = await this.createForUser(userId);
    }
    
    const existingItemIndex = cart.items.findIndex(i => i.product_id === parseInt(productId));
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: cart.items.length + 1,
        product_id: parseInt(productId),
        quantity,
        price,
        created_at: new Date()
      });
    }
    
    // Update total
    cart.total_amount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    cart.updated_at = new Date();
    
    return cart.id;
  }

  static async updateItem(itemId, quantity) {
    for (let cart of db.carts) {
      const itemIndex = cart.items.findIndex(i => i.id === parseInt(itemId));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.total_amount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        cart.updated_at = new Date();
        return cart.id;
      }
    }
    throw new Error('Cart item not found');
  }

  static async removeItem(itemId) {
    for (let cart of db.carts) {
      const itemIndex = cart.items.findIndex(i => i.id === parseInt(itemId));
      if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
        cart.total_amount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        cart.updated_at = new Date();
        return cart.id;
      }
    }
    throw new Error('Cart item not found');
  }

  static async clear(userId) {
    const cart = db.carts.find(c => c.user_id === parseInt(userId));
    if (cart) {
      cart.items = [];
      cart.total_amount = 0;
      cart.updated_at = new Date();
    }
  }
}

module.exports = Cart;