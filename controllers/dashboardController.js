const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-11
        
        // Define date boundaries
        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

        // 1. Overall Totals
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});
        const activeCustomers = await Customer.countDocuments({ status: { $ne: 'Inactive' } });

        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $nin: ['Cancelled', 'Returned', 'Refunded'] } } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // 2. Percentage Increases (Current vs Previous Month)
        // Products
        const currProducts = await Product.countDocuments({ createdAt: { $gte: startOfCurrentMonth } });
        const prevProducts = await Product.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } });
        const productIncrease = prevProducts === 0 ? (currProducts > 0 ? 100 : 0) : ((currProducts - prevProducts) / prevProducts) * 100;

        // Orders
        const currOrders = await Order.countDocuments({ createdAt: { $gte: startOfCurrentMonth } });
        const prevOrders = await Order.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } });
        const orderIncrease = prevOrders === 0 ? (currOrders > 0 ? 100 : 0) : ((currOrders - prevOrders) / prevOrders) * 100;

        // Customers
        const currCustomers = await Customer.countDocuments({ createdAt: { $gte: startOfCurrentMonth } });
        const prevCustomers = await Customer.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } });
        const customerIncrease = prevCustomers === 0 ? (currCustomers > 0 ? 100 : 0) : ((currCustomers - prevCustomers) / prevCustomers) * 100;

        // Revenue
        const currRevenueRes = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfCurrentMonth }, orderStatus: { $nin: ['Cancelled', 'Returned', 'Refunded'] } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const prevRevenueRes = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth }, orderStatus: { $nin: ['Cancelled', 'Returned', 'Refunded'] } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const currRev = currRevenueRes.length > 0 ? currRevenueRes[0].total : 0;
        const prevRev = prevRevenueRes.length > 0 ? prevRevenueRes[0].total : 0;
        const revenueIncrease = prevRev === 0 ? (currRev > 0 ? 100 : 0) : ((currRev - prevRev) / prevRev) * 100;

        // Format increases to strings like "+12.5%"
        const formatInc = (val) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
        const increases = {
            products: formatInc(productIncrease),
            orders: formatInc(orderIncrease),
            revenue: formatInc(revenueIncrease),
            customers: formatInc(customerIncrease)
        };

        // 3. Monthly Chart Data (Revenue for current year)
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear, $lte: endOfYear },
                    orderStatus: { $nin: ['Cancelled', 'Returned', 'Refunded'] }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" }, // 1 = Jan, 2 = Feb...
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const chartData = new Array(12).fill(0);
        monthlyRevenue.forEach(item => {
            // item._id is 1-indexed month
            chartData[item._id - 1] = item.total;
        });

        // To make the chart look nice on frontend, we might want to scale it to percentages (0-100) or send raw values.
        // Let's send raw values, and let frontend calculate height percentages relative to the max value.
        
        // 4. Fetch recent sales
        const recentSales = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer', 'firstName lastName')
            .populate('orderItems.product', 'name');

        const formattedRecentSales = recentSales.map(order => {
            const firstItemName = order.orderItems.length > 0 && order.orderItems[0].product
                ? order.orderItems[0].product.name
                : 'Unknown Product';

            let bgColor = 'bg-amber-100 text-amber-700'; // Default / Processing
            if (['Delivered', 'Completed', 'Shipped'].includes(order.orderStatus)) {
                bgColor = 'bg-emerald-100 text-emerald-700';
            } else if (['Cancelled', 'Refunded'].includes(order.orderStatus)) {
                bgColor = 'bg-red-100 text-red-700';
            } else if (['Out for Delivery'].includes(order.orderStatus)) {
                bgColor = 'bg-blue-100 text-blue-700';
            }

            return {
                id: order._id,
                name: firstItemName,
                price: order.totalAmount, 
                time: order.createdAt, 
                status: order.orderStatus,
                color: bgColor
            };
        });

        res.json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalRevenue,
                activeCustomers,
                increases,
                recentSales: formattedRecentSales,
                chartData // Raw revenue values per month
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};
