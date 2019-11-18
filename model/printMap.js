/*
*
*   Author : DESNOUST Nicolas
*
*/

var defaultIconX = 11.325, defaultIconY = 18.15;        // dimensions de l'icone du marqueur
var defaultShadowX = 20.5, defaultShadowY = 20.5;
var baseZoom = 8, zoomMin = 8, zoomMax = 13;            // niveaux de zoom utilises pour la creation de marqueurs
var markersUrl = [];                                    // images des marqueurs
var coeff = 0.5;                                        // coefficient d'evolution de la taille d'un marqueur
var map;                                                // carte
var latMap = 47.227638, longMap = 2.213749;             // latitude et longitude de la carte par defaut
var defaultZoom = 6;                                    // zoom par defaut de la carte
var markersLayer;                                       // contient les marqueurs affiches sur la carte
var searchLayer;
var compt = 0;
var cp; // voloiseau
var sourceLayer;
var searchApplied = false, filtersApplied = false;
var markersCluster;

// Initialise la carte
function initMap () {
    map = L.map('mapid',
      {zoomControl: false,
         maxZoom: 13,
         minZoom: 6
      }
    ).setView([latMap, longMap], defaultZoom);

    var zoomControl = L.control.zoom({position:'bottomleft'}).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    for (var i = 0; i < 4; i++) {
        var url = "ressources/markers/marker"+i+".png";
        markersUrl[i] = url;
    }

    // creation des layers
    markersCluster = new L.markerClusterGroup({
        spiderfyOnMaxZoom: true
    });
    markersLayer = L.featureGroup();
    searchLayer = L.featureGroup();
    sourceLayer = L.featureGroup();

    map.addLayer(markersCluster);

    map.on('popupopen', function(e) {
      var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
      px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
      map.panTo(map.unproject(px),{animate: true}); // pan to new center
    });
}

// Retourne une icone avec une taille adaptee au zoom courant
function createIcon (currentZoom, color) {

    // Ramene le zoom aux bornes
    currentZoom = currentZoom < zoomMin ? zoomMin : (currentZoom > zoomMax ? zoomMax : currentZoom) ;

    var x = defaultIconX * (1 + coeff*(currentZoom - baseZoom));
    var y = defaultIconY * (1 + coeff*(currentZoom - baseZoom));

    var xs = defaultShadowX * (1 + coeff*(currentZoom - baseZoom));
    var ys = defaultShadowY * (1 + coeff*(currentZoom - baseZoom));


    var icon = L.icon({
        iconUrl: markersUrl[color],
        iconSize: [x, y],
        shadowUrl: "ressources/leaflet/images/marker-shadow.png",
        shadowSize: [xs, ys],
        shadowAnchor: [xs*0.33, ys],
        iconAnchor: [x/2, y],
        popupAnchor: [0, -y]
    });

    return icon;
}

// Met a jour l'affichage des marqueurs lors d'un changement de zoom sur la carte
function resizeMarkers() {
    var currentZoom = map.getZoom(); // zoom courant de la carte

    if (currentZoom >= zoomMin && currentZoom <= zoomMax) {
        if (map.hasLayer(markersCluster)) {

            var icon = createIcon(currentZoom, 1);

            markersLayer.eachLayer(function (marker) {
                marker.setIcon(icon);
            });

            icon = createIcon(currentZoom, 0);


            searchLayer.eachLayer(function (marker) {
                marker.setIcon(icon);
            });

            icon = createIcon(currentZoom, 3);

            sourceLayer.eachLayer(function (marker) {
                marker.setIcon(icon);
            });
        }
    }
}

// Supprime les marqueurs couramment affichés
function deleteCurrentMarkers () {
    markersCluster.clearLayers();
    markersLayer.clearLayers();
    searchLayer.clearLayers();
    sourceLayer.clearLayers();
}

// construit le message d'une pop-up a partir d'une liste de marqueurs
// sous forme de tableau
function buildPopupMsg (listofMarkers) {
    var popupMsg = "<table class='table table-striped table-dark'><thead><tr>";

    // construction de l'en-tete du tableau
    popupMsg += "<th scope='col'>NUMCLI</th>"

    Object.keys(columnTypes).forEach(function(key) {
      if (key !== "NUMCLI" && key !== "LAT" && key !== "LON" && key !== "CP")
        popupMsg += "<th scope='col'>" + key + "</th>";
    });

    popupMsg += "</tr></thead><tbody>";

    // construction du contenu
    listofMarkers.forEach(function(row) {
        popupMsg += "<tr><th scope='row'>" + row["NUMCLI"] + "</th> ";

        Object.keys(columnTypes).forEach(function(key) {
            if (key !== "NUMCLI" && key !== "LAT" && key !== "LON" && key !== "CP")
                popupMsg += "<td>" + ((row.hasOwnProperty(key)) ? row[key] : "") + "</td>";
        });
        popupMsg += "</tr>";
    });
    popupMsg += "</tr></tbody></table>";

    return popupMsg;
}

