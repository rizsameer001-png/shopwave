const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: String,
    image: String,
    icon: String,
    color: { type: String, default: '#6C63FF' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  next();
});

module.exports = mongoose.model('Category', categorySchema);
