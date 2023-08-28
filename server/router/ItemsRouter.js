const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ItemsModel = require("../models/ItemsModel");
const { check, validationResult } = require("express-validator");

router.get("/all_items", async (req, res) => {
  const products = await ItemsModel.find({ quantity: { $gt: 0 } });
  res.json(products);
});

router.post("/all_items", async (req, res) => {
  const { itemIds } = req.body;

  try {
    const products = await ItemsModel.find({ _id: { $in: itemIds } });

    // Create a map of item IDs to quantities
    const itemQuantities = {};
    products.forEach((product) => {
      itemQuantities[product._id.toString()] = product.quantity;
    });

    res.json(itemQuantities);
  } catch (error) {
    console.error("Error fetching item quantities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get_item/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the provided id is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ message: "Invalid product ID", status: 0 });
  }

  try {
    const item = await ItemsModel.findById(id);

    if (!item) {
      return res.json({ message: "Item not found", status: 0 });
    }

    if (item.quantity <= 0) {
      return res.json({ message: "Item is out of stock", status: 0 });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", status: 0 });
  }
});

router.put(
  "/update/:id",
  [
    check("name").notEmpty().withMessage("Enter Product Name"),
    check("price").notEmpty().withMessage("Enter Product Price"),
    check("image").notEmpty().withMessage("Add Image Link"),
    check("description").notEmpty().withMessage("Enter product description"),
    check("quantity").notEmpty().withMessage("Enter product quantity"),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { name, price, image, description, quantity } = req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.json({ error: error.array(), status: 0 });
      return;
    }

    try {
      const updatedProduct = await ItemsModel.findByIdAndUpdate(
        id,
        {
          name,
          price,
          image,
          description,
          quantity,
        },
        { new: true }
      );

      if (!updatedProduct) {
        res.json({ message: "Product not found", status: 0 });
        return;
      }

      res.json({
        message: "Product updated",
        status: 1,
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", status: 0 });
    }
  }
);

router.put("/update_multiple_cart_items", async (req, res) => {
  const { items } = req.body;

  try {
    for (const { itemId, quantity } of items) {
      const itemToUpdate = await ItemsModel.findById(itemId);
      if (!itemToUpdate) {
        console.log(`Item with ID ${itemId} not found.`);
        continue;
      }

      if (quantity > itemToUpdate.quantity) {
        return res
          .status(400)
          .json({
            message: `Cart item quantity cannot be more than item quantity for item ${itemId}`,
            status: 0,
          });
      }

      const updatedItem = await ItemsModel.findByIdAndUpdate(
        itemId,
        { quantity },
        { new: true }
      );

      if (!updatedItem) {
        console.log(`Item with ID ${itemId} not found.`);
      }
    }

    res.json({ message: "Items quantities updated", status: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", status: 0 });
  }
});

router.post(
  "/add",
  [
    check("name").notEmpty().withMessage("Enter Product Name"),
    check("price").notEmpty().withMessage("Enter Product Price"),
    check("image").notEmpty().withMessage("Add Image Link"),
    check("description").notEmpty().withMessage("Enter product description"),
    check("quantity").notEmpty().withMessage("Enter product quantity"),
  ],
  (req, res) => {
    const { name, price, image, description, quantity } = req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.json({ error: error.array(), status: 0 });
      return;
    }

    const newProduct = new ItemsModel({
      name,
      price,
      image,
      description,
      quantity,
    });

    newProduct.save().then((docs) => {
      res.send({ message: "Product added", status: 1, docs });
    });
  }
);

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the provided id is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ message: "Invalid product ID", status: 0 });
  }

  try {
    const deletedProduct = await ItemsModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.json({ message: "Product not found", status: 0 });
    }

    return res.json({ message: "Product deleted", status: 1 });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
});

module.exports = router;
