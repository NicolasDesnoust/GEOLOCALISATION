/*
*
*   Author : DESNOUST Nicolas
*
*/

/* Ville source de la recherche */
var source = [];
/* Temps en minutes en voiture à vol d'oiseau */
var searchTime;

function updateSearchParameters () {
	// récupération des paramètres de recherche
	var location = document.getElementById('postalCode').value;
    searchTime = document.getElementById('time').value;

    location = location.split(", ");

    var city = location[0];
    var postalCode = location[1];

	// recherche des coordonnees de la ville source  
    source = [];
    var cities = cpToGps[postalCode];

    for (var i = 0; i < cities.length; i++) {
    	if (city === cities[i].NOM_COM) {
    		source[0] = cities[i].LAT;
    		source[1] = cities[i].LON;
    		break;
    	}
    }
}

// convertit un temps (min) en distance (km) a partir d'une vitesse moyenne en voiture (km/h)
function getDistance (time) {
    var averageSpeed = 50;                     		  // en km/h
    var distance = averageSpeed * time/60;     		  // conversion du temps en heures et application formule v = d x t

    return distance;
}

// Converti des degrés en radians
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converti des radians en degrés
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function haversineFormula (latSource, lonSource, latTarget, lonTarget) {
	var haversineFormula = ( 6371 * Math.acos( Math.cos( Math.radians(latSource) ) * Math.cos( Math.radians( latTarget ) ) *
    						Math.cos( Math.radians( lonTarget ) - Math.radians(lonSource) ) + Math.sin( Math.radians(latSource) )
    						 * Math.sin( Math.radians( latTarget ) ) ) );
	return haversineFormula;
}

/* Rempli le dictionnaire contenant les donateurs correspondant a la recherche */
function fillInDonorsSearch () {
    var lat = source[0], lon = source[1];
    var maxDistance = getDistance(searchTime);
    var computedDistance;
    donorsSearch = {};

    Object.keys(dict).forEach(function(index) {

    	computedDistance = haversineFormula (lat, lon, dict[index].LAT, dict[index].LON);

    	if (computedDistance <= 0.001)
    		donorsSearch[index] = 0;
    	else if(computedDistance <= maxDistance) {
    		donorsSearch[index] = 1;
    	}
    });
}

function applySearch () {
    deleteCurrentMarkers();
    searchApplied = true;
    addMarkers();
    enableDidSearch();
}