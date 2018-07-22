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

//Costos por defecto

  var costoDiaDeTrabajo = 30000;
  var costoMantenimientoPorImpresion = 100000;
  var costoLocalArriendo = 700000;
  var adicionalReserva = 10000; // 10.000
  var porcentajeUtilidad = 30; //30%


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

var option = "<option style='background: rgba(0, 0, 0, 0.3);' name='@value'>@nombre</option>";
var tempDiv = "";
var divFinal = "";

var input = "<input style='display:none;' name='idEmpresa' value='@id'></input>";
var tempInput = "";
var divFinal2 = "";
// index page 
app.get('/', function(req, res) {
    var consulta = "SELECT datosempresa.nombreEmpresa, usuario.idUsuario FROM usuario INNER JOIN datosempresa ON usuario.idUsuario = datosempresa.idUsuario";
    con.query(consulta, function (err, rows) {  
      rows.forEach(function(row) {
      tempDiv = option;
      tempDiv = tempDiv.replace('@value',row.idUsuario);
      tempDiv = tempDiv.replace('@nombre',row.nombreEmpresa);
      divFinal = tempDiv;

      tempInput = input;
      tempInput = tempInput.replace('@id',row.idUsuario);
      divFinal2 = tempInput;
      
      });
      res.render('pages/index',{
        empresas: divFinal,
        div2:divFinal2
      });
    });
});
app.get('/index.html', function(req, res) {
    var consulta = "SELECT datosempresa.nombreEmpresa, usuario.idUsuario FROM usuario INNER JOIN datosempresa ON usuario.idUsuario = datosempresa.idUsuario";
    con.query(consulta, function (err, rows) {  
      rows.forEach(function(row) {
      tempDiv = option;
      tempDiv = tempDiv.replace('@value',row.idUsuario);
      tempDiv = tempDiv.replace('@nombre',row.nombreEmpresa);
      divFinal = tempDiv;
      
      tempInput = input;
      tempInput = tempInput.replace('@id',row.idUsuario);
      divFinal2 = tempInput;
      
      });
      res.render('pages/index',{
        empresas: divFinal,
        div2:divFinal2
      });
    });
});

app.post('/cotizacionEnLinea', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields);
    var consulta = "SELECT * FROM costosexternosempresa WHERE idUsuario = "+fields.idEmpresa;
    con.query(consulta, function (err, rows) {
        if (err) throw err; 
        var iva = 0;
        if(rows.length>0){
          res.render('pages/cotizacionEnLinea',{
            diaLaboralCost : rows[0]. costoDiaDeTrabajo,
            MantenimientoPorImpresion :rows[0].costoMantenimientoPorImpresion,
            costoLocalArriendo: rows[0].costoLocalArriendo,
            costoInternoPorIntentos: rows[0].adicionalReserva,
            utilidad: rows[0].porcentajeUtilidad,
            IVA: rows[0].IVA
          });
        }else{
          res.render('pages/cotizacionEnLinea',{
            diaLaboralCost : costoDiaDeTrabajo,
            MantenimientoPorImpresion : costoMantenimientoPorImpresion,
            costoLocalArriendo: costoLocalArriendo,
            costoInternoPorIntentos: costoInternoPorIntentos,
            utilidad: porcentajeUtilidad,
            IVA: iva
          });
        }
    });    
  });
});


