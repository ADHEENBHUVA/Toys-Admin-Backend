const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    module: { type: String, required: true },
    description: { type: String, required: true },
    adminId: { type: String },
    ipAddress: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
