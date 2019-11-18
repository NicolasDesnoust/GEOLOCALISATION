/*
*
*   Author : DESNOUST Nicolas
*
*/

$(document).ready(function () {

    $('#searchButton').on("click", function(e) {
        updateSearchParameters();
        fillInDonorsSearch();   
        applySearch();
    });

});

function enableDidSearch() {
    console.log("enable");
    $('#didSearch').prop('disabled', false);
    $('#didSearch').prop('checked', true);
}

function disableDidSearch() {
    $('#didSearch').prop('checked', false);
    $('#didSearch').prop('disabled', true);
}