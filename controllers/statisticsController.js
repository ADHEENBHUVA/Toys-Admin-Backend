const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.getDashboardStats = async (req, res) => {
    try {
        // Aggregate Total Revenue
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Total Orders
        const totalOrders = await Order.countDocuments();

        // Total Customers
        const totalCustomers = await Customer.countDocuments();

        // Calculate a mock Conversion Rate (Total Orders / Arbitrary views)
        const conversionRate = totalOrders > 0 ? ((totalOrders / (totalCustomers * 10)) * 100).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                totalCustomers,
                conversionRate: Number(conversionRate)
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
