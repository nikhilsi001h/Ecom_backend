const bcrypt = require('bcryptjs');

// Hash passwords synchronously for initial data
const hashedAdminPass = bcrypt.hashSync('admin123', 12);
const hashedUserPass = bcrypt.hashSync('user123', 12);
const hashedVendorPass = bcrypt.hashSync('vendor123', 12);

// In-memory database
const db = {
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: hashedAdminPass,
      phone: '1234567890',
      role: 'admin',
      is_email_verified: true,
      is_phone_verified: false,
      avatar: null,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'user@ecommerce.com',
      password: hashedUserPass,
      phone: '9876543210',
      role: 'user',
      is_email_verified: true,
      is_phone_verified: false,
      avatar: null,
      created_at: new Date('2024-01-02'),
      updated_at: new Date('2024-01-02')
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedUserPass,
      phone: '5551234567',
      role: 'user',
      is_email_verified: true,
      is_phone_verified: false,
      avatar: null,
      created_at: new Date('2024-01-03'),
      updated_at: new Date('2024-01-03')
    }
  ],

  categories: [
    { id: 1, name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', image: null, parent_id: null, is_active: true, created_at: new Date() },
    { id: 2, name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel', image: null, parent_id: null, is_active: true, created_at: new Date() },
    { id: 3, name: 'Books', slug: 'books', description: 'Books and literature', image: null, parent_id: null, is_active: true, created_at: new Date() },
    { id: 4, name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchen items', image: null, parent_id: null, is_active: true, created_at: new Date() },
    { id: 5, name: 'Sports', slug: 'sports', description: 'Sports equipment and accessories', image: null, parent_id: null, is_active: true, created_at: new Date() }
  ],

  vendors: [
    {
      id: 1,
      business_name: 'Tech Paradise',
      email: 'vendor1@ecommerce.com',
      password: hashedVendorPass,
      phone: '1112223333',
      description: 'Your one-stop shop for all tech gadgets',
      is_verified: true,
      is_active: true,
      rating: 4.8,
      total_sales: 50000,
      created_at: new Date()
    },
    {
      id: 2,
      business_name: 'Fashion Hub',
      email: 'vendor2@ecommerce.com',
      password: hashedVendorPass,
      phone: '4445556666',
      description: 'Latest fashion trends and styles',
      is_verified: true,
      is_active: true,
      rating: 4.5,
      total_sales: 35000,
      created_at: new Date()
    }
  ],

  products: [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest Apple iPhone with A17 Pro chip, 6.1-inch display, and advanced camera system',
      price: 999,
      compare_price: 1099,
      category_id: 1,
      brand: 'Apple',
      stock: 50,
      vendor_id: 1,
      rating: 4.8,
      num_reviews: 156,
      is_featured: true,
      is_active: true,
      views: 1250,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'iPhone 15 Pro' }],
      tags: ['smartphone', 'apple', 'ios'],
      created_at: new Date()
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Premium Android smartphone with stunning display and powerful performance',
      price: 899,
      compare_price: 999,
      category_id: 1,
      brand: 'Samsung',
      stock: 75,
      vendor_id: 1,
      rating: 4.6,
      num_reviews: 89,
      is_featured: true,
      is_active: true,
      views: 980,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Samsung Galaxy S24' }],
      tags: ['smartphone', 'samsung', 'android'],
      created_at: new Date()
    },
    {
      id: 3,
      name: 'MacBook Pro 14"',
      slug: 'macbook-pro-14',
      description: 'Powerful laptop with M3 chip, stunning Liquid Retina XDR display',
      price: 1999,
      compare_price: 2199,
      category_id: 1,
      brand: 'Apple',
      stock: 30,
      vendor_id: 1,
      rating: 4.9,
      num_reviews: 234,
      is_featured: true,
      is_active: true,
      views: 2100,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'MacBook Pro' }],
      tags: ['laptop', 'apple', 'macbook'],
      created_at: new Date()
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise canceling headphones with exceptional sound quality',
      price: 399,
      compare_price: null,
      category_id: 1,
      brand: 'Sony',
      stock: 100,
      vendor_id: 1,
      rating: 4.7,
      num_reviews: 412,
      is_featured: false,
      is_active: true,
      views: 850,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Sony Headphones' }],
      tags: ['headphones', 'sony', 'wireless'],
      created_at: new Date()
    },
    {
      id: 5,
      name: 'Mens Cotton T-Shirt',
      slug: 'mens-cotton-t-shirt',
      description: 'Comfortable premium cotton t-shirt perfect for everyday wear',
      price: 29.99,
      compare_price: null,
      category_id: 2,
      brand: 'Fashion Hub',
      stock: 200,
      vendor_id: 2,
      rating: 4.3,
      num_reviews: 67,
      is_featured: false,
      is_active: true,
      views: 450,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'T-Shirt' }],
      tags: ['clothing', 'tshirt', 'mens'],
      created_at: new Date()
    },
    {
      id: 6,
      name: 'Womens Summer Dress',
      slug: 'womens-summer-dress',
      description: 'Elegant floral print summer dress, lightweight and comfortable',
      price: 59.99,
      compare_price: null,
      category_id: 2,
      brand: 'Fashion Hub',
      stock: 150,
      vendor_id: 2,
      rating: 4.5,
      num_reviews: 92,
      is_featured: false,
      is_active: true,
      views: 680,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Summer Dress' }],
      tags: ['clothing', 'dress', 'womens'],
      created_at: new Date()
    },
    {
      id: 7,
      name: 'The Great Gatsby',
      slug: 'the-great-gatsby',
      description: 'Classic novel by F. Scott Fitzgerald, hardcover edition',
      price: 14.99,
      compare_price: null,
      category_id: 3,
      brand: 'Penguin Books',
      stock: 80,
      vendor_id: null,
      rating: 4.8,
      num_reviews: 523,
      is_featured: false,
      is_active: true,
      views: 320,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Book' }],
      tags: ['books', 'fiction', 'classic'],
      created_at: new Date()
    },
    {
      id: 8,
      name: 'Air Fryer 5.5Qt',
      slug: 'air-fryer-5-5qt',
      description: 'Digital air fryer with 8 preset cooking functions',
      price: 89.99,
      compare_price: null,
      category_id: 4,
      brand: 'KitchenPro',
      stock: 45,
      vendor_id: null,
      rating: 4.4,
      num_reviews: 178,
      is_featured: false,
      is_active: true,
      views: 540,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Air Fryer' }],
      tags: ['kitchen', 'appliance', 'cooking'],
      created_at: new Date()
    },
    {
      id: 9,
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip exercise yoga mat with carrying strap',
      price: 34.99,
      compare_price: null,
      category_id: 5,
      brand: 'FitLife',
      stock: 120,
      vendor_id: null,
      rating: 4.6,
      num_reviews: 89,
      is_featured: false,
      is_active: true,
      views: 390,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Yoga Mat' }],
      tags: ['sports', 'yoga', 'fitness'],
      created_at: new Date()
    },
    {
      id: 10,
      name: 'Wireless Gaming Mouse',
      slug: 'wireless-gaming-mouse',
      description: 'Ergonomic wireless mouse with RGB lighting and programmable buttons',
      price: 49.99,
      compare_price: null,
      category_id: 1,
      brand: 'TechGear',
      stock: 90,
      vendor_id: 1,
      rating: 4.5,
      num_reviews: 134,
      is_featured: false,
      is_active: true,
      views: 620,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Gaming Mouse' }],
      tags: ['electronics', 'gaming', 'mouse'],
      created_at: new Date()
    }
  ],

  carts: [],

  orders: [
    {
      id: 1,
      user_id: 2,
      order_number: 'ORD-1704067200000-001',
      items: [
        { id: 1, product_id: 1, name: 'iPhone 15 Pro', quantity: 1, price: 999, image: 'https://via.placeholder.com/400' }
      ],
      items_price: 999,
      tax_price: 99.9,
      shipping_price: 0,
      total_price: 1098.9,
      payment_method: 'card',
      is_paid: true,
      paid_at: new Date('2024-01-05'),
      status: 'delivered',
      delivered_at: new Date('2024-01-10'),
      tracking_number: 'TRACK123456789',
      shipping_address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '9876543210'
      },
      created_at: new Date('2024-01-05')
    }
  ],

  reviews: [
    {
      id: 1,
      product_id: 1,
      user_id: 2,
      rating: 5,
      comment: 'Amazing phone! The camera quality is outstanding and battery life is excellent.',
      is_verified_purchase: true,
      created_at: new Date('2024-01-12')
    },
    {
      id: 2,
      product_id: 1,
      user_id: 3,
      rating: 4,
      comment: 'Great phone but a bit pricey. Overall very satisfied with the performance.',
      is_verified_purchase: true,
      created_at: new Date('2024-01-15')
    },
    {
      id: 3,
      product_id: 3,
      user_id: 2,
      rating: 5,
      comment: 'Best laptop I have ever owned. Perfect for development work and video editing.',
      is_verified_purchase: true,
      created_at: new Date('2024-01-18')
    },
    {
      id: 4,
      product_id: 4,
      user_id: 3,
      rating: 5,
      comment: 'Noise cancellation is incredible. Perfect for work and travel.',
      is_verified_purchase: true,
      created_at: new Date('2024-01-20')
    }
  ],

  wishlists: [],

  addresses: [],

  notifications: []
};

// Auto-increment IDs
let nextId = {
  users: 4,
  categories: 6,
  vendors: 3,
  products: 11,
  carts: 1,
  orders: 2,
  reviews: 5,
  wishlists: 1,
  addresses: 1,
  notifications: 1
};

module.exports = { db, nextId };