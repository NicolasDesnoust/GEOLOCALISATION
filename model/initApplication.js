/*
*
*   Author : DESNOUST Nicolas
*
*/

window.onload = function() {
    initMap();

    map.on('zoomend', function() {
        map.closePopup();
        resizeMarkers();
    });

};