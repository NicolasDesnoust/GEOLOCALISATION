/*
*
*   Author : DESNOUST Nicolas
*
*/

var filterMatrix = [];           // matrice contenant les filtres crees par l'utilisateur
var cButtonCount = 0;
var filtersOn = "false";

function addOptions (select) {
    Object.keys(columnTypes).forEach(function(key) { 
        // retire les colonnes a ne pas integrer dans la liste
        if (key !== "LAT" && key !== "LON" && key !== "NUMCLI" && key !== "CP") {
            // creation du texte de l'option
            var opt = "<option class='columnOption' value=\"" + columnTypes[key] + "." + key + "\">" + key + "</option>";

            select.append(opt);
        }
    });
}

// Met a jour la liste des colonnes a filtrer
function updateFilters () {

    // recuperation du selecteur
    var select1 = $('#columnNames1', $('#filtersModal'));
    var select2 = $('#columnNames2', $('#filtersModal'));

    // suppression des anciens filtres
    $( "option" ).remove(".columnOption");

    // ajout des nouveaux filtres
    addOptions (select1);
    addOptions (select2);
}

function clearFilters () {
    // suppression des anciens filtres
    $( "option" ).remove(".columnOption");

    var opt = "<option class='defaultOption' selected value='base'>Veuillez choisir un filtre</option>";
    var select = $('#operators1', $('#filtersModal'));
    select.append(opt);
    
    select = $('#operators2', $('#filtersModal'));
    select.append(opt);

    var inp1 = document.getElementById("inputFilter1");
    var inp2 = document.getElementById("inputFilter2");
    
    if (inp1 != null)
        inp1.value = "";
    if (inp2 != null)
        inp2.value = "";
}

function addNewFilter (filter) {
    var newRow = [];

    newRow.push(filter);
    filterMatrix.push(newRow);

    showFilterMatrix();
}

function extendFilter (filterIndex, filter) {
    if (filterMatrix.length > filterIndex) {
        filterMatrix[filterIndex].push(filter);
    }

    showFilterMatrix();
}

/* Rempli le tableau contenant les donateurs correspondant aux filtres */
function fillInDonors () {

    var isMatchingAFilter;
    var isMatchingAllConstraints;
    var i, j;
    donors = {};

    Object.keys(dict).forEach(function(index) {

        i = 0;
        isMatchingAFilter = false;
        
        while (i < filterMatrix.length && !isMatchingAFilter) {

            j = 0;
            var constraint = filterMatrix[i];
            isMatchingAllConstraints = true;
            
            while (j < constraint.length && isMatchingAllConstraints) {   
                var type = columnTypes[constraint[j].filter];
                var filter = dict[index][constraint[j].filter];
                var operator = constraint[j].operator;
                var value = constraint[j].val;

                if (!compare(type, filter, operator, value)) {
                    isMatchingAllConstraints = false;
                }

                j++;
            }

            if (isMatchingAllConstraints)
                isMatchingAFilter = true;

            i++;
        }

        /* Si le donateur correspond au filtre on l'enregistre */
        if (isMatchingAFilter)
            donors[index] = true;
    });
}

function applyFilters () {
    deleteCurrentMarkers();
    filtersApplied = true;
    addMarkers();
    enableWithFilters();
}

function compare (type, filter, operator, value) {

    switch (type) {
        case "int":
            filter = parseInt(filter);
            value = parseInt(value);
            break;
        case "float":
            filter = parseFloat(filter);
            value = parseFloat(value);
            break;
        case "boolean":
            filter = filter.toLowerCase();

            switch (filter) {
                case "true":
                case "vrai":
                case "o":
                case "oui":
                    filter = true;
                    break;
                case "false":
                case "faux":
                case "n":
                case "non":
                    filter = false;
                    break;
            }
            break;
    }

    switch (operator) {
        case 'supérieur à': return filter > value;
        case 'inférieur à': return filter < value;
        case 'supérieur ou égal à': return filter >= value;
        case 'inférieur ou égal à': return filter <= value;
        case 'égal à': return filter == value;
        case 'différent de': return filter != value;
        case 'est vrai': return filter == true;
        case 'est faux': return filter == false;
    }
}

function getFilterAsObject (index) { 
    var filter = document.getElementById("columnNames"+index).value;
    var operator = document.getElementById("operators"+index).value;
    /* Dans le cas d'un boolean il n'y a pas de valeur */
    var inputFilter = document.getElementById("inputFilter"+index);
    var value;

    /* Verification des entrées */
    if (inputFilter === null)
        value = "";
    else {
        value = inputFilter.value;
        if (value === "")
            return null;
    }

    if (filter === "base" || operator === "base")
        return null;
    
    var filterAsObject = {};
    filter = filter.split(".");
    filterAsObject["filter"] = filter[1];
    filterAsObject["operator"] = operator;
    filterAsObject["val"] = value;
    
    return filterAsObject;
}

function getAddConstraintButton () {
    var button = document.createElement("button");

    button.setAttribute("onclick", 'goToAddConstraints(' + cButtonCount + ')');
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-primary");

    cButtonCount++;

    button.appendChild(document.createTextNode(" + "));

    return button;
}

function showFilterMatrix () {
    cButtonCount = 0;

    // recuperation du corps de la table
    var tableBody = document.getElementById("filterMatrixBody");

    // suppression des anciens filtres
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    filterMatrix.forEach(function(row) {

        var tableRow = tableBody.insertRow(-1);

        row.forEach(function(filterAsObj) {
            // Insere une cellule dans la ligne courante
            var newCell = tableRow.insertCell(-1);

            // ajoute un noeud textuel a la cellule
            var newText = document.createTextNode(filterAsObj.filter+" "+filterAsObj.operator+" "+filterAsObj.val);
            newCell.appendChild(newText);
        });

        // Insere une cellule d'ajout dans la ligne courante
        var addCell = tableRow.insertCell(-1);

        // ajoute un bouton a la cellule
        addCell.appendChild(getAddConstraintButton());

        tableBody.insertRow (tableRow);
    });
}

function enableWithFilters() {
    $('#withFilters').prop('disabled', false);
    $('#withFilters').prop('checked', true);
}

function disableWithFilters() {
    $('#withFilters').prop('checked', false);
    $('#withFilters').prop('disabled', true);
}