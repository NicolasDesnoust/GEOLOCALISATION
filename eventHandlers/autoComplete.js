/*
*
*   Author : DESNOUST Nicolas
*
*/

$(function() {
    $( "#postalCode" ).autocomplete ({
    	source: function( request, response ) {
        	var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
        	var suggestions = [];
        	var suggestion;
        	var compt = 0, maxSuggestions = 10;

        	/* 	Pour chaque code postal */
        	Object.keys(cpToGps).forEach(function(key) {
        		/* Pour chaque ville associée au code postal */
        		cpToGps[key].forEach(function(location) {
        			suggestion = location.NOM_COM + ", " + key;

					if (matcher.test(suggestion) && compt <= maxSuggestions) {
						console.log (suggestion);
						suggestions.push(suggestion);
						compt++;
					}
				});
        	});

        	response(suggestions);
      	},
      	minLength: 3
	});
});