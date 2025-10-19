const { db, nextId } = require('../data/mockData1');

class Review {
  static async create({ productId, userId, rating, comment }) {
    const review = {
      id: nextId.reviews++,
      product_id: parseInt(productId),
      user_id: parseInt(userId),
      rating,
      comment,
      is_verified_purchase: false,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.reviews.push(review);
    return review;
  }

  static async findByProduct(productId) {
    return db.reviews
      .filter(r => r.product_id === parseInt(productId))
      .sort((a, b) => b.created_at - a.created_at)
      .map(review => {
        const user = db.users.find(u => u.id === review.user_id);
        return {
          ...review,
          user_name: user?.name,
          user_avatar: user?.avatar
        };
      });
  }

  static async findById(id) {
    const review = db.reviews.find(r => r.id === parseInt(id));
    if (!review) return null;
    
    const user = db.users.find(u => u.id === review.user_id);
    const product = db.products.find(p => p.id === review.product_id);
    
    return {
      ...review,
      user_name: user?.name,
      product_name: product?.name
    };
  }

  static async update(id, { rating, comment }) {
    const review = db.reviews.find(r => r.id === parseInt(id));
    if (!review) return null;
    
    review.rating = rating;
    review.comment = comment;
    review.updated_at = new Date();
    
    return review;
  }

  static async delete(id) {
    const reviewIndex = db.reviews.findIndex(r => r.id === parseInt(id));
    if (reviewIndex === -1) return null;
    
    const [deleted] = db.reviews.splice(reviewIndex, 1);
    return { product_id: deleted.product_id };
  }

  static async checkExisting(productId, userId) {
    return db.reviews.find(r => 
      r.product_id === parseInt(productId) && 
      r.user_id === parseInt(userId)
    );
  }
}

module.exports = Review;