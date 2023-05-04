const Post = require("./models/Post");
const express = require("express")
const ImagePost = require("./models/ImagePost");
const BasePost = require("./BasePost")
console.log("Route  File")
const multer = require("multer");


class AuthMediator {
  constructor(passport) {
    this.passport = passport;
  }

  authenticate(req, res, next) {
    this.passport.authenticate("local-login", {
      successRedirect: "/newpost",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  }
  authenticateSignup(req, res, next) {
    this.passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true,
    })(req, res, next);
  }
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
}


class Routes {
  constructor(app, passport) {
    this.app = app;
    this.passport = passport;
    this.authMediator = new AuthMediator(this.passport);
    // this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  init() {
    // console.log("Route Entered", this.passport)
    this.app.get("/", this.renderIndex.bind(this));
    this.app.get("/login", this.renderLogin.bind(this));
    this.app.post("/login", this.authMediator.authenticate.bind(this.authMediator));
    this.app.get("/signup", this.renderSignup.bind(this));
    this.app.post("/signup", this.authMediator.authenticateSignup.bind(this.authMediator));
    this.app.get("/profile", this.authMediator.isLoggedIn.bind(this.authMediator), this.renderProfile.bind(this));
    this.app.get("/newpost", this.authMediator.isLoggedIn.bind(this.authMediator), this.renderNewPost.bind(this));
    this.app.post("/blogpost", this.authMediator.isLoggedIn.bind(this.authMediator), this.processBlogPost.bind(this));
    this.app.get("/blog", this.renderBlogPage.bind(this));
    this.app.get("/logout", this.logout.bind(this));
  }

  renderIndex(req, res) {
    res.render("index.ejs");
  }

  renderLogin(req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
    
  }

  authenticateLogin(req, res, next) {
    console.log("About to login", this.passport)
    this.passport.authenticate("local-login", {
      successRedirect: "/newpost",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  }

  renderSignup(req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  }

  authenticateSignup(req, res, next) {
    this.passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true,
    })(req, res, next);
  }

  renderProfile(req, res) {
    res.render("profile.ejs", { user: req.user });
  }

  renderNewPost(req, res) {
    res.render("blogPost.ejs", { user: req.user });
  }

  processBlogPost(req, res) {
    if(req.body.image != ""){
      console.log("Has Image")
      const imagePost = new PhotoPost;
      imagePost.createPost(req, res)
      
    }else{
      const articlePost = new ArticlePost;
      articlePost.createPost(req, res)
    }
    
    
    
  }

  renderBlogPage(req, res) {
    Post.find({}, (err, posts) => {
      if (err) throw err;
      res.render("blogPage.ejs", { posts });
    });
  }

  logout(req, res) {
    req.logout();
    res.redirect("/");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}


class ArticlePost extends BasePost {
  constructor() {
    super();
  }

  validatePostData(req, res) {
    console.log("Article Side");
    // Additional validation for ArticlePost
    if(req != null){
      this.savePostToDb(req, res)
    }
  }

  savePostToDb(req, res) {
    // Saving logic for ArticlePost
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      user_id: req.user.id,
    });
    post.save();
    this.rerouteToBlog(res)
  }

  rerouteToBlog(res) {
    // Notification logic for ArticlePost
    res.redirect("/blog");
  }
}

class PhotoPost extends BasePost {
  constructor() {
    super();
  }

  validatePostData(req, res) {
    
      // use multer middleware to handle file upload
      // define multer storage engine
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    this.upload = multer({ storage: this.storage });

    this.upload.single("image")(req, res, (err) => {
      if (err) {
        console.log("Error uploading image file:", err);
      } else {
        // if the file was uploaded successfully, set the image filename
        if (req.file) {
          
        }
      }})
      this.savePostToDb(req, res)
  }

  savePostToDb(req, res) {
    console.log("title: " + req.body.title)
    // Saving logic for ArticlePost
    const photoPost = new Post({
      title: req.body.title,
      content: req.body.content,
      user_id: req.user.id,
      imagePath: req.body.image,
    });
    photoPost.save();
    this.rerouteToBlog(res)
  }

  rerouteToBlog(res) {
    // Notification logic for ArticlePost
    res.redirect("/blog");
  }
}
module.exports = Routes;
