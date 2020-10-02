const bcrypt = require('bcryptjs');
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const user = require('../model/user');

const Costumer = require('../model/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key:"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"
  }
}));

exports.getLogin = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: req.flash("error")
  });
};

exports.getSignup = (req, res, next) => {
  res.render('signup', {
    pageTitle: 'signup',
    isAuthenticated: false,
    errorMessage: req.flash("error")
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Costumer.findOne({ email: email })
    .then(costumer => {
      if (!costumer) {
        
        req.flash('error','invalid email or password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, costumer.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.costumer = costumer;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error','invalid email or password');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  Costumer.findOne({ email: email })
    .then(costumer => {
      if (costumer) {
        req.flash("error","e-mail exists already please pick a different one");
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const costumer = new Costumer({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return costumer.save();
        })
        .then(result => {
          console.log("user is created");
          res.redirect('/login');
          transporter.sendMail({
            to: email,
            from: "gulshany01@gmail.com",
            subject: "siguup seccedded",
            html : "<h1> you successfully signed in</h1>"

          })
          .catch(err =>{
            console.log(err);
          });
         
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};


// exports.postSignup = (req, res, next) =>{
//   const email = req.body.email;
//   const password= req.body.password;
//   Costumer.findOne({ email: email})
//   .then(costumer =>{
//     if(costumer){
//       return res.redirect("/signup");
//     }
//     bcrypt.hash(password, 12)
//     .then(hashedPassword =>{
//       const costumer=  new Costumer({
//         email : email,
//         password : hashedPassword,
//         cart: {items: []}
//       })
//       return costumer.save();
//     })
//     .then(result =>{
//       console.log("user is created");
//       res.redirect('/login');
//     })
//   }).catch(err=>{
//     console.log(err)
//   })
// }


exports.getReset = (req, res, next) =>{
  res.render("passwordReset",{
    pageTitle: "Reset",
    errorMessage:req.flash("err")
  })
}


exports.postReset = (req, res, next) =>{
  crypto.randomBytes(32, (err, buffer) =>{
    if(err){
      console.log(err);
      return res.redirect("/passwordReset");

    }
    const token = buffer.toString("hex");
    Costumer.findOne( { email : req.body.email})
    .then(costumer =>{
      if(!costumer){
        req.flash("err","no account with email found ");
        return res.redirect('/passwordReset');

      }
      costumer.resetToken = token; 
      costumer.resetTokenExpiration = Date.now() + 360000;
      return costumer.save();
      

    }

    ).then(result =>{
      res.redirect("/");
     transporter.sendMail({
        to: req.body.email,
        from: "gulshany01@gmail.com",
        subject: "password Reset",
        html : `
        <p> you reset a password reset</p>
        <p>click this <a href="http://localhost:9000/passwordReset/${token}">link</a> to set the new password</p>

        `
      });
    })
    .catch(err =>{
      console.log(err);
    })

  })

}

exports.getNewPassword = (req, res, next) =>{
  const token = req.params.token;
  Costumer.findOne({resetToken: token, resetTokenExpiration:{$gt: Date.now()} })
  .then(costumer =>{
    res.render("newPassword",{
      pageTitle: "update new Password",
      errorMessage: req.flash("error"),
      costumer: 
    })
  }

  ).catch(err=>{
    console.log(err);
  })
  
}