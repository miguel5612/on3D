var header = "Reporte de impresion";
var content = "<form id='form' action='/reporteIntento'><input type='Text' value='@cotizationNumber' syle='display:none' name=idCotizacion><div class='form-group'><label>Porcentaje de impresion realizado:</label><input placeholder='50'  class='form-control'  type='Text' name='porcentajeImpresion'></div><div class='form-group'><input  class='form-check-input' type='checkbox' name='chkEndPrint'><label  class='form-check-label'>La impresion ha finalizado, el producto esta listo?</label></div></form>";
var strSubmitFunc = "applyButtonFunc()";
var btnText = "Reportar intento de impresion!";
doModal('idMyModal', header, content, strSubmitFunc, btnText);


function reporteImpresion(idCotizacion){
	var content2 = "";
	content2 = content;
	content2 = content2.replace("@cotizationNumber",idCotizacion);
	doModal('idMyModal', header, content2, strSubmitFunc, btnText);
}

function applyButtonFunc(){
	console.log("form enviado");
}