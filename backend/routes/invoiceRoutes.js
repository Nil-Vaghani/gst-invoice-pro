/**
 * @fileoverview Invoice API Routes
 * Handles CRUD operations for Invoices.
 * All routes are protected by JWT Middleware.
 * @module routes/invoiceRoutes
 */

const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

/**
 * @route POST /api/invoices
 * @description Create and save a new GST invoice. Ties the invoice to the authenticated user ID.
 * @access Private
 */
router.post("/", async (req, res) => {
  try {
    const invoice = new Invoice({ ...req.body, user: req.user.id });
    const savedInvoice = await invoice.save();
    res.status(201).json({
      success: true,
      message: "Invoice saved successfully",
      data: savedInvoice,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while saving invoice",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/invoices
 * @description Fetch all invoices related to the authenticated user. Newest first.
 * @access Private
 */
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoices",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/invoices/:id
 * @description Fetch a specific invoice by ID. Ensures user only accesses their own invoice.
 * @access Private
 */
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoice",
      error: error.message,
    });
  }
});

/**
 * @route DELETE /api/invoices/:id
 * @description Delete a specific invoice permanently from MongoDB.
 * @access Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting invoice",
      error: error.message,
    });
  }
});

module.exports = router;
