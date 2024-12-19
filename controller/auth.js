// controllers/authController.js
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../model/user");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  try {
    const hash_pw = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      ...req.body,
      password: hash_pw
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (user) {
    const status = await bcrypt.compare(req.body.password, user.password);
    if (status) {
      let userObject = user.get({ plain: true });
      delete userObject.password;

      const token = jwt.sign(userObject, process.env.JWT_SECRET);
      return res.send({ data: userObject, token });
    }
  }
  return res.status(401).send({ msg: "Unauthenticated" });
};

const getuser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ msg: "Unauthorized: No token provided" });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decodedToken.id);

      if (!user) {
        return res.status(401).send({ msg: "Unauthorized: Invalid token" });
      }

      return res.send({ user });
    } catch (err) {
      console.error(err);
      return res.status(401).send({ msg: "Unauthorized: Invalid token" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getuser
};
