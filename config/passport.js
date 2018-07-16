const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');

var config = require('./config.js')

var connection = mysql.createConnection({
    host: config.localhost,
    user: config.user,
    password: config.password,
    database: config.database
});

module.exports = function (passport) {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password'
        }, (email, password, done) => {
          // Match user
          connection.query("select * from user where email = '" + email + "'", (err, rows) => {
            if (rows.length < 1) {
              console.log(rows);
              return done();
            }
            var hash = crypto.createHash('sha256').update(password).digest('base64');
            if (rows[0].password == hash) {
              if (err) console.log(err);
              var newUserMysql = new Object();

              newUserMysql.email = rows[0].email;
              newUserMysql.username = rows[0].username;
              newUserMysql.id = rows[0].id;
              newUserMysql.password = rows[0].password;
              newUserMysql.type = rows[0].type;
              newUserMysql.token = '';
              jwt.sign({
                data: newUserMysql
              }, 'secrethhhhh', { expiresIn: 3000 }, (err, token) => {
                newUserMysql.token = token;
                if(rows[0].customers==''||rows[0].customers==undefined||rows[0].customers==null){
                  newUserMysql.customers =[];
                  return done(null, newUserMysql);
                }
                var sql = "SELECT id,name FROM customers WHERE id in ("+rows[0].customers+")";
                connection.query(sql, (err, crows) => {
                  var customers = crows;
                  newUserMysql.customers = customers;
                  return done(null, newUserMysql);
                });
                
              });
            } else {
              return done(null, false, { message: 'Password Incorrect' });
            }
          })
        }));
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });
}
