const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  images:      [{ type: String }],
  // Points / exchange value
  price:       { type: Number, required: true, default: 45 },
  // Ownership & lifecycle
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      { type: String, enum: ['available', 'sold', 'swap'], default: 'available' },
  // Garment metadata (new fields for Stitch design)
  category:    { type: String, default: 'Heavy Outerwear' },
  fiber:       { type: String, default: '' },           // e.g. "100% Duck Cotton Canvas • 22.4 oz"
  size:        { type: String, default: '' },           // e.g. "Size 42 (M/L)"
  condition:   { type: String, default: '' },           // e.g. "Excellent (Grade A)"
  depot:       { type: String, default: 'Cascadia Depot Hub 44-A' },
  method:      { type: String, enum: ['swap', 'redeem', 'both'], default: 'both' },
  lot:         { type: String, default: '' },           // e.g. "LOT-284-A"
  tagId:       { type: String, default: '' },           // e.g. "TAG #C-0482"
  tags:        [{ type: String }],                      // e.g. ["cotton","workwear"]
  createdAt:   { type: Date, default: Date.now },
});

// Auto-generate lot and tagId before save if not provided
productSchema.pre('save', function (next) {
  if (!this.lot) {
    const num = Math.floor(100 + Math.random() * 900);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const letter = letters[Math.floor(Math.random() * letters.length)];
    this.lot = `LOT-${num}-${letter}`;
  }
  if (!this.tagId) {
    const prefix = this.category ? this.category[0].toLowerCase() : 'x';
    const num = Math.floor(1000 + Math.random() * 9000);
    this.tagId = `TAG #${prefix.toUpperCase()}-${num}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);