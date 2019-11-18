/*
*
*   Author : DESNOUST Nicolas
*
*/

/* Dictionnaire contenant les donateurs */
var dict = {};
/* Dictionnaire contenant les donateurs correspondant aux filtres */
var donors = {};
/* Dictionnaire contenant les donateurs correspondant a la recherche */
var donorsSearch = {};
/* Dictionnaire associant les noms de colonnes à leur type */
var columnTypes = {};
/* Tableau contenant les clés du dictionnaire, triées selon la latitude et la longitude */
var dictSortedByCoord = [];

/* Contient la clé de l'objet passé en paramètre */
var key = function(obj){
	return obj.NUMCLI; // NUMCLI : clé identifiant les donateurs de manière unique
};

/* Traite le fichier et demande l'affichage des marqueurs ensuite */
function processFile (file, callback, separator, cpColumnName) {
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

	if (regex.test(file.value.toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			var reader = new FileReader();

			reader.onload = function (e) {
				var rows = e.target.result.trim().split(/\r?\n/);
				
				fillInDictionary(rows, separator, cpColumnName);
				sortDictionnary();
				fillInColumnTypes(rows, separator, cpColumnName);
				callback();
			}

			reader.readAsText(file.files[0]);
		}
		else {
			alert("This browser does not support HTML5.");
		}
	}
	else {
		alert("Please upload a valid CSV file.");
	}
}

/* Rempli le dictionnaire avec les donateurs d'un fichier */
function fillInDictionary (rows, separator) {
	var donateur;
	var cells;
	var columnNames = rows[0].split(separator);

	for (var j = 0; j < columnNames.length; j++) {
			/* Suppression des "" autour des chaines de caractères */
			if (columnNames[j][0] === '"' && columnNames[j][columnNames[j].length-1] === '"')
				columnNames[j] = columnNames[j].substring(1, columnNames[j].length-1);

			if (columnNames[j] === cpColumnName)
				columnNames[j] = "CP";
	}

	for (var i = 1; i < rows.length; i++) {

		donateur = {};
		cells = rows[i].split(separator);

		for (var j = 0; j < cells.length; j++) {
			/* Suppression des "" autour des chaines de caractères */
			if (cells[j][0] === '"' && cells[j][cells[j].length-1] === '"')
				cells[j] = cells[j].substring(1, cells[j].length-1);

			/* Remplace le code postal par des coordonnées */
			if (columnNames[j] == "CP") {
				donateur[columnNames[j]] = cells[j];
				donateur["LAT"] = cpToGps[cells[j]][0].LAT;
				donateur["LON"] = cpToGps[cells[j]][0].LON;
			}
			else
				donateur[columnNames[j]] = cells[j];
		}
		
		dict[key(donateur)] = donateur;
	}
}

/* Trie un tableau contenant les clés des donateurs facilitant
 * la phase d'affichage (les donateurs de mêmes coordonnées doivent
 * se retrouver dans un même marqueur) */
function sortDictionnary () {
	dictSortedByCoord = [];

	Object.keys(dict).forEach(function(key) {
		dictSortedByCoord.push(key);
	});

	/* Trie en fonction de la latitude puis de la longitude */
		dictSortedByCoord.sort(function (key1, key2) {
			var latComp = dict[key1].LAT - dict[key2].LAT;
			var lonComp;

			/* Si la latitude n'est pas suffisante pour la comparaison */
			if (latComp === 0)
				lonComp = dict[key1].LON - dict[key2].LON;
			else
				return latComp;

			return lonComp;
		});
}

/* Devine le type de la valeur passée en paramètre */
 function getValueType (value) {
        var type = "undetermined";
        var decimalSepCount = 0;

        /* Impossible de déterminer le type */
        if (value == "null" || value == "NULL")
            return type;

        /* Si la valeur est booléenne */
        value = value.toLowerCase();
        if (value === "true" || value === "false" 
        	|| value === "vrai" || value === "faux" 
        	|| value === "o" || value === "n"
        	|| value === "oui" || value === "non") {
        	return "boolean";
        }

        // longueur de la valeur courante
        var size = value.length;

        for (var i = 0; i < size; i++) {

            // si le caractere n'est pas un chiffre
            if (value[i] < '0' || value[i] > '9') {

                // teste si le nombre est potentiellement un float (contient '.' ou ',')
                if ((value[i] == '.' || value[i] == ",") && decimalSepCount == 0 && (i > 0 && i < size)) {
                    type = "float";
                }
                // sinon le type est string
                else {
                	type = "string";
                    // pas necessaire de continuer a boucler
                    return type;
                }
            }
            // le caractere est un chiffre
            else {
                // le type float prevaut
                if (type != "float")
                    type = "int";
            }
        }

        return type;
    }

/* Devine le type de chaque colonne de 'rows' et le stocke dans un dictionnaire */
function fillInColumnTypes (rows, separator) {
	var columnNames = rows[0].split(separator);
	var columnType;
	var i = 1;
	var columnsToIdentify = [];

	for (var j = 0; j < columnNames.length; j++) {
		/* Suppression des "" autour des chaines de caractères */
		if (columnNames[j][0] === '"' && columnNames[j][columnNames[j].length-1] === '"')
			columnNames[j] = columnNames[j].substring(1, columnNames[j].length-1);

		if (columnNames[j] === cpColumnName)
			columnNames[j] = "CP";
	
		columnsToIdentify.push(j);
	}

	while (i < rows.length && columnsToIdentify.length > 0) {

		cells = rows[i].split(separator);

		for (var j = 0; j < columnsToIdentify.length; j++) {

			columnType = "undetermined";
			/* Les " " ne sont pas retirés pour que les valeurs soient automatiquement détectées comme "string" */
  			columnType = getValueType(cells[columnsToIdentify[j]]);

  			if (columnType != "undetermined") {
  				columnTypes[columnNames[columnsToIdentify[j]]] = columnType;
  				columnsToIdentify.splice(j, 1); 
  			}
		}
	}
}

/* Code à exécuter lorsque le fichier a été chargé et traité */
function callbackImport () {
	deleteCurrentMarkers();

    if (searchApplied)
    	fillInDonorsSearch();   

    if (filtersApplied)
    	fillInDonors();

    addMarkers();
    updateFilters();
}