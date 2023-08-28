const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String },
  price: { type: Number },
  image: { type: String },
  description: { type: String },
  quantity: { type: Number }
});

const ItemsModel = mongoose.model("items", ItemSchema);

module.exports = ItemsModel;
