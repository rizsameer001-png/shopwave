const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description required'] },
    shortDescription: { type: String, maxlength: 300 },
    price: { type: Number, required: [true, 'Price required'], min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Fashion', 'Sports', 'Beauty', 'Home', 'Books', 'Toys', 'Grocery'],
      index: true,
    },
    brand: { type: String, required: true },
    images: [{ url: String, alt: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    sizes: [String],
    colors: [{ name: String, hex: String }],
    tags: [String],
    specifications: { type: Map, of: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    weight: Number,
    dimensions: { length: Number, width: Number, height: Number },
    sku: { type: String, unique: true, sparse: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: discount percent
productSchema.virtual('discountPercent').get(function () {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual: effective price
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price;
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + this._id.toString().slice(-6);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
