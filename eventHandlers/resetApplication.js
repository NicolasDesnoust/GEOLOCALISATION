/*
*
*   Author : DESNOUST Nicolas
*
*/

$(document).ready(function(){
    /* Réinitialisation de l'application */
    $('#deleteButton', $('#deleteModal')).click(function(e) {
        dict = {};
        columnTypes = {};
        filterMatrix = [];
        showFilterMatrix();
        clearFilters();
        searchApplied = false;
        filtersApplied = false;

        deleteCurrentMarkers();
        disableWithFilters();
        disableDidSearch();
    });

});