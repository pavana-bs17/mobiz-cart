const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'items', 
  },
  quantity: {
    type: Number,
  },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
