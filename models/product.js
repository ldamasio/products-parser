import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
  code: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }
