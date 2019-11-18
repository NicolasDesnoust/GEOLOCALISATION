/*
*
*   Author : DESNOUST Nicolas
*
*/

$(document).ready(function () {

    $('#exportButton', $('#exportModal')).on("click", function(e) {
        
        var useSearch = !document.getElementById('didSearch').disabled && document.getElementById('didSearch').checked;
        var useFilters = !document.getElementById('withFilters').disabled && document.getElementById('withFilters').checked;
        var useHeader = document.getElementById('addHeader').checked;
        var donorsToExport = [];
        var donor = '';
        var keys = Object.keys(dict);
        var entry;
        
        /* Ajout des noms des colonnes en en-tête */
        if (useHeader) {
            entry = dict[keys[0]];

            Object.keys(entry).forEach(function(attribute) {
                if (attribute === "LAT" || attribute === "LON")
                    return;

                donor += '"'+ attribute +'",';
            });
            
            /* Suppression de la dernière virgule */
            donor = donor.substring(0, donor.length-1);
            donorsToExport.push(donor);
        }
        
        keys.forEach(function(key) {
            
            if (useSearch && !donorsSearch.hasOwnProperty(key))
                return;
            if (useFilters && !donors.hasOwnProperty(key))
                return;
            
            donor = "";
            entry = dict[key]; 

            Object.keys(entry).forEach(function(attribute) {
                if (attribute === "LAT" || attribute === "LON")
                    return;

                /* Si la valeur est de type chaîne de caractères */
                if (columnTypes[attribute] === "string")
                    donor += '"' + entry[attribute] + '",';
                else
                    donor += entry[attribute] + ',';
            });

            /* Suppression de la dernière virgule */
            donor = donor.substring(0, donor.length-1);
            donorsToExport.push(donor);
        });

        var blob = new Blob([donorsToExport.join('\n')], { type:'text/csv' });
        saveAs(blob, jQuery("#outFileName").val());
    });

});