const ShippingSettings = require('../models/ShippingSettings');

// Get Shipping Settings
exports.getShippingSettings = async (req, res) => {
    try {
        let settings = await ShippingSettings.findOne();
        if (!settings) {
            settings = await ShippingSettings.create({
                baseShippingCharge: 50,
                isFreeShippingActive: true,
                freeShippingMinAmount: 1000,
                freeShippingMinItems: 0
            });
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error("Error getting shipping settings:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update Shipping Settings
exports.updateShippingSettings = async (req, res) => {
    try {
        let settings = await ShippingSettings.findOne();
        if (settings) {
            settings = await ShippingSettings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
        } else {
            settings = await ShippingSettings.create(req.body);
        }
        res.status(200).json({ success: true, message: 'Shipping Settings Updated Successfully', data: settings });
    } catch (error) {
        console.error("Error updating shipping settings:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
