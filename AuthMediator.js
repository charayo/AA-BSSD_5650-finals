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

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
}