const { db, nextId } = require('../data/mockData');

class Notification {
  static async create({ userId, type, title, message, link = null }) {
    const notification = {
      id: nextId.notifications++,
      user_id: parseInt(userId),
      type,
      title,
      message,
      link,
      is_read: false,
      read_at: null,
      created_at: new Date()
    };
    
    db.notifications.push(notification);
    return notification;
  }

  static async findByUser(userId, limit = 50) {
    return db.notifications
      .filter(n => n.user_id === parseInt(userId))
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, limit);
  }

  static async findById(id) {
    return db.notifications.find(n => n.id === parseInt(id));
  }

  static async markAsRead(id) {
    const notification = db.notifications.find(n => n.id === parseInt(id));
    if (!notification) return null;
    
    notification.is_read = true;
    notification.read_at = new Date();
    
    return notification;
  }

  static async markAllAsRead(userId) {
    db.notifications.forEach(n => {
      if (n.user_id === parseInt(userId) && !n.is_read) {
        n.is_read = true;
        n.read_at = new Date();
      }
    });
  }

  static async countUnread(userId) {
    return db.notifications.filter(n => n.user_id === parseInt(userId) && !n.is_read).length;
  }

  static async delete(id) {
    const notificationIndex = db.notifications.findIndex(n => n.id === parseInt(id));
    if (notificationIndex === -1) return null;
    
    const [deleted] = db.notifications.splice(notificationIndex, 1);
    return deleted;
  }

  static async deleteAllForUser(userId) {
    db.notifications = db.notifications.filter(n => n.user_id !== parseInt(userId));
  }

  static async getUnreadByUser(userId) {
    return db.notifications
      .filter(n => n.user_id === parseInt(userId) && !n.is_read)
      .sort((a, b) => b.created_at - a.created_at);
  }
}

module.exports = Notification;