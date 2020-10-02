const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const crypto = require("crypto");


const csrfProtection = csrf();

const Costumer =require("./model/user");
const MONGDB_URI = "mongodb+srv://gulshan:Tzd8Rx20iYBRgyFG@cluster0.pzhj1.mongodb.net/Shopping?retryWrites=true&w=majority";

const app = express();
const store = new mongoDBStore({
    uri: MONGDB_URI,
    collection: "sessions"
})
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine","ejs");
app.set("views","views");

app.use(session({secret: "my secret", resave: false, saveUninitialized: false, store: store}));

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
    if (!req.session.costumer) {
      return next();
    }
    Costumer.findById(req.session.costumer._id)
      .then(costumer => {
        req.costumer = costumer;
        next();
      })
      .catch(err => console.log(err));
  });

app.use((req, res, next) =>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

const router= require("./router/admin");
const authRouter  = require("./router/auth");

app.use(router);
app.use(authRouter);


mongoose.connect("mongodb+srv://gulshan:Tzd8Rx20iYBRgyFG@cluster0.pzhj1.mongodb.net/Shopping?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})
.then((result) =>{
    app.listen(9000)
})
.catch(err =>{
    console.log(err);
})