app.post('/registrarEmpresa', function(req, res) {
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var consulta = "SELECT * FROM `datosEmpresa` WHERE idUsuario = "+req.session.usrID;
      con.query(consulta, function (err, rows) {
        if (err) throw err; 
        if(rows.length>0){
        //UPDATE
        consulta = "UPDATE datosEmpresa SET nombreEmpresa='@nombreEmpresa',nitEmpresa='@nitEmpresa',direccionEmpresa='@direccionEmpresa',telefonoEmpresa='@telefonoEmpresa' WHERE idUsuario=@idUsuario";
        consulta = consulta.replace('@idUsuario',req.session.usrID);
        consulta = consulta.replace('@nombreEmpresa',fields.nombreEmpresa);
        consulta = consulta.replace('@nitEmpresa',fields.NIT);
        consulta = consulta.replace('@direccionEmpresa',fields.direccion);
        consulta = consulta.replace('@telefonoEmpresa',fields.telefono);
        console.log("UPDATE");
        console.log(consulta);
        con.query(consulta, function (err, rows) {
        if (err) throw err; 
          res.redirect("/datosEmpresa");
        });
        }else{
          //INSERT
          console.log("INSERT");
          consulta = "INSERT INTO `datosEmpresa` ( `idUsuario`, `nombreEmpresa`, `nitEmpresa`, `direccionEmpresa`, `telefonoEmpresa`) VALUES ( @idUsuario, '@nombreEmpresa', '@nitEmpresa', '@direccionEmpresa', '@telefonoEmpresa')";
          consulta = consulta.replace('@idUsuario',req.session.usrID);
          consulta = consulta.replace('@nombreEmpresa',fields.nombreEmpresa);
          consulta = consulta.replace('@nitEmpresa',fields.NIT);
          consulta = consulta.replace('@direccionEmpresa',fields.direccion);
          consulta = consulta.replace('@telefonoEmpresa',fields.telefono);
          console.  log(consulta);
          con.query(consulta, function (err, rows) {
          if (err) throw err; 
            res.redirect("/datosEmpresa");
          }); 
        }
      }); 
    });
});


//Formulario para agregar los costos internos de la empresa

app.get('/costosInternos', function(req, res) {
  var consulta = "SELECT * FROM `costosExternosEmpresa` WHERE idUsuario = "+req.session.usrID;
  con.query(consulta, function (err, rows) {
  if (err) throw err; 
  var iva = 0;
  if(rows.length>0){
    //Tabla de costos del cliente
    costoDiaDeTrabajo =  rows[0].costoDiaDeTrabajo;
    costoMantenimientoPorImpresion = rows[0].costoMantenimientoPorImpresion;
    costoLocalArriendo = rows[0].costoLocalArriendo;
    adicionalReserva = rows[0].adicionalReserva;
    porcentajeUtilidad = rows[0].porcentajeUtilidad;
    var iva = rows[0].IVA; 
  }
  res.render('pages/costos', {
        costoDiaDeTrabajo: costoDiaDeTrabajo,
        costoMantenimientoPorImpresion: costoMantenimientoPorImpresion,
        costoLocalArriendo: costoLocalArriendo,
        adicionalReserva: adicionalReserva,
        porcentajeUtilidad: porcentajeUtilidad,
        IVA:iva,
        datosEmpresaClass: 'active',
        main:'',
        pendent: '',
        registrarUsoImpresora: '',
        registrarImpresora: '',
        sistemaSupervision: ''
      });
  });
});


