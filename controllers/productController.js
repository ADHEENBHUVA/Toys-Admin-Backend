const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}, { images: { $slice: 1 } }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to fetch products'
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
    try {
        const { name, category, subCategory, brand, price, stockQuantity, description, images, ageGroup } = req.body;

        const newProduct = new Product({
            name,
            sku: 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            category,
            subCategory: subCategory || undefined,
            brand: brand || undefined,
            price: Number(price),
            stockQuantity: Number(stockQuantity),
            description,
            images: images || [],
            ageGroup: ageGroup || [],
            status: 'Active'
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            data: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error: Failed to create product'
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
    try {
        const { name, category, subCategory, brand, price, stockQuantity, description, images, ageGroup } = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.name = name || product.name;
        if (category) product.category = category;
        if (subCategory !== undefined) product.subCategory = subCategory || undefined;
        if (brand !== undefined) product.brand = brand || undefined;
        if (price) product.price = Number(price);
        if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
        if (description !== undefined) product.description = description;
        if (images && images.length > 0) product.images = images;
        if (ageGroup !== undefined) product.ageGroup = ageGroup;

        await product.save();

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to update product'
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Product removed'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to delete product'
        });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error fetching product by id:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
