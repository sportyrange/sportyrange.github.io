let map = L.map("map", {
    center: [47.3, 11.5],
    zoom: 10,
    layers: [L.tileLayer.provider("BasemapAT.grau")]
});

let rainviewer = L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Start/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Time:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
});
rainviewer.addTo(map);

let overlay = {
    stations: L.featureGroup(),

}

L.control.layers({
    "BasemapAT.grau": L.tileLayer.provider("BasemapAT.grau"),
    "BasemapAT.terrain": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
}, {
    "Wetterstationen Tirol": overlay.stations,
}).addTo(map);

let awsUrl = "https://aws.openweb.cc/stations";
let aws = L.geoJson.ajax(awsUrl, {
    filter: function (feature) {
        return feature.properties.LT /*!== null -->ist unnötig!! */ ;

    },
    pointToLayer: function (point, latlng) {
        //console.log("point: ", point);
        let marker = L.marker(latlng, {

        });
        marker.bindPopup(`<h3>${point.properties.name} ${point.geometry.coordinates[2]} m</h3>
        <ul>
        <li>Position: Lat: ${point.geometry.coordinates[1]}/Lng: ${point.geometry.coordinates[0]}</li>
        <li>Datum: ${point.properties.date}</li>
        <li>Lufttemperatur: ${point.properties.LT} °C</li>
        <li>Windgeschwindigkeit: ${point.properties.WG} m/s</li>
        <li>Relative Luftfeuchte: ${point.properties.RH} %</li>
        <li>Schneehöhe: ${point.properties.HS} cm</li>
        <li> Grafik: <a href=https://lawine.tirol.gv.at/data/grafiken/1100/standard/tag/${point.properties.plot}.png> ${point.properties.plot} </a></li>
        </ul>`);
        //console.log("feature in filter", point);
        return marker;

    }
}).addTo(overlay.stations);

const OWKey ="6b674de39054a72d29926196d5d45168";
const lat ="47.262661";
const lon ="11.39454";
let forecast_apiurl =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&APPID=${OWKey}&units=metric`;

async function getForecast() {
    const response = await fetch(forecast_apiurl);
    const data = await response.json();
    console.log (data);
}
getForecast();

// Versuch --> Forecast zu integrieren - Nutzung von API der Open-Wheater map
//sportyrange API - openwehtermap key 6b674de39054a72d29926196d5d45168; id of Innsbruck
// {
//     "id": 2775220,
//     "name": "Innsbruck",
//     "state": "",
//     "country": "AT",
//     "coord": {
//       "lon": 11.39454,
//       "lat": 47.262661 
//     }

//     http://api.openweathermap.org/data/2.5/weather?q=Innsbruck,AT&APPID=6b674de39054a72d29926196d5d45168
