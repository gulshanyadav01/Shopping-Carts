const express = require("express");
// const { route } = require("../../shopping/router/admin");
const { check, body } = require("express-validator");

const Costumer = require('../model/user');

const router = express.Router();
const authController = require("../controller/auth");

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', check("email").isEmail().withMessage("please enter a valid email").custom((value ,{req}) =>{
    if(value === "test@test.com"){
        throw new Error("this email is forbidden");
    }
    return true;

}) ,
body("password", "please enter the password only number and text").isLength({min: 5}).isAlphanumeric(),
body("confirmPassword").custom((value, { req }) =>{
    if(value !== req.body.password){
        throw new Error("password have to be match");
    }
    return true
})
, authController.postSignup);

router.post('/logout', authController.postLogout);

router.get("/passwordReset",authController.getReset);

router.post("/passwordReset",authController.postReset);

router.get("/newPassword/:token", authController.getNewPassword);

router.post("/newPassword",authController.postNewPassword);

module.exports = router;