// Ajoute une liste de marqueurs sur la carte
function addMarkers() {
  // si personne n'habite dans la ville source de la recherche alors
  // permet d'ajouter un marqueur rouge
  var mustAddSource = true;

  // creation d'un icone adapte au zoom courant
  var blueIcon = createIcon (map.getZoom(), 1);
  // creation d'un icone adapte au zoom courant
  var blackIcon = createIcon (map.getZoom(), 0);
  // creation d'un icone adapte au zoom courant
  var redIcon = createIcon (map.getZoom(), 3);

  var tempList = [];
  var oldLat = -200;
  var oldLong = -200;
  var popupMsg = "";
  var currentIcon;
  var currentLayer;
      
  // ajoute les marqueurs liste par liste
  // pour les grouper par marqueur
  dictSortedByCoord.forEach(function(item) {
    // passe les donateurs ne correspondant pas aux filtres
    if (!donors.hasOwnProperty(item) && filtersApplied)
      return;

    var lat = dict[item].LAT;
    var long = dict[item].LON;

    if (lat == oldLat && long == oldLong)
      tempList.push (dict[item]);
    else {
      if (oldLat != -200) {

        popupMsg = buildPopupMsg (tempList);
        /* Si le donateur ne correspond pas à la recherche
         * ou que la recherche n'est pas à prendre en compte
         * -> affichage standard du marqueur  */
        if (!donorsSearch.hasOwnProperty(key(tempList[0])) || !searchApplied) {
          currentIcon = blueIcon;
          currentLayer = markersLayer;
        }
        /* Sinon si le donateur est dans la ville source son marqueur doit avoir une apparence unique */  
        else if (donorsSearch[key(tempList[0])] == 0) {
          currentIcon = redIcon;
          currentLayer = sourceLayer;
          mustAddSource = false;
        }
        /* Sinon le donateur correspond à la recherche sans être dans la ville source */
        else {
          currentIcon = blackIcon;
          currentLayer = searchLayer;
        }

        // Ajout d'un marqueur dans un layer correspondant à son appartenance (idem pour sa couleur)
        var popup = L.popup({maxHeight:300, className:'popupStyle'}).setContent(popupMsg);
        L.marker([tempList[0].LAT, tempList[0].LON], {icon: currentIcon}).addTo(currentLayer).bindPopup(popup);
        // Reset de la liste
        tempList = [];
      }
      tempList.push (dict[item]);

      oldLat = dict[item].LAT;
      oldLong = dict[item].LON;
    }
  });

  // ajoute les derniers marqueurs a la carte
  if (tempList.length > 0) {
      popupMsg = buildPopupMsg (tempList);

      /* Si le donateur ne correspond pas à la recherche
      * ou que la recherche n'est pas à prendre en compte
      * -> affichage standard du marqueur  */
      if (!donorsSearch.hasOwnProperty(key(tempList[0])) || !searchApplied) {
        currentIcon = blueIcon;
        currentLayer = markersLayer;
      }
      /* Sinon si le donateur est dans la ville source son marqueur doit avoir une apparence unique */  
      else if (donorsSearch[key(tempList[0])] == 0) {
        currentIcon = redIcon;
        currentLayer = sourceLayer;
        mustAddSource = false;
      }
      /* Sinon le donateur correspond à la recherche sans être dans la ville source */
      else {
        currentIcon = blackIcon;
        currentLayer = searchLayer;
      }

      // Ajout d'un marqueur dans un layer correspondant à son appartenance (idem pour sa couleur)
      var popup = L.popup({maxHeight:300, className:'popupStyle'}).setContent(popupMsg);
      L.marker([tempList[0].LAT, tempList[0].LON], {icon: currentIcon}).addTo(currentLayer).bindPopup(popup);
  }
  /* Si aucun donateur correspondant à la recherche ne se trouve dans la ville source 
   * il faut ajouter un marqueur unique à cet emplacement */
  if (searchApplied)
    if (mustAddSource)
      addSource();

  // ajout des layer a la carte
  markersCluster.addLayer(markersLayer);
  markersCluster.addLayer(searchLayer);
  markersCluster.addLayer(sourceLayer);

   // Repositionnement de l'utilisateur sur la carte
  if (searchApplied) {
    var sLBounds = searchLayer.getBounds();

    if(sLBounds.isValid())
      map.flyToBounds(sLBounds);
    else
      map.flyTo([source[0], source[1]]);
  }
  else {
    var mCBounds = markersCluster.getBounds();
    
    if (mCBounds.isValid())
      map.flyToBounds(mCBounds);
  }
}

function addSource () {
  // creation d'un icone adapte au zoom courant
  var icon = createIcon (map.getZoom(), 3);
  L.marker([source[0], source[1]], {icon: icon}).addTo(sourceLayer);
}