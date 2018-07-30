// load the things we need
var express = require('express');
var app = express();
//to upload files 
var formidable = require('formidable');
var fs = require('fs');
//formateo de la fecha
var dateFormat = require('dateformat');
//Suma y resta de fechas
var moment = require('moment-business-time');
//Creacion de PDF
PDFDocument = require('pdfkit');
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

//horas laborales
moment.locale('en', {
    workinghours: {
        0: null,
        1: ['08:00:00', '18:00:00'],
        2: ['08:00:00', '18:00:00'],
        3: ['08:00:00', '18:00:00'],
        4: ['08:00:00', '18:00:00'],
        5: ['08:00:00', '18:00:00'],
        6: ['08:00:00', '18:00:00']
    }
});

con.connect(function(err) {
  if (err) throw err;
  
});
//Ruta de la aplicacion
rutaEliminarImpresora = '/eliminarImpresora';



//Configuracion del envio de email
var user = 'onmotica@gmail.com';
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: 'AbCd1234'
  }
});

//Costos por defecto

  var costoDiaDeTrabajo = 30000;
  var costoMantenimientoPorImpresion = 100000;
  var costoLocalArriendo = 700000;
  var adicionalReserva = 10000; // 10.000
  var porcentajeUtilidad = 30; //30%

  var cantidadMetros = 10;
  var pesoGramos = 62.83;
  var costoCarrete = 5000;
  var costoMetro = 500;
  var horasReservaImpresion = 48 + 24; // 3 dias
  var costoFilamento = costoMetro; //costo por metro
  var tiempoReserva = horasReservaImpresion; //tiempo de reserva
  var tiempoPagoAbono = 16; 
  var diametroBoquilla = 0.4;


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
    var consulta = "SELECT datosempresa.nombreEmpresa, usuario.idUsuario FROM usuario INNER JOIN datosempresa ON usuario.idUsuario = datosempresa.idUsuario and usuario.usuarioActivo=1";
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
    var consulta = "SELECT datosempresa.nombreEmpresa, usuario.idUsuario FROM usuario INNER JOIN datosempresa ON usuario.idUsuario = datosempresa.idUsuario and usuario.usuarioActivo=1";
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
var cssPaletaColor = "select.listMaterial option.option@id{background-color: #@color;}\r\n";
var cssPaletaTemp = "";
var cssPaletaFinal = "";

var optionFila = "<option class='option@id' value='@idFilamento'>@nombreFIlamento</option>\r\n";
var optionTemp = "";
var optionFInal = "";

var colorScript = "<script type='text/javascript'>var color@id = '#@color'</script>\r\n";
var colorTemp = "";
var colorFinal = "";

