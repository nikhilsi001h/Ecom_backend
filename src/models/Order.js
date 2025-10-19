const { db, nextId } = require('../data/mockData');

class Order {
  static async create(orderData) {
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    const order = {
      id: nextId.orders++,
      user_id: orderData.userId,
      order_number: orderNumber,
      items: orderData.items,
      items_price: orderData.itemsPrice,
      tax_price: orderData.taxPrice,
      shipping_price: orderData.shippingPrice,
      total_price: orderData.totalPrice,
      payment_method: orderData.paymentMethod,
      shipping_address: orderData.shippingAddress,
      is_paid: false,
      paid_at: null,
      status: 'pending',
      delivered_at: null,
      tracking_number: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.orders.push(order);
    
    // Reduce stock
    for (const item of orderData.items) {
      const product = db.products.find(p => p.id === item.product);
      if (product) {
        product.stock -= item.quantity;
      }
    }
    
    return order;
  }

  static async findByUser(userId, limit = 10, offset = 0) {
    const orders = db.orders
      .filter(o => o.user_id === parseInt(userId))
      .sort((a, b) => b.created_at - a.created_at)
      .slice(offset, offset + limit);
    
    return orders;
  }

  static async findById(id) {
    const order = db.orders.find(o => o.id === parseInt(id));
    if (!order) return null;
    
    // Add user info
    const user = db.users.find(u => u.id === order.user_id);
    return {
      ...order,
      user_name: user?.name,
      user_email: user?.email
    };
  }

  static async findAll(filters = {}, limit = 20, offset = 0) {
    let orders = db.orders;
    
    if (filters.status) {
      orders = orders.filter(o => o.status === filters.status);
    }
    
    return orders
      .sort((a, b) => b.created_at - a.created_at)
      .slice(offset, offset + limit)
      .map(order => {
        const user = db.users.find(u => u.id === order.user_id);
        return {
          ...order,
          user_name: user?.name,
          user_email: user?.email
        };
      });
  }

  static async updateStatus(id, status) {
    const order = db.orders.find(o => o.id === parseInt(id));
    if (!order) return null;
    
    order.status = status;
    order.updated_at = new Date();
    
    if (status === 'delivered') {
      order.delivered_at = new Date();
    }
    
    return order;
  }

  static async cancel(id) {
    const order = db.orders.find(o => o.id === parseInt(id));
    if (!order) return null;
    
    // Restore stock
    for (const item of order.items) {
      const product = db.products.find(p => p.id === item.product);
      if (product) {
        product.stock += item.quantity;
      }
    }
    
    order.status = 'cancelled';
    order.updated_at = new Date();
    
    return order;
  }

  static async countByUser(userId) {
    return db.orders.filter(o => o.user_id === parseInt(userId)).length;
  }

  static async count(filters = {}) {
    let orders = db.orders;
    
    if (filters.status) {
      orders = orders.filter(o => o.status === filters.status);
    }
    
    return orders.length;
  }

  static async updateTracking(id, trackingNumber) {
    const order = db.orders.find(o => o.id === parseInt(id));
    if (!order) return null;
    
    order.tracking_number = trackingNumber;
    order.status = 'shipped';
    order.updated_at = new Date();
    
    return order;
  }
}

module.exports = Order;