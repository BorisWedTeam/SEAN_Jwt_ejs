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
var dateTime = require('node-datetime');

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
      //save the current time for last login
      var dt = dateTime.create();
      var formatted = dt.format('Y-m-d H:M:S');
      connection.query("update user set last_login = '"+formatted+"' where id = '"+user.id+"'", function (err, rows) {
        if(type == '0'){
          res.redirect('/login');
        }
        else if(type == '1'){
          console.log(user);
          res.cookie('user', user)
          .redirect('/dashboard');
        }
        else{
          res.redirect('/customers');
        }
      });

    });
  })(req, res, next);
});

router.post('/register', (req, res) => {
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
      if (!req.body.username || req.body.username.length < 4) {
        errors.push({ text: 'Username can\'t be empty or less than 4' })
      }

      if (!req.body.email) {
        errors.push({ text: 'Email can\'t be empty' })
      }

      if (!req.body.password) {
        errors.push({ text: 'Password can\'t be empty' })
      }
      if (!req.body.phone) {
        errors.push({ text: 'Phone number can\'t be empty' })
      }

      if (errors.length > 0) {
        res.render('register', {
          errors: errors,
          name: req.body.username,
          email: req.body.email,
          password: req.body.password
        })
      }
      else{
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
          res.render('register', {
            errors: errors,
            name: req.body.username,
            email: req.body.email,
            password: req.body.password
          })
        });
      }
      

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
  // connection.query("select * from user where type = 1", (err, rows) => {
    // if (err) { console.log(err) }
    res.render('customersadd')
  // });
});

router.post('/customer/add', verifyJWT, (req , res)=> {
  var name = req.body.customername;
  var id = req.body.customerid;
  var channel = req.body.channel;
  var status = req.body.status;
  var platforms = req.body.platform_st;

  var insertQuery = "INSERT INTO customers ( name, customer_id ,channel ,status) values ('" + name + "','" + id + "','" + channel + "','" + status + "')";
      connection.query(insertQuery, function (err, rows) {
        
        var insert_id = rows.insertId;
        //clear configs and resave
        connection.query("delete from platforms where customer_id = '"+rows.insertId+"'", function (err, rows) {
            var array = JSON.parse(platforms);
            array.forEach(function(element){
                var insertQuery = "insert into platforms (config_parameter, friendly_name, value, status, customer_id, app_title) values ('" + element.config_parameter + "','" + element.friendly_name + "','" + element.value + "','" + element.status + "','" + insert_id + "','" + element.app_title + "')";
                

                connection.query(insertQuery, function (err, rows) {
                  
                });
            });
        });
        res.redirect('/customers');
      });
});

router.post('/customer/edit/:customerid', verifyJWT, (req, res)=>{
  var customerid = req.params.customerid;

  var name = req.body.customername;
  var id = req.body.customerid;
  var channel = req.body.channel;
  var status = req.body.status;
  var platforms = req.body.platform_st;
  var updateQuery = "update customers set name = '"+name+"', customer_id = '"+id+"', channel = '"+channel+"', status = '"+status+"' where id = '"+customerid+"'";
  connection.query(updateQuery, function (err, rows) {
        
    //clear configs and resave
    connection.query("delete from platforms where customer_id = '"+customerid+"'", function (err, rows) {
        var array = JSON.parse(platforms);
        array.forEach(function(element){
            var insertQuery = "insert into platforms (config_parameter, friendly_name, value, status, customer_id, app_title) values ('" + element.config_parameter + "','" + element.friendly_name + "','" + element.value + "','" + element.status + "','" + customerid + "','" + element.app_title + "')";
           connection.query(insertQuery, function (err, rows) {
              
            });
        });
    });
    res.redirect('/customers');
  });
})

