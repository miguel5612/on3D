/*
Dinamic modal example.

Reference: https://stackoverflow.com/questions/22313992/dynamically-build-twitter-bootstrap-modal

<div id="idMyModal"></div>
and then you can use it via:

var header = "This is my dynamic header";
var content = "This is my dynamic content";
var strSubmitFunc = "applyButtonFunc()";
var btnText = "Just do it!";
doModal('idMyModal', header, content, strSubmitFunc, btnText);



*/

function doModal(placementId, heading, formContent, strSubmitFunc, btnText)
{
    var html =  '<div id="modalWindow" class="modal hide fade in" style="display:none;">';
    html += '<div class="modal-dialog" role="document">';
    html += '<div class="modal-header" style="background-color:white">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>'+heading+'</h4>'
    html += '</div>';
    html += '<div class="modal-body" style="background-color:white">';
    html += '<p>';
    html += formContent;
    html += '</div>';
    html += '<div class="modal-footer" style="background-color:white">';
    if (btnText!='') {
        html += '<span class="btn btn-success"';
        html += ' onClick="'+strSubmitFunc+'">'+btnText;
        html += '</span>';
    }
    html += '<span class="btn" data-dismiss="modal">';
    html += 'Close';
    html += '</span>'; // close button
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    html += '</div>';  // modal dialog
    $("#"+placementId).html(html);
    $("#modalWindow").modal();
}


function hideModal()
{
    // Using a very general selector - this is because $('#modalDiv').hide
    // will remove the modal window but not the mask
    $('.modal.in').modal('hide');
}