//Formulario para actualizar los costos internos
app.post('/actualizarCostosInternos', function(req, res) {
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var consulta = "SELECT * FROM `costosExternosEmpresa` WHERE idUsuario = "+req.session.usrID;
      con.query(consulta, function (err, rows) {
        if (err) throw err; 
        if(rows.length>0){
        //UPDATE
        consulta = "UPDATE costosExternosEmpresa SET IVA=@IVA, costoDiaDeTrabajo=@costoDiaDeTrabajo,costoMantenimientoPorImpresion=@costoMantenimientoPorImpresion,costoLocalArriendo=@costoLocalArriendo,adicionalReserva=@adicionalReserva,porcentajeUtilidad=@porcentajeUtilidad WHERE idUsuario=@idUsuario";
        consulta = consulta.replace('@idUsuario',req.session.usrID);
        consulta = consulta.replace('@costoDiaDeTrabajo',fields.costoDiaDeTrabajo);
        consulta = consulta.replace('@costoMantenimientoPorImpresion',fields.costoMantenimientoPorImpresion);
        consulta = consulta.replace('@costoLocalArriendo',fields.costoLocalArriendo);
        consulta = consulta.replace('@adicionalReserva',fields.adicionalReserva);
        consulta = consulta.replace('@porcentajeUtilidad',fields.porcentajeUtilidad);
        consulta = consulta.replace('@IVA',fields.IVA);
        console.log("UPDATE");
        console.log(consulta);
        con.query(consulta, function (err, rows) {
        if (err) throw err; 
          res.redirect("/costosInternos");
        });
        }else{
          //INSERT
          console.log("INSERT");
          consulta = "INSERT INTO `costosExternosEmpresa` ( `idUsuario`,`IVA`, `costoDiaDeTrabajo`, `costoMantenimientoPorImpresion`, `costoLocalArriendo`, `adicionalReserva`, `porcentajeUtilidad`) VALUES ( @idUsuario, @IVA, @costoDiaDeTrabajo, @costoMantenimientoPorImpresion, @costoLocalArriendo, @adicionalReserva, @porcentajeUtilidad)";
          consulta = consulta.replace('@idUsuario',req.session.usrID);
          consulta = consulta.replace('@costoDiaDeTrabajo',fields.costoDiaDeTrabajo);
          consulta = consulta.replace('@costoMantenimientoPorImpresion',fields.costoMantenimientoPorImpresion);
          consulta = consulta.replace('@costoLocalArriendo',fields.costoLocalArriendo);
          consulta = consulta.replace('@adicionalReserva',fields.adicionalReserva);
          consulta = consulta.replace('@porcentajeUtilidad',fields.porcentajeUtilidad);
          consulta = consulta.replace('@IVA',fields.IVA);
          console.  log(consulta);
          con.query(consulta, function (err, rows) {
          if (err) throw err; 
            res.redirect("/costosInternos");
          }); 
        }
      }); 
    });
});


//Formulario para agregar los datos de la empresa 
app.get('/datosEmpresa', function(req, res) {
  var consulta = "SELECT * FROM `datosEmpresa` WHERE idUsuario = "+req.session.usrID;
  con.query(consulta, function (err, rows) {
  if (err) throw err; 
  var nombreEmpresa = "";
  var NIT = "";
  var direccion = "";
  var telefono = "";
  console.log(rows.length);
  if(rows.length>0){
    nombreEmpresa = rows[0].nombreEmpresa;
    direccion = rows[0].direccionEmpresa;
    NIT = rows[0].nitEmpresa;
    telefono =  rows[0].telefonoEmpresa;
  }
    res.render('pages/datoEmpresa', {
        datosEmpresaClass: 'active',
        main:'',
        pendent: '',
        registrarUsoImpresora: '',
        registrarImpresora: '',
        sistemaSupervision: '',
        nombreEmpresa: nombreEmpresa,
        NIT:NIT,
        direccion:direccion,
        telefono:telefono
      });
    });
});

// Login 
app.get('/login', function(req, res) {
  if(req.session.usrID){
    //En caso que ya haya iniciado sesion
    res.redirect("/main");
   }else{ 
    res.render('pages/login');
  }
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
      datosEmpresaClass: '',
      main:'active',
      pendent: '',
      registrarUsoImpresora: '',
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
      datosEmpresaClass: '',
      main:'',
      pendent: 'active',
      registrarUsoImpresora: '',
      registrarImpresora: '',
      sistemaSupervision: ''
    });
});
// registrar filamento 
app.get('/registrarFilamento', function(req, res) {
    res.render('pages/registrarFilamento', {
      datosEmpresaClass: '',
      main:'',
      pendent: '',
      registrarUsoImpresora: 'active',
      registrarImpresora: '',
      sistemaSupervision: ''
    });
});

