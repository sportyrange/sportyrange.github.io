const lon = 11.39454; // Koordinaten IBK
const lat = 47.262661; // Koordinaten IBK 
const KeyORS = "5b3ce3597851110001cf6248450373d54f5b4420884d186c964719d9" // Key API Open Rout Service

let map = L.map("map", {
    center: [47.263353, 11.400533],
    zoom: 13,
    layers: [L.tileLayer.provider('OpenStreetMap.DE')],
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
        text: 'get Isochrones',
        callback: getAccess
    }]
});
data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Innsbruck Zentrum"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    lon,
                    lat
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Kranebitten Ale Hötting West"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    11.35181,
                    47.26308
                ]
            }
        }
    ]
}
// and the geoJSON marker:
function onEachMarker(feature, layer) {
    layer.bindContextMenu({
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'get Isochrones from marker',
            callback: getAccessFromMarker
        }]
    })
    layer.bindPopup(feature.properties.name);
};
var markers = L.geoJSON(data).addTo(map);

let apiIsochron = `https://api.openrouteservice.org/v2/isochrones/cycling-regular?location=${lat},${lon}&api_key=${KeyORS}`

function getAccess(e) {
    $.ajax({
        type: "GET", //rest Type
        dataType: 'json',
        url: apiIsochron,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
        }
    });
};