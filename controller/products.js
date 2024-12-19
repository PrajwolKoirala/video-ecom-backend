const { Op, Sequelize  } = require("sequelize");
const Product = require("../model/Product");
const User = require("../model/user");
const path = require("path");

// Fetch products with search, filter, and pagination
// const fetchProduct = async (req, res, next) => {
//     try {
//         const search_term = req.query.search_term || "";
//         const per_page = parseInt(req.query.per_page) || 25;
//         const page = parseInt(req.query.page) || 1;
//         const price_from = parseFloat(req.query.price_from) || 0;
//         const price_to = parseFloat(req.query.price_to) || 999999999999999;

//         const products = await Product.findAll({
//             where: {
//                 [Op.or]: [
//                     { name: { [Op.iLike]: `%${search_term}%` } },
//                     { brands: { [Op.contains]: [search_term] } },
//                     { categories: { [Op.contains]: [search_term] } }
//                 ],
//                 newPrice: {
//                     [Op.gte]: price_from,
//                     [Op.lte]: price_to
//                 }
//             },
//             order: [["name", "ASC"]],
//             offset: (page - 1) * per_page,
//             limit: per_page
//         });

//         res.send({ data: products });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };
const fetchProduct = async (req, res, next) => {
    try {
        const search_term = req.query.search_term || "";
        const per_page = parseInt(req.query.per_page) || 25;
        const page = parseInt(req.query.page) || 1;
        const price_from = parseFloat(req.query.price_from) || 0;
        const price_to = parseFloat(req.query.price_to) || 999999999999999;

        const products = await Product.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', `%${search_term.toLowerCase()}%`),
                            Sequelize.where(Sequelize.fn('JSON_SEARCH', Sequelize.col('brands'), 'one', `%${search_term}%`), { [Op.ne]: null }),
                            Sequelize.where(Sequelize.fn('JSON_SEARCH', Sequelize.col('categories'), 'one', `%${search_term}%`), { [Op.ne]: null })
                        ]
                    },
                    {
                        newPrice: {
                            [Op.gte]: price_from,
                            [Op.lte]: price_to
                        }
                    }
                ]
            },
            order: [["name", "ASC"]],
            offset: (page - 1) * per_page,
            limit: per_page
        });

        res.send({ data: products });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Store a new product with image upload
const store = async (req, res, next) => {
    try {
        let imageFiles = req.files ? req.files.images || [] : [];
        if (!Array.isArray(imageFiles)) imageFiles = [imageFiles];

        const uploadedImagePaths = [];
        for (const imageFile of imageFiles) {
            const file_name = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(imageFile.name);
            await new Promise((resolve, reject) => {
                imageFile.mv(path.join(__dirname, "../uploads/", file_name), (err) => {
                    if (err) return reject(err);
                    uploadedImagePaths.push(file_name);
                    resolve();
                });
            });
        }

        const productData = {
            ...req.body,
            images: uploadedImagePaths,
            createdBy: req.user.id
        };

        const product = await Product.create(productData);
        res.send({ product });
    } catch (err) {
        console.error("Error:", err);
        next(err);
    }
};

// Update an existing product
const update = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        const [updated] = await Product.update(updateData, {
            where: { id: productId }
        });

        if (!updated) {
            return res.status(404).send({ msg: "Product not found" });
        }

        const updatedProduct = await Product.findByPk(productId);
        res.send({ product: updatedProduct });
    } catch (err) {
        next(err);
    }
};

// Remove a product
const remove = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send("Resource not found");
        }

        await product.destroy();
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

// Get a single product by ID
const getproduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send("Resource not found");
        }

        res.send({ product });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
};

// Add a review to a product
const createReview = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { rating, comment } = req.body;
        const user = req.user.name;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send({ msg: "Product not found" });
        }

        product.reviews = [
            ...(product.reviews || []),
            { user, rating, comment }
        ];

        await product.save();
        res.send({ product });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    fetchProduct,
    getproduct,
    store,
    update,
    remove,
    createReview
};
