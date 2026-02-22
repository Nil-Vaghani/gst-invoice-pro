const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

// POST /api/invoices — Create and save a new invoice
router.post("/", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
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

// GET /api/invoices — Fetch all invoices (newest first)
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
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

// GET /api/invoices/:id — Fetch a single invoice by ID
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
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

// DELETE /api/invoices/:id — Delete a specific invoice
router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
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
