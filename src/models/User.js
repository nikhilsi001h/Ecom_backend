const { db, nextId } = require('../data/mockData1');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, password, phone, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = {
      id: nextId.users++,
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      is_email_verified: false,
      is_phone_verified: false,
      avatar: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.users.push(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async findByEmail(email) {
    return db.users.find(u => u.email === email);
  }

  static async findById(id) {
    const user = db.users.find(u => u.id === parseInt(id));
    if (!user) return null;
    
    // Return without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async update(id, updates) {
    const userIndex = db.users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return null;
    
    const allowedFields = ['name', 'phone', 'avatar'];
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        db.users[userIndex][key] = updates[key];
      }
    });
    
    db.users[userIndex].updated_at = new Date();
    
    const { password, ...userWithoutPassword } = db.users[userIndex];
    return userWithoutPassword;
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const userIndex = db.users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) return null;
    
    db.users[userIndex].password = hashedPassword;
    db.users[userIndex].updated_at = new Date();
    
    return { id: db.users[userIndex].id };
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAll(limit = 20, offset = 0) {
    return db.users
      .slice(offset, offset + limit)
      .map(({ password, ...user }) => user);
  }

  static async count() {
    return db.users.length;
  }

  static async updateRole(id, role) {
    const userIndex = db.users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return null;
    
    db.users[userIndex].role = role;
    db.users[userIndex].updated_at = new Date();
    
    const { password, ...userWithoutPassword } = db.users[userIndex];
    return userWithoutPassword;
  }
}

module.exports = User;