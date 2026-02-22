const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  amount: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    // Business Details
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    businessAddress: {
      type: String,
      trim: true,
      default: "",
    },
    businessGSTIN: {
      type: String,
      trim: true,
      default: "",
    },
    businessPhone: {
      type: String,
      trim: true,
      default: "",
    },
    businessEmail: {
      type: String,
      trim: true,
      default: "",
    },

    // Client Details
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    clientAddress: {
      type: String,
      trim: true,
      default: "",
    },
    clientGSTIN: {
      type: String,
      trim: true,
      default: "",
    },
    clientPhone: {
      type: String,
      trim: true,
      default: "",
    },

    // Items
    items: {
      type: [itemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one item is required",
      },
    },

    // GST
    gstRate: {
      type: Number,
      required: true,
      enum: [5, 12, 18, 28],
    },

    // Calculated Fields
    subTotal: {
      type: Number,
      required: true,
    },
    cgstAmount: {
      type: Number,
      required: true,
    },
    sgstAmount: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },

    // Invoice Metadata
    invoiceNumber: {
      type: String,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Auto-generate invoice number before saving
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
