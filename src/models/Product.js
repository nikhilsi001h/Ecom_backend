const { db, nextId } = require('../data/mockData');

class Product {
  static async create(productData) {
    const { 
      name, description, price, comparePrice, categoryId, 
      brand, stock, vendorId, tags = [] 
    } = productData;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const product = {
      id: nextId.products++,
      name,
      slug,
      description,
      price,
      compare_price: comparePrice || null,
      category_id: categoryId,
      brand,
      stock,
      vendor_id: vendorId || null,
      rating: 0,
      num_reviews: 0,
      is_featured: false,
      is_active: true,
      views: 0,
      images: [],
      tags,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.products.push(product);
    return product;
  }

  static async findAll(filters = {}, limit = 20, offset = 0) {
    let products = db.products.filter(p => p.is_active);
    
    // Apply filters
    if (filters.category) {
      products = products.filter(p => p.category_id === parseInt(filters.category));
    }
    
    if (filters.priceMin !== undefined) {
      products = products.filter(p => p.price >= parseFloat(filters.priceMin));
    }
    
    if (filters.priceMax !== undefined) {
      products = products.filter(p => p.price <= parseFloat(filters.priceMax));
    }
    
    if (filters.vendor) {
      products = products.filter(p => p.vendor_id === parseInt(filters.vendor));
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sorting
    const sortBy = filters.sort || '-created_at';
    if (sortBy === 'price') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === '-price') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else {
      products.sort((a, b) => b.created_at - a.created_at);
    }
    
    // Pagination
    return products.slice(offset, offset + limit);
  }

  static async findById(id) {
    return db.products.find(p => p.id === parseInt(id));
  }

  static async update(id, updates) {
    const productIndex = db.products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) return null;
    
    Object.keys(updates).forEach(key => {
      db.products[productIndex][key] = updates[key];
    });
    
    db.products[productIndex].updated_at = new Date();
    return db.products[productIndex];
  }

  static async delete(id) {
    const productIndex = db.products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) return null;
    
    const [deleted] = db.products.splice(productIndex, 1);
    return deleted;
  }

  static async incrementViews(id) {
    const product = db.products.find(p => p.id === parseInt(id));
    if (product) {
      product.views += 1;
    }
  }

  static async updateRating(productId) {
    const reviews = db.reviews.filter(r => r.product_id === parseInt(productId));
    const product = db.products.find(p => p.id === parseInt(productId));
    
    if (product) {
      product.num_reviews = reviews.length;
      product.rating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;
    }
  }

  static async count(filters = {}) {
    let products = db.products.filter(p => p.is_active);
    
    if (filters.category) {
      products = products.filter(p => p.category_id === parseInt(filters.category));
    }
    
    return products.length;
  }
}

module.exports = Product;