// load the things we need
var express = require('express');
var app = express();

var port = 8000;

// set static folder

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});
app.get('/index.html', function(req, res) {
    res.render('pages/index');
});

// Login 
app.get('/login', function(req, res) {
    res.render('pages/login');
});

// Cotizar tu impresion 
app.get('/cotizacionEnLinea', function(req, res) {
    res.render('pages/cotizacionEnLinea');
});
// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(port);
console.log(port+' is the magic port');