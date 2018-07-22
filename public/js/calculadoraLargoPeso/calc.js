function calcularLargo()
{
	var masa1 =  parseInt(document.getElementById("filaPeso").value);
	var densidad1 = parseInt(document.getElementById("densidadText").value);
	var diametro1 = parseInt(document.getElementById("diametro").value);
	var largo = document.getElementById("filaMetros");	
	largo.value =  (masa1/(Math.PI*densidad1*(((diametro1/2)/10)^2))).toFixed(2);
}
function calcularPeso()
{
	var largo1 = parseInt(parseInt(document.getElementById("filaMetros").value));
	var densidad1 = parseInt(document.getElementById("densidadText").value);
	var diametro1 = parseInt(document.getElementById("diametro").value);
	var masa = document.getElementById("filaPeso");
	masa.value = (largo1*(Math.PI*densidad1*(((diametro1/2)/10)^2))).toFixed(2);
}
function loadPLA(){
	var densidad = document.getElementById("densidadText");
	var ABS =  document.getElementById("ABS");
	var PLA =  document.getElementById("PLA");
	var Flexi =  document.getElementById("Flexible");
	densidad.value = 1.24;
	ABS.checked= false;
	Flexi.checked = false;
	refrescarValores();
}
function loadABS(){
	var densidad = document.getElementById("densidadText");
	var ABS =  document.getElementById("ABS");
	var PLA =  document.getElementById("PLA");
	var Flexi =  document.getElementById("Flexible");
	densidad.value = 1.04;
	PLA.checked= false;
	Flexi.checked = false;
	refrescarValores();
}
function loadFlexi(){
	var densidad = document.getElementById("densidadText");
	var ABS =  document.getElementById("ABS");
	var PLA =  document.getElementById("PLA");
	var Flexi =  document.getElementById("Flexible");
	densidad.value = 1.21;
	PLA.checked= false;
	ABS.checked = false;
	refrescarValores();
}
function refrescarValores(){
	var largo1 = parseInt(parseInt(document.getElementById("filaMetros").value));
	var masa1 =  parseInt(document.getElementById("filaPeso").value);
	if(largo1>0) {
		calcularPeso();
	}else if(masa1>0){
		calcularLargo();
	}
}
function cargarPeso(){
	var divPeso = document.getElementById("inputMetro");
	var divMetros = document.getElementById("inputPeso");
	var radioPeso = document.getElementById("Peso");
	var radioMetros = document.getElementById("Metros");
	radioMetros.checked = false;
	divPeso.style.display = "none";
	divMetros.style.display = "";
}
function cargarMetros(){
	var divPeso = document.getElementById("inputMetro");
	var divMetros = document.getElementById("inputPeso");
	var radioPeso = document.getElementById("Peso");
	var radioMetros = document.getElementById("Metros");
	radioPeso	.checked = false;
	divPeso.style.display = "";
	divMetros.style.display = "none";
}
function validarFilamento(){
	var largo1 = parseInt(parseInt(document.getElementById("filaMetros").value));
	var masa1 =  parseInt(document.getElementById("filaPeso").value);
	var costoFilamento = parseInt(document.getElementById("costoFilamento").value);
	if(!(costoFilamento>0)){alert('Por favor ingrese el costo del filamento');}
	if(!(largo1>0)){alert('Por favor ingrese el numero de metros o la masa del filamento');}
	if(!(masa1>0)){alert('Por favor ingrese el numero de metros o la masa del filamento');}
	if(largo1>0 & masa1>0 & costoFilamento>0){
		return true;
	}else if(largo1>0 & costoFilamento>0){
		calcularPeso();
		return false;
	}else if(masa1>0 & costoFilamento>0){
		calcularLargo();
		return false;
	}else{
		return false;
	}
}