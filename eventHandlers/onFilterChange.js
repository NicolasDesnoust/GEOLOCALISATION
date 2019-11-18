/*
*
*   Author : DESNOUST Nicolas
*
*/

$(document).ready(function () {

    /* Remplissage automatique du second selecteur des filtres à partir du premier et de l'input */
    $('.columnNames', $('#filtersModal')).change(function() {

        var key = $(this).val().split(".")[0];
        var vals = [];
        var id = 0;
        var inputAsString = "";

        if (this.getAttribute("id") === "columnNames1")
            id = 1;
        else if (this.getAttribute("id") === "columnNames2")
            id = 2;

        $('input').remove("#inputFilter"+id);
                   
        inputAsString = "<input id='inputFilter"+ id +"' class='inputFilter form-control' ";

        switch(key) {
            case 'int':
                vals = filtersData.int.split(",");
                inputAsString += "type='number' step='1' ";
                break;
            case 'float':
                vals = filtersData.float.split(",");
                inputAsString += "type='number' step='any' ";
                break;
            case 'string':
                vals = filtersData.string.split(",");
                inputAsString += "type='text' ";
                break;
            case 'boolean':
                vals = filtersData.boolean.split(",");
                break;
            case 'base':
                vals = ['Veuillez choisir un filtre'];
                inputAsString += "type='text' ";
                break;
        }

        inputAsString += "name='inputFilter' required>";

        if (key !== "boolean")
            $("#inputContainer"+id, $('#filtersModal')).append(inputAsString);
        
        var secondChoice;

        secondChoice = $("#operators"+id, $('#filtersModal'));

        secondChoice.empty();
        if (key === "base")
            secondChoice.append("<option class='defaultOption' name='option' selected value = 'base'>" + vals[0] + "</option>");
        else
            $.each(vals, function(index, value) {
                secondChoice.append("<option class='columnOption' name='option'>" + value + "</option>");
            });
    });  

    /* Ajoute un filtre */
    $('#valFilterButton', $('#filtersModal')).on("click", function(e) {
        
        var filterAsObj = getFilterAsObject(1);

        if (filterAsObj !== null) {
            addNewFilter(filterAsObj);
        }

        goToFiltersMatrix();
    });

    /* Ajoute une contrainte à un filtre */
    $('#valConstraintButton', $('#filtersModal')).on("click", function(e) {

        var filterAsObj = getFilterAsObject(2);
            
        if (filterAsObj !== null) {
            extendFilter(cBIndex, filterAsObj);
        }

        goToFiltersMatrix();
    });

    /* Application de la matrice de filtres aux donateurs */
    $('#applyButton', $('#filtersModal')).click(function(e) {
        fillInDonors();
        applyFilters();
    });

});