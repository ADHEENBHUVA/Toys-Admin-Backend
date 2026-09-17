const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String },
    previousQuantity: { type: Number, required: true },
    changedQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    action: { type: String, enum: ['Restock', 'Sold', 'Return', 'Damage', 'Adjustment'], required: true },
    reason: { type: String },
    orderRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
