const express = require("express");
// const { route } = require("../../shopping/router/admin");

const router = express.Router();
const authController = require("../controller/auth");

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get("/passwordReset",authController.getReset);
router.post("/passwordReset",authController.postReset)

module.exports = router;