// registrar impresora 
var impresoraDiv = "<form onclick='enviar(this.id)' id='printer@id' method='POST' action='/registrarFilamento'><input type='Text' name='idImpresora' value='@id' style='display:none'><div class='col-md-3'><div class='well dash-box'><h2><img src='/icons/printer.ico' style='width: 80px;height: 80px;'/><div></div><span class=''></span>&nbsp&nbsp @Nombre</h2><h4>@Version</h4></div></div></form>";
var divFinal = ""; //En este div quedan las etiquetas finales
var divTemp = ""; //En este div se cargan los datos temporalmente
app.get('/registrarImpresora', function(req, res) {
    if(req.session.usrID){
      var idUsuario =  req.session.usrID;
      var consulta = "SELECT * FROM `impresora` INNER JOIN usuario ON impresora.IDUsuario=usuario.idUsuario WHERE impresora.IDUsuario = "+idUsuario;
      console.log(consulta);
      con.query(consulta, function (err, rows) {
      if (err) throw err;
      var divFinal = ""; //En este div quedan las etiquetas finales
      var divTemp = ""; //En este div se cargan los datos temporalmente
      rows.forEach(function(row) {
        divTemp = impresoraDiv;
        divTemp = divTemp.replace('@id',row.idImpresora);
        divTemp = divTemp.replace('@id',row.idImpresora);
        divTemp = divTemp.replace('@Nombre',row.nombreImpresora);
        divTemp = divTemp.replace('@Version',row.tamanoCamaCaliente);
        divFinal +=divTemp;
      });
      res.render('pages/registrarImpresora', {
          datosEmpresaClass: '',
          main:'',
          pendent: '',
          registrarUsoImpresora: '',
          registrarImpresora: 'active',
          sistemaSupervision: '',
          impresoras: divFinal
        });
      });
    }else{
      res.redirect("/index.html");
    }
});
// sistema de supervision 
app.get('/sistemaSupervision', function(req, res) {
    res.render('pages/sistemaSupervision', {
      datosEmpresaClass: '',
      main:'',
      pendent: '',
      registrarUsoImpresora: '',
      registrarImpresora: '',
      sistemaSupervision: 'active'
    });
});


// Visor del sistema de supervision  (general)
app.get('/generalStatus', function(req, res) {
    res.render('pages/generalStatus' ,{
      datosEmpresaClass: '',
      main:'',
      pendent: '',
      registrarUsoImpresora: '',
      registrarImpresora: '',
      sistemaSupervision: 'active'
    });
});


// Visor de una temperatura especifica 
app.get('/mostrarTemperatura', function(req, res) {
    res.render('pages/mostrarTemperatura',{
      datosEmpresaClass: '',
      main:'',
      pendent: '',
      registrarUsoImpresora: '',
      registrarImpresora: '',
      sistemaSupervision: 'active'
    });
});


// Visor de archivos 
app.get('/reporteImpresion', function(req, res) {
    res.render('pages/reportarIntento',{
      datosEmpresaClass: '',
      main:'',
      pendent: 'active',
      registrarUsoImpresora: '',
      registrarImpresora: '',
      sistemaSupervision: ''
    });
});