app.post('/cotizacionEnLinea', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    
    var consulta = "SELECT * FROM costosexternosempresa INNER JOIN datosEmpresa ON datosEmpresa.idUsuario=costosexternosempresa.idUsuario WHERE datosEmpresa.idUsuario = "+fields.idEmpresa;
    
    con.query(consulta, function (err, rows) {
        if (err) throw err; 
        consulta = "SELECT filamento.idFilamento,filamento.nombreFilamento,filamento.tipoFilamento,filamento.colorFilamento,filamento.costoFilamento,filamento.numeroMetros,impresora.diametroBoquilla,filamento.idImpresora,impresora.idImpresora FROM `filamento` INNER JOIN impresora ON filamento.idImpresora = impresora.idImpresora WHERE impresora.idUsuario ="+fields.idEmpresa;
        
        con.query(consulta, function (err, rows2) {
          if (err) throw err; 
          optionFinal = "";
          cssPaletaFinal = "";
          colorTemp = "";
          rows2.forEach(function(row3) {
              var nombre = row3.nombreFilamento;
              
              nombre+= ' ';
              nombre += row3.tipoFilamento;
              

              cssPaletaTemp = cssPaletaColor;
              cssPaletaTemp = cssPaletaTemp.replace('@id',row3.idFilamento);
              cssPaletaTemp = cssPaletaTemp.replace('@color',row3.colorFilamento);
              cssPaletaFinal += cssPaletaTemp;

              
              var costoCarrete = parseFloat(row3.costoFilamento);
              
              var numeroMetros = parseFloat(row3.numeroMetros);
              
              var costoFIlamento = costoCarrete/numeroMetros;

              optionTemp = optionFila;
              optionTemp = optionTemp.replace('@idFilamento',costoFIlamento);
              optionTemp = optionTemp.replace('@color',row3.colorFilamento);
              optionTemp = optionTemp.replace('@nombreFIlamento',nombre);
              optionTemp = optionTemp.replace('@id',row3.idFilamento);
              optionFinal += optionTemp;

              colorTemp = colorScript;
              colorTemp = colorTemp.replace('@id',row3.idFilamento);
              colorTemp = colorTemp.replace('@color',row3.colorFilamento);
              colorFinal += colorTemp;
               
          });
          
          
          var iva = 0;
          if(rows.length>0){
            res.render('pages/cotizacionEnLinea',{
            diaLaboralCost : rows[0]. costoDiaDeTrabajo,
            MantenimientoPorImpresion :rows[0].costoMantenimientoPorImpresion,
            costoLocalArriendo: rows[0].costoLocalArriendo,
            costoInternoPorIntentos: rows[0].adicionalReserva,
            utilidad: rows[0].porcentajeUtilidad,
            IVA: rows[0].IVA,
            idEmpresa:fields.idEmpresa,
            costoMetroFilamento: (parseFloat(rows2[0].costoFilamento)/parseFloat(rows2[0].numeroMetros)),
            tiempoReserva: rows[0].horasReservaEntreTrabajos,
            diametroBoquilla: rows2[0].diametroBoquilla,
            css: cssPaletaFinal,
            option: optionFinal,
            script:colorFinal
            });
          }else{
          res.render('pages/cotizacionEnLinea',{
            diaLaboralCost : costoDiaDeTrabajo,
            MantenimientoPorImpresion : costoMantenimientoPorImpresion,
            costoLocalArriendo: costoLocalArriendo,
            costoInternoPorIntentos: costoInternoPorIntentos,
            utilidad: porcentajeUtilidad,
            IVA: iva, 
            idEmpresa: fields.idEmpresa,
            costoMetroFilamento: '500',
            tiempoReserva: tiempoReserva,
            css: cssPaletaFinal,
            option: optionFinal,
            script:colorFinal
          });
        }
      });
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
        consulta = "UPDATE datosEmpresa SET horasReservaEntreTrabajos = @horasReservaEntreTrabajos, nombreEmpresa='@nombreEmpresa',nitEmpresa='@nitEmpresa',direccionEmpresa='@direccionEmpresa',telefonoEmpresa='@telefonoEmpresa' WHERE idUsuario=@idUsuario";
        consulta = consulta.replace('@idUsuario',req.session.usrID);
        consulta = consulta.replace('@nombreEmpresa',fields.nombreEmpresa);
        consulta = consulta.replace('@nitEmpresa',fields.NIT);
        consulta = consulta.replace('@direccionEmpresa',fields.direccion);
        consulta = consulta.replace('@telefonoEmpresa',fields.telefono);
        consulta = consulta.replace('@horasReservaEntreTrabajos',fields.tiempoReservaHoras);
        
        
        
        con.query(consulta, function (err, rows) {
        if (err) throw err; 
          res.redirect("/datosEmpresa");
        });
        }else{
          //INSERT
          
          consulta = "INSERT INTO `datosEmpresa` ( `idUsuario`, `nombreEmpresa`, `nitEmpresa`, `direccionEmpresa`, `telefonoEmpresa`, `horasReservaEntreTrabajos`) VALUES ( @idUsuario, '@nombreEmpresa', '@nitEmpresa', '@direccionEmpresa', '@telefonoEmpresa')";
          consulta = consulta.replace('@idUsuario',req.session.usrID);
          consulta = consulta.replace('@nombreEmpresa',fields.nombreEmpresa);
          consulta = consulta.replace('@nitEmpresa',fields.NIT);
          consulta = consulta.replace('@direccionEmpresa',fields.direccion);
          consulta = consulta.replace('@telefonoEmpresa',fields.telefono);
          consulta = consulta.replace('@horasReservaEntreTrabajos',fields.tiempoReservaHoras);
        
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

app.get('/costosExtra', function(req, res) {
  var consulta = "SELECT * FROM `costoCotizacion` WHERE idUsuario = "+req.session.usrID;
  con.query(consulta, function (err, rows) {
  if (err) throw err; 
  var iva = 0;
  if(rows.length>0){
    //Tabla de costos del cliente
    cantidadMetros =  rows[0].cantidadMetros;
    pesoGramos = rows[0].pesoGramos;
    costoCarrete = rows[0].costoCarrete;
    costoMetro = rows[0].costoMetro;
    horasReservaImpresion = rows[0].horasReservaImpresion;
  }
  res.render('pages/datoExtra', {
        cantidadMetros: cantidadMetros,
        pesoGramos: pesoGramos,
        costoCarrete: costoCarrete,
        costoMetro: costoMetro,
        horasReservaImpresion: horasReservaImpresion,
        idUsuario:req.session.usrID,
        datosEmpresaClass: 'active',
        main:'',
        pendent: '',
        registrarUsoImpresora: '',
        registrarImpresora: '',
        sistemaSupervision: ''
      });
  });
});

app.post('/actualizarExtras', function(req, res) {
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      
      var consulta = "SELECT * FROM `costoCotizacion` WHERE idUsuario = "+req.session.usrID;
      con.query(consulta, function (err, rows) {
        var costoMetro = parseFloat(fields.costoFila)/parseFloat(fields.metros);
        if (err) throw err; 
        if(rows.length>0){
        //UPDATE
        consulta = "UPDATE costoCotizacion SET cantidadMetros=@cantidadMetros, pesoGramos=@pesoGramos,costoCarrete=@costoCarrete,costoMetro=@costoMetro,horasReservaImpresion=@horasReservaImpresion WHERE idUsuario=@idUsuario";
        consulta = consulta.replace('@cantidadMetros',fields.metros);
        consulta = consulta.replace('@pesoGramos',fields.gramos);
        consulta = consulta.replace('@costoCarrete',fields.costoFila);
        consulta = consulta.replace('@costoMetro',costoMetro);
        consulta = consulta.replace('@horasReservaImpresion',fields.horasReservaImpresion);
        consulta = consulta.replace('@idUsuario',req.session.usrID);
        
        
        con.query(consulta, function (err, rows) {
        if (err) throw err; 
          res.redirect("/costosExtra");
        });
        }else{
          //INSERT
          
          consulta = "INSERT INTO `costoCotizacion` (`idUsuario`, `cantidadMetros`,`pesoGramos`, `costoCarrete`, `costoMetro`, `horasReservaImpresion`) VALUES ( @idUsuario, @cantidadMetros, @pesoGramos, @costoCarrete, @costoMetro, @horasReservaImpresion)";
          consulta = consulta.replace('@cantidadMetros',fields.metros);
          consulta = consulta.replace('@pesoGramos',fields.gramos);
          consulta = consulta.replace('@costoCarrete',fields.costoFila);
          consulta = consulta.replace('@costoMetro',costoMetro);
          consulta = consulta.replace('@horasReservaImpresion',fields.horasReservaImpresion);
          consulta = consulta.replace('@idUsuario',req.session.usrID);
          console.  log(consulta);
            con.query(consulta, function (err, rows) {
          if (err) throw err; 
            res.redirect("/costosExtra");
          }); 
        }
      }); 
    });
});


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
        
        
        con.query(consulta, function (err, rows) {
        if (err) throw err; 
          res.redirect("/costosInternos");
        });
        }else{
          //INSERT
          
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
  
  if(rows.length>0){
    nombreEmpresa = rows[0].nombreEmpresa;
    direccion = rows[0].direccionEmpresa;
    NIT = rows[0].nitEmpresa;
    telefono =  rows[0].telefonoEmpresa;
    tiempoReservaHoras =  rows[0].horasReservaEntreTrabajos;
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
        telefono:telefono,
        tiempoReservaHoras: tiempoReservaHoras
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
      
      if(fields.chk1){
        consulta = "SELECT idUsuario FROM usuario WHERE email = '"+fields.email+"' AND contrasena='"+fields.contrasena+"'";
        con.query(consulta, function (err, result) {
        if (err) throw err;
        
          if(result.length>0){
            var id = parseInt(result[0].idUsuario);
            req.session.usrID = id;
            
            res.redirect("/main");
          }else{res.redirect("/login");}
        });
        
      }else if(fields.chk2){
        
        var consulta = "SELECT COUNT(*) as total FROM usuario WHERE email='"+fields.email+"'";
         con.query(consulta, function (err, result) {
         if (err) throw err;
         //Aqui se identifica si el usuario ya estaba registrado, caso contrario -- lo registramos :)
          if(parseInt(result[0].total) == 0){
            consulta = "INSERT INTO usuario (`email`, `contrasena`, `usuarioActivo`) VALUES ('"+fields.email+"','"+fields.contrasena+"',"+1+")";
            
            con.query(consulta, function (err, result) {
            if (err) throw err;
            
              //En caso que el id de usuario no se encuentren en sesion, lo guardamos
              consulta = "SELECT idUsuario FROM usuario WHERE email = '"+fields.email+"'";
              con.query(consulta, function (err, result) {
              if (err) throw err; 
              var id = result[0].idUsuario;
              req.session.usrID = id;
              
              res.redirect("/main");
              });
            });
          }else{
            //Email en uso
            res.redirect("/index.html")
          };
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
    var consulta = "INSERT INTO impresora (`IDUsuario`, `nombreImpresora`, `tamanoCamaCaliente`, `tipoFilamento`, `diametroBoquilla`) VALUES ("+req.session.usrID+",'"+fields.printerName+"','"+fields.tamanoImpresora+"','"+filamento+"',"+fields.tamanoBoquilla+")";
    
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
      var marcaFecha = dateFormat(new Date(), "yyyymmddhhmm");
      var url = '/STL/'+marcaFecha+files.archivoupload.name;
      var newpath = __dirname + "/public/STL/" +marcaFecha+ files.archivoupload.name;
      
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        var nombreArchivo = marcaFecha + files.archivoupload.name;
        
        var porcentajeImputestosVar = fields.porIVA;
        var costoImpuestoVar = parseFloat(porcentajeImputestosVar/100) * parseInt(fields.costoGeneral);
        var consulta = "SELECT * FROM `datosempresa`  INNER JOIN usuario ON datosempresa.idUsuario = usuario.idUsuario WHERE usuario.idUsuario= " + fields.idEmpresa;
        con.query(consulta, function (err, result) {
        if (err) throw err;
        var tiempoReserva = parseInt(fields.tiempoReservaHoras);
        var fechaEntrega = moment(new Date());
        var fechaAbono = moment(new Date());

        var minutos = parseInt(String(fields.tiempoImpresion).split('.')[1]);
        fechaAbono = fechaAbono.addWorkingTime( tiempoPagoAbono,'hours');
        fechaEntrega = fechaEntrega.addWorkingTime( tiempoReserva + tiempoPagoAbono + parseInt(fields.tiempoImpresion), 'hours');
        fechaEntrega = fechaEntrega.addWorkingTime( minutos, 'minutes');//Agregamos los minutos
        
        
        
        
        
          res.render('pages/printCotizacion',{
            nombreArchivo: nombreArchivo,
            urlArchivo:url,
            tiempoReserva: fields.tiempoReservaHoras,
            idEmpresa: fields.idEmpresa,
            nombreEmpresa: result[0].nombreEmpresa, 
            telefonoEmpresa: result[0].telefonoEmpresa,
            direccion: result[0].direccionEmpresa,
            nitEmpresa:   result[0].nitEmpresa,
            nombreOriginal:files.archivoupload.name,
            servicioImpresion : "Impresion 3D ("+files.archivoupload.name+")",
            costoImpresionUni : fields.costoGeneral,
            costoImpresionTotal : fields.costoGeneral,
            porcentajeImputestos : porcentajeImputestosVar,
            costoImpuesto : costoImpuestoVar,
            costoSubtotal : parseInt(fields.costoGeneral),
            costoTotal : parseInt(fields.costoGeneral) + parseInt(costoImpuestoVar),
            costoAbono :  (parseInt(fields.costoGeneral) + parseInt(costoImpuestoVar))/2,
            linkCondiciones: "legal",
            fechaEntrega: dateFormat(fechaEntrega,"yyyy.mm.dd hh:mm"),
            fechaPagoAbono: dateFormat(fechaAbono,"yyyy.mm.dd hh:mm"),
            emailCliente: "ingrese su email",
            emailProveedor: result[0].email,
            color: fields.colorFilamento,
            idFilamento: fields.idFilamento,
            tamano: fields.largo + ' x ' + fields.alto + ' x ' + fields.ancho + ' (cm)',
            tiempoImpresion:fields.tiempoImpresion,
            numeroMetros: fields.numeroMetros
          });
      });
    });
  });
});
// generacion de la orden de impresion
app.post('/imprimirPieza', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
      
      var url = fields.url;
      //Crear cotizacion en el sistema
      var consulta = "INSERT INTO `cotizacion` ( `idUsuario`, `emailProveedor`, `emailCliente`, `idFilamento`, `nombreArchivo`, `urlArchivo`, `numeroMetrosEstimado`, `tiempoImpresionEstimado`, `valorImpuestos`, `valorTotal`, `fechaAbono`, `fechaFin`, `abonoPagado`) VALUES(@idUsuario, '@emailProveedor',  '@emailCliente', @idFilamento, '@nombreArchivo', '@urlArchivo', '@numeroMetrosEstimado', @tiempoImpresionEstimado, @valorImpuestos, @valorTotal, '@fechaAbono', '@fechaFin', @abonoPagado)";
      consulta = consulta.replace('@idUsuario',fields.idEmpresa);
      consulta = consulta.replace('@emailProveedor',fields.emailProveedor);
      consulta = consulta.replace('@emailCliente',fields.emailCliente);
      consulta = consulta.replace('@idFilamento',fields.idFilamento);
      consulta = consulta.replace('@nombreArchivo',fields.nombreArchivo);
      consulta = consulta.replace('@urlArchivo',url);
      consulta = consulta.replace('@numeroMetrosEstimado',fields.numeroMetros);//FALTA
      consulta = consulta.replace('@tiempoImpresionEstimado',fields.tiempoImpresion);//FALTA
      consulta = consulta.replace('@valorImpuestos',fields.costoImpuestoTotal);
      consulta = consulta.replace('@valorTotal',fields.costoTotalImpresion);
      consulta = consulta.replace('@fechaAbono',fields.fechaPagoAbono);
      consulta = consulta.replace('@fechaFin',fields.fechaEntrega);
      consulta = consulta.replace('@abonoPagado',0); //Aqui el abono aun no se ha pagado
      
      con.query(consulta, function (err, result1) {
      if (err) throw err;
        //Obtener el ID de la cotizacion
       
              
          var idCotizacion = result1.insertId;
          //Agendar la impresion
          consulta = "INSERT INTO `agenda` ( `idCotizacion`, `fechaInicio`, `fechaFinal`) VALUES (@idCotizacion, '@fechaInicio', '@fechaFinal')";
          consulta = consulta.replace('@idCotizacion', idCotizacion);
          consulta = consulta.replace('@fechaInicio', fields.fechaPagoAbono);
          consulta = consulta.replace('@fechaFinal', fields.fechaEntrega);
          
          con.query(consulta, function (err, result2) {
          if (err) throw err;
          
          consulta = "SELECT * FROM `datosempresa` WHERE idUsuario="+ fields.idEmpresa;
          con.query(consulta, function (err, result3) {
          if (err) throw err;
            generarPropuesta(result3[0].nombreEmpresa,fields.fechaEntrega,fields.fechaPagoAbono,fields.emailCliente,fields.emailProveedor,result3[0].telefonoEmpresa,fields.nombreArchivo,fields.costoTotalImpresion,idCotizacion);
            res.redirect('/envioExitoso');
            
          });  
        });
      });
    });
});



