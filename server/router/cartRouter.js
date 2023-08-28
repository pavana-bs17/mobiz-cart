const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cartmodel");
const Product = require("../models/ItemsModel");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/add_to_cart",
  verifyToken,
  [
    check("product_id").notEmpty().withMessage("Product ID is required"),
    check("quantity").notEmpty().withMessage("Quantity is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { user_id, product_id, quantity } = req.body;

      // Fetch the available quantity of the product from the product table
      const product = await Product.findById(product_id);
      if (!product) {
        throw new Error("Product not found");
      }

      // Check if the requested quantity exceeds the available quantity in the product table
      if (quantity > product.quantity) {
        return res
          .status(400)
          .json({
            message: "Requested quantity exceeds available quantity",
            status: 0,
          });
      }

      // Check if the product is already in the cart
      const existingCartItem = await Cart.findOne({
        user: user_id,
        product: product_id,
      });

      if (existingCartItem) {
        // Calculate the total quantity after adding the requested quantity
        const totalQuantity = existingCartItem.quantity + quantity;
        // Check if the total quantity exceeds the available quantity in the product table
        if (totalQuantity > product.quantity) {
          return res
            .status(400)
            .json({
              message: "Total quantity exceeds available quantity",
              status: 0,
            });
        }

        // Update the quantity of the existing cart item
        existingCartItem.quantity = totalQuantity;
        await existingCartItem.save();

        return res.json({
          message: "Cart item quantity updated",
          updatedCartItem: existingCartItem,
          status: 1,
        });
      }

      // If the product is not in the cart, create a new cart item
      const cartItem = new Cart({
        user: user_id,
        product: product_id,
        quantity,
      });

      await cartItem.save();

      res.json({ message: "Item added to cart", status: 1 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Retrieve cart items for a user

router.get("/get_cart_items/:user_id", verifyToken, async (req, res) => {
  try {
    const user_id = req.params.user_id;
    // Validate the user_id format before creating ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const cartItems = await Cart.find({ user: user_id }).populate("product");

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update cart item quantity

router.put(
  "/update_cart_item/:cart_item_id",
  verifyToken,
  [check("quantity").notEmpty().withMessage("Quantity is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const cart_item_id = req.params.cart_item_id;
      const { quantity } = req.body;

      const cartItem = await Cart.findById(cart_item_id);
      if (!cartItem) {
        return res
          .status(404)
          .json({ message: "Cart item not found", status: 0 });
      }

      // Fetch the associated product's available quantity from the items table
      const associatedProduct = await Product.findById(cartItem.product);
      if (!associatedProduct) {
        return res
          .status(404)
          .json({ message: "Associated product not found" });
      }

      if (quantity > associatedProduct.quantity) {
        return res
          .status(400)
          .json({ message: "Quantity exceeds available stock", status: 0 });
      }

      // Update cart item's quantity
      cartItem.quantity = quantity;
      await cartItem.save();

      res.json({
        message: "Cart item quantity updated",
        updatedCartItem: cartItem,
        status: 1,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Remove an item from the cart
router.delete(
  "/remove_from_cart/:cart_item_id",
  verifyToken,
  async (req, res) => {
    try {
      const cart_item_id = req.params.cart_item_id;

      await Cart.findByIdAndDelete(cart_item_id);

      res.json({ message: "Item removed from cart", status: 1 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete("/remove_multiple_from_cart", verifyToken, async (req, res) => {
  try {
    const cart_item_ids = req.body.cart_item_ids;
    // DeleteMany function to delete multiple cart items by IDs
    await Cart.deleteMany({ _id: { $in: cart_item_ids } });

    res.json({ message: "Items removed from cart", status: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
