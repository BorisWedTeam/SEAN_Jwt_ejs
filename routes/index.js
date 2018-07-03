const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
var crypto = require('crypto');

const { verifyJWT, unVerifyJWT } = require('../helpers/auth');

var config = require('../config/config.js');
var constants = require('../config/constant.js');
var connection = mysql.createConnection({
  host: config.localhost,
  user: config.user,
  password: config.password,
  database: config.database
});

router.get('/dashboard', verifyJWT, (req, res) => {
  var user = req.cookies.user;
  res.render('index', user);
})

router.get('/2', verifyJWT, (req, res) => {
  res.send('hiii');
})

router.get('/register', unVerifyJWT, (req, res) => {
  res.render('register');
})

router.get('/', unVerifyJWT, (req, res) => {
  res.render('login');
})

router.get('/login', unVerifyJWT, (req, res) => {
  res.render('login');
})
router.get('/monetization/subscription',verifyJWT,(req,res)=>{
  res.render('subscription');
})
router.get('/monetization/savdAd',verifyJWT,(req,res)=>{
  var preRollUrl = req.query.preRollInput;
  var preRollCheck = req.query.preRollCheck?1:0;
  var midRollUrl = req.query.midRollInput;
  var midRollCheck = req.query.midRollCheck?1:0;
  var postRollUrl = req.query.postRollInput;
  var postRollCheck = req.query.postRollCheck?1:0;
  var displayAds = req.query.displayAds;
  var displayAdsCheck = req.query.displayAdsCheck?1:0;

  var sql1 = "UPDATE advertisement SET colValue='"+preRollUrl+"',colCheck="+preRollCheck+" WHERE colName='"+constants.PRE_ROLL_COL+"' ";
  connection.query(sql1,(err,result)=>{console.log(err);});
  var sql2 = "UPDATE advertisement SET colValue='"+midRollUrl+"',colCheck="+midRollCheck+" WHERE colName='"+constants.MID_ROLL_COL+"' ";
  connection.query(sql2,(err,result)=>{console.log(err);});
  var sql3 = "UPDATE advertisement SET colValue='"+postRollUrl+"',colCheck="+postRollCheck+" WHERE colName='"+constants.POST_ROLL_COL+"' ";
  connection.query(sql3,(err,result)=>{console.log(err);});
  var sql4 = "UPDATE advertisement SET colValue='"+displayAds+"',colCheck="+displayAdsCheck+" WHERE colName='"+constants.DISPLAY_ADS_COL+"' ";
  connection.query(sql4,(err,result)=>{
    console.log(err);
    res.redirect('/monetization/advertisement')
  });


})
router.get('/monetization/advertisement',verifyJWT,(req,res)=>{
  connection.query("SELECT * FROM advertisement", (err, rows) => {
    if (err) { console.log(err) }
    if (rows.length > 0) {
      var data ={
        preRollUrl:rows[0].colValue,
        preRollCheck:rows[0].colCheck,
        midRollUrl:rows[1].colValue,
        midRollCheck:rows[1].colCheck,
        postRollUrl:rows[2].colValue,
        postRollCheck:rows[2].colCheck,
        displayAdsValue:rows[3].colValue,
        displayAdsCheck:rows[3].colCheck
      }
      // console.log(rows);
      // console.log(data);
      res.render('advertisement',data);
    }
  });
})

router.post('/login', function (req, res, next) {
  /* look at the 2nd parameter to the below call */
  let errors = [];
  if (!req.body.password || !req.body.email) {
    req.flash('error_msg', 'please enter email and password');
    res.redirect('/login')
  }
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error_msg', 'your email or password is not correct');
      res.redirect('/login')
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      var type = user.type;
      // if(type == '2'){
      //   res.redirect('/admin')
      // }
      // else if(type=='1'){
      //   res.redirect('/dashboard')
      // }
      if(type == '0'){
        res.redirect('/login');
      }
      else if(type == '1'){
        res.cookie('user', user)
        .redirect('/dashboard');
      }
      else{
        res.redirect('/customers');
      }
    });
  })(req, res, next);
});

router.post('/register', (req, res) => {
  console.log(req.body);
  let errors = [];
  connection.query("select * from user where email = '" + req.body.email + "'", (err, rows) => {
    if (err) { console.log(err) }
    if (rows.length > 0) {
      errors.push({ text: 'sorry this email already exist' });
      res.render('register', {
        errors: errors,
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone : req.body.phone
      })
    }
    else {
      // if (!req.body.username || req.body.username.length < 4) {
      //   errors.push({ text: 'Username can\'t be empty or less than 4' })
      // }

      // if (!req.body.email) {
      //   errors.push({ text: 'Email can\'t be empty' })
      // }

      // if (!req.body.password) {
      //   errors.push({ text: 'Password can\'t be empty' })
      // }

      // if (errors.length > 0) {
      //   res.render('register', {
      //     errors: errors,
      //     name: req.body.username,
      //     email: req.body.email,
      //     password: req.body.password
      //   })
      // }
      var newUserMysql = new Object();

      newUserMysql.email = req.body.email;
      newUserMysql.username = req.body.username;
      newUserMysql.password = req.body.password;
      newUserMysql.phone = req.body.phone;

      var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
      newUserMysql.password = hash;
      var insertQuery = "INSERT INTO user ( email, username, password , phone_number ) values ('" + req.body.email + "','" + req.body.username + "','" + newUserMysql.password + "','" + newUserMysql.phone + "')";
      connection.query(insertQuery, function (err, rows) {
        req.flash('success_msg', 'User Registered');
        res.redirect('/');
      });

    }
  })
})

router.get('/logout', (req, res) => {
  req.user = '';
  req.logout();
  res.clearCookie('user');
  res.redirect('/');
})

router.get('/customers', verifyJWT, (req, res) => {
    res.render('customers');
});

router.get('/users', verifyJWT, (req, res) => {
  res.render('users');
});

router.get('/customers/add', verifyJWT, (req, res) => {
  res.render('customersadd');
});

router.post('/customer/add', verifyJWT, (req , res)=> {
  var name = req.body.customername;
  var id = req.body.customerid;
  var insertQuery = "INSERT INTO customers ( name, customer_id ) values ('" + name + "','" + id + "')";
      connection.query(insertQuery, function (err, rows) {
        res.redirect('/customers');
      });
});

router.get('/admin/customers/delete/:customerid', verifyJWT, (req, res) => {
    
    connection.query("delete from customers where id='"+ req.params.customerid +"'" , (err, rows) => {
        if (err) { console.log(err) }
        res.render('customers');
    });
});

router.get('/admin', verifyJWT, (req , res) => {

  res.render('index',{type:'2'});
})

router.get('/admin/customers', verifyJWT, (req , res)=>{
    connection.query("select * from customers", (err, rows) => {
        if (err) { console.log(err) }
        res.json(rows);
    });
})
module.exports = router;
