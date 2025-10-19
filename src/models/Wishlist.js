const { db, nextId } = require('../data/mockData1');

class Wishlist {
  static async findByUser(userId) {
    let wishlist = db.wishlists.find(w => w.user_id === parseInt(userId));
    
    if (!wishlist) {
      return null;
    }
    
    // Populate products
    wishlist.products = wishlist.product_ids.map(productId => {
      const product = db.products.find(p => p.id === productId);
      return product ? {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        rating: product.rating,
        image: product.images[0]?.url,
        stock: product.stock
      } : null;
    }).filter(p => p !== null);
    
    return wishlist;
  }

  static async createForUser(userId) {
    const wishlist = {
      id: nextId.wishlists++,
      user_id: parseInt(userId),
      product_ids: [],
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.wishlists.push(wishlist);
    return wishlist;
  }

  static async addProduct(userId, productId) {
    let wishlist = db.wishlists.find(w => w.user_id === parseInt(userId));
    
    if (!wishlist) {
      wishlist = await this.createForUser(userId);
    }
    
    if (wishlist.product_ids.includes(parseInt(productId))) {
      throw new Error('Product already in wishlist');
    }
    
    wishlist.product_ids.push(parseInt(productId));
    wishlist.updated_at = new Date();
    
    return wishlist.id;
  }

  static async removeProduct(userId, productId) {
    const wishlist = db.wishlists.find(w => w.user_id === parseInt(userId));
    
    if (wishlist) {
      wishlist.product_ids = wishlist.product_ids.filter(id => id !== parseInt(productId));
      wishlist.updated_at = new Date();
    }
  }

  static async clearWishlist(userId) {
    const wishlist = db.wishlists.find(w => w.user_id === parseInt(userId));
    if (wishlist) {
      wishlist.product_ids = [];
      wishlist.updated_at = new Date();
    }
  }

  static async checkIfExists(userId, productId) {
    const wishlist = db.wishlists.find(w => w.user_id === parseInt(userId));
    return wishlist && wishlist.product_ids.includes(parseInt(productId));
  }
}

module.exports = Wishlist;