const express = require("express");
// const { route } = require("../../shopping/router/admin");

const { body } = require("express-validator");


const router = express.Router();
const ControllerBhai = require("../controller/admin");

const isAuth = require("../middleware/isAuth");
router.get("/",ControllerBhai.getIndex);

router.get("/add-product", isAuth , ControllerBhai.getAddProducts);
router.post("/add-product",[
    body("name")
    .isAlphanumeric()
    .isLength({ min: 3})
    .trim(),
    body("imageUrl").isURL(),
    body("description")
    .isLength( {min: 5, max: 400})
    .trim()
],
 isAuth ,ControllerBhai.postAddProducts);



router.get("/getDetails/:productId", isAuth , ControllerBhai.getProduct);

router.get("/edit-product/:productId", isAuth ,ControllerBhai.getEditProduct);
router.post("/edit-product", isAuth ,ControllerBhai.postEditProduct);

// delete Product 

router.post("/deleteProduct", isAuth ,ControllerBhai.postDeleteProduct);

// post - add to cart
router.post("/addToCart", isAuth ,ControllerBhai.postCartProduct);
router.get("/cart", isAuth ,ControllerBhai.getCart);

// delete cart product 

router.post("/deleteCartProduct", isAuth ,ControllerBhai.deleteProductCart);
router.get("/admin",isAuth , ControllerBhai.getAdmin);
module.exports = router;