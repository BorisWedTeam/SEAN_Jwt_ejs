const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const ejs = require('ejs');

require('./config/passport')(passport);
const app = express();


// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));
app.use('/assets',express.static(__dirname + '/public/assets/'));
app.use('/images',express.static(__dirname + '/public/images/'));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
})
 
// parse application/json

var index = require('./routes/index');
app.use('/', index);

var port = process.env.PORT || 3100;

app.listen(port, () => {
    console.log(`Connected on port ${port}`)
})