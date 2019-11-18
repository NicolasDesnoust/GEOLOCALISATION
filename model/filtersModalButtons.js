/*
*
*   Author : DESNOUST Nicolas
*
*/

var cBIndex = 0;

$(document).ready(function() {

    $('#filtersModal').on('show.bs.modal', function () {
        goToFiltersMatrix();
    });
    
});

function goToFiltersMatrix() {
    $('#backButton', $('#filtersModal')).hide();
    $('#valFilterButton', $('#filtersModal')).hide();
    $('#valConstraintButton', $('#filtersModal')).hide();

    $('#quitButton', $('#filtersModal')).show();
    $('#addButton', $('#filtersModal')).show();
    $('#applyButton', $('#filtersModal')).show();

    $('#navTab a[href="#filtersTable"]', $('#filtersModal')).tab('show');
}

function goToAddFilters() {
    $('#applyButton', $('#filtersModal')).hide();
    $('#quitButton', $('#filtersModal')).hide();
    $('#addButton', $('#filtersModal')).hide();
    $('#valConstraintButton', $('#filtersModal')).hide();

    $('#backButton', $('#filtersModal')).show();
    $('#valFilterButton', $('#filtersModal')).show();

    $('#navTab a[href="#addFilter"]', $('#filtersModal')).tab('show');
}

function goToAddConstraints(cButtonIndex) {
    cBIndex = cButtonIndex;

    $('#applyButton', $('#filtersModal')).hide();
    $('#quitButton', $('#filtersModal')).hide();
    $('#addButton', $('#filtersModal')).hide();
    $('#valFilterButton', $('#filtersModal')).hide();

    $('#backButton', $('#filtersModal')).show();
    $('#valConstraintButton', $('#filtersModal')).show();

    $('#navTab a[href="#addConstraint"]', $('#filtersModal')).tab('show');
}