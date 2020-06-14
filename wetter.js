let map = L.map("map", {
    center: [47.263353, 11.400533],
    zoom: 10,
    layers: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    })
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
const OWKey = "6b674de39054a72d29926196d5d45168";
const lat = "47.262661";
const lon = "11.39454";
let forecast_apiurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&APPID=${OWKey}&units=metric`;


let xlabel = []; // variablen für die Chart
let ytemp = []; // variablen für die chart 
let yhum = []; // Variable für Chart 
let ypres = []; // variable für Chart
let yrain = []; // variable für Chart
let yWeatherText = [];
let yWeatherId = [];



//Erstellen einer Line-Chart mit Stündlicher Vorhergesagter temperatur, Luftdruck und Luftfeuchte, Bewölkung 
// https://www.chartjs.org/docs/latest/charts/line.html
chartIt();
getForecast();


async function chartIt() {
    await getForecast();
    let canvas = document.getElementById('Forecast48h').getContext('2d');
    let ForecastChart = new Chart(canvas, {
        type: 'line',
        // The data for our dataset
        data: {
            labels: xlabel,
            datasets: [{
                    label: 'Temperatur in °C',
                    borderColor: 'rgb(255, 99, 132)',
                    data: ytemp,
                    yAxisID: 'TempY',
                    datalabels: {
                        display: 'auto',
                        anchor: 'end',
                        align: 'top',
                        rotation: '-30',
                        color: 'rgb(255, 99, 132)',
                        formatter: function(value, context){
                            return context ;
                        },

                    }
                }, {
                    label: "Erwarteter Niedrschlag in mm",
                    data: yrain,
                    yAxisID: 'RainY',
                    type: 'bar',
                    backgroundColor: '#2673bf',
                    datalabels: {
                        display: true,
                        align: 'end',
                        anchor: 'end',
                        align: 'top',
                        rotation: '-30',
                        color: '#2673bf',
                    },

                },
                /* {
                               label: "Luftfeuchte",
                               data: yhum,
                              yAxisID: 'HumY',
                           }, {
                               label: "Luftdruck",
                               data: ypres,
                               type: "bar",
                              yAxisID: 'PresY',
                           }, */
            ]
        },
        // Configuration options go here
        options: {
            scales: {
                yAxes: [{
                        id: "TempY",
                        type: "linear",
                        position: "left",
                    },
                    /* {
                                       id: "HumY",
                                       type: "linear",
                                       position :"right",
                                   }, {
                                       id: "PresY",
                                       type: "linear",
                                       position :"right",
                                   },  */
                    {
                        id: "RainY",
                        type: "linear",
                        position: "right",
                        ticks: {
                            beginAtZero: true,
                            steps: 1,
                            max: 15,
                        }

                    }
                ],
                layout: {

                }
            }
        }
    });
};




async function getForecast() {
    const response = await fetch(forecast_apiurl);
    const data = await response.json();
    //console.log(data.hourly); //data.hourly[0] unix Zeit! muss noch umgerechnet werden 

    let rows = data.hourly;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        //console.log(row)
        let dt = row.dt; //UnixTime
        dateObj = new Date(dt * 1000);
        hours = dateObj.getHours();
        formattedTime = hours.toString().padStart(2, '0') + ` Uhr`

        xlabel.push(formattedTime);
        let temp = row.temp;
        ytemp.push(temp);
        let hum = row.humidity;
        yhum.push(hum);
        let pres = row.pressure;
        ypres.push(pres);

        let rainrow = row.rain;
        if (rainrow === undefined) {
            continue;
        };
        let rain = rainrow["1h"];
        yrain.push(rain);
        let weatherText = row.weather["0"].main;
        yWeatherText.push(rain);
        let weatherId = row.weather["0"].id;
        yWeatherId.push(rain);
        //console.log(row.weather["0"].main); // row.weather["0"].main --> Text wie das Wetter wird
        console.log(row.weather["0"].id); // row.weather["0"].id --> ID wie das wetter wird + ersetzen durch Symbole
    };


};