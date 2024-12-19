const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ msg: "Unauthorized: No token provided" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decodedToken._id });

        if (!user) {
            return res.status(401).send({ msg: "Unauthorized: Invalid token" });
        }
        else{
        req.user = user;
        next();
        }
        
    } catch (err) {
        next(err);

    }
};

module.exports = authMiddleware;
