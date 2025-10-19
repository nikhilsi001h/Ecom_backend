const { db, nextId } = require('../data/mockData1');

class Category {
  static async create({ name, description, image, parentId = null }) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const category = {
      id: nextId.categories++,
      name,
      slug,
      description,
      image,
      parent_id: parentId,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    db.categories.push(category);
    return category;
  }

  static async findAll() {
    return db.categories.filter(c => c.is_active);
  }

  static async findById(id) {
    return db.categories.find(c => c.id === parseInt(id));
  }

  static async update(id, updates) {
    const categoryIndex = db.categories.findIndex(c => c.id === parseInt(id));
    if (categoryIndex === -1) return null;
    
    Object.keys(updates).forEach(key => {
      db.categories[categoryIndex][key] = updates[key];
    });
    
    db.categories[categoryIndex].updated_at = new Date();
    return db.categories[categoryIndex];
  }

  static async delete(id) {
    const categoryIndex = db.categories.findIndex(c => c.id === parseInt(id));
    if (categoryIndex === -1) return null;
    
    const [deleted] = db.categories.splice(categoryIndex, 1);
    return deleted;
  }
}

module.exports = Category;