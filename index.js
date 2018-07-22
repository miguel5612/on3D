// load the things we need
var express = require('express');
var app = express();
//to upload files 
var formidable = require('formidable');
var fs = require('fs');
//formateo de la fecha
var dateFormat = require('dateformat');
//Conexion mySQL
var mysql = require('mysql');
//SQL Configuration
var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  port:3306,
  database:"ON3D"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// Server configs
var port = 8000;
//Sesiones en nodejs
var cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Secure is Recommeneded, However it requires an HTTPS enabled website (SSL Certificate)
        maxAge: 864000000 // 10 Days in miliseconds
    }
}))


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
//registro e inicio de sesion
app.post('/iniciarSesion', function(req, res) {
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(fields);
      if(fields.chk1){
        consulta = "SELECT idUsuario FROM usuario WHERE email = '"+fields.email+"' AND contrasena='"+fields.contrasena+"'";
        con.query(consulta, function (err, result) {
        if (err) throw err;
        console.log(result.length); 
          if(result.length>0){
            var id = parseInt(result[0].idUsuario);
            req.session.usrID = id;
            console.log("bienvenido usuario: "+id);
            res.redirect("/main");
          }else{res.redirect("/login");}
        });
        console.log("login");
      }else if(fields.chk2){
        console.log("register");
        var consulta = "SELECT COUNT(*) as total FROM usuario WHERE email='"+fields.email+"'";
         con.query(consulta, function (err, result) {
         if (err) throw err;
         //Aqui se identifica si el usuario ya estaba registrado, caso contrario -- lo registramos :)
          if(parseInt(result[0].total) == 0){
            consulta = "INSERT INTO usuario (`email`, `contrasena`, `usuarioActivo`) VALUES ('"+fields.email+"','"+fields.contrasena+"',"+1+")";
            console.log(consulta);
            con.query(consulta, function (err, result) {
            if (err) throw err;
            console.log("usuario registrado exitosamente :)");
              //En caso que el id de usuario no se encuentren en sesion, lo guardamos
              consulta = "SELECT idUsuario FROM usuario WHERE email = '"+fields.email+"'";
              con.query(consulta, function (err, result) {
              if (err) throw err; 
              var id = result[0].idUsuario;
              req.session.usrID = id;
              console.log("bienvenido usuario: "+id);
              res.redirect("/main");
              });
            });
          }else{console.log("Redirecciono por que el mail esta en uso"); res.redirect("/index.html")};
        }); 
      }
    });
});

//registro de una impresora
app.post('/addPrinter', function(req, res) {
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    var filamento = "";
    if(fields.PLA){filamento = "PLA"}
    else if(fields.ABS){filamento = "ABS"}
    else if(fields.Flexi){filamento = "Flexible"}
    var consulta = "INSERT INTO impresora (`IDUsuario`, `nombreImpresora`, `tamanoCamaCaliente`, `tipoFilamento`) VALUES ("+req.session.usrID+",'"+fields.printerName+"','"+fields.tamanoImpresora+"','"+filamento+"')";
    console.log(consulta);
    con.query(consulta, function (err, result) {
    if (err) throw err; 
    res.redirect("/registrarImpresora");
    });
  });
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
  console.log(req.session.usrID);
  if(req.session.usrID){
    res.render('pages/paginaPrincipal', {
      main:'active',
      pendent: '',
      registrarFilamento: '',
      registrarImpresora: '',
      sistemaSupervision: ''
    });
  }else{
    res.redirect("/index.html");
  }
});
// Trabajo pendiente 
app.get('/pendent', function(req, res) {
    res.render('pages/trabajoPendiente', {
      main:'',
      pendent: 'active',
      registrarFilamento: '',
      registrarImpresora: '',
      sistemaSupervision: ''
    });
});
// registrar filamento 
app.get('/registrarFilamento', function(req, res) {
    res.render('pages/registrarFilamento', {
      main:'',
      pendent: '',
      registrarFilamento: 'active',
      registrarImpresora: '',
      sistemaSupervision: ''
    });
});

// registrar impresora 
app.get('/registrarImpresora', function(req, res) {
    res.render('pages/registrarImpresora', {
      main:'',
      pendent: '',
      registrarFilamento: '',
      registrarImpresora: 'active',
      sistemaSupervision: ''
    });
});
// sistema de supervision 
app.get('/sistemaSupervision', function(req, res) {
    res.render('pages/sistemaSupervision', {
      main:'',
      pendent: '',
      registrarFilamento: '',
      registrarImpresora: '',
      sistemaSupervision: 'active'
    });
});


// Visor del sistema de supervision  (general)
app.get('/generalStatus', function(req, res) {
    res.render('pages/generalStatus' ,{
      main:'',
      pendent: '',
      registrarFilamento: '',
      registrarImpresora: '',
      sistemaSupervision: 'active'
    });
});


// Visor de una temperatura especifica 
app.get('/mostrarTemperatura', function(req, res) {
    res.render('pages/mostrarTemperatura',{
      main:'',
      pendent: '',
      registrarFilamento: '',
      registrarImpresora: '',
      sistemaSupervision: 'active'
    });
});


// Visor de archivos 
app.get('/reporteImpresion', function(req, res) {
    res.render('pages/reportarIntento',{
      main:'',
      pendent: 'active',
      registrarFilamento: '',
      registrarImpresora: '',
      sistemaSupervision: ''
    });
});

// Agregar filamento a impresora 
app.get('/configurarFilamento', function(req, res) {
    res.render('pages/configurarFilamento',{
      main:'',
      pendent: '',
      registrarFilamento: '',
      registrarImpresora: 'active',
      sistemaSupervision: ''
    });
});




// Intento de impresion 
app.post('/enviarIntento', function(req, res) {
    //si la impresion salio bien se debe imprimir la factura y enviar al correo del cliente
    res.render('pages/facturaEnLinea');
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