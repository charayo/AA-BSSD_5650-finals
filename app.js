// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const config = require('./config.json');

const mongoose = require('mongoose');
class MyApp {
  constructor(config) {
    this.config = config;
    this.app = express();
    this.setup();
    this.listen();
  }

  async connectToDb() {
    try {
      await mongoose.connect(this.config.mongodb, {dbName: "mongooseDB"});
      console.log('connection successful');
    } catch (error) {
      console.error(error);
    }
  }

  setup() {
    // Connect to DB
    this.connectToDb();

    // Configure app
    this.app.set('view engine', 'ejs');
    this.app.use(bodyParser.urlencoded({ extended: true })); //parse incoming request for post body
    this.app.use(bodyParser.json());
    this.app.use(session({secret: 'pandas', resave:true, saveUninitialized: true}))
    this.app.use(flash());
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // passportConfig.
    const PassportConfig = require("./PassportConfig");
    const passportConfig = new PassportConfig(passport);
    passportConfig.serializeUser();
    passportConfig.deserializeUser();
  
    // Register passport strategies
    passportConfig.signup();
    passportConfig.login();
    

    const Routes = require("./Routes");
    const routes = new Routes(this.app, passport);
    routes.init()
  }

  listen() {
    this.app.listen(this.config.port);
    console.log(`listening on http://${this.config.host}${this.config.port}`);
  }
}


const app = new MyApp(config);
