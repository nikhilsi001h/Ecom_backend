const { db, nextId } = require('../data/mockData');
const bcrypt = require('bcryptjs');

class Vendor {
  static async findById(id) {
    return db.vendors.find(v => v.id === id);
  }

  static async findByEmail(email) {
    return db.vendors.find(v => v.email === email);
  }

  // ADD THIS METHOD
  static async findByUserId(userId) {
    return db.vendors.find(v => v.user_id === userId);
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const newVendor = {
      id: nextId.vendors++,
      user_id: null, // Will be set when creating associated user
      business_name: data.businessName,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      description: data.description || '',
      is_verified: false,
      is_active: true,
      rating: 0,
      total_sales: 0,
      created_at: new Date()
    };

    db.vendors.push(newVendor);
    return newVendor;
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async update(id, data) {
    const index = db.vendors.findIndex(v => v.id === id);
    if (index === -1) return null;

    db.vendors[index] = { ...db.vendors[index], ...data };
    return db.vendors[index];
  }

  static async delete(id) {
    const index = db.vendors.findIndex(v => v.id === id);
    if (index === -1) return false;

    db.vendors.splice(index, 1);
    return true;
  }

  static async getAll() {
    return db.vendors;
  }
}

module.exports = Vendor;