// Agregar filamento a impresora 
app.get('/configurarFilamento', function(req, res) {
    res.render('pages/registrarFilamento',{
      datosEmpresaClass: '',
      main:'',
      pendent: '',
      registrarUsoImpresora: '',
      registrarImpresora: 'active',
      sistemaSupervision: ''
    });
});
// Agregar filamento a impresora
var divFilamento = "<form id='eliminarFilamento@filaID'><div class='col-md-3'><div class='well dash-box'><h2>@filanombre</h2><h2><img src='/icons/filamento.ico' style='width: 80px;height: 80px;'/><div></div><span class=' aria-hidden='true'></span>&nbsp&nbsp @filaLargo Mt </h2><h4>@filaTipo <input style='width: 90px;height: 30px;' class='jscolor' name='color' value='@filaColor'/>  </h4></div></div></form>";
var divFilaTemp = "";
var divFilaFinal = ""; 
app.post('/registrarFilamento', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var idPrinter = fields.idImpresora;
      consulta = "SELECT * FROM `filamento` WHERE idImpresora ="+idPrinter+" and idUsuario="+req.session.usrID;
      console.log(consulta);
      con.query(consulta, function (err, rows) {
        if (err) throw err;
        divFilaFinal = ""; //En este div quedan las etiquetas finales
        divFilaTemp = ""; //En este div se cargan los datos temporalmente
        rows.forEach(function(row) {
          divFilaTemp = divFilamento;
          divFilaTemp = divFilaTemp.replace('@filaID',row.idFilamento);
          divFilaTemp = divFilaTemp.replace('@filanombre',row.nombreFilamento);
          divFilaTemp = divFilaTemp.replace('@filaLargo',row.numeroMetros);
          divFilaTemp = divFilaTemp.replace('@filaColor',row.colorFilamento);
          divFilaTemp = divFilaTemp.replace('@filaTipo',row.tipoFilamento);
          divFilaFinal += divFilaTemp;
        });        
          //console.log(divFilaFinal);
          res.render('pages/registrarFilamento',{
            datosEmpresaClass: '',
            main:'',
            pendent: '',
            registrarUsoImpresora: '',
            registrarImpresora: 'active',
            sistemaSupervision: '',
            idImpresora: idPrinter,
            filamentos: divFilaFinal
          
        });
      });
  });
});
//Agregar el filamento a la impresora seleccionada
app.post('/agregarFilamento', function(req, res) {
  if(req.session.usrID){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    var consulta = "INSERT INTO `filamento` (`idImpresora`, `idUsuario`, `nombreFilamento`, `tipoFilamento`, `colorFilamento`, `numeroMetros`, `pesoFilamento`, `diametroFilamento`, `costoFilamento`) VALUES (@idImpresora, @idUsuario, '@nombreFilamento', '@tipoFilamento', '@colorFilamento', @numeroMetros, @pesoFilamento, @diametroFilamento, @costoFilamento)";
    consulta = consulta.replace('@idImpresora',fields.idImpresora);
    consulta = consulta.replace('@idUsuario',req.session.usrID);
    consulta = consulta.replace('@nombreFilamento',fields.filaNombre);
    consulta = consulta.replace('@tipoFilamento',fields.filaTipo);
    consulta = consulta.replace('@colorFilamento',fields.color);
    consulta = consulta.replace('@numeroMetros',fields.metros);
    consulta = consulta.replace('@pesoFilamento',fields.gramos);
    consulta = consulta.replace('@diametroFilamento',fields.diametro);
    consulta = consulta.replace('@costoFilamento',fields.costoFila);    
    //console.log(consulta);
    con.query(consulta, function (err, rows) {
    if (err) throw err;

    consulta = "SELECT * FROM `filamento` WHERE idImpresora ="+fields.idImpresora+" and idUsuario="+req.session.usrID;
    console.log(consulta);
    con.query(consulta, function (err, rows) {
      if (err) throw err;
      divFilaFinal = ""; //En este div quedan las etiquetas finales
      divFilaTemp = ""; //En este div se cargan los datos temporalmente
      rows.forEach(function(row) {
        divFilaTemp = divFilamento;
        divFilaTemp = divFilaTemp.replace('@filaID',row.idFilamento);
        divFilaTemp = divFilaTemp.replace('@filanombre',row.nombreFilamento);
        divFilaTemp = divFilaTemp.replace('@filaLargo',row.numeroMetros);
        divFilaTemp = divFilaTemp.replace('@filaColor',row.colorFilamento);
        divFilaTemp = divFilaTemp.replace('@filaTipo',row.tipoFilamento);
        divFilaFinal += divFilaTemp;        
      });
      console.log(divFilaFinal);
      res.render('pages/registrarFilamento',{
        datosEmpresaClass: '',
        main:'',
        pendent: '',
        registrarUsoImpresora: '',
        registrarImpresora: 'active',
        sistemaSupervision: '',
        idImpresora: fields.idImpresora,
        filamentos: divFilaFinal
      
      });  
    });
  });
 });
}else{
    res.redirect("/index.html");
   }
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