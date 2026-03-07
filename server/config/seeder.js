const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  { name: 'Electronics', icon: '📱', color: '#667EEA', description: 'Gadgets, devices and tech accessories', sortOrder: 1 },
  { name: 'Fashion', icon: '👗', color: '#FF6B9D', description: 'Clothing, shoes and accessories', sortOrder: 2 },
  { name: 'Sports', icon: '⚽', color: '#43E97B', description: 'Sports equipment and activewear', sortOrder: 3 },
  { name: 'Beauty', icon: '💄', color: '#FA709A', description: 'Skincare, makeup and fragrances', sortOrder: 4 },
  { name: 'Home', icon: '🏠', color: '#4FACFE', description: 'Furniture, decor and appliances', sortOrder: 5 },
  { name: 'Books', icon: '📚', color: '#F093FB', description: 'Books, e-books and audiobooks', sortOrder: 6 },
  { name: 'Toys', icon: '🧸', color: '#FDA085', description: 'Toys and games for all ages', sortOrder: 7 },
  { name: 'Grocery', icon: '🍎', color: '#43E97B', description: 'Fresh food and pantry essentials', sortOrder: 8 },
];

const products = [
  {
    name: 'Premium Wireless Headphones Pro',
    description: 'Experience crystal-clear sound with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, ultra-comfortable memory foam ear cushions, and hi-res audio support. Perfect for music lovers and remote workers.',
    shortDescription: 'ANC wireless headphones with 30hr battery',
    price: 299.99, discountPrice: 199.99,
    category: 'Electronics', brand: 'SoundPro',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Headphones front' },
      { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', alt: 'Headphones side' },
    ],
    stock: 45, rating: 4.8, numReviews: 2847,
    isFeatured: true, colors: [{ name: 'Midnight Black', hex: '#1a1a1a' }, { name: 'Pearl White', hex: '#f5f5f5' }, { name: 'Navy Blue', hex: '#1e3a5f' }],
    tags: ['wireless', 'noise-cancelling', 'premium'],
    specifications: new Map([['Driver Size', '40mm'], ['Frequency Response', '20Hz-20kHz'], ['Battery', '30 hours'], ['Connectivity', 'Bluetooth 5.2']]),
  },
  {
    name: 'Smart Watch Series X Pro',
    description: 'Stay connected and track your health with our latest flagship smartwatch. Features GPS, heart rate monitor, SpO2 sensor, 7-day battery, 50m water resistance, and over 100 workout modes.',
    shortDescription: 'GPS smartwatch with health monitoring',
    price: 449.99, discountPrice: 349.99,
    category: 'Electronics', brand: 'TechWear',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Watch front' },
      { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500', alt: 'Watch on wrist' },
    ],
    stock: 30, rating: 4.9, numReviews: 1523,
    isFeatured: true, isNew: true,
    colors: [{ name: 'Silver', hex: '#C0C0C0' }, { name: 'Space Black', hex: '#2d2d2d' }, { name: 'Rose Gold', hex: '#B76E79' }],
    tags: ['smartwatch', 'health', 'gps', 'waterproof'],
  },
  {
    name: 'Ultra Boost Running Shoes',
    description: 'Engineered for peak performance. Responsive Boost cushioning, Primeknit upper for a sock-like fit, and Continental rubber outsole for superior grip in all conditions.',
    shortDescription: 'High-performance running shoes',
    price: 129.99, discountPrice: 89.99,
    category: 'Sports', brand: 'SpeedRun',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Shoe side view' },
      { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', alt: 'Shoe top view' },
    ],
    stock: 100, rating: 4.6, numReviews: 4210,
    isFeatured: true,
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: [{ name: 'Blue/White', hex: '#4169E1' }, { name: 'Black/Red', hex: '#1a1a1a' }, { name: 'Green/Yellow', hex: '#228B22' }],
    tags: ['running', 'sports', 'shoes', 'performance'],
  },
  {
    name: 'Genuine Leather Crossbody Bag',
    description: 'Handcrafted from full-grain leather, this crossbody bag combines style with functionality. Features 3 interior compartments, RFID-blocking pocket, and adjustable strap.',
    shortDescription: 'Full-grain leather crossbody bag',
    price: 89.99,
    category: 'Fashion', brand: 'LuxeLeather',
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', alt: 'Bag front' },
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Bag interior' },
    ],
    stock: 25, rating: 4.7, numReviews: 892,
    isNew: true,
    colors: [{ name: 'Tan', hex: '#D2B48C' }, { name: 'Black', hex: '#1a1a1a' }, { name: 'Burgundy', hex: '#800020' }],
    tags: ['leather', 'bag', 'fashion', 'accessories'],
  },
  {
    name: 'RGB Mechanical Gaming Keyboard',
    description: 'Dominate your game with our pro-grade mechanical keyboard. Features Cherry MX switches, per-key RGB lighting, N-key rollover, aircraft-grade aluminum frame, and programmable macros.',
    shortDescription: 'Pro mechanical keyboard with Cherry MX switches',
    price: 159.99, discountPrice: 119.99,
    category: 'Electronics', brand: 'GamePro',
    images: [
      { url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500', alt: 'Keyboard overview' },
      { url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500', alt: 'Keyboard RGB' },
    ],
    stock: 60, rating: 4.5, numReviews: 3104,
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#f5f5f5' }],
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb'],
    specifications: new Map([['Switch Type', 'Cherry MX Red'], ['Layout', 'TKL (87 keys)'], ['Connectivity', 'USB-C + Wireless'], ['Polling Rate', '1000Hz']]),
  },
  {
    name: 'Premium Yoga Mat with Alignment',
    description: 'Transform your practice with our eco-friendly natural rubber yoga mat. Features alignment lines, 6mm thickness for joint protection, non-slip surface, and antimicrobial top layer.',
    shortDescription: 'Eco-friendly yoga mat, 6mm thick',
    price: 59.99,
    category: 'Sports', brand: 'ZenFit',
    images: [{ url: 'https://images.unsplash.com/photo-1601925228536-40d8b5e4d3e4?w=500', alt: 'Yoga mat' }],
    stock: 80, rating: 4.4, numReviews: 657,
    colors: [{ name: 'Lavender', hex: '#E6E6FA' }, { name: 'Ocean Blue', hex: '#006994' }, { name: 'Rose Pink', hex: '#FF007F' }, { name: 'Forest Green', hex: '#228B22' }],
    tags: ['yoga', 'fitness', 'eco-friendly', 'sports'],
  },
  {
    name: 'Vitamin C Glow Skincare Set',
    description: 'Complete your skincare routine with our dermatologist-tested Vitamin C set. Includes 20% Vitamin C serum, hyaluronic acid moisturizer, SPF 50+ sunscreen, and eye cream. Suitable for all skin types.',
    shortDescription: 'Complete Vitamin C skincare routine',
    price: 79.99, discountPrice: 59.99,
    category: 'Beauty', brand: 'GlowUp',
    images: [{ url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500', alt: 'Skincare set' }],
    stock: 40, rating: 4.8, numReviews: 1205,
    isNew: true, tags: ['skincare', 'beauty', 'vitamin-c', 'natural'],
  },
  {
    name: 'Smart Coffee Maker 12-Cup',
    description: 'Wake up to perfectly brewed coffee every morning. Features programmable 24-hour timer, built-in conical burr grinder, thermal carafe, adjustable brew strength, and WiFi connectivity.',
    shortDescription: 'Programmable coffee maker with built-in grinder',
    price: 199.99, discountPrice: 149.99,
    category: 'Home', brand: 'BrewMaster',
    images: [{ url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', alt: 'Coffee maker' }],
    stock: 20, rating: 4.6, numReviews: 2341,
    isFeatured: true, tags: ['coffee', 'kitchen', 'smart home', 'appliance'],
  },
  {
    name: 'Noise-Cancelling True Wireless Earbuds',
    description: 'Immerse yourself in sound with 10mm drivers, 30dB active noise cancellation, 8-hour battery per charge, wireless charging case, and IPX5 waterproof rating.',
    shortDescription: 'True wireless earbuds with ANC',
    price: 149.99, discountPrice: 99.99,
    category: 'Electronics', brand: 'SoundPro',
    images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', alt: 'Earbuds' }],
    stock: 55, rating: 4.6, numReviews: 1879,
    isNew: true, isFeatured: true,
    colors: [{ name: 'White', hex: '#ffffff' }, { name: 'Black', hex: '#1a1a1a' }],
    tags: ['wireless', 'earbuds', 'anc', 'audio'],
  },
  {
    name: '4K Ultra-Wide Gaming Monitor 34"',
    description: '34-inch curved Ultra-Wide QHD display with 144Hz refresh rate, 1ms response time, HDR600, G-Sync compatible, and USB-C with 65W Power Delivery.',
    shortDescription: '34" curved gaming monitor, 144Hz QHD',
    price: 699.99, discountPrice: 549.99,
    category: 'Electronics', brand: 'ViewPro',
    images: [{ url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', alt: 'Monitor' }],
    stock: 15, rating: 4.7, numReviews: 643,
    isFeatured: true,
    tags: ['monitor', 'gaming', '4k', 'ultrawide'],
    specifications: new Map([['Resolution', '3440x1440 QHD'], ['Refresh Rate', '144Hz'], ['Response Time', '1ms'], ['Panel', 'VA Curved 1500R']]),
  },
  {
    name: 'Men\'s Classic Slim-Fit Suit',
    description: 'Timeless Italian craftsmanship meets modern tailoring. Notch lapel, two-button closure, fully lined, with matching trousers. Perfect for business and formal events.',
    shortDescription: 'Italian slim-fit suit, multiple colors',
    price: 299.99, discountPrice: 229.99,
    category: 'Fashion', brand: 'ClassicWear',
    images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4259?w=500', alt: 'Suit' }],
    stock: 30, rating: 4.5, numReviews: 421,
    sizes: ['36R', '38R', '40R', '42R', '44R', '46R'],
    colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Navy', hex: '#000080' }, { name: 'Black', hex: '#1a1a1a' }],
    tags: ['suit', 'formal', 'fashion', 'men'],
  },
  {
    name: 'Professional Blender 1800W',
    description: 'Commercial-grade blending power for smoothies, soups, and more. 1800W motor, 10-speed settings, self-cleaning cycle, BPA-free 72oz jar, and variable speed control.',
    shortDescription: '1800W professional blender',
    price: 129.99, discountPrice: 89.99,
    category: 'Home', brand: 'BlendPro',
    images: [{ url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500', alt: 'Blender' }],
    stock: 35, rating: 4.4, numReviews: 892,
    colors: [{ name: 'Silver', hex: '#C0C0C0' }, { name: 'Black', hex: '#1a1a1a' }, { name: 'Red', hex: '#CC0000' }],
    tags: ['kitchen', 'blender', 'appliance', 'smoothie'],
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany(), Category.deleteMany()]);
    console.log('🗑  Cleared existing data');

    await Category.insertMany(categories);
    console.log('📂 Categories seeded');

    const adminUser = await User.create({ name: 'Admin User', email: 'admin@shopwave.com', password: 'admin123', isAdmin: true, avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6C63FF&color=fff' });
    const demoUser = await User.create({ name: 'Demo User', email: 'demo@shopwave.com', password: 'demo123', avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=FF6584&color=fff' });
    console.log('👥 Users seeded');

    await Product.insertMany(products);
    console.log(`📦 ${products.length} Products seeded`);

    console.log('\n✅ Database seeded successfully!');
    console.log('────────────────────────────────');
    console.log('🔑 Admin:  admin@shopwave.com / admin123');
    console.log('👤 User:   demo@shopwave.com  / demo123');
    console.log('────────────────────────────────\n');
    process.exit();
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany(), Category.deleteMany()]);
    console.log('🗑  All data destroyed');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') destroyData(); else importData();
