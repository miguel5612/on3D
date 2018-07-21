// load the things we need
var express = require('express');
var app = express();
//to upload files 
var formidable = require('formidable');
var fs = require('fs');
//formateo de la fecha
var dateFormat = require('dateformat');

// Server configs
var port = 8000;

// set static folder

app.use(express.static('public'));
app.use(express.static('public/css'));
app.use(express.static('public/img'));
app.use(express.static('public/js'));
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
// Subir tu archivo al SV
app.post('/subirSTL', function(req, res) {
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.archivoupload.path;
      var newpath = __dirname + "/public/STL/" + files.archivoupload.name;
      console.log("NEW PATH IS " + newpath);
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        var nombreArchivo = files.archivoupload.name;
        console.log(fields);
        var porcentajeImputestosVar = 0;
        var costoImpuestoVar = parseInt(porcentajeImputestosVar) * parseInt(fields.costoGeneral);
        res.render('pages/printCotizacion',{
          servicioImpresion : "Impresion 3D ("+files.archivoupload.name+")",
          costoImpresionUni : fields.costoGeneral,
          costoImpresionTotal : fields.costoGeneral,
          porcentajeImputestos : porcentajeImputestosVar,
          costoImpuesto : costoImpuestoVar,
          costoSubtotal : parseInt(fields.costoGeneral),
          costoTotal : parseInt(fields.costoGeneral) + parseInt(costoImpuestoVar),
          costoAbono :  (parseInt(fields.costoGeneral) + parseInt(costoImpuestoVar))/2,
          nombreEmpresa: "CED 3D",
          linkCondiciones: "CEDLEGAL",
          direccion: "calle 22 numero barrio nn",
          fechaEntrega: dateFormat(new Date(),"yyyy.mm.dd hh:mm"),
          fechaPagoAbono: dateFormat(new Date(),"yyyy.mm.dd hh:mm"),
          emailCliente: "client@customer.com",
          emailProveedor: "proveedor@hotmail.com"
        });
      });
    });
});
// generacion de la orden de impresion
app.post('/imprimirPieza', function(req, res) {
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.archivoupload.path;
      var newpath = __dirname + "/public/STL/" + files.archivoupload.name;
      console.log("NEW PATH IS " + newpath);
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        var nombreArchivo = files.archivoupload.name;
        console.log(fields);
        var porcentajeImputestosVar = 0;
        var costoImpuestoVar = parseInt(porcentajeImputestosVar) * parseInt(fields.costoGeneral);
        res.render('pages/printCotizacion',{
          servicioImpresion : "Impresion 3D ("+files.archivoupload.name+")",
          costoImpresionUni : fields.costoGeneral,
          costoImpresionTotal : fields.costoGeneral,
          porcentajeImputestos : porcentajeImputestosVar,
          costoImpuesto : costoImpuestoVar,
          costoSubtotal : parseInt(fields.costoGeneral),
          costoTotal : parseInt(fields.costoGeneral) + parseInt(costoImpuestoVar),
          costoAbono :  (parseInt(fields.costoGeneral) + parseInt(costoImpuestoVar))/2,
          nombreEmpresa: "CED 3D",
          linkCondiciones: "CEDLEGAL",
          direccion: "calle 22 numero barrio nn",
          fechaEntrega: dateFormat(new Date(),"yyyy.mm.dd hh:mm"),
          fechaPagoAbono: dateFormat(new Date(),"yyyy.mm.dd hh:mm"),
          emailCliente: "client@customer.com",
          emailProveedor: "proveedor@hotmail.com"
        });
      });
    });
});


// Pagina principal de usuarios 
app.get('/main', function(req, res) {
    res.render('pages/paginaPrincipal');
});

// Visor de archivos 
app.get('/imprimirCotizacion', function(req, res) {
    res.render('pages/printCotizacion');
});

// Visor de archivos 
app.get('/visorArchivos', function(req, res) {
    res.render('pages/visorArchivos');
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(port);
console.log(port+' is the magic port');