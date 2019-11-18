/*
*
*   Author : DESNOUST Nicolas
*
*/

$(document).ready(function () {
	
	/* Cache le message d'alerte de fichier manquant */
	$('#importModal').on('show.bs.modal', function () {
  		$('#fileMissingAlert').hide();
	}),

	/* Fait apparaitre le nom du fichier lorsqu'il est sélectionné */
    $(".custom-file-input", $('#importModal')).on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    }),

	/* Démarre l'import de fichier */
    $('#importButton', $('#importModal')).on("click", function(e) {

    	var file = document.getElementById('customFile');
        var cpColumnName = document.getElementById('cpColumnName').value;
        var separator = document.getElementById('separator').value;

        switch (separator) {
            case ",":
            case ";":
                break;
            default:
                separator = ",";
        }

        /* Nouveau nom de code postal spécifié */
        if (cpColumnName == "")
        	cpColumnName = "CP";

        /* Pas de fichier spécifié */
        if (file.value == "") {
        	$('#fileMissingAlert').show();
        }
        else {
        	// traitement du fichier
        	processFile(file, callbackImport, separator, cpColumnName);

        	$('#importModal').modal('hide');
        }
	});

});