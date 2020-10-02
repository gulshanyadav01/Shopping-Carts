const { restart } = require("nodemon");
const Product = require("../model/product");
const Costumer = require("../model/user")


exports.getIndex = (req, res, next) =>{
    Product.find()
    .then( ( product ) => {
        res.render("products",{
            pageTitle:"products",
            product: product
        });

    } )
    .catch( ( err ) =>{
        console.log(err);
    })
}

exports.getAddProducts = (req, res, next) =>{
    res.render("add-product",{
        pageTitle:"add-product",
        editing:false
    
    });
}

exports.postAddProducts = (req, res, next) =>{
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product({
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl
    });
    product.save()
    .then((result) =>{
        console.log(result);
        res.redirect("/");
    })
    .catch((err) =>{
        console.log(err);
    })
}
// get Details 

exports.getProduct = (req, res, next) =>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product =>{
        res.render("product",{pageTitle:"Details",
        product:product
        });
    })
    .catch((err) =>{
        console.log(err);
    })
}


exports.getEditProduct = (req, res, next) =>{
    const edit = req.query.edit;
    if(!edit){
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then((product) =>{
        res.render("add-product",{pageTitle:"edit-product",
        product:product,
        editing:edit
    });
    })

}

exports.postEditProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    const updatedName = req.body.name;
    const updatedPrice =req.body.price;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;

    Product.findById(prodId)
    .then((product) =>{
        product.name = updatedName;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        product.price = updatedPrice;
        return product.save();
    })
    .then(result =>{
        // console.log("product is updated");
        res.redirect("/");
    })
    .catch(err =>{
        console.log(err);
    })

}

exports.postDeleteProduct = (req, res, next) =>{
    const prodId = req.body.delete;
    Product.findByIdAndRemove(prodId)
    .then((result) =>{
        console.log("product is deleted");
        res.redirect("/");
    })
    .catch((err) =>{
        console.log(err);
    })
}


exports.postCartProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product =>{
        return req.costumer.addToCart(product)
    })
    .then(result =>{
        res.redirect("/cart")
    })
    .catch(err =>{
        console.log(err);
    })

}


exports.getCart = (req, res, next ) =>{
    req.costumer
    .populate("cart.items.productId")
    .execPopulate()
    .then(costumer =>{
        const product = costumer.cart.items;
        // console.log(product);
        res.render("cart",{
            pageTitle:"Your Cart",
            product: product
        });

    })
}

exports.deleteProductCart = (req, res, next) =>{
    const prodId = req.body.productId; 
    req.costumer.deleteCartProducts(prodId)
    .then(costumer =>{
        res.redirect("/cart");
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.getAdmin = (req, res, next) =>{
    Product.find()
    .then(product =>{
        res.render("admin",{pageTitle:"products",
        product: product
    });
    })
}