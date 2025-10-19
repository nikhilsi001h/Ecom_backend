const { db, nextId } = require('../data/mockData');

class Address {
  static async create(addressData) {
    const { userId, fullName, phone, street, city, state, zipCode, country, isDefault } = addressData;
    
    // If this is default, unset other defaults
    if (isDefault) {
      db.addresses.forEach(addr => {
        if (addr.user_id === parseInt(userId)) {
          addr.is_default = false;
        }
      });
    }
    
    const address = {
      id: nextId.addresses++,
      user_id: parseInt(userId),
      full_name: fullName,
      phone,
      street,
      city,
      state,
      zip_code: zipCode,
      country,
      is_default: isDefault || false,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.addresses.push(address);
    return address;
  }

  static async findByUser(userId) {
    return db.addresses
      .filter(a => a.user_id === parseInt(userId))
      .sort((a, b) => {
        if (a.is_default !== b.is_default) {
          return b.is_default - a.is_default;
        }
        return b.created_at - a.created_at;
      });
  }

  static async findById(id) {
    return db.addresses.find(a => a.id === parseInt(id));
  }

  static async findDefaultByUser(userId) {
    return db.addresses.find(a => a.user_id === parseInt(userId) && a.is_default);
  }

  static async update(id, updates) {
    const addressIndex = db.addresses.findIndex(a => a.id === parseInt(id));
    if (addressIndex === -1) return null;
    
    // If setting as default, unset other defaults
    if (updates.is_default) {
      const userId = db.addresses[addressIndex].user_id;
      db.addresses.forEach(addr => {
        if (addr.user_id === userId) {
          addr.is_default = false;
        }
      });
    }
    
    Object.keys(updates).forEach(key => {
      db.addresses[addressIndex][key] = updates[key];
    });
    
    db.addresses[addressIndex].updated_at = new Date();
    return db.addresses[addressIndex];
  }

  static async delete(id) {
    const addressIndex = db.addresses.findIndex(a => a.id === parseInt(id));
    if (addressIndex === -1) return null;
    
    const [deleted] = db.addresses.splice(addressIndex, 1);
    return deleted;
  }

  static async setAsDefault(id, userId) {
    // Unset all defaults for this user
    db.addresses.forEach(addr => {
      if (addr.user_id === parseInt(userId)) {
        addr.is_default = false;
      }
    });
    
    // Set this address as default
    const address = db.addresses.find(a => a.id === parseInt(id) && a.user_id === parseInt(userId));
    if (address) {
      address.is_default = true;
      address.updated_at = new Date();
      return address;
    }
    
    return null;
  }
}

module.exports = Address;