app.get('/envioExitoso', function(req, res) {
  res.render('pages/success.ejs');
});






// Pagina principal de usuarios 
app.get('/main', function(req, res) {
  
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
var formBasic = "   <form class='col-md-3' style='padding:0' action='/reporteImpresion' method='POST'><div class='panel-body'><div class='col-md-12'><div class='well dash-box'><h2 onclick='reporteImpresion(@idCotizacion)'><img src='/icons/3dIcon.ico' style='width: 80px;height: 80px;'><span class=' aria-hidden='true'> @fechaEntrega </span></h2><h4><a href='@url'>@nombreArchivo</a></h4></div></div></div></form>";
var formTemp = "";
var formFinal = "";
app.get('/pendent', function(req, res) {
    var formTemp = "";
    var formFinal = "";
    var consulta = "SELECT * FROM `cotizacion` WHERE idUsuario = @idUsuario";
    consulta = consulta.replace('@idUsuario',req.session.usrID);
    con.query(consulta, function (err, rows) {
    if (err) throw err;  
      rows.forEach(function(row) {
        formTemp = formBasic;
        formTemp = formTemp.replace('@url',row.urlArchivo);
        formTemp = formTemp.replace('@nombreArchivo',row.nombreArchivo);
        formTemp = formTemp.replace('@fechaEntrega',dateFormat(row.fechaFin,"yyyy.mm.dd"));
        formTemp = formTemp.replace('@idCotizacion',row.idCotizacion);
        formFinal +=formTemp;
  
      })
      res.render('pages/trabajoPendiente', {
        datosEmpresaClass: '',
        main:'',
        pendent: 'active',
        registrarUsoImpresora: '',
        registrarImpresora: '',
        sistemaSupervision: '',
        lista:formFinal
      });
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


app.post(rutaEliminarImpresora, function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  
    var consulta = "DELETE FROM filamento WHERE idImpresora = "+fields.idImpresora;
    console.log(consulta);
    con.query(consulta, function (err, rows) {
      if (err) throw err;
      var consulta = "DELETE FROM impresora WHERE idImpresora = "+fields.idImpresora;
      con.query(consulta, function (err, rows) {
      if (err) throw err;
        res.redirect('/registrarImpresora');    
      });
    });
  });
});
// registrar impresora 
var impresoraDiv = "<div class='col-md-3'><form class='col-md-12' style='padding:0;' onclick='enviar(this.id)' id='printer@id' method='POST' action='/registrarFilamento'><input type='Text' name='idImpresora' value='@id' style='display:none'><div class='col-md-12'><div class='well dash-box col-md-12' style='border:0;padding:0;margin:0'><h2 class='col-md-12'><img class='col-md-12' style='margin-top:11%' src='/icons/printer.ico' style='width: 80px;height: 80px;'/><div></div><span class='col-md-12'>@Nombre</span></h2><h4>@Version</h4></div></div></form><form action='@url' method='POST' id='formRedirect'><input style='display:none' type='Text' value='@idImpresora' name='idImpresora'><button type='submit' style='margin-left:11%' class='btn btn-danger'> Eliminar impresora </button></form></div>";
var divFinal = ""; //En este div quedan las etiquetas finales
var divTemp = ""; //En este div se cargan los datos temporalmente
app.get('/registrarImpresora', function(req, res) {
    if(req.session.usrID){
      var idUsuario =  req.session.usrID;
      var consulta = "SELECT * FROM `impresora` INNER JOIN usuario ON impresora.IDUsuario=usuario.idUsuario WHERE impresora.IDUsuario = "+idUsuario;
      
      con.query(consulta, function (err, rows) {
      if (err) throw err;
      var divFinal = ""; //En este div quedan las etiquetas finales
      var divTemp = ""; //En este div se cargan los datos temporalmente
      rows.forEach(function(row) {
        divTemp = impresoraDiv;
        divTemp = divTemp.replace('@url',rutaEliminarImpresora);
        divTemp = divTemp.replace('@idImpresora',row.idImpresora);
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
var divFilamento = "<form class='col-md-3'  onclick='enviarFormulario(this.id,urlEliminar)' id='form'><div class='well dash-box'><h2>@filanombre</h2><h2><img src='/icons/filamento.ico' style='width: 80px;height: 80px;'/><div></div><span class=' aria-hidden='true'></span>&nbsp&nbsp @filaLargo Mt </h2><h4>@filaTipo <input type='Text' value='@filaID' name='idFilamento' style='display:none'/> <input style='width: 90px;height: 30px;' class='jscolor' name='color' value='@filaColor'/>  </h4></div></form>";
var divFilaTemp = "";
var divFilaFinal = ""; 
app.post('/registrarFilamento', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var idPrinter = fields.idImpresora;
      consulta = "SELECT * FROM `filamento` WHERE idImpresora ="+idPrinter+" and idUsuario="+req.session.usrID;
      
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
          //
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

app.post('/eliminarFilamento', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var consulta = "DELETE FROM filamento WHERE idFilamento = @idFilamento";
  console.log(fields);
  consulta = consulta.replace('@idFilamento', fields.idFilamento);
  console.log(consulta);
  con.query(consulta, function (err, rows) {
  if (err) throw err;
    res.end();
    //res.redirect('/main');
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
    //
    con.query(consulta, function (err, rows) {
    if (err) throw err;

    consulta = "SELECT * FROM `filamento` WHERE idImpresora ="+fields.idImpresora+" and idUsuario="+req.session.usrID;
    
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




//Funciones de usuario

//Generar cotizacion

function generarPropuesta(nombreEmpresa,fechaEntrega,fechaPagoAbono,emailCliente,emailEmpresa,telefonoEmpresa,nombreArchivo,costoServicio,idCotizacion)
{
          /*
          var nombreEmpresa = 'CED 3D';
          var fechaEntrega = dateFormat(new Date(), "yyyy.mm.dd");
          var fechaPagoAbono = dateFormat(new Date(),"yyyy.mm.dd");
          var emailCliente = 'miguelangelcu@ufps.edu.co';
          var emailEmpresa = 'empresa@empresa.com';
          var telefonoEmpresa = 3192597748;
          var nombreArchivo = '3D.STL';
          var costoServicio = 500000;
          */
          var terminosON3D = 'ON3D es un sistema de gestion en linea que permite generar de manera automatica la cotizacion, calcular metricas y elaborar la agenda de las impresiones asignadas a las empresas aqui registradas, el cliente '+emailCliente+' debe comunicarse atravez de los canales referidos en esta propuesta (email - telefono) y acordar los terminos de pago y el lugar de entrega';
          var terminos = 'El contenido de este mensaje y de los archivos adjuntos están dirigidos exclusivamente a sus destinatarios y puede contener información privilegiada o confidencial. Si usted no es el destinatario real, por favor informe de ello al remitente y elimine el mensaje de inmediato, de tal manera que no pueda acceder a él de nuevo. Está prohibida su retención, grabación, utilización o divulgación con cualquier propósito. Este mensaje ha sido verificado con software antivirus; sin embargo, el remitente no se hace responsable en caso de que en éste o en los archivos adjuntos haya presencia de algún virus que pueda generar daños en los equipos o programas del destinatario.';
          var terminosIngles ='This e-mail and its attachments may contain privileged or confidential information and are addressed exclusively to their intended recipients. If you are not the intended recipient, please notify the sender immediately and delete this e-mail and its attachments from your system. The storage, recording, use or disclosure of this e-mail and its attachments by anyone other than the intended recipient is strictly prohibited. This message has been verified using antivirus software; however, the sender is not responsible for any damage to hardware or software resulting from the presence of any virus.';

          doc = new PDFDocument();
          doc.pipe( fs.createWriteStream(__dirname+'/public/cotizacion/cotiza'+idCotizacion+'.pdf') );
          //encabezado
          doc.fontSize(8);
          doc.text(dateFormat(new Date(),"yyyy.mm.dd"),
          {
            width: 410,
            align: 'left'
          });

          doc.text(nombreEmpresa,
          {
            width: 410,
            align: 'right'
          });

          doc.fontSize(15);
          doc.text('           ',{
            width: 200,
            align: 'center'
          });

          doc.fontSize(25);
          doc.text(nombreEmpresa + ' Cotización',{
            width: 410,
            align: 'center'
          });

          doc.fontSize(15);
          doc.text('           ',{
            width: 200,
            align: 'center'
          });
          
          doc.fontSize(12);
          doc.text('Cordial saludo ' + emailCliente + ':',
          {
            width: 410,
            align: 'justify'
          });

          doc.text('Atendiendo  su  amable  solicitud  estamos  enviando  cotización  de  los  productos  requeridos,  para  nosotros  es  un  placer  poner    nuestra  compañía  a  su  servicio ' + emailCliente + '.',
          {
            width: 410,
            align: 'justify'
          });

          doc.fontSize(12);
          doc.text('           ',{
            width: 200,
            align: 'center'
          });
          
          doc.text('Acontinuacion se presentan las caracteristicas del servicio cotizado:  ',
          {
            width: 410,
            align: 'justify'
          });

          doc.fontSize(12);
          doc.text('Servicio: impresion 3D (' + nombreArchivo + ').',
          {
            width: 410,
            align: 'justify'
          });          

          doc.fontSize(12);
          doc.text('Costo total del servicio de impresion: $' + costoServicio,
          {
            width: 410,
            align: 'left'
          });

          doc.fontSize(12);
          doc.text('Correo electronico de la empresa:' + emailEmpresa,
          {
            width: 410,
            align: 'left'
          });


          doc.fontSize(12);
          doc.text('Telefono de la empresa: ' + telefonoEmpresa,
          {
            width: 410,
            align: 'left'
          });

          doc.fontSize(12);
          doc.text('Fecha de entrega de la impresion: ' + fechaEntrega,
          {
            width: 410,
            align: 'left'
          });

          doc.fontSize(12);
          doc.text('Fecha de pago del abono inicial: ' + fechaPagoAbono,
          {
            width: 410,
            align: 'left'
          });


          doc.fontSize(12);
          doc.text('           ',{
            width: 200,
            align: 'center'
          });

          doc.text(terminosON3D,
          {
            width: 410,
            align: 'justify'
          });

          doc.fontSize(12);
          doc.text('           ',{
            width: 200,
            align: 'center'
          });

          doc.text(terminos,
          {
            width: 410,
            align: 'justify'
          });

          doc.text(terminosIngles,
          {
            width: 410,
            align: 'justify'
          });

          doc.end();
          enviarEmail(user,emailCliente,nombreEmpresa + ' Cotizacion','Cordial saludo '+emailCliente+'\r\nAdjunto se encuentran los documentos solicitados. Te recordamos los canales de contacto con la empresa '+nombreEmpresa+': \r\n\r\n telefono: '+telefonoEmpresa+'\r\n '+'correo electronico: '+ emailEmpresa +' \r\n\r\n\r\n'+terminos+'\r\n\r\n\r\n'+terminosIngles,'cotizacion.pdf',__dirname+'/public/cotizacion/cotiza'+idCotizacion+'.pdf');


}
function enviarEmail(remitente,destinatario,subject,text,filename,path){
 transporter.sendMail({
  from: remitente,
  to: destinatario,
  subject: subject,
  text: text,
  attachments: [{
    filename: filename,
    path: path,
    contentType: 'application/pdf'
    }], function (err, info) {
     if(err){
       console.error(err);
       //res.send(err);
     }
     else{
       
       //res.send(info);
     }
    } 
  });
}