function validar(){
	var filename = document.getElementById("filename");
	var email = document.getElementById("email");
	var file = document.getElementById("file");
	var emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
	if(filename.value != "" & emailRegex.test(email.value) &  file.value!=""){
		return true;
	}else if(filename.value==""){
		alert("El nombre de archivo es un campo requerido.");
	}else if(!emailRegex.test(email.value)){
		alert("El email es un campo requerido");
	}else if(file.value==""){
		alert("El archivo .STL es requerido para cotizar");
	}
	return false;
}

 function startUpload()
{
	if(validar()){
	    var id = setInterval(frame, 50);
    	var percent = 1;
	    $('.btnprogress').text('Continue')
	    function frame() {
	    if (percent >= 100) {
	      clearInterval(id);
	      $('.btnprogress').text('Close');
	      $('#myModal').modal('hide');
	    } else {
      		percent++; 
      		$('.progress-bar').css('width', percent+'%').attr('aria-valuenow', percent); 
    	}
  	}
  	document.getElementById("uplForm").submit();
  }    
}


function clickProgress()
{
    var progress = $('.btnprogress').text();
    if(progress =='Continue')
    {
        window.open(window.location.href);
    }
    else    
    {
         $('#myModal').modal('toggle');
    }           
}
function comprueba_extension(formulario, archivo) { 
   extensiones_permitidas = new Array(".stl"); 
   mierror = ""; 
   if (!archivo) { 
      //Si no tengo archivo, es que no se ha seleccionado un archivo en el formulario 
      	mierror = "No has seleccionado ningún archivo"; 
   }else{ 
      //recupero la extensión de este nombre de archivo 
      extension = (archivo.substring(archivo.lastIndexOf("."))).toLowerCase(); 
      //alert (extension); 
      //compruebo si la extensión está entre las permitidas 
      permitida = false; 
      for (var i = 0; i < extensiones_permitidas.length; i++) { 
         if (extensiones_permitidas[i] == extension) { 
         permitida = true; 
         break; 
         } 
      } 
      if (!permitida) { 
         mierror = "Comprueba la extensión de los archivos a subir. \nSólo se pueden subir archivos con extensiones: " + extensiones_permitidas.join(); 
      	}else{ 
         	//submito! 
         validar();
         alert ("Todo correcto. Voy a submitir el formulario."); 
         formulario.submit(); 
         return 1; 
      	} 
   } 
   //si estoy aqui es que no se ha podido submitir 
   alert (mierror); 
   return 0; 
}