$(document).ready( function () {
	$('form').submit( function () {
		var formdata = $(this).serialize();
		var action = this.action.split("/");
		var length = action.length;
		var url = "/" + action[length-1];
		console.log(url);
		console.log(idImpresora);
		
		document.getElementById(this.id).remove();

		$.ajax({
		    type: "POST",
		    url: url,
		    data: formdata,
		 });
		return false;		

	});

});

function enviarFormulario(id,url){
		var formdata = $('#'+id).serialize();
		console.log('data: ',formdata,'url: ',url);
		
		$.ajax({
		    type: "POST",
		    url: url,
		    data: formdata,
		 });
		document.getElementById(id).remove();
		 return false;
	}



//eliminar elementos

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}