const Order = require("../model/Order")
const Product = require("../model/Product")

const store = async(req, res,next) => {
try{
    //req.body,products = [{id,quamtity}]
    // in DB we need [name,quantity,price,created_by,status]
   
   
     let request_products = req.body.products
    // req.body.products.map(product => {
    //     return {

    //     }
    // })


    let products = [];
    for (let index = 0; index<request_products.length; index++){
        let product = await Product.findById(request_products[index].product_id)
        if (product) {
            products.push({
                name: product.name,
                quantity: request_products[index].quantity,
                price: product.price,
                status: "pending",
                product_id: product._id
            });
        }
    }

    let order = await Order.create({
        products,
        created_by: req.user._id
    });
    res.status(201).send({ msg: "Order created successfully", order });
} catch (err) {
    next(err);


    // console.log("store order");
}
}

module.exports = {
    store
}