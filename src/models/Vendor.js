const { db, nextId } = require('../data/mockData1');
const bcrypt = require('bcryptjs');

class Vendor {
  static async create({ businessName, email, password, phone }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const vendor = {
      id: nextId.vendors++,
      business_name: businessName,
      email,
      password: hashedPassword,
      phone,
      description: null,
      is_verified: false,
      is_active: true,
      rating: 0,
      total_sales: 0,
      created_at: new Date()
    };
    
    db.vendors.push(vendor);
    
    const { password: _, ...vendorWithoutPassword } = vendor;
    return vendorWithoutPassword;
  }

  static async findByEmail(email) {
    return db.vendors.find(v => v.email === email);
  }

  static async findById(id) {
    const vendor = db.vendors.find(v => v.id === parseInt(id));
    if (!vendor) return null;
    
    const { password, ...vendorWithoutPassword } = vendor;
    return vendorWithoutPassword;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async update(id, updates) {
    const vendorIndex = db.vendors.findIndex(v => v.id === parseInt(id));
    if (vendorIndex === -1) return null;
    
    Object.keys(updates).forEach(key => {
      if (key !== 'password') {
        db.vendors[vendorIndex][key] = updates[key];
      }
    });
    
    db.vendors[vendorIndex].updated_at = new Date();
    
    const { password, ...vendorWithoutPassword } = db.vendors[vendorIndex];
    return vendorWithoutPassword;
  }

  static async findAll(limit = 20, offset = 0) {
    return db.vendors
      .filter(v => v.is_active)
      .slice(offset, offset + limit)
      .map(({ password, ...vendor }) => vendor);
  }

  static async count() {
    return db.vendors.filter(v => v.is_active).length;
  }
}

module.exports = Vendor;