var picked_customer = {id: '',name:'', customer_id: '',channel:'', status: '', 'platforms':''};
router.get('/admin/customers/edit/:customerid', verifyJWT, (req, res) => {
    picked_customer = {id: '',name:'', customer_id: '', status: '', 'platforms':''};
    picked_customer.id = req.params.customerid;
    async.waterfall([
      function (cbk) {
        
        connection.query("select * from customers where id='"+req.params.customerid+"'", (err, rows) => {
          if (err) { console.log(err) }
          if(rows.length > 0){
            picked_customer.id = rows[0].id;
            picked_customer.name = rows[0].name;
            picked_customer.customer_id = rows[0].customer_id;
            picked_customer.status = rows[0].status;
            picked_customer.channel = rows[0].channel;
            picked_customer.platforms = '';
          }
          
          cbk()
        });
      },
    function (cbk) {
      
        connection.query("select * from platforms where customer_id = '"+req.params.customerid+"'", (err, rows) => {
          
          if (err) { console.log(err) }
          //picked_customer.platforms = JSON.stringify(rows);
          var rlt = {};
          if(rows.length > 0){
            
            rows.forEach(function(item){
              if(rlt[item.app_title]) rlt[item.app_title].push(item);
              else rlt[item.app_title] = [], rlt[item.app_title].push(item);
            })
            
          }
          picked_customer.platforms = JSON.stringify(rlt);
         
          cbk(null,picked_customer)
        });
      }
    

  ], function (err, results) { //async.waterfall final result

    res.render('customersadd',{customer : results});
    
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
var async = require('async');

var index_c = 0;
var customers = [];
var c_result = [];
router.get('/admin/customers', verifyJWT, (req , res)=>{
    async.waterfall([
        function (cbk) {
          customers = [];
          connection.query("select * from customers", (err, rows) => {
            if (err) { console.log(err) }
            customers = rows;
            cbk()
          });
        },
      function (cbk) {
        index_c = 0;
        c_result = [];
        
        for(var i =0 ; i < customers.length ; i++){
          var customer_id = customers[i].id;
          connection.query("select app_title from platforms where customer_id = '"+customer_id+"' group by app_title", (err, rows) => {
            
            if (err) { console.log(err) }
            var platform_array = [];
            rows.forEach(function(item){
                platform_array.push(item.app_title);
            });
            var item = {};
            
            item.id = customers[index_c].id;
            item.name = customers[index_c].name;
            item.customer_id = customers[index_c].customer_id;
            item.channel = customers[index_c].channel;
            item.status = customers[index_c].status;
            item.platforms =  platform_array.join(',');
            c_result.push(item);
            //cbk(null,rows)
            if(index_c == customers.length - 1){
              cbk(null,c_result)
            }
            index_c ++;
            //if(index_c == cu)
          });
        }
      }
    
    ], function (err, results) { //async.waterfall final result
    
      res.json(results);
    });
    
})

router.get('/admin/users', verifyJWT, (req , res) => {
  connection.query("call getAllUserAdmins(1)", (err, rows) => {
    if (err) { console.log(err) }
    var string=JSON.stringify(rows);
    // console.log(string);
    var json =  JSON.parse(string);
    console.log(json);
    // var rows = json[0];
    // console.log(rows);
    var finalRows = json[0];
    res.json(finalRows);
  });
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

router.get('/monetization/getpackages', verifyJWT, (req , res) => {
  var customerId = req.query.customerId;

  connection.query("select * from package where customerId="+customerId, (err, rows) => {
    if (err) { console.log(err) }
    res.json(rows);
  });
})
router.get('/monetization/deletePackage',verifyJWT,(req,res)=>{
  var packcageId = req.query.packageId;
  var sql1 = "DELETE FROM package WHERE id="+packcageId;
  var sql2 = "DELETE FROM package_sub WHERE packageId="+packcageId;
  connection.query(sql1,(err,result)=>{});
  connection.query(sql2,(err,result)=>{var response = {"err":0,success:true};res.json(response);});
})
router.get('/monetization/addMonetization',verifyJWT,(req,res)=>{
  var sql = "SELECT * FROM county ORDER BY `name`";
  connection.query(sql,(err,result)=>{
    res.render('addMonetization',{countries:result});
  })
})
router.get('/monetization/editPack/:packageId',verifyJWT,(req,res)=>{
  var packageId = req.params.packageId;
  var sql = "SELECT * FROM county ORDER BY `name`";
  connection.query(sql,(err,result)=>{
    var countries = result;
    var sql = "select * from package where id="+packageId;
    connection.query(sql,(err,rows)=>{
      var title = rows[0].title;
      var details = rows[0].details;
      res.render('editMonetization',{title:title,details:details,countries:countries,packageId:packageId});
    })
  })
})
router.get('/monetization/getLanguages',verifyJWT,(req,res)=>{
  var packageId = req.query.packageId;
  var sql = "SELECT package_sub.`packageId`,subscription.* FROM package_sub LEFT JOIN subscription ON package_sub.`subscriptionId` = subscription.`id` WHERE packageId="+packageId +" AND subscription.`id` IS NOT NULL";
  connection.query(sql,(err,result)=>{
    res.json(result);
  })
})
router.get('/monetization/editPackage',verifyJWT,(req,res)=>{
  var packageId = req.query.packageId;
  var packageTitle = req.query.packageTitle;
  var packcageDetail = req.query.packageDetail;
  var customerId = req.query.customerId;
  var languageIds = req.query.languageIds;
  var sql = "UPDATE package SET title='"+packageTitle+"',details='"+packcageDetail+"' WHERE id="+packageId;
  connection.query(sql,(err,result)=>{
    var sql1 = "DELETE FROM package_sub WHERE packageId="+packageId;
    connection.query(sql1,(err,result)=>{
      var sql2 = "INSERT INTO package_sub (packageId,subscriptionId) VALUES "
      for(var i = 0 ; i < languageIds.length;i++){
        sql2 = sql2+"("+packageId+","+languageIds[i]+"),";
      }
      if(languageIds.length>0){
        sql2 = sql2.slice(0,-1);
        console.log(sql2);
        connection.query(sql2,(err,result)=>{
          res.send("OK");
        });
      }
    })
  })
})

router.get("/monetization/addLanguage",verifyJWT,(req,res)=>{
  var countryId = req.query.countryId;
  var title = req.query.title;
  var price = req.query.price;
  var description = req.query.description;
  var duration = req.query.duration;
  var bannerUrl = req.query.bannerUrl;
  var sql = "insert into subscription (duration,title,price,description,banner,country) values ('"+duration+"','"+title+"','"+
    price+"','"+description+"','"+bannerUrl+"','"+countryId+"')";
    console.log(sql);
    connection.query(sql,function(err,result){
      res.send(result.insertId.toString());
    })
});
router.get("/monetization/removeLanguage",verifyJWT,(req,res)=>{
  var id = req.query.id;
  var sql = "delete from subscription where id=" + id;
  connection.query(sql,(err,result)=>{
    var sql1 = "delete from package_sub where subscriptionId="+id;
    connection.query(sql1,(err,result)=>{
      res.send("success");
    })
  })
})
router.get('/getCountries',verifyJWT,(req,res)=>{
  var sql = "SELECT * FROM county ORDER BY `name`";
  connection.query(sql,(err,result)=>{
    res.json(result);
  })
})
router.get('/monetization/addPackage',verifyJWT,(req,res)=>{
  var packageTitle = req.query.packageTitle;
  var packageDetail = req.query.packageDetail;
  var customerId = req.query.customerId;
  var languageIds = req.query.languageIds;
  var sql = "INSERT INTO package (title,details,customerId) VALUES('"+packageTitle+"','"+packageDetail+"',"+customerId+") ";
  console.log(sql);
  connection.query(sql,(err, rows)=>{
    console.log(rows);
    var packageId = rows.insertId;
    var sql2 = "INSERT INTO package_sub (packageId,subscriptionId) VALUES "
    for(var i = 0 ; i < languageIds.length;i++){
      sql2 = sql2+"("+packageId+","+languageIds[i]+"),";
    }
    if(languageIds.length>0){
      sql2 = sql2.slice(0,-1);
      console.log(sql2);
      connection.query(sql2,(err,result)=>{
        res.send("OK");
      });
    }
  })
})
router.get('/packages',verifyJWT,(req,res)=>{
  var customerName= req.query.app;
  var packages = [];
  var sql = "SELECT package.* FROM package LEFT JOIN customers ON package.`customerId` = customers.id WHERE customers.`name`='"+customerName+"'";
  connection.query(sql,(err,rows)=>{
    packages = rows;
    packages.forEach((i,idx,package) => {
      var sql1= "SELECT subscription.* FROM subscription RIGHT JOIN package_sub ON subscription.`id` = package_sub.`subscriptionId` WHERE package_sub.`packageId`="+packages[idx].id;
      console.log(sql1);
      connection.query(sql1,(err,result)=>{
        packages[idx].subscriptions = result;
        if (idx === packages.length - 1){ 
          res.json(packages);
        }
   
      })
    });
  });
})

router.get('/admin/users/delete/:userid', verifyJWT, (req , res) => {
  connection.query("delete from user where id='"+ req.params.userid +"'" , (err, rows) => {
    if (err) { console.log(err) }
    res.redirect('users');
  });
})

router.get('/admin/users/edit/:userid', verifyJWT, (req , res) => {
    connection.query("select * from user where id= '"+req.params.userid+"'", (err, rows) => {
        if (err) { console.log(err) }
        var user = rows[0];
        var customers_array = [];
        if(typeof user.customers !== 'undefined' && user.customers != ""){
          customers_array = user.customers.split(",")
        }
        var customers = JSON.stringify(customers_array);
        user.customers = customers;
        console.log(user);
        connection.query("select * from customers", (err, rows) => {
          if (err) { console.log(err) }
          res.render('usersadd', {data : user, customers: rows})
        });
    });
})


router.post('/admin/users/edit', verifyJWT, (req, res) => {
  let errors = [];
    if (!req.body.username || req.body.username.length < 4) {
      errors.push({ text: 'Username can\'t be empty or less than 4' })
    }

    if (!req.body.email) {
      errors.push({ text: 'Email can\'t be empty' })
    }

    if (!req.body.password) {
      errors.push({ text: 'Password can\'t be empty' })
    }
    if (!req.body.phone) {
      errors.push({ text: 'Phone number can\'t be empty' })
    }
    if (!req.body.user_id) {
      errors.push({ text: 'User Id can\'t be empty' })
    }

    if (errors.length > 0) {
      res.render('users', {
        errors: errors,
        id : req.body.user_id,
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone : req.body.phone
      })
    }

    var id = req.body.user_id;
    var username = req.body.username;
    var email = req.body.email;
    var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');;
    var phone = req.body.phone;
    var customers = req.body.user_channels;
    if(req.body.password != '*****'){
      var updateQuery = "Update user SET email = '"+email+"', username = '"+username+"', phone_number = '"+phone+"', password = '"+hash+"', customers = '"+customers+"' where id = '"+id+"'";
      connection.query(updateQuery, function (err, rows) {
          res.redirect('/users');
      });
    }
    else{
      var updateQuery = "Update user SET email = '"+email+"', username = '"+username+"', phone_number = '"+phone+"', customers = '"+customers+"' where id = '"+id+"'";
      connection.query(updateQuery, function (err, rows) {
          res.redirect('/users');
      });
    }
})

router.get('/mobileUsers/displayUsers',verifyJWT,(req,res)=>{
  res.render("mobileUsers/mobileUsers");
})
router.get('/mobileUsers/display',verifyJWT,(req,res)=>{
  var customerId = req.query.customerId;
  var sql = "SELECT mobile_users.id,email,fullName,county.`name` as country ,package.`title`,last_active,device_id,user_status FROM mobile_users LEFT JOIN county ON mobile_users.`countryId` = county.`id` LEFT JOIN package ON mobile_users.`package_id` = package.`id` WHERE customer_id="+customerId;
  connection.query(sql,(err,rows)=>{
    res.json(rows);
  })
})
router.get('/mobileUsers/add',verifyJWT,(req,res)=>{
  var sql = "SELECT * FROM county ORDER BY `name`";
  var countries = [];
  connection.query(sql,(err,result)=>{
    countries = result;
    // res.render('mobileUsers/add',{countries:result});

    var sql2 = "SELECT id,title FROM package";
    connection.query(sql2,(err,rows)=>{
      res.render('mobileUsers/add',{countries:countries,packages:rows});
    })

  })

})
module.